import jwt from 'jsonwebtoken';
import { users, liveSessions } from './data.js';
import { getRoom, runtime } from './state.js';

const chatLimit = 200;

const minutesBetween = (start, end) => Math.max(0, Math.round((new Date(end) - new Date(start)) / 60000));

function recordAttendance(session, user) {
  if (user.role !== 'student') return;
  let entry = runtime.liveAttendance.find(
    (item) => item.sessionId === session.id && item.studentId === user.id && !item.leftAt
  );
  if (!entry) {
    entry = {
      id: `live-att-${Date.now()}-${user.id}`,
      sessionId: session.id,
      classId: session.classId,
      studentId: user.id,
      joinedAt: new Date().toISOString(),
      leftAt: null,
      durationMin: 0,
      source: 'live',
    };
    runtime.liveAttendance.push(entry);
  }
  return entry;
}

function closeAttendance(sessionId, userId) {
  const entry = runtime.liveAttendance.find(
    (item) => item.sessionId === sessionId && item.studentId === userId && !item.leftAt
  );
  if (entry) {
    entry.leftAt = new Date().toISOString();
    entry.durationMin = minutesBetween(entry.joinedAt, entry.leftAt);
  }
}

function participantList(room) {
  const now = Date.now();
  return [...room.participants.values()].map((p) => ({
    ...p,
    durationMin: Math.max(0, Math.round((now - new Date(p.joinedAt).getTime()) / 60000)),
  }));
}

function broadcastParticipants(io, sessionId) {
  const room = getRoom(sessionId);
  io.to(`live:${sessionId}`).emit('live:participants', {
    participants: participantList(room),
  });
}

function canManage(session, user) {
  return user.role === 'admin' || (user.role === 'teacher' && session.teacherId === user.id);
}

