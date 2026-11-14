import express from 'express';
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Server } from 'socket.io';
import {
  users,
  books,
  classes,
  bookProgress,
  liveSessions,
  quizzes,
  assessments,
  scores,
  subjectGrades,
  tasks,
  submissions,
  attendanceSessions,
  lessonPlans,
  parentNotes,
  notifications,
  activityLogs,
  weeklyStudy,
  performanceTrend,
  userGrowth,
} from './data.js';
import { runtime } from './state.js';
import { setupRealtime } from './realtime.js';
import { getRoom } from './state.js';

try {
  process.loadEnvFile?.();
} catch {
  /* .env optional */
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: true, credentials: true },
});
const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET || 'sigemas-dev-secret-change-me';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '6mb' }));

const nowIso = () => new Date().toISOString();
const publicUser = (user) => {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
};
const findUser = (id) => users.find((u) => u.id === id);
const userName = (id) => findUser(id)?.name ?? 'Pengguna';
const classById = (id) => classes.find((c) => c.id === id);
const bookById = (id) => books.find((b) => b.id === id);
const canAccessBook = (user, book) =>
  book?.audience !== 'teacher' || user.role === 'teacher' || user.role === 'admin';
const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const signToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

const auth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Silakan masuk terlebih dahulu.' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUser(payload.sub);
    if (!user) return res.status(401).json({ error: 'Akun tidak ditemukan.' });
    if (user.status !== 'aktif') return res.status(403).json({ error: 'Akun tidak aktif.' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Sesi kedaluwarsa. Silakan masuk kembali.' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Peran Anda tidak memiliki akses ke fitur ini.' });
  }
  next();
};

const addLog = (actor, action, target, req) => {
  activityLogs.unshift({
    id: `log-${Date.now()}`,
    actor: actor?.name || 'Sistem',
    role: actor?.role || 'system',
    action,
    target,
    at: nowIso(),
    ip: req?.ip?.replace('::ffff:', '') || '10.12.0.1',
  });
  if (activityLogs.length > 80) activityLogs.pop();
};

const nextScheduleForClass = (classObj, limit = 6) => {
  if (!classObj) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return classObj.schedule
    .map((item) => {
      const target = dayNames.indexOf(item.day);
      let diff = (target - today.getDay() + 7) % 7;
      const date = new Date(today);
      date.setDate(today.getDate() + diff);
      return {
        ...item,
        teacherName: item.teacherId ? userName(item.teacherId) : undefined,
        date: date.toISOString(),
        dateLabel: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        isToday: diff === 0,
        classId: classObj.id,
        className: classObj.name,
      };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date) || a.start.localeCompare(b.start))
    .slice(0, limit);
};

const studentSubjectGrades = (studentId) => {
  const boost = studentId === 's1' ? 0 : -6;
  return subjectGrades.map((s) => ({
    ...s,
    final: Math.max(60, Math.min(100, s.final + boost)),
    mastery: Math.max(50, Math.min(100, s.mastery + boost)),
  }));
};

const weightedAverage = (classId, studentId) => {
  const rows = assessments.filter((a) => a.classId === classId);
  let total = 0;
  let weight = 0;
  for (const assessment of rows) {
    const score = scores.find((s) => s.assessmentId === assessment.id && s.studentId === studentId);
    if (score) {
      total += score.score * assessment.weight;
      weight += assessment.weight;
    }
  }
  return weight ? Math.round((total / weight) * 10) / 10 : 0;
};

const classAverages = (classId) => {
  const cls = classById(classId);
  if (!cls) return { average: 0, ranks: [], best: 0, lowest: 0 };
  const rows = cls.studentIds.map((studentId) => ({
    studentId,
    name: userName(studentId),
    average: weightedAverage(classId, studentId),
  }));
  const ranked = [...rows].sort((a, b) => b.average - a.average);
  const valid = rows.filter((r) => r.average > 0);
  const average = valid.length
    ? Math.round((valid.reduce((sum, r) => sum + r.average, 0) / valid.length) * 10) / 10
    : 0;
  return {
    average,
    ranks: ranked,
    best: ranked[0]?.average ?? 0,
    lowest: ranked[ranked.length - 1]?.average ?? 0,
  };
};

const attendanceForStudent = (studentId) => {
  const records = [];
  for (const session of attendanceSessions) {
    const record = session.records.find((r) => r.studentId === studentId);
    if (record) {
      records.push({
        ...record,
        date: session.date,
        topic: session.topic,
        classId: session.classId,
      });
    }
  }
  for (const record of runtime.liveAttendance.filter((r) => r.studentId === studentId)) {
    const session = liveSessions.find((s) => s.id === record.sessionId);
    records.push({
      ...record,
      status: record.status || 'hadir',
      date: record.joinedAt,
      topic: session?.title || 'Kelas live',
      classId: record.classId,
    });
  }
  const unique = new Map();
  for (const record of records) {
    const key = record.sessionId || `${record.date}-${record.topic}`;
    const existing = unique.get(key);
    if (!existing || (record.durationMin || 0) > (existing.durationMin || 0)) unique.set(key, record);
  }
  const list = [...unique.values()].sort((a, b) => new Date(b.date) - new Date(a.date));
  const count = (status) => list.filter((r) => r.status === status).length;
  const present = count('hadir') + count('terlambat');
  return {
    records: list,
    summary: {
      total: list.length,
      present: count('hadir'),
      late: count('terlambat'),
      sick: count('sakit'),
      excused: count('izin'),
      absent: count('alfa'),
      rate: list.length ? Math.round((present / list.length) * 100) : 0,
      totalMinutes: list.reduce((sum, r) => sum + (r.durationMin || 0), 0),
    },
  };
};

const stripAnswers = (quiz) => ({
  ...quiz,
  questions: quiz.questions.map(({ answer, explanation, ...rest }) => rest),
});

const quizLeaderboard = (quizId, limit = 8) => {
  const bestByStudent = new Map();
  for (const attempt of runtime.quizAttempts.filter((a) => a.quizId === quizId)) {
    const prev = bestByStudent.get(attempt.studentId);
    if (!prev || attempt.score > prev.score) bestByStudent.set(attempt.studentId, attempt);
  }
  return [...bestByStudent.values()]
    .sort((a, b) => b.score - a.score || new Date(a.submittedAt) - new Date(b.submittedAt))
    .slice(0, limit)
    .map((attempt, index) => ({
      rank: index + 1,
      studentId: attempt.studentId,
      name: userName(attempt.studentId),
      score: attempt.score,
      submittedAt: attempt.submittedAt,
    }));
};

