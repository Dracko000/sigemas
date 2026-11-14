import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Camera,
  CameraOff,
  CheckCircle2,
  Clock,
  ExternalLink,
  Hand,
  Loader2,
  MessageCircle,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  PenLine,
  PhoneOff,
  Plus,
  Send,
  ShieldCheck,
  Signal,
  Users,
  Video,
  WifiOff,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';
import { createLiveSocket, type LiveChatMessage, type LiveParticipant, type LivePoll, type LiveStroke } from '../../lib/socket';
import { cx, roleLabel } from '../../lib/format';
import type { Book, ClassRoom } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input, Textarea } from '../ui/Field';
import { Modal } from '../ui/Modal';
import { EmptyState } from '../ui/Misc';
import { Tabs } from '../ui/Tabs';
import { SigemasMascot } from '../SigemasMascot';
import { Whiteboard } from './Whiteboard';
import { BookCover } from '../books/BookCover';

export interface RoomSession {
  id: string;
  title: string;
  classId: string;
  className?: string;
  teacherId: string;
  teacherName?: string;
  bookId: string;
  bookTitle?: string;
  chapterId: string;
  chapter?: string;
  status: string;
  startedAt?: string;
  scheduledAt: string;
  durationMin?: number;
  participants: number;
  book?: Book;
  class?: ClassRoom;
}

interface JoinAck {
  ok: boolean;
  error?: string;
  participants?: LiveParticipant[];
  messages?: LiveChatMessage[];
  poll?: LivePoll | null;
  me?: { id: string; name: string; role: string };
}

interface PeerEntry {
  pc: RTCPeerConnection;
  pending: RTCIceCandidateInit[];
}

const stopStream = (stream: MediaStream | null) => {
  stream?.getTracks().forEach((track) => track.stop());
};

const timerText = (seconds: number) => {
  const safe = Math.max(0, seconds);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
};

function HandBadge() {
  return (
    <span className="grid h-5 w-5 place-items-center rounded-full bg-accent-soft text-accent-strong" title="Mengangkat tangan">
      <Hand className="h-3 w-3" aria-hidden="true" />
    </span>
  );
}