export function setupRealtime(io, jwtSecret) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Token tidak ditemukan'));
      const payload = jwt.verify(token, jwtSecret);
      const user = users.find((u) => u.id === payload.sub);
      if (!user) return next(new Error('Pengguna tidak ditemukan'));
      socket.data.user = { id: user.id, name: user.name, role: user.role };
      next();
    } catch {
      next(new Error('Sesi tidak valid'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user;

    socket.on('live:join', (payload = {}, ack) => {
      const session = liveSessions.find((s) => s.id === payload.sessionId);
      if (!session) {
        ack?.({ ok: false, error: 'Sesi tidak ditemukan.' });
        return;
      }
      if (session.status !== 'live') {
        ack?.({ ok: false, error: 'Sesi ini belum atau sudah tidak berlangsung.' });
        return;
      }
      if (!canManage(session, user) && user.role !== 'student') {
        ack?.({ ok: false, error: 'Peran ini tidak dapat bergabung ke kelas live.' });
        return;
      }

      const room = getRoom(session.id);
      room.participants.set(socket.id, {
        socketId: socket.id,
        id: user.id,
        name: user.name,
        role: user.role,
        raised: false,
        joinedAt: new Date().toISOString(),
      });
      socket.join(`live:${session.id}`);
      socket.data.liveSessionId = session.id;
      recordAttendance(session, user);

      ack?.({
        ok: true,
        session,
        participants: participantList(room),
        messages: room.messages,
        poll: room.poll,
        me: user,
      });
      broadcastParticipants(io, session.id);
      socket.to(`live:${session.id}`).emit('live:presence', {
        type: 'join',
        name: user.name,
        role: user.role,
        at: new Date().toISOString(),
      });
    });

    socket.on('chat:send', (payload = {}) => {
      const sessionId = socket.data.liveSessionId;
      if (!sessionId) return;
      const text = String(payload.text ?? '').trim().slice(0, 500);
      if (!text) return;
      const room = getRoom(sessionId);
      const message = {
        id: `msg-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        user: { id: user.id, name: user.name, role: user.role },
        text,
        at: new Date().toISOString(),
      };
      room.messages.push(message);
      if (room.messages.length > chatLimit) room.messages.shift();
      io.to(`live:${sessionId}`).emit('chat:message', message);
    });

    socket.on('hand:raise', (payload = {}) => {
      const sessionId = socket.data.liveSessionId;
      if (!sessionId) return;
      const room = getRoom(sessionId);
      const participant = room.participants.get(socket.id);
      if (!participant) return;
      participant.raised = Boolean(payload.raised);
      io.to(`live:${sessionId}`).emit('live:hand', {
        id: user.id,
        name: user.name,
        raised: participant.raised,
        at: new Date().toISOString(),
      });
      broadcastParticipants(io, sessionId);
    });

    socket.on('poll:start', (payload = {}) => {
      const sessionId = socket.data.liveSessionId;
      if (!sessionId) return;
      const session = liveSessions.find((s) => s.id === sessionId);
      if (!session || !canManage(session, user)) return;
      const options = (Array.isArray(payload.options) ? payload.options : [])
        .map((o) => String(o).trim().slice(0, 120))
        .filter(Boolean)
        .slice(0, 6);
      if (!payload.question || options.length < 2) return;
      const room = getRoom(sessionId);
      const poll = {
        id: `poll-${Date.now()}`,
        question: String(payload.question).slice(0, 200),
        options: options.map((text) => ({ text, votes: 0 })),
        correctIndex:
          Number.isInteger(payload.correctIndex) && payload.correctIndex < options.length
            ? payload.correctIndex
            : null,
        active: true,
        totalVotes: 0,
        startedAt: new Date().toISOString(),
      };
      room.poll = poll;
      room.pollVotes = new Map();
      io.to(`live:${sessionId}`).emit('live:poll', poll);
    });

    socket.on('poll:vote', (payload = {}) => {
      const sessionId = socket.data.liveSessionId;
      if (!sessionId) return;
      const room = getRoom(sessionId);
      const poll = room.poll;
      if (!poll || !poll.active) return;
      const index = Number(payload.index);
      if (!Number.isInteger(index) || index < 0 || index >= poll.options.length) return;
      if (room.pollVotes.has(poll.id) && room.pollVotes.get(poll.id).has(socket.id)) return;
      if (!room.pollVotes.has(poll.id)) room.pollVotes.set(poll.id, new Map());
      room.pollVotes.get(poll.id).set(socket.id, index);
      poll.options[index].votes += 1;
      poll.totalVotes += 1;
      io.to(`live:${sessionId}`).emit('live:poll', poll);
    });

    socket.on('poll:end', () => {
      const sessionId = socket.data.liveSessionId;
      if (!sessionId) return;
      const session = liveSessions.find((s) => s.id === sessionId);
      if (!session || !canManage(session, user)) return;
      const room = getRoom(sessionId);
      if (!room.poll) return;
      room.poll.active = false;
      room.poll.endedAt = new Date().toISOString();
      io.to(`live:${sessionId}`).emit('live:poll', room.poll);
    });

    // WebRTC signaling: relay SDP/ICE only to participants in the same room.
    const relaySignal = (event, payload = {}) => {
      const sessionId = socket.data.liveSessionId;
      if (!sessionId) return;
      const target = String(payload.to || '');
      if (!target || target === socket.id) return;
      const room = getRoom(sessionId);
      if (!room.participants.has(target)) return;
      io.to(target).emit(event, {
        ...payload,
        to: undefined,
        from: socket.id,
        fromName: user.name,
        fromRole: user.role,
      });
    };

    socket.on('webrtc:offer', (payload) => relaySignal('webrtc:offer', payload));
    socket.on('webrtc:answer', (payload) => relaySignal('webrtc:answer', payload));
    socket.on('webrtc:ice', (payload) => relaySignal('webrtc:ice', payload));

    socket.on('webrtc:stop', () => {
      const sessionId = socket.data.liveSessionId;
      if (!sessionId) return;
      socket.to(`live:${sessionId}`).emit('webrtc:stop', {
        from: socket.id,
        name: user.name,
        role: user.role,
      });
    });

    socket.on('session:end', () => {
      const sessionId = socket.data.liveSessionId;
      if (!sessionId) return;
      const session = liveSessions.find((s) => s.id === sessionId);
      if (!session || !canManage(session, user)) return;
      session.status = 'ended';
      session.endedAt = new Date().toISOString();
      const room = getRoom(sessionId);
      room.participants.forEach((p) => {
        if (p.role === 'student') closeAttendance(sessionId, p.id);
      });
      io.to(`live:${sessionId}`).emit('live:ended', {
        sessionId,
        endedAt: session.endedAt,
        by: user.name,
      });
    });

    socket.on('disconnect', () => {
      const sessionId = socket.data.liveSessionId;
      if (!sessionId) return;
      const room = getRoom(sessionId);
      const participant = room.participants.get(socket.id);
      room.participants.delete(socket.id);
      if (participant?.role === 'student') closeAttendance(sessionId, participant.id);
      broadcastParticipants(io, sessionId);
      if (participant) {
        socket.to(`live:${sessionId}`).emit('webrtc:stop', {
          from: socket.id,
          name: participant.name,
          role: participant.role,
        });
        socket.to(`live:${sessionId}`).emit('live:presence', {
          type: 'leave',
          name: participant.name,
          role: participant.role,
          at: new Date().toISOString(),
        });
      }
    });
  });
}