const sessionSummary = (session) => {
  const cls = classById(session.classId);
  const book = bookById(session.bookId);
  return {
    ...session,
    className: cls?.name,
    teacherName: userName(session.teacherId),
    bookTitle: book?.title,
    chapter: book?.chapters.find((c) => c.id === session.chapterId)?.title,
    isMine: false,
  };
};

const roleCounts = () => {
  const counts = { student: 0, teacher: 0, parent: 0, admin: 0 };
  for (const u of users) counts[u.role] = (counts[u.role] || 0) + 1;
  return counts;
};

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'SiGEMAS API', time: nowIso(), uptime: process.uptime() });
});

app.get('/api/demo-accounts', (_req, res) => {
  res.json(
    ['s1', 't1', 'p1', 'a1'].map((id) => {
      const u = findUser(id);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        title: u.title,
        password: 'demo1234',
      };
    })
  );
});

app.post('/api/auth/login', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const user = users.find((u) => u.email.toLowerCase() === email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Email atau kata sandi tidak sesuai.' });
  }
  if (user.status !== 'aktif') {
    return res.status(403).json({ error: 'Akun Anda belum aktif. Hubungi administrator.' });
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});

app.get('/api/auth/me', auth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
app.get('/api/dashboard', auth, (req, res) => {
  const user = req.user;

  if (user.role === 'student') {
    const cls = classById(user.classId);
    const progress = Object.entries(bookProgress)
      .filter(([key]) => key.startsWith(`${user.id}:`))
      .map(([key, value]) => ({ ...bookById(key.split(':')[1]), progress: value }))
      .filter((b) => b.id);
    const fallbackBooks = books
      .filter((b) => canAccessBook(user, b) && b.featured)
      .slice(0, 3)
      .map((b) => ({ ...b, progress: { percent: 0, lastPage: 1 } }));
    const activeSession = liveSessions
      .filter((s) => s.status === 'live' && s.classId === user.classId)
      .map(sessionSummary)[0];
    const attendance = attendanceForStudent(user.id);
    const leaderboard = quizLeaderboard('quiz-mat-3');
    const avg = Math.round(
      studentSubjectGrades(user.id).reduce((sum, s) => sum + s.final, 0) /
        studentSubjectGrades(user.id).length
    );
    const myTasks = tasks
      .filter((t) => t.classId === user.classId)
      .map((t) => ({
        ...t,
        submission: submissions.find((s) => s.taskId === t.id && s.studentId === user.id) || null,
      }))
      .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));

    return res.json({
      role: 'student',
      summary: {
        studyHours: Math.round((weeklyStudy.reduce((s, d) => s + d.minutes, 0) / 60) * 10) / 10,
        modulesDone: progress.filter((b) => b.progress.percent >= 100).length + 3,
        averageScore: avg,
        attendanceRate: attendance.summary.rate,
        streakDays: 12,
        rank: classAverages(user.classId).ranks.findIndex((r) => r.studentId === user.id) + 1,
      },
      activeSession,
      books: progress.length ? progress : fallbackBooks,
      tasks: myTasks.filter((t) => t.status === 'open').slice(0, 4),
      upcoming: nextScheduleForClass(cls, 5),
      weeklyStudy,
      subjects: studentSubjectGrades(user.id),
      leaderboard,
      attendance: attendance.summary,
      className: cls?.name,
    });
  }

  if (user.role === 'teacher') {
    const myClasses = classes.filter((c) => user.classIds?.includes(c.id));
    const classStats = myClasses.map((c) => {
      const avg = classAverages(c.id);
      return {
        ...c,
        studentCount: c.studentIds.length,
        average: avg.average,
        attendanceRate: 96,
      };
    });
    const activeSession = liveSessions
      .filter((s) => s.status === 'live' && s.teacherId === user.id)
      .map(sessionSummary)[0];
    const pending = submissions
      .filter((s) => {
        const task = tasks.find((t) => t.id === s.taskId);
        return s.status === 'menunggu' && task?.teacherId === user.id;
      })
      .map((s) => ({
        ...s,
        studentName: userName(s.studentId),
        taskTitle: tasks.find((t) => t.id === s.taskId)?.title,
      }));
    const todaySchedule = myClasses
      .flatMap((c) => nextScheduleForClass(c, 8))
      .filter((s) => s.isToday)
      .sort((a, b) => a.start.localeCompare(b.start));
    const gradedClasses = classStats.filter((c) => c.average > 0);
    const classAvg = gradedClasses.length
      ? Math.round(
          gradedClasses.reduce((sum, c) => sum + c.average, 0) / gradedClasses.length
        )
      : 0;
    const room = activeSession ? getRoom(activeSession.id) : null;

    return res.json({
      role: 'teacher',
      summary: {
        activeStudents: room?.participants.size || activeSession?.participants || 0,
        classesToday: todaySchedule.length,
        pendingReviews: pending.length,
        classAverage: classAvg,
        totalStudents: myClasses.reduce((sum, c) => sum + c.studentIds.length, 0),
      },
      activeSession,
      pending,
      classes: classStats,
      performance: performanceTrend.map((p) => ({ label: p.label, score: p.classAvg })),
      todaySchedule,
      tasks: tasks
        .filter((t) => t.teacherId === user.id && t.status === 'open')
        .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt)),
      scoreDistribution: [
        { label: '90–100', value: 9 },
        { label: '80–89', value: 12 },
        { label: '70–79', value: 7 },
        { label: '<70', value: 4 },
      ],
    });
  }

  if (user.role === 'parent') {
    const childId = user.childIds?.[0];
    const child = findUser(childId);
    const cls = classById(child?.classId);
    const attendance = attendanceForStudent(childId);
    const ranks = classAverages(child.classId).ranks;
    const avg = Math.round(
      studentSubjectGrades(childId).reduce((sum, s) => sum + s.final, 0) /
        studentSubjectGrades(childId).length
    );
    const notes = parentNotes
      .filter((n) => n.studentId === childId)
      .map((n) => ({
        ...n,
        teacherName: userName(n.teacherId),
        teacherTitle: findUser(n.teacherId)?.subject,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    return res.json({
      role: 'parent',
      child: publicUser(child),
      className: cls?.name,
      summary: {
        averageScore: avg,
        attendanceRate: attendance.summary.rate,
        modulesDone: 7,
        rank: ranks.findIndex((r) => r.studentId === childId) + 1,
        totalStudents: cls?.studentIds.length || 0,
        studyHours: 6.4,
      },
      performance: performanceTrend,
      subjects: studentSubjectGrades(childId),
      attendance: attendance.summary,
      attendanceRecords: attendance.records.slice(0, 6),
      recentGrades: studentSubjectGrades(childId).slice(0, 5),
      notes,
      tasks: tasks
        .filter((t) => t.classId === child?.classId && t.status === 'open')
        .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))
        .slice(0, 4),
      weeklyStudy,
    });
  }

  const counts = roleCounts();
  const pendingTeachers = users.filter((u) => u.role === 'teacher' && u.status === 'nonaktif');
  res.json({
    role: 'admin',
    summary: {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.status === 'aktif').length,
      totalBooks: books.length,
      totalClasses: classes.length,
      liveNow: liveSessions.filter((s) => s.status === 'live').length,
      syncedBooks: runtime.sync.booksCount,
    },
    userGrowth,
    roleDistribution: [
      { label: 'Siswa', value: counts.student, color: '#1E88E5' },
      { label: 'Guru', value: counts.teacher, color: '#FF9800' },
      { label: 'Orang Tua', value: counts.parent, color: '#16A34A' },
      { label: 'Admin', value: counts.admin, color: '#8E24AA' },
    ],
    sync: runtime.sync,
    logs: activityLogs.slice(0, 6),
    pendingTeachers: pendingTeachers.map(publicUser),
    classes: classes.map((c) => ({
      ...c,
      studentCount: c.studentIds.length,
      homeroomName: userName(c.homeroomId),
      average: classAverages(c.id).average,
    })),
    system: {
      uptimeHours: Math.round(process.uptime() / 36) / 100,
      memoryMb: Math.round(process.memoryUsage().rss / 1048576),
      latencyMs: 24,
      storage: '68%',
    },
  });
});