function LessonBookPanel({
  book,
  chapterId,
  chapterTitle,
}: {
  book?: Book;
  chapterId: string;
  chapterTitle?: string;
}) {
  if (!book) {
    return (
      <Card className="flex min-h-[180px] flex-col items-center justify-center p-5 text-center">
        <BookOpen className="h-8 w-8 text-muted/60" aria-hidden="true" />
        <p className="mt-2 text-xs font-bold text-text">Buku pelajaran belum tersedia</p>
        <p className="mt-1 text-[10px] leading-relaxed text-muted">Guru belum memilih buku untuk sesi ini.</p>
      </Card>
    );
  }
  const chapter = book.chapters?.find((item) => item.id === chapterId);
  const chapterLabel = chapter ? `Bab ${chapter.number}: ${chapter.title}` : chapterTitle;
  return (
    <Card className="flex h-[420px] flex-col overflow-hidden sm:h-[520px]">
      <div className="flex items-start gap-2 border-b border-border p-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone="primary">PDF lengkap</Badge>
            <Badge tone="neutral">Kelas {book.grade}</Badge>
          </div>
          <h3 className="mt-1.5 line-clamp-1 text-xs font-bold leading-snug text-text">{book.title}</h3>
          {chapterLabel && (
            <p className="mt-0.5 line-clamp-1 text-[10px] font-semibold text-muted">{chapterLabel}</p>
          )}
        </div>
        {book.fileUrl && (
          <a
            href={book.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border bg-surface text-muted transition hover:bg-surface-2 hover:text-text"
            aria-label="Buka PDF di tab baru"
            title="Buka PDF di tab baru"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
      </div>
      {book.fileUrl ? (
        <iframe
          src={`${book.fileUrl}#view=FitH`}
          title={`Buku lengkap: ${book.title}`}
          className="min-h-0 w-full flex-1 border-0 bg-white"
        />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-5 text-center">
          <BookCover book={book} size="sm" />
          <p className="text-[10px] leading-relaxed text-muted">
            PDF resmi belum tersedia. Buka buku siswa untuk membaca materi.
          </p>
          <Link to={`/baca/${book.id}`} target="_blank" rel="noreferrer">
            <Button size="sm">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> Buka buku siswa
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}

export function LiveRoom({ session }: { session: RoomSession }) {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  const socketRef = useRef<ReturnType<typeof createLiveSocket> | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<MediaStream | null>(null);
  const screenRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localPipRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const remotePeerRef = useRef<string>('');
  const peersRef = useRef<Map<string, PeerEntry>>(new Map());
  const pendingIceRef = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());
  const broadcastingRef = useRef(false);
  const boardStorageKey = `sigemas:board:${session.id}:${user?.id || 'guest'}`;

  const [connected, setConnected] = useState(false);
  const [joined, setJoined] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [participants, setParticipants] = useState<LiveParticipant[]>([]);
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [strokes, setStrokes] = useState<LiveStroke[]>(() => {
    try {
      const raw = localStorage.getItem(boardStorageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? (parsed as LiveStroke[]) : [];
    } catch {
      return [];
    }
  });
  const [poll, setPoll] = useState<LivePoll | null>(null);
  const [myVote, setMyVote] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [handRaised, setHandRaised] = useState(false);
  const [stage, setStage] = useState<'video' | 'board'>('video');
  const [ended, setEnded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [camOn, setCamOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [mediaBusy, setMediaBusy] = useState(false);
  const [remoteActive, setRemoteActive] = useState(false);
  const [remoteName, setRemoteName] = useState('');
  const [remoteRole, setRemoteRole] = useState('teacher');
  const [broadcasting, setBroadcasting] = useState(false);
  const [endConfirm, setEndConfirm] = useState(false);
  const [pollOpen, setPollOpen] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '', '', '']);
  const [pollCorrect, setPollCorrect] = useState(0);
  const [pollError, setPollError] = useState('');

  const displayName = user?.name || 'Peserta';
  const raisedCount = participants.filter((p) => p.raised).length;
  const showLocalVideo = camOn || screenSharing;
  const showVideo = showLocalVideo || remoteActive;
  const teacherName = session.teacherName || 'Pengajar SiGEMAS';

  const clearRemote = () => {
    remotePeerRef.current = '';
    remoteStreamRef.current = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    setRemoteActive(false);
    setRemoteName('');
  };

  const attachLocalStream = (stream: MediaStream | null) => {
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    if (localPipRef.current) localPipRef.current.srcObject = stream;
  };

  const closePeer = (peerId: string) => {
    const entry = peersRef.current.get(peerId);
    if (!entry) return;
    entry.pc.onicecandidate = null;
    entry.pc.ontrack = null;
    entry.pc.onconnectionstatechange = null;
    entry.pc.close();
    peersRef.current.delete(peerId);
    pendingIceRef.current.delete(peerId);
    if (remotePeerRef.current === peerId) clearRemote();
  };

  const closeAllPeers = () => {
    for (const peerId of [...peersRef.current.keys()]) closePeer(peerId);
    pendingIceRef.current.clear();
  };

  const createPeer = (peerId: string) => {
    const existing = peersRef.current.get(peerId);
    if (existing) return existing;
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    const entry: PeerEntry = { pc, pending: [] };
    const queued = pendingIceRef.current.get(peerId);
    if (queued?.length) {
      entry.pending.push(...queued);
      pendingIceRef.current.delete(peerId);
    }
    pc.onicecandidate = (event) => {
      if (event.candidate) socketRef.current?.emit('webrtc:ice', { to: peerId, candidate: event.candidate });
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'closed') closePeer(peerId);
    };
    peersRef.current.set(peerId, entry);
    return entry;
  };

  const sendOffer = async (targetId: string, stream: MediaStream) => {
    if (!targetId || peersRef.current.has(targetId)) return;
    try {
      const { pc } = createPeer(targetId);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current?.emit('webrtc:offer', { to: targetId, sdp: pc.localDescription });
    } catch {
      closePeer(targetId);
    }
  };

  const startBroadcast = async (stream: MediaStream) => {
    if (!isTeacher || broadcastingRef.current) return;
    broadcastingRef.current = true;
    setBroadcasting(true);
    const mySocketId = socketRef.current?.id;
    for (const participant of participants) {
      if (participant.socketId === mySocketId) continue;
      await sendOffer(participant.socketId, stream);
    }
  };

  const stopBroadcast = () => {
    broadcastingRef.current = false;
    setBroadcasting(false);
    closeAllPeers();
    socketRef.current?.emit('webrtc:stop');
  };

  const replaceBroadcastVideo = (stream: MediaStream | null) => {
    const track = stream?.getVideoTracks()[0];
    if (!track) return;
    for (const { pc } of peersRef.current.values()) {
      const sender = pc.getSenders().find((item) => item.track?.kind === 'video');
      if (sender) void sender.replaceTrack(track);
    }
  };

  const handleOffer = async (payload: {
    from?: string;
    sdp?: RTCSessionDescriptionInit;
    fromName?: string;
    fromRole?: string;
  }) => {
    if (!payload.from || !payload.sdp) return;
    if (!['teacher', 'admin'].includes(payload.fromRole || 'teacher')) return;
    const entry = createPeer(payload.from);
    entry.pc.ontrack = (event) => {
      const stream = event.streams[0] || new MediaStream([event.track]);
      remotePeerRef.current = payload.from || '';
      remoteStreamRef.current = stream;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
      setRemoteName(payload.fromName || teacherName);
      setRemoteRole(payload.fromRole || 'teacher');
      setRemoteActive(true);
      setStage('video');
    };
    try {
      await entry.pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      for (const candidate of entry.pending.splice(0)) await entry.pc.addIceCandidate(candidate);
      const answer = await entry.pc.createAnswer();
      await entry.pc.setLocalDescription(answer);
      socketRef.current?.emit('webrtc:answer', { to: payload.from, sdp: entry.pc.localDescription });
    } catch {
      closePeer(payload.from);
    }
  };

  const handleAnswer = async (payload: { from?: string; sdp?: RTCSessionDescriptionInit }) => {
    if (!payload.from || !payload.sdp) return;
    const entry = peersRef.current.get(payload.from);
    if (!entry) return;
    try {
      await entry.pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      for (const candidate of entry.pending.splice(0)) await entry.pc.addIceCandidate(candidate);
    } catch {
      closePeer(payload.from);
    }
  };

  const handleIce = async (payload: { from?: string; candidate?: RTCIceCandidateInit }) => {
    if (!payload.from || !payload.candidate) return;
    const entry = peersRef.current.get(payload.from);
    if (!entry) {
      const queued = pendingIceRef.current.get(payload.from) ?? [];
      queued.push(payload.candidate);
      pendingIceRef.current.set(payload.from, queued);
      return;
    }
    if (entry.pc.remoteDescription) {
      try {
        await entry.pc.addIceCandidate(payload.candidate);
      } catch {
        /* abaikan kandidat ICE yang sudah tidak relevan */
      }
    } else {
      entry.pending.push(payload.candidate);
    }
  };

  const handleRemoteStop = (payload: { from?: string }) => {
    if (payload.from) closePeer(payload.from);
  };

  useEffect(() => {
    try {
      localStorage.setItem(boardStorageKey, JSON.stringify(strokes));
    } catch {
      /* penyimpanan lokal penuh atau diblokir */
    }
  }, [boardStorageKey, strokes]);

  useEffect(() => {
    const socket = createLiveSocket();
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('live:join', { sessionId: session.id }, (ack: JoinAck) => {
        if (!ack?.ok) {
          setJoinError(ack?.error || 'Tidak dapat bergabung ke kelas.');
          return;
        }
        setJoinError('');
        setJoined(true);
        setParticipants(ack.participants ?? []);
        setMessages(ack.messages ?? []);
        setPoll(ack.poll ?? null);
      });
    });
    socket.on('disconnect', () => {
      setConnected(false);
      setJoined(false);
      closeAllPeers();
      clearRemote();
    });
    socket.on('connect_error', () => {
      setConnected(false);
      setJoinError('Koneksi realtime gagal. Periksa jaringan lalu muat ulang.');
    });
    socket.on('live:participants', (payload: { participants: LiveParticipant[] }) => {
      setParticipants(payload.participants);
    });
    socket.on('chat:message', (message: LiveChatMessage) => {
      setMessages((rows) => [...rows.slice(-199), message]);
    });
    socket.on('webrtc:offer', (payload) => {
      void handleOffer(payload);
    });
    socket.on('webrtc:answer', (payload) => {
      void handleAnswer(payload);
    });
    socket.on('webrtc:ice', (payload) => {
      void handleIce(payload);
    });
    socket.on('webrtc:stop', (payload) => {
      handleRemoteStop(payload);
    });
    socket.on('live:poll', (nextPoll: LivePoll) => setPoll(nextPoll));
    socket.on('live:hand', (payload: { id: string; name: string; raised: boolean }) => {
      if (payload.id !== user?.id && payload.raised) {
        toast.info(`${payload.name} mengangkat tangan`, 'Beri kesempatan untuk bertanya.');
      }
    });
    socket.on('live:ended', (payload: { by?: string }) => {
      setEnded(true);
      setJoined(false);
      broadcastingRef.current = false;
      setBroadcasting(false);
      closeAllPeers();
      clearRemote();
      stopStream(mediaRef.current);
      stopStream(screenRef.current);
      setCamOn(false);
      setScreenSharing(false);
      toast.info('Kelas live berakhir', payload?.by ? `Diakhiri oleh ${payload.by}.` : undefined);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      broadcastingRef.current = false;
      closeAllPeers();
      clearRemote();
      stopStream(mediaRef.current);
      stopStream(screenRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  useEffect(() => {
    if (!isTeacher || !broadcasting || !joined) return;
    const stream = screenRef.current || mediaRef.current;
    if (!stream) return;
    const mySocketId = socketRef.current?.id;
    const present = new Set(participants.map((participant) => participant.socketId));
    for (const peerId of [...peersRef.current.keys()]) {
      if (!present.has(peerId)) closePeer(peerId);
    }
    for (const participant of participants) {
      if (participant.socketId !== mySocketId && !peersRef.current.has(participant.socketId)) {
        void sendOffer(participant.socketId, stream);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participants, broadcasting, joined, isTeacher]);

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = screenSharing ? screenRef.current : mediaRef.current;
    }
    if (localPipRef.current) localPipRef.current.srcObject = mediaRef.current;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStreamRef.current;
  }, [stage, remoteActive, camOn, screenSharing]);

  useEffect(() => {
    if (!session.startedAt) return;
    const started = new Date(session.startedAt).getTime();
    const update = () => setElapsed(Math.floor((Date.now() - started) / 1000));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [session.startedAt]);

  const ensureMedia = async () => {
    if (mediaRef.current) return mediaRef.current;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    stream.getAudioTracks().forEach((track) => {
      track.enabled = false;
    });
    mediaRef.current = stream;
    return stream;
  };

  const toggleCamera = async () => {
    if (camOn) {
      mediaRef.current?.getVideoTracks().forEach((track) => {
        track.enabled = false;
      });
      setCamOn(false);
      if (!screenSharing) {
        attachLocalStream(null);
        if (isTeacher) stopBroadcast();
      }
      return;
    }
    setMediaBusy(true);
    try {
      const stream = await ensureMedia();
      stream.getVideoTracks().forEach((track) => {
        track.enabled = true;
      });
      if (!screenSharing) attachLocalStream(stream);
      setCamOn(true);
      if (isTeacher && !screenSharing) await startBroadcast(stream);
    } catch {
      toast.error('Kamera tidak dapat diakses', 'Izinkan akses kamera dan mikrofon di browser.');
    } finally {
      setMediaBusy(false);
    }
  };

  const toggleMic = async () => {
    if (micOn) {
      mediaRef.current?.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
      setMicOn(false);
      return;
    }
    setMediaBusy(true);
    try {
      const stream = await ensureMedia();
      stream.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });
      setMicOn(true);
    } catch {
      toast.error('Mikrofon tidak dapat diakses', 'Izinkan akses mikrofon di browser.');
    } finally {
      setMediaBusy(false);
    }
  };

  const toggleScreen = async () => {
    if (screenSharing) {
      stopStream(screenRef.current);
      screenRef.current = null;
      setScreenSharing(false);
      attachLocalStream(camOn ? mediaRef.current : null);
      if (isTeacher) {
        if (camOn && mediaRef.current) replaceBroadcastVideo(mediaRef.current);
        else stopBroadcast();
      }
      return;
    }
    setMediaBusy(true);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenRef.current = stream;
      attachLocalStream(stream);
      setScreenSharing(true);
      setStage('video');
      if (isTeacher) {
        if (broadcastingRef.current) replaceBroadcastVideo(stream);
        else await startBroadcast(stream);
      }
      stream.getVideoTracks()[0]?.addEventListener('ended', () => {
        screenRef.current = null;
        setScreenSharing(false);
        attachLocalStream(camOn ? mediaRef.current : null);
        if (isTeacher) {
          if (camOn && mediaRef.current) replaceBroadcastVideo(mediaRef.current);
          else stopBroadcast();
        }
      });
    } catch {
      /* pengguna membatalkan pemilihan layar */
    } finally {
      setMediaBusy(false);
    }
  };

  const toggleHand = () => {
    const next = !handRaised;
    socketRef.current?.emit('hand:raise', { raised: next });
    setHandRaised(next);
    if (next) toast.info('Tangan diangkat', 'Guru akan melihat tanda tanganmu.');
  };

  const sendChat = (event: FormEvent) => {
    event.preventDefault();
    const text = chatInput.trim();
    if (!text || !joined) return;
    socketRef.current?.emit('chat:send', { text });
    setChatInput('');
  };

  const sendStroke = (stroke: LiveStroke) => {
    const localStroke = { ...stroke, id: `local-${Date.now()}-${Math.random().toString(16).slice(2, 6)}` };
    setStrokes((rows) => [...rows.slice(-2499), localStroke]);
  };

  const clearBoard = () => setStrokes([]);

  const vote = (index: number) => {
    if (!poll?.active || myVote !== null) return;
    socketRef.current?.emit('poll:vote', { index });
    setMyVote(index);
  };

  const endPoll = () => socketRef.current?.emit('poll:end');

  const openPollBuilder = () => {
    setPollQuestion('');
    setPollOptions(['', '', '', '']);
    setPollCorrect(0);
    setPollError('');
    setPollOpen(true);
  };

  const createPoll = () => {
    const options = pollOptions.map((option) => option.trim()).filter(Boolean);
    if (!pollQuestion.trim() || options.length < 2) {
      setPollError('Isi pertanyaan dan minimal dua pilihan jawaban.');
      return;
    }
    socketRef.current?.emit('poll:start', {
      question: pollQuestion.trim(),
      options,
      correctIndex: pollCorrect < options.length ? pollCorrect : null,
    });
    setPollOpen(false);
    toast.success('Polling dimulai', 'Siswa dapat menjawab sekarang.');
  };

  const endSession = async () => {
    try {
      await api(`/api/live-sessions/${session.id}/end`, { method: 'PATCH' });
      setEnded(true);
      setJoined(false);
      setEndConfirm(false);
      stopStream(mediaRef.current);
      stopStream(screenRef.current);
      toast.success('Kelas diakhiri', 'Presensi peserta tersimpan otomatis.');
    } catch (error) {
      toast.error('Gagal mengakhiri kelas', error instanceof Error ? error.message : undefined);
    }
  };

  const leaveRoom = () => {
    socketRef.current?.disconnect();
    navigate(isTeacher ? '/guru/live' : '/live');
  };

  const sortedParticipants = useMemo(
    () =>
      [...participants].sort((a, b) => {
        if (a.raised !== b.raised) return a.raised ? -1 : 1;
        if (a.role !== b.role) return a.role === 'teacher' ? -1 : 1;
        return a.name.localeCompare(b.name);
      }),
    [participants]
  );

  if (ended) {
    return (
      <Card className="overflow-hidden">
        <div className="relative bg-[linear-gradient(135deg,#0B3B69,#12579A)] px-6 py-10 text-center text-white">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/15 backdrop-blur">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight">Kelas live telah berakhir</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-white/75">
            Terima kasih sudah belajar bersama. Presensi, chat, dan hasil polling tersimpan untuk ditinjau kembali.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button variant="accent" onClick={() => navigate(isTeacher ? '/guru/live' : '/live')}>
              Kembali ke daftar kelas
            </Button>
            <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20" onClick={() => navigate('/dashboard')}>
              Buka dasbor
            </Button>
          </div>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-3">
          <div className="rounded-xl bg-surface-2 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Durasi</p>
            <p className="mt-1 text-lg font-extrabold tabular-nums text-text">{timerText(elapsed)}</p>
          </div>
          <div className="rounded-xl bg-surface-2 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Pesan kelas</p>
            <p className="mt-1 text-lg font-extrabold tabular-nums text-text">{messages.length}</p>
          </div>
          <div className="rounded-xl bg-surface-2 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Suara polling</p>
            <p className="mt-1 text-lg font-extrabold tabular-nums text-text">{poll?.totalVotes ?? 0}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 bg-[linear-gradient(120deg,#0B3B69,#12579A_62%,#1E88E5)] px-4 py-3 text-white sm:px-5">
          <Link
            to={isTeacher ? '/guru/live' : '/live'}
            className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 transition hover:bg-white/20"
            aria-label="Kembali ke daftar kelas live"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-danger px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden="true" />
                Live
              </span>
              <span className="text-[11px] text-white/70">{session.className} · {session.chapter || session.bookTitle}</span>
            </div>
            <h2 className="mt-0.5 truncate text-base font-extrabold tracking-tight sm:text-lg">{session.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold tabular-nums sm:inline-flex">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {timerText(elapsed)}
            </span>
            <span className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold', connected ? 'bg-white/10 text-white' : 'bg-danger/90 text-white')}>
              {connected ? <Signal className="h-3.5 w-3.5" aria-hidden="true" /> : <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />}
              {connected ? 'Terhubung' : 'Terputus'}
            </span>
            {isTeacher && (
              <Button size="sm" variant="danger" onClick={() => setEndConfirm(true)} className="h-8 px-3">
                Akhiri
              </Button>
            )}
          </div>
        </div>
      </Card>

      {joinError && !joined ? (
        <Card className="p-6">
          <EmptyState
            icon={WifiOff}
            title="Belum bisa masuk kelas"
            description={joinError}
            action={
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Coba lagi
                </Button>
                <Button onClick={() => navigate(isTeacher ? '/guru/live' : '/live')}>Kembali</Button>
              </div>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_352px]">
          <div className="min-w-0 space-y-4">
            <Card className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
                <Tabs
                  items={[
                    { id: 'video', label: 'Video kelas', icon: Video },
                    { id: 'board', label: 'Papan tulis', icon: PenLine },
                  ]}
                  value={stage}
                  onChange={(value) => setStage(value as 'video' | 'board')}
                />
                <div className="flex items-center gap-2 text-[11px] font-semibold text-muted">
                  <Users className="h-3.5 w-3.5" aria-hidden="true" />
                  {participants.length} peserta
                  {raisedCount > 0 && (
                    <Badge tone="accent" className="gap-1">
                      <Hand className="h-3 w-3" aria-hidden="true" /> {raisedCount}
                    </Badge>
                  )}
                </div>
              </div>

              {stage === 'board' ? (
                <div className="grid gap-3 p-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
                  <div className="h-[420px] sm:h-[520px]">
                    <Whiteboard
                      strokes={strokes}
                      onStroke={sendStroke}
                      canClear
                      onClear={clearBoard}
                    />
                  </div>
                  <LessonBookPanel book={session.book} chapterId={session.chapterId} chapterTitle={session.chapter} />
                </div>
              ) : (
                <div className="relative aspect-video w-full overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#1E4E7A,#0A1F36_70%)]">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className={cx('absolute inset-0 h-full w-full object-cover transition-opacity', remoteActive ? 'opacity-100' : 'opacity-0')}
                  />
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className={cx('h-full w-full object-cover transition-opacity', !remoteActive && showLocalVideo ? 'opacity-100' : 'opacity-0')}
                  />
                  {remoteActive && showLocalVideo && !screenSharing && (
                    <video
                      ref={localPipRef}
                      autoPlay
                      muted
                      playsInline
                      className="absolute bottom-3 right-3 z-10 h-24 w-36 rounded-xl border-2 border-white/40 object-cover shadow-xl sm:h-28 sm:w-40"
                    />
                  )}
                  {!showVideo && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
                      <SigemasMascot className="h-24 w-24 drop-shadow-2xl sm:h-32 sm:w-32" />
                      <p className="mt-3 text-sm font-bold sm:text-base">{displayName}</p>
                      {remoteActive ? null : isTeacher ? (
                        <>
                          <p className="mt-1 max-w-sm text-[11px] text-white/60">
                            Nyalakan kamera agar seluruh siswa dapat melihat dan mendengar Anda.
                          </p>
                          <Button
                            size="sm"
                            variant="accent"
                            className="mt-3"
                            onClick={toggleCamera}
                            disabled={mediaBusy}
                          >
                            <Video className="mr-1.5 h-4 w-4" aria-hidden="true" />
                            {mediaBusy ? 'Membuka kamera…' : 'Aktifkan kamera guru'}
                          </Button>
                        </>
                      ) : (
                        <p className="mt-1 max-w-sm text-[11px] text-white/60">
                          Menunggu guru mengaktifkan kamera. Anda tetap bisa mengikuti chat dan papan tulis.
                        </p>
                      )}
                    </div>
                  )}
                  {showVideo && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
                      <span
                        className={cx(
                          'h-1.5 w-1.5 rounded-full',
                          remoteActive ? 'bg-danger' : micOn ? 'bg-success' : 'bg-white/40'
                        )}
                        aria-hidden="true"
                      />
                      {remoteActive ? `${remoteName} · ${roleLabel[remoteRole] || 'Guru'}` : displayName}
                      {!remoteActive && screenSharing && <span className="text-white/70">· berbagi layar</span>}
                    </div>
                  )}
                  <div className="absolute right-3 top-3 flex items-center gap-2">
                    <Badge tone="danger" dot className="bg-danger/90 text-white">
                      {remoteActive ? 'GURU LIVE' : 'LIVE'}
                    </Badge>
                    {raisedCount > 0 && (
                      <Badge tone="accent" className="bg-accent/90 text-[#2b1a00]">
                        <Hand className="h-3 w-3" aria-hidden="true" /> {raisedCount} tangan
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-2 border-t border-border bg-surface px-3 py-3 sm:gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMic}
                    disabled={mediaBusy}
                    className={cx(
                      'grid h-11 w-11 place-items-center rounded-xl border transition disabled:opacity-50',
                      micOn ? 'border-primary/30 bg-primary-soft text-primary-strong dark:text-primary' : 'border-border bg-surface-2 text-muted hover:text-text'
                    )}
                    aria-label={micOn ? 'Matikan mikrofon' : 'Aktifkan mikrofon'}
                    aria-pressed={micOn}
                  >
                    {mediaBusy ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : micOn ? <Mic className="h-4.5 w-4.5" /> : <MicOff className="h-4.5 w-4.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleCamera}
                    disabled={mediaBusy}
                    className={cx(
                      'grid h-11 w-11 place-items-center rounded-xl border transition disabled:opacity-50',
                      camOn ? 'border-primary/30 bg-primary-soft text-primary-strong dark:text-primary' : 'border-border bg-surface-2 text-muted hover:text-text'
                    )}
                    aria-label={camOn ? 'Matikan kamera' : 'Aktifkan kamera'}
                    aria-pressed={camOn}
                  >
                    {camOn ? <Camera className="h-4.5 w-4.5" /> : <CameraOff className="h-4.5 w-4.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleScreen}
                    disabled={mediaBusy}
                    className={cx(
                      'grid h-11 w-11 place-items-center rounded-xl border transition disabled:opacity-50',
                      screenSharing ? 'border-accent/40 bg-accent-soft text-accent-strong' : 'border-border bg-surface-2 text-muted hover:text-text'
                    )}
                    aria-label={screenSharing ? 'Berhenti berbagi layar' : 'Bagikan layar'}
                    aria-pressed={screenSharing}
                  >
                    {screenSharing ? <MonitorOff className="h-4.5 w-4.5" /> : <Monitor className="h-4.5 w-4.5" />}
                  </button>
                  {!isTeacher && (
                    <button
                      type="button"
                      onClick={toggleHand}
                      className={cx(
                        'grid h-11 w-11 place-items-center rounded-xl border transition',
                        handRaised ? 'border-accent/40 bg-accent-soft text-accent-strong' : 'border-border bg-surface-2 text-muted hover:text-text'
                      )}
                      aria-label={handRaised ? 'Turunkan tangan' : 'Angkat tangan'}
                      aria-pressed={handRaised}
                    >
                      <Hand className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>
                <div className="hidden h-8 w-px bg-border sm:block" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => setStage(stage === 'board' ? 'video' : 'board')}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 text-xs font-semibold text-text transition hover:border-primary/35"
                >
                  {stage === 'board' ? <Video className="h-4 w-4" aria-hidden="true" /> : <PenLine className="h-4 w-4" aria-hidden="true" />}
                  {stage === 'board' ? 'Lihat video' : 'Buka papan'}
                </button>
                <Button variant="danger" size="sm" onClick={leaveRoom} className="h-10">
                  <PhoneOff className="h-4 w-4" aria-hidden="true" />
                  {isTeacher ? 'Keluar' : 'Keluar kelas'}
                </Button>
              </div>
            </Card>

            <PollPanel
              poll={poll}
              myVote={myVote}
              isTeacher={isTeacher}
              onVote={vote}
              onEnd={endPoll}
              onCreate={openPollBuilder}
            />
          </div>

          <div className="min-w-0 space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary-soft text-primary-strong dark:text-primary">
                    <Users className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-text">Peserta</h3>
                    <p className="text-[10px] text-muted">{participants.length} bergabung · {raisedCount} tangan</p>
                  </div>
                </div>
                {isTeacher && (
                  <Link to="/guru/presensi" className="text-[10px] font-bold text-primary hover:underline">
                    Presensi
                  </Link>
                )}
              </div>
              <div className="mt-3 max-h-48 space-y-1.5 overflow-y-auto pr-1">
                {sortedParticipants.length === 0 && (
                  <p className="rounded-xl bg-surface-2 px-3 py-3 text-center text-[11px] text-muted">
                    Menunggu peserta lain bergabung…
                  </p>
                )}
                {sortedParticipants.map((participant) => (
                  <div key={participant.socketId} className="flex items-center gap-2.5 rounded-xl px-1.5 py-1.5">
                    <Avatar name={participant.name} size="xs" status="online" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-text">
                        {participant.name}
                        {participant.id === user?.id && <span className="ml-1 text-[9px] text-muted">(Anda)</span>}
                      </p>
                      <p className="text-[9px] text-muted">
                        {roleLabel[participant.role] || participant.role} · {participant.durationMin} mnt
                      </p>
                    </div>
                    {participant.raised && <HandBadge />}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-success-soft px-2.5 py-2 text-[10px] font-semibold text-success">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Presensi tercatat otomatis saat bergabung
              </div>
            </Card>

            <Card className="flex h-[420px] flex-col overflow-hidden xl:h-[500px]">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
                <h3 className="text-sm font-bold text-text">Obrolan kelas</h3>
                <Badge tone="neutral" className="ml-auto">{messages.length}</Badge>
              </div>
              <div className="flex-1 space-y-2.5 overflow-y-auto px-3 py-3">
                {messages.length === 0 && (
                  <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                    <MessageCircle className="h-7 w-7 text-muted/60" aria-hidden="true" />
                    <p className="mt-2 text-xs font-semibold text-muted">Belum ada pesan</p>
                    <p className="mt-0.5 text-[10px] text-muted/80">Sapa teman dan guru di sini.</p>
                  </div>
                )}
                {messages.map((message) => {
                  const mine = message.user.id === user?.id;
                  return (
                    <div key={message.id} className={cx('flex gap-2', mine && 'flex-row-reverse')}>
                      {!mine && <Avatar name={message.user.name} size="xs" />}
                      <div className={cx('max-w-[82%]', mine && 'text-right')}>
                        <div className={cx('mb-0.5 flex items-center gap-1.5 text-[9px] text-muted', mine && 'justify-end')}>
                          <span className="font-semibold">{mine ? 'Anda' : message.user.name}</span>
                          {message.user.role === 'teacher' && (
                            <span className="rounded bg-primary-soft px-1 py-0.5 text-[8px] font-bold text-primary-strong dark:text-primary">GURU</span>
                          )}
                        </div>
                        <div
                          className={cx(
                            'inline-block rounded-2xl px-3 py-2 text-left text-[11px] leading-relaxed',
                            mine ? 'rounded-tr-md bg-primary text-white' : 'rounded-tl-md bg-surface-2 text-text'
                          )}
                        >
                          {message.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={sendChat} className="border-t border-border p-2.5">
                <div className="flex items-end gap-2">
                  <input
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    maxLength={500}
                    disabled={!joined}
                    placeholder={joined ? 'Tulis pesan…' : 'Menghubungkan…'}
                    aria-label="Tulis pesan kelas"
                    className="h-10 min-w-0 flex-1 rounded-xl border border-border bg-surface-2 px-3 text-xs text-text outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-55"
                  />
                  <Button type="submit" size="icon" disabled={!chatInput.trim() || !joined} aria-label="Kirim pesan" className="h-10 w-10 shrink-0">
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}

      {!joined && !joinError && (
        <div className="fixed inset-x-0 bottom-20 z-20 mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold text-muted shadow-pop lg:bottom-8">
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
          Menghubungkan ke kelas live…
        </div>
      )}

      <Modal
        open={endConfirm}
        onClose={() => setEndConfirm(false)}
        title="Akhiri kelas live?"
        description="Peserta akan dikeluarkan dari ruang kelas dan presensi ditutup otomatis."
        footer={
          <>
            <Button variant="outline" onClick={() => setEndConfirm(false)}>Batal</Button>
            <Button variant="danger" onClick={endSession}>Ya, akhiri kelas</Button>
          </>
        }
      >
        <div className="flex items-start gap-3 rounded-xl bg-warning-soft p-3 text-xs leading-relaxed text-warning">
          <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>Durasi sesi saat ini {timerText(elapsed)} dengan {participants.length} peserta di ruang kelas. Chat, video, dan papan tulis pribadi tidak dapat dilanjutkan setelah sesi berakhir.</p>
        </div>
      </Modal>

      <Modal
        open={pollOpen}
        onClose={() => setPollOpen(false)}
        title="Buat polling kelas"
        description="Kumpulkan jawaban siswa secara realtime. Tandai jawaban benar untuk pembahasan."
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setPollOpen(false)}>Batal</Button>
            <Button variant="accent" onClick={createPoll}>
              <BarChart3 className="h-4 w-4" aria-hidden="true" /> Mulai polling
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Textarea
            label="Pertanyaan"
            placeholder="Contoh: Manakah yang termasuk fungsi kuadrat?"
            value={pollQuestion}
            onChange={(event) => setPollQuestion(event.target.value)}
            maxLength={200}
            rows={2}
          />
          <div>
            <p className="mb-2 text-xs font-semibold text-text">Pilihan jawaban</p>
            <div className="space-y-2">
              {pollOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPollCorrect(index)}
                    className={cx(
                      'grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-[10px] font-bold transition',
                      pollCorrect === index ? 'border-success bg-success text-white' : 'border-border bg-surface-2 text-muted hover:border-success/40'
                    )}
                    aria-label={`Tandai pilihan ${index + 1} sebagai jawaban benar`}
                    aria-pressed={pollCorrect === index}
                  >
                    {pollCorrect === index ? <CheckCircle2 className="h-4 w-4" /> : String.fromCharCode(65 + index)}
                  </button>
                  <input
                    value={option}
                    onChange={(event) =>
                      setPollOptions((rows) => rows.map((value, i) => (i === index ? event.target.value : value)))
                    }
                    placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
                    maxLength={120}
                    className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 text-xs text-text outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/12"
                    aria-label={`Teks pilihan ${String.fromCharCode(65 + index)}`}
                  />
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-muted">Kosongkan pilihan yang tidak dipakai. Tanda hijau menandai jawaban benar.</p>
          </div>
          {pollError && <p className="rounded-lg bg-danger-soft px-3 py-2 text-xs font-semibold text-danger">{pollError}</p>}
        </div>
      </Modal>
    </div>
  );
}

function PollPanel({
  poll,
  myVote,
  isTeacher,
  onVote,
  onEnd,
  onCreate,
}: {
  poll: LivePoll | null;
  myVote: number | null;
  isTeacher: boolean;
  onVote: (index: number) => void;
  onEnd: () => void;
  onCreate: () => void;
}) {
  if (!poll) {
    return (
      <Card className="flex flex-wrap items-center gap-3 p-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent-strong">
          <BarChart3 className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-text">Polling kelas</p>
          <p className="text-[11px] text-muted">
            {isTeacher ? 'Uji pemahaman siswa dengan pertanyaan singkat.' : 'Belum ada polling. Tetap fokus pada materi.'}
          </p>
        </div>
        {isTeacher && (
          <Button size="sm" variant="accent" onClick={onCreate}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Buat polling
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-soft text-accent-strong">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold text-text">Polling kelas</p>
            <p className="text-[10px] text-muted">{poll.totalVotes} suara · {poll.active ? 'berlangsung' : 'selesai'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {poll.active ? <Badge tone="success" dot>Aktif</Badge> : <Badge tone="neutral">Ditutup</Badge>}
          {isTeacher && poll.active && (
            <Button size="sm" variant="outline" onClick={onEnd} className="h-8 px-2.5">
              Tutup
            </Button>
          )}
          {isTeacher && !poll.active && (
            <Button size="sm" variant="ghost" onClick={onCreate} className="h-8 px-2.5">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Baru
            </Button>
          )}
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold text-text">{poll.question}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {poll.options.map((option, index) => {
            const percent = poll.totalVotes ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
            const selected = myVote === index;
            const correct = !poll.active && poll.correctIndex === index;
            const wrongSelection = !poll.active && selected && poll.correctIndex !== null && poll.correctIndex !== index;
            return (
              <button
                key={`${poll.id}-${index}`}
                type="button"
                onClick={() => onVote(index)}
                disabled={!poll.active || myVote !== null || isTeacher}
                className={cx(
                  'relative overflow-hidden rounded-xl border p-2.5 text-left transition',
                  correct
                    ? 'border-success/45 bg-success-soft'
                    : wrongSelection
                      ? 'border-danger/40 bg-danger-soft'
                      : selected
                        ? 'border-primary/45 bg-primary-soft'
                        : 'border-border bg-surface-2 hover:border-primary/30',
                  (poll.active && myVote === null && !isTeacher) && 'cursor-pointer'
                )}
                aria-pressed={selected}
              >
                <span className="absolute inset-y-0 left-0 bg-primary/12 transition-[width] duration-500" style={{ width: `${percent}%` }} aria-hidden="true" />
                <span className="relative flex items-center gap-2">
                  <span className={cx('grid h-6 w-6 shrink-0 place-items-center rounded-md text-[10px] font-extrabold', correct ? 'bg-success text-white' : 'bg-surface text-muted')}>
                    {correct ? <CheckCircle2 className="h-3.5 w-3.5" /> : String.fromCharCode(65 + index)}
                  </span>
                  <span className="min-w-0 flex-1 text-[11px] font-semibold text-text">{option.text}</span>
                  <span className="text-[10px] font-bold tabular-nums text-muted">{option.votes > 0 ? `${percent}%` : ''}</span>
                  {selected && <span className="text-[9px] font-bold text-primary-strong dark:text-primary">Pilihanmu</span>}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted">
          <span>
            {isTeacher
              ? poll.active ? 'Siswa dapat memilih satu jawaban.' : 'Polling ditutup. Jawaban benar ditandai hijau.'
              : myVote !== null ? 'Jawaban terkirim. Tunggu hasil dari guru.' : poll.active ? 'Pilih satu jawaban.' : 'Polling telah ditutup.'}
          </span>
          {!poll.active && poll.correctIndex !== null && (
            <span className="inline-flex items-center gap-1 font-semibold text-success">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Jawaban benar: {String.fromCharCode(65 + poll.correctIndex)}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
