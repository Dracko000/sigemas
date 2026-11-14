const now = new Date();
const daysAgo = (days, hour = 20) => {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const runtime = {
  quizAttempts: [
    { id: 'att-1', quizId: 'quiz-mat-3', studentId: 's8', score: 96, submittedAt: daysAgo(1, 20) },
    { id: 'att-2', quizId: 'quiz-mat-3', studentId: 's3', score: 94, submittedAt: daysAgo(2, 19) },
    { id: 'att-3', quizId: 'quiz-mat-3', studentId: 's1', score: 92, submittedAt: daysAgo(2, 20) },
    { id: 'att-4', quizId: 'quiz-mat-3', studentId: 's6', score: 88, submittedAt: daysAgo(3, 18) },
    { id: 'att-5', quizId: 'quiz-mat-3', studentId: 's2', score: 76, submittedAt: daysAgo(3, 21) },
    { id: 'att-6', quizId: 'quiz-mat-1', studentId: 's1', score: 100, submittedAt: daysAgo(12, 20) },
    { id: 'att-7', quizId: 'quiz-mat-1', studentId: 's3', score: 100, submittedAt: daysAgo(11, 19) },
    { id: 'att-8', quizId: 'quiz-ind-2', studentId: 's1', score: 90, submittedAt: daysAgo(8, 18) },
  ],
  modules: [],
  liveAttendance: [],
  rooms: new Map(),
  sync: {
    lastSyncedAt: daysAgo(1, 22),
    booksCount: 67,
    conflicts: 0,
    source: 'SIBI · Pusat Perbukuan Kemendikdasmen',
    status: 'sinkron',
  },
};

export const getRoom = (sessionId) => {
  if (!runtime.rooms.has(sessionId)) {
    runtime.rooms.set(sessionId, {
      participants: new Map(),
      messages: [],
      poll: null,
      pollVotes: new Map(),
    });
  }
  return runtime.rooms.get(sessionId);
};