// ---------------------------------------------------------------------------
// Books & reader
// ---------------------------------------------------------------------------
app.get('/api/books', auth, (req, res) => {
  const q = String(req.query.q || '').toLowerCase();
  const subject = String(req.query.subject || '');
  res.json(
    books
      .filter((b) => canAccessBook(req.user, b))
      .filter((b) => (subject ? b.subject === subject : true))
      .filter((b) =>
        q
          ? `${b.title} ${b.subject} ${b.authors.join(' ')}`.toLowerCase().includes(q)
          : true
      )
      .map(({ chapters, ...book }) => {
        const progress = bookProgress[`${req.user.id}:${book.id}`] || null;
        return {
          ...book,
          chapterCount: chapters.length,
          firstChapter: chapters[0]?.title,
          progress,
        };
      })
  );
});

app.get('/api/books/:id', auth, (req, res) => {
  const book = bookById(req.params.id);
  if (!book) return res.status(404).json({ error: 'Buku tidak ditemukan.' });
  if (!canAccessBook(req.user, book)) {
    return res.status(403).json({ error: 'Buku panduan guru hanya dapat diakses oleh guru.' });
  }
  res.json({
    ...book,
    progress: bookProgress[`${req.user.id}:${book.id}`] || null,
    teacherName: userName('t1'),
  });
});

app.post('/api/progress', auth, requireRole('student'), (req, res) => {
  const { bookId, lastPage, percent } = req.body || {};
  const book = bookById(bookId);
  if (!book) return res.status(404).json({ error: 'Buku tidak ditemukan.' });
  if (!canAccessBook(req.user, book)) {
    return res.status(403).json({ error: 'Buku panduan guru hanya dapat diakses oleh guru.' });
  }
  const page = Math.max(1, Math.min(Number(lastPage) || 1, 100));
  const pct = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)));
  const key = `${req.user.id}:${bookId}`;
  bookProgress[key] = { percent: pct, lastPage: page, updatedAt: nowIso() };
  if (pct > 0 && pct % 25 === 0) addLog(req.user, 'Membaca buku SIBI', `${bookById(bookId).title} · ${pct}%`, req);
  res.json({ ok: true, progress: bookProgress[key] });
});

// ---------------------------------------------------------------------------
// Classes
// ---------------------------------------------------------------------------
app.get('/api/classes', auth, (req, res) => {
  let list = classes;
  if (req.user.role === 'teacher') list = classes.filter((c) => req.user.classIds?.includes(c.id));
  if (req.user.role === 'student') list = classes.filter((c) => c.id === req.user.classId);
  if (req.user.role === 'parent') {
    const child = findUser(req.user.childIds?.[0]);
    list = classes.filter((c) => c.id === child?.classId);
  }
  res.json(
    list.map((c) => ({
      ...c,
      studentCount: c.studentIds.length,
      homeroomName: userName(c.homeroomId),
      average: classAverages(c.id).average,
      attendanceRate: 96,
      schedule: c.schedule.map((s) => ({ ...s, teacherName: userName(s.teacherId) })),
    }))
  );
});

app.get('/api/classes/:id', auth, (req, res) => {
  const cls = classById(req.params.id);
  if (!cls) return res.status(404).json({ error: 'Kelas tidak ditemukan.' });
  res.json({
    ...cls,
    homeroomName: userName(cls.homeroomId),
    studentCount: cls.studentIds.length,
    average: classAverages(cls.id).average,
    students: cls.studentIds.map((id) => ({
      ...publicUser(findUser(id)),
      average: weightedAverage(cls.id, id),
    })),
    upcoming: nextScheduleForClass(cls, 6),
    schedule: cls.schedule.map((s) => ({ ...s, teacherName: userName(s.teacherId) })),
  });
});

// ---------------------------------------------------------------------------
// Tasks, submissions & grades
// ---------------------------------------------------------------------------
const tasksForUser = (user) => {
  if (user.role === 'teacher') return tasks.filter((t) => t.teacherId === user.id);
  if (user.role === 'student') return tasks.filter((t) => t.classId === user.classId);
  if (user.role === 'parent') {
    const child = findUser(user.childIds?.[0]);
    return tasks.filter((t) => t.classId === child?.classId);
  }
  return tasks;
};

app.get('/api/tasks', auth, (req, res) => {
  res.json(
    tasksForUser(req.user)
      .map((t) => ({
        ...t,
        className: classById(t.classId)?.name,
        teacherName: userName(t.teacherId),
        submission:
          req.user.role === 'student'
            ? submissions.find((s) => s.taskId === t.id && s.studentId === req.user.id) || null
            : undefined,
      }))
      .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))
  );
});

app.post('/api/tasks', auth, requireRole('teacher', 'admin'), (req, res) => {
  const body = req.body || {};
  if (!body.title || !body.classId || !body.dueAt) {
    return res.status(400).json({ error: 'Judul, kelas, dan tenggat wajib diisi.' });
  }
  const cls = classById(body.classId);
  if (!cls) return res.status(404).json({ error: 'Kelas tidak ditemukan.' });
  const task = {
    id: `task-${Date.now()}`,
    title: String(body.title).slice(0, 120),
    description: String(body.description || '').slice(0, 1000),
    classId: body.classId,
    teacherId: req.user.id,
    subject: body.subject || req.user.subject || 'Matematika',
    bookId: body.bookId || null,
    chapterId: body.chapterId || null,
    type: body.type || 'Tugas',
    maxScore: Number(body.maxScore) || 100,
    dueAt: new Date(body.dueAt).toISOString(),
    createdAt: nowIso(),
    status: 'open',
    submittedCount: 0,
    totalStudents: cls.studentIds.length * 4,
  };
  tasks.unshift(task);
  addLog(req.user, 'Membuat tugas baru', task.title, req);
  res.status(201).json(task);
});

app.patch('/api/tasks/:id', auth, requireRole('teacher', 'admin'), (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Tugas tidak ditemukan.' });
  if (req.user.role === 'teacher' && task.teacherId !== req.user.id) {
    return res.status(403).json({ error: 'Anda bukan pemilik tugas ini.' });
  }
  Object.assign(task, {
    title: req.body.title ?? task.title,
    description: req.body.description ?? task.description,
    dueAt: req.body.dueAt ? new Date(req.body.dueAt).toISOString() : task.dueAt,
    status: req.body.status ?? task.status,
    maxScore: req.body.maxScore ?? task.maxScore,
  });
  res.json(task);
});

app.get('/api/submissions', auth, requireRole('teacher', 'admin'), (req, res) => {
  const task = req.query.taskId ? tasks.find((t) => t.id === req.query.taskId) : null;
  res.json(
    submissions
      .filter((s) => (task ? s.taskId === task.id : true))
      .filter((s) => {
        const t = tasks.find((x) => x.id === s.taskId);
        return req.user.role === 'admin' || t?.teacherId === req.user.id;
      })
      .map((s) => ({
        ...s,
        studentName: userName(s.studentId),
        taskTitle: tasks.find((t) => t.id === s.taskId)?.title,
      }))
  );
});

app.patch('/api/submissions/:id', auth, requireRole('teacher', 'admin'), (req, res) => {
  const submission = submissions.find((s) => s.id === req.params.id);
  if (!submission) return res.status(404).json({ error: 'Pengumpulan tidak ditemukan.' });
  const score = Number(req.body?.score);
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    return res.status(400).json({ error: 'Nilai harus antara 0 dan 100.' });
  }
  submission.score = Math.round(score);
  submission.status = 'dinilai';
  submission.gradedAt = nowIso();
  addLog(req.user, 'Menilai tugas', `${submission.taskId} · ${submission.score}`, req);
  res.json({ ...submission, studentName: userName(submission.studentId) });
});

app.get('/api/gradebook', auth, requireRole('teacher', 'admin'), (req, res) => {
  const classId = String(req.query.classId || req.user.classIds?.[0] || 'x-ipa-2');
  const cls = classById(classId);
  if (!cls) return res.status(404).json({ error: 'Kelas tidak ditemukan.' });
  const classAssessments = assessments.filter((a) => a.classId === classId);
  const clsScores = scores.filter((s) => classAssessments.some((a) => a.id === s.assessmentId));
  res.json({
    class: { ...cls, homeroomName: userName(cls.homeroomId) },
    students: cls.studentIds.map((id) => ({ ...publicUser(findUser(id)), average: weightedAverage(classId, id) })),
    assessments: classAssessments,
    scores: clsScores,
    summary: classAverages(classId),
  });
});

app.post('/api/grades/bulk', auth, requireRole('teacher', 'admin'), (req, res) => {
  const rows = Array.isArray(req.body?.scores) ? req.body.scores : [];
  let updated = 0;
  for (const row of rows) {
    const assessment = assessments.find((a) => a.id === row.assessmentId);
    if (!assessment) continue;
    const cls = classById(assessment.classId);
    if (!cls?.studentIds.includes(row.studentId)) continue;
    const score = Number(row.score);
    if (!Number.isFinite(score) || score < 0 || score > assessment.maxScore) continue;
    const existing = scores.find(
      (s) => s.assessmentId === row.assessmentId && s.studentId === row.studentId
    );
    if (existing) {
      existing.score = Math.round(score);
      existing.updatedAt = nowIso();
    } else {
      scores.push({
        id: `sc-${row.studentId}-${row.assessmentId}`,
        assessmentId: row.assessmentId,
        studentId: row.studentId,
        score: Math.round(score),
        updatedAt: nowIso(),
      });
    }
    updated += 1;
  }
  addLog(req.user, 'Menyimpan buku nilai', `${updated} sel nilai diperbarui`, req);
  res.json({ ok: true, updated });
});

app.get('/api/grades', auth, (req, res) => {
  let studentId = req.user.id;
  if (req.user.role === 'parent') studentId = req.user.childIds?.[0];
  if (req.user.role === 'teacher' || req.user.role === 'admin') {
    const classId = String(req.query.classId || 'x-ipa-2');
    return res.json({
      class: classById(classId),
      students: classById(classId)?.studentIds.map((id) => ({
        ...publicUser(findUser(id)),
        ...classAverages(classId).ranks.find((r) => r.studentId === id),
      })),
      summary: classAverages(classId),
    });
  }
  const student = findUser(studentId);
  const cls = classById(student.classId);
  const attendance = attendanceForStudent(studentId);
  const classAssessments = assessments.filter((a) => a.classId === student.classId);
  res.json({
    student: publicUser(student),
    className: cls?.name,
    subjects: studentSubjectGrades(studentId),
    assessments: classAssessments,
    scores: scores.filter((s) => s.studentId === studentId),
    attendance: attendance.summary,
    attendanceRecords: attendance.records,
    average: Math.round(
      studentSubjectGrades(studentId).reduce((sum, s) => sum + s.final, 0) /
        studentSubjectGrades(studentId).length
    ),
    rank: classAverages(student.classId).ranks.findIndex((r) => r.studentId === studentId) + 1,
    totalStudents: cls?.studentIds.length,
    trend: performanceTrend,
  });
});

// ---------------------------------------------------------------------------
// Attendance
// ---------------------------------------------------------------------------
app.get('/api/attendance', auth, (req, res) => {
  let classId =
    req.user.role === 'student'
      ? req.user.classId
      : req.user.role === 'parent'
        ? findUser(req.user.childIds?.[0])?.classId
        : String(req.query.classId || req.user.classIds?.[0] || 'x-ipa-2');
  if (req.user.role === 'teacher' && !req.user.classIds?.includes(classId)) {
    classId = req.user.classIds?.[0];
  }
  const cls = classById(classId);
  if (!cls) return res.status(404).json({ error: 'Kelas tidak ditemukan.' });

  const sessions = attendanceSessions
    .filter((s) => s.classId === classId)
    .map((s) => ({
      ...s,
      records: s.records.map((r) => ({ ...r, studentName: userName(r.studentId) })),
    }));

  const live = runtime.liveAttendance
    .filter((r) => r.classId === classId)
    .map((r) => ({
      ...r,
      studentName: userName(r.studentId),
      sessionTitle: liveSessions.find((s) => s.id === r.sessionId)?.title,
    }));

  if (req.user.role === 'student' || req.user.role === 'parent') {
    const studentId = req.user.role === 'student' ? req.user.id : req.user.childIds?.[0];
    const data = attendanceForStudent(studentId);
    return res.json({
      class: cls,
      student: publicUser(findUser(studentId)),
      records: data.records,
      summary: data.summary,
      sessions: sessions
        .map((s) => ({
          ...s,
          records: s.records.filter((r) => r.studentId === studentId),
        }))
        .filter((s) => s.records.length),
    });
  }

  const flat = sessions.flatMap((s) => s.records);
  const count = (status) => flat.filter((r) => r.status === status).length;
  res.json({
    class: cls,
    students: cls.studentIds.map((id) => ({
      ...publicUser(findUser(id)),
      summary: {
        hadir: flat.filter((r) => r.studentId === id && r.status === 'hadir').length,
        terlambat: flat.filter((r) => r.studentId === id && r.status === 'terlambat').length,
        sakit: flat.filter((r) => r.studentId === id && r.status === 'sakit').length,
        izin: flat.filter((r) => r.studentId === id && r.status === 'izin').length,
        alfa: flat.filter((r) => r.studentId === id && r.status === 'alfa').length,
      },
    })),
    sessions,
    live,
    summary: {
      totalSessions: sessions.length,
      hadir: count('hadir'),
      terlambat: count('terlambat'),
      sakit: count('sakit'),
      izin: count('izin'),
      alfa: count('alfa'),
      rate: flat.length
        ? Math.round(((count('hadir') + count('terlambat')) / flat.length) * 100)
        : 0,
    },
  });
});

// ---------------------------------------------------------------------------
// Quizzes
// ---------------------------------------------------------------------------
app.get('/api/quizzes', auth, (req, res) => {
  res.json(
    quizzes
      .filter((q) => {
        if (req.user.role === 'teacher') return q.teacherId === req.user.id || q.classId === req.user.classIds?.[0];
        if (req.user.role === 'student') return q.classId === req.user.classId;
        return true;
      })
      .map((q) => {
        const attempts = runtime.quizAttempts.filter(
          (a) => a.quizId === q.id && a.studentId === req.user.id
        );
        const best = attempts.reduce((max, a) => Math.max(max, a.score), 0);
        return {
          id: q.id,
          title: q.title,
          subject: q.subject,
          bookId: q.bookId,
          chapterId: q.chapterId,
          durationMin: q.durationMin,
          difficulty: q.difficulty,
          questionCount: q.questions.length,
          teacherName: userName(q.teacherId),
          classId: q.classId,
          attempts: attempts.length,
          bestScore: best,
          leaderboard: quizLeaderboard(q.id, 3),
        };
      })
  );
});

app.get('/api/quizzes/:id', auth, (req, res) => {
  const quiz = quizzes.find((q) => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Kuis tidak ditemukan.' });
  const payload = req.user.role === 'student' ? stripAnswers(quiz) : quiz;
  res.json({
    ...payload,
    teacherName: userName(quiz.teacherId),
    bookTitle: bookById(quiz.bookId)?.title,
    bestScore: runtime.quizAttempts
      .filter((a) => a.quizId === quiz.id && a.studentId === req.user.id)
      .reduce((max, a) => Math.max(max, a.score), 0),
    leaderboard: quizLeaderboard(quiz.id, 10),
  });
});

app.post('/api/quizzes/:id/submit', auth, requireRole('student'), (req, res) => {
  const quiz = quizzes.find((q) => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Kuis tidak ditemukan.' });
  const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
  let correct = 0;
  const review = quiz.questions.map((q, index) => {
    const chosen = Number.isInteger(answers[index]) ? answers[index] : null;
    const isCorrect = chosen === q.answer;
    if (isCorrect) correct += 1;
    return {
      question: q.question,
      options: q.options,
      answer: q.answer,
      chosen,
      correct: isCorrect,
      explanation: q.explanation,
    };
  });
  const score = Math.round((correct / quiz.questions.length) * 100);
  const attempt = {
    id: `att-${Date.now()}`,
    quizId: quiz.id,
    studentId: req.user.id,
    score,
    submittedAt: nowIso(),
  };
  runtime.quizAttempts.push(attempt);
  addLog(req.user, 'Menyelesaikan kuis', `${quiz.title} · ${score}`, req);
  res.json({
    score,
    correct,
    total: quiz.questions.length,
    review,
    leaderboard: quizLeaderboard(quiz.id, 10),
    attempt,
  });
});

// ---------------------------------------------------------------------------
// Schedule, lesson plans, modules
// ---------------------------------------------------------------------------
app.get('/api/schedule', auth, (req, res) => {
  let cls;
  if (req.user.role === 'student') cls = classById(req.user.classId);
  else if (req.user.role === 'parent') cls = classById(findUser(req.user.childIds?.[0])?.classId);
  else {
    const classId = String(req.query.classId || req.user.classIds?.[0] || 'x-ipa-2');
    cls = classById(classId);
  }
  if (!cls) return res.status(404).json({ error: 'Kelas tidak ditemukan.' });
  const myTasks =
    req.user.role === 'student'
      ? tasks.filter((t) => t.classId === cls.id && t.status === 'open')
      : tasks.filter((t) => t.classId === cls.id);
  res.json({
    class: { ...cls, homeroomName: userName(cls.homeroomId) },
    schedule: nextScheduleForClass(cls, 20),
    tasks: myTasks.sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt)),
    lessonPlans: lessonPlans.filter((l) => l.classId === cls.id),
  });
});

app.get('/api/lesson-plans', auth, (req, res) => {
  const classId = String(req.query.classId || req.user.classIds?.[0] || 'x-ipa-2');
  res.json(
    lessonPlans
      .filter((l) => (req.user.role === 'admin' ? true : l.classId === classId))
      .map((l) => ({
        ...l,
        className: classById(l.classId)?.name,
        bookTitle: bookById('mat-10')?.title,
      }))
  );
});

app.post('/api/lesson-plans', auth, requireRole('teacher', 'admin'), (req, res) => {
  const body = req.body || {};
  if (!body.topic || !body.classId) {
    return res.status(400).json({ error: 'Topik dan kelas wajib diisi.' });
  }
  const plan = {
    id: `rpp-${Date.now()}`,
    week: Number(body.week) || lessonPlans.length + 1,
    classId: body.classId,
    subject: body.subject || 'Matematika',
    topic: String(body.topic).slice(0, 160),
    chapterId: body.chapterId || null,
    dates: body.dates || 'Minggu mendatang',
    status: body.status || 'mendatang',
    activities: Array.isArray(body.activities) ? body.activities : [],
    assessment: body.assessment || 'Latihan mandiri',
  };
  lessonPlans.push(plan);
  addLog(req.user, 'Menyusun RPP digital', plan.topic, req);
  res.status(201).json(plan);
});

app.patch('/api/lesson-plans/:id', auth, requireRole('teacher', 'admin'), (req, res) => {
  const plan = lessonPlans.find((l) => l.id === req.params.id);
  if (!plan) return res.status(404).json({ error: 'RPP tidak ditemukan.' });
  Object.assign(plan, {
    topic: req.body.topic ?? plan.topic,
    dates: req.body.dates ?? plan.dates,
    status: req.body.status ?? plan.status,
    assessment: req.body.assessment ?? plan.assessment,
    activities: req.body.activities ?? plan.activities,
  });
  res.json(plan);
});

app.get('/api/modules', auth, requireRole('teacher', 'admin'), (req, res) => {
  res.json(runtime.modules.filter((m) => req.user.role === 'admin' || m.teacherId === req.user.id));
});

app.post('/api/modules', auth, requireRole('teacher', 'admin'), (req, res) => {
  const body = req.body || {};
  const module = {
    id: `module-${Date.now()}`,
    teacherId: req.user.id,
    teacherName: req.user.name,
    fileName: body.fileName || 'Dokumen SIBI.pdf',
    title: body.title || 'Modul hasil ekstraksi',
    classId: body.classId || req.user.classIds?.[0] || 'x-ipa-2',
    chapters: body.chapters || [],
    glossary: body.glossary || [],
    questions: body.questions || [],
    flashcards: body.flashcards || [],
    createdAt: nowIso(),
  };
  runtime.modules.unshift(module);
  addLog(req.user, 'Menyimpan modul ekstraksi', module.title, req);
  res.status(201).json(module);
});

// ---------------------------------------------------------------------------
// Live sessions
// ---------------------------------------------------------------------------
app.get('/api/live-sessions', auth, (req, res) => {
  let list = liveSessions;
  if (req.user.role === 'student') list = liveSessions.filter((s) => s.classId === req.user.classId);
  if (req.user.role === 'teacher') list = liveSessions.filter((s) => req.user.classIds?.includes(s.classId));
  if (req.user.role === 'parent') {
    const child = findUser(req.user.childIds?.[0]);
    list = liveSessions.filter((s) => s.classId === child?.classId);
  }
  res.json(
    list
      .map((s) => ({
        ...sessionSummary(s),
        participants:
          s.status === 'live'
            ? getRoom(s.id).participants.size || s.participants
            : s.participants,
      }))
      .sort((a, b) => {
        const rank = { live: 0, scheduled: 1, ended: 2 };
        return rank[a.status] - rank[b.status] || new Date(a.scheduledAt) - new Date(b.scheduledAt);
      })
  );
});

app.get('/api/live-sessions/:id', auth, (req, res) => {
  const session = liveSessions.find((s) => s.id === req.params.id);
  if (!session) return res.status(404).json({ error: 'Sesi live tidak ditemukan.' });
  res.json({
    ...sessionSummary(session),
    book: bookById(session.bookId),
    class: classById(session.classId),
  });
});

app.post('/api/live-sessions', auth, requireRole('teacher', 'admin'), (req, res) => {
  const body = req.body || {};
  const classId = body.classId || req.user.classIds?.[0];
  if (!classById(classId)) return res.status(404).json({ error: 'Kelas tidak ditemukan.' });
  const book = bookById(body.bookId || 'mat-10');
  const chapter = book?.chapters.find((c) => c.id === body.chapterId) || book?.chapters[0];
  if (book?.audience === 'teacher') {
    return res.status(400).json({ error: 'Buku panduan guru tidak dapat dipakai sebagai materi kelas siswa.' });
  }
  if (body.startNow !== false) {
    for (const s of liveSessions) {
      if (s.status === 'live' && s.classId === classId) {
        s.status = 'ended';
        s.endedAt = nowIso();
      }
    }
  }
  const session = {
    id: `live-${Date.now()}`,
    title:
      body.title ||
      `${book?.subject || 'Pembelajaran'} · ${chapter ? `Bab ${chapter.number}: ${chapter.title}` : 'Sesi diskusi'}`,
    classId,
    teacherId: req.user.id,
    bookId: book?.id,
    chapterId: chapter?.id,
    status: body.startNow === false ? 'scheduled' : 'live',
    scheduledAt: body.scheduledAt ? new Date(body.scheduledAt).toISOString() : nowIso(),
    startedAt: body.startNow === false ? undefined : nowIso(),
    durationMin: Number(body.durationMin) || 90,
    participants: 0,
  };
  liveSessions.unshift(session);
  addLog(req.user, body.startNow === false ? 'Menjadwalkan kelas live' : 'Memulai kelas live', session.title, req);
  res.status(201).json(sessionSummary(session));
});

app.patch('/api/live-sessions/:id/end', auth, requireRole('teacher', 'admin'), (req, res) => {
  const session = liveSessions.find((s) => s.id === req.params.id);
  if (!session) return res.status(404).json({ error: 'Sesi tidak ditemukan.' });
  if (req.user.role === 'teacher' && session.teacherId !== req.user.id) {
    return res.status(403).json({ error: 'Anda bukan pemilik sesi ini.' });
  }
  session.status = 'ended';
  session.endedAt = nowIso();
  const room = getRoom(session.id);
  for (const p of room.participants.values()) {
    if (p.role === 'student') {
      const entry = runtime.liveAttendance.find(
        (a) => a.sessionId === session.id && a.studentId === p.id && !a.leftAt
      );
      if (entry) {
        entry.leftAt = nowIso();
        entry.durationMin = Math.max(
          0,
          Math.round((new Date(entry.leftAt) - new Date(entry.joinedAt)) / 60000)
        );
      }
    }
  }
  io.to(`live:${session.id}`).emit('live:ended', {
    sessionId: session.id,
    endedAt: session.endedAt,
    by: req.user.name,
  });
  addLog(req.user, 'Mengakhiri kelas live', session.title, req);
  res.json(sessionSummary(session));
});

// ---------------------------------------------------------------------------
// Users, catalog sync, analytics, logs, search, notifications
// ---------------------------------------------------------------------------
app.get('/api/users', auth, requireRole('admin'), (req, res) => {
  const q = String(req.query.q || '').toLowerCase();
  const role = String(req.query.role || '');
  const rows = users
    .filter((u) => (role ? u.role === role : true))
    .filter((u) =>
      q ? `${u.name} ${u.email} ${u.title || ''}`.toLowerCase().includes(q) : true
    )
    .map((u) => ({
      ...publicUser(u),
      className: classById(u.classId)?.name,
      childNames: u.childIds?.map((id) => userName(id)) || [],
      lastActive: u.status === 'aktif' ? 'Hari ini' : '30 hari lalu',
    }));
  res.json({
    users: rows,
    stats: {
      total: users.length,
      aktif: users.filter((u) => u.status === 'aktif').length,
      guru: users.filter((u) => u.role === 'teacher').length,
      siswa: users.filter((u) => u.role === 'student').length,
      ortu: users.filter((u) => u.role === 'parent').length,
    },
  });
});

app.post('/api/users', auth, requireRole('admin'), (req, res) => {
  const body = req.body || {};
  const email = String(body.email || '').trim().toLowerCase();
  if (!body.name || !email || !body.role) {
    return res.status(400).json({ error: 'Nama, email, dan peran wajib diisi.' });
  }
  if (users.some((u) => u.email.toLowerCase() === email)) {
    return res.status(409).json({ error: 'Email sudah terdaftar.' });
  }
  if (!['student', 'teacher', 'parent', 'admin'].includes(body.role)) {
    return res.status(400).json({ error: 'Peran tidak valid.' });
  }
  const user = {
    id: `u-${Date.now()}`,
    name: String(body.name).slice(0, 80),
    email,
    passwordHash: bcrypt.hashSync(String(body.password || 'demo1234'), 10),
    role: body.role,
    title: body.title || `${body.role} SiGEMAS`,
    status: 'aktif',
    joinedAt: nowIso(),
    classId: body.classId || undefined,
    childIds: body.childIds || undefined,
    subject: body.subject || undefined,
  };
  users.push(user);
  addLog(req.user, 'Menambah akun pengguna', `${user.name} · ${user.role}`, req);
  res.status(201).json(publicUser(user));
});

app.patch('/api/users/:id', auth, requireRole('admin'), (req, res) => {
  const user = findUser(req.params.id);
  if (!user) return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
  if (user.id === req.user.id && req.body.status === 'nonaktif') {
    return res.status(400).json({ error: 'Anda tidak dapat menonaktifkan akun sendiri.' });
  }
  if (req.body.name) user.name = String(req.body.name).slice(0, 80);
  if (req.body.title) user.title = String(req.body.title).slice(0, 120);
  if (req.body.status && ['aktif', 'nonaktif'].includes(req.body.status)) user.status = req.body.status;
  if (req.body.role && ['student', 'teacher', 'parent', 'admin'].includes(req.body.role)) {
    user.role = req.body.role;
  }
  addLog(req.user, 'Memperbarui akun', `${user.name} · ${user.status}`, req);
  res.json(publicUser(user));
});

app.post('/api/catalog/sync', auth, requireRole('admin'), (req, res) => {
  runtime.sync = {
    ...runtime.sync,
    lastSyncedAt: nowIso(),
    booksCount: books.length,
    conflicts: 0,
    status: 'sinkron',
  };
  addLog(req.user, 'Sinkronisasi katalog SIBI', `${books.length} buku tersinkron`, req);
  res.json({ ok: true, sync: runtime.sync, books: books.filter((b) => b.status === 'synced').length });
});

app.get('/api/analytics', auth, requireRole('admin'), (_req, res) => {
  const counts = roleCounts();
  res.json({
    userGrowth,
    roleDistribution: [
      { label: 'Siswa', value: counts.student, color: '#1E88E5' },
      { label: 'Guru', value: counts.teacher, color: '#FF9800' },
      { label: 'Orang Tua', value: counts.parent, color: '#16A34A' },
      { label: 'Admin', value: counts.admin, color: '#8E24AA' },
    ],
    topBooks: [...books]
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 5)
      .map((b) => ({ label: b.subject, value: b.downloads, title: b.title })),
    engagement: performanceTrend,
    liveStats: {
      totalSessions: liveSessions.length,
      liveNow: liveSessions.filter((s) => s.status === 'live').length,
      avgParticipants: Math.round(
        liveSessions.reduce((sum, s) => sum + (s.participants || 0), 0) / liveSessions.length
      ),
      quizAttempts: runtime.quizAttempts.length,
    },
    system: {
      uptimeHours: Math.round(process.uptime() / 36) / 100,
      memoryMb: Math.round(process.memoryUsage().rss / 1048576),
      latencyMs: 24,
      storage: '68%',
    },
  });
});

app.get('/api/logs', auth, requireRole('admin'), (req, res) => {
  const role = String(req.query.role || '');
  res.json(activityLogs.filter((l) => (role ? l.role === role : true)).slice(0, 60));
});

app.get('/api/search', auth, (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  if (q.length < 2) return res.json({ books: [], users: [], classes: [], tasks: [] });
  const match = (text) => String(text).toLowerCase().includes(q);
  res.json({
    books: books
      .filter((b) => canAccessBook(req.user, b))
      .filter((b) => match(b.title) || match(b.subject) || b.authors.some(match))
      .slice(0, 4)
      .map(({ chapters, ...b }) => b),
    users:
      req.user.role === 'student'
        ? []
        : users
            .filter((u) => match(u.name) || match(u.email))
            .slice(0, 4)
            .map(publicUser),
    classes: classes.filter((c) => match(c.name) || match(c.room)).slice(0, 3),
    tasks: tasksForUser(req.user)
      .filter((t) => match(t.title) || match(t.subject))
      .slice(0, 4),
  });
});

app.get('/api/notifications', auth, (req, res) => {
  res.json(notifications[req.user.role] || []);
});

// ---------------------------------------------------------------------------
// Error handling & startup
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Flashcards
// ---------------------------------------------------------------------------
const flashcards = [];

app.get('/api/flashcards', auth, (req, res) => {
  const { bookId } = req.query;
  const requestedBook = bookId ? bookById(bookId) : null;
  if (requestedBook && !canAccessBook(req.user, requestedBook)) {
    return res.status(403).json({ error: 'Buku panduan guru hanya dapat diakses oleh guru.' });
  }
  if (bookId && !flashcards.some((card) => card.bookId === bookId)) {
    const book = requestedBook;
    if (book?.chapters?.length) {
      for (const chapter of book.chapters) {
        flashcards.push({
          id: `${book.id}-fc-${chapter.id}`,
          bookId: book.id,
          chapterId: chapter.id,
          question: `Apa konsep utama dari ${chapter.title}?`,
          answer: chapter.summary,
          difficulty: 'medium',
          successCount: 0,
          lastReviewed: null,
        });
      }
    }
  }
  const allowedBookIds = new Set(
    books.filter((book) => canAccessBook(req.user, book)).map((book) => book.id)
  );
  const filtered = flashcards.filter(
    (card) => allowedBookIds.has(card.bookId) && (!bookId || card.bookId === bookId)
  );
  res.json(filtered);
});

app.post('/api/flashcards/review', auth, (req, res) => {
  const { id, difficulty } = req.body;
  const card = flashcards.find(c => c.id === id);
  if (!card) return res.status(404).json({ error: 'Kartu tidak ditemukan.' });
  const cardBook = bookById(card.bookId);
  if (cardBook && !canAccessBook(req.user, cardBook)) {
    return res.status(403).json({ error: 'Buku panduan guru hanya dapat diakses oleh guru.' });
  }
  
  card.difficulty = difficulty;
  card.lastReviewed = new Date().toISOString();
  card.successCount += difficulty === 'easy' ? 1 : 0;
  
  res.json({ ok: true, card });
});

// ---------------------------------------------------------------------------
// Gamification (XP & Badges)
// ---------------------------------------------------------------------------
const userGamification = {};

app.get('/api/gamification', auth, (req, res) => {
  const userId = req.user.id;
  const data = userGamification[userId] || { xp: 0, level: 1, badges: [], dailyQuests: [] };
  res.json(data);
});

app.post('/api/gamification/add-xp', auth, (req, res) => {
  const { amount, reason } = req.body;
  const userId = req.user.id;
  if (!userGamification[userId]) {
    userGamification[userId] = { xp: 0, level: 1, badges: [], dailyQuests: [] };
  }
  
  const user = userGamification[userId];
  user.xp += amount;
  
  const newLevel = Math.floor(Math.sqrt(user.xp / 100)) + 1;
  if (newLevel > user.level) {
    user.level = newLevel;
    addLog(req.user, 'Level Up', `Mencapai level ${newLevel}`, req);
  }
  
  res.json({ ok: true, xp: user.xp, level: user.level });
});

app.post('/api/gamification/claim-badge', auth, (req, res) => {
  const { badgeId } = req.body;
  const userId = req.user.id;
  if (!userGamification[userId]) {
    userGamification[userId] = { xp: 0, level: 1, badges: [], dailyQuests: [] };
  }
  
  if (!userGamification[userId].badges.includes(badgeId)) {
    userGamification[userId].badges.push(badgeId);
    addLog(req.user, 'Badge Terbuka', `Mendapatkan badge ${badgeId}`, req);
  }
  
  res.json({ ok: true, badges: userGamification[userId].badges });
});

// ---------------------------------------------------------------------------
// Production static serving
// ---------------------------------------------------------------------------
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir, { maxAge: '1h', index: false }));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Endpoint API tidak ditemukan.' });
});

app.use((err, _req, res, _next) => {
  console.error('[SiGEMAS]', err);
  res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
});

setupRealtime(io, JWT_SECRET);

server.listen(PORT, () => {
  console.log(`\n  SiGEMAS API  →  http://localhost:${PORT}`);
  console.log(`  Realtime     →  socket.io siap`);
  if (fs.existsSync(distDir)) console.log(`  Frontend     →  http://localhost:${PORT}\n`);
  else console.log(`  Frontend dev →  http://localhost:5173\n`);
});
