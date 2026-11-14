export type Role = 'student' | 'teacher' | 'parent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  title?: string;
  status: 'aktif' | 'nonaktif';
  classId?: string;
  classIds?: string[];
  childIds?: string[];
  childNames?: string[];
  subject?: string;
  nisn?: string;
  className?: string;
  joinedAt?: string;
  lastActive?: string;
  xp?: number;
  level?: number;
  badges?: string[];
}

export interface BookPage {
  page: number;
  kind: string;
  heading: string;
  paragraphs: string[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  startPage: number;
  endPage: number;
  summary: string;
  objectives: string[];
  pages: BookPage[];
}

export interface Book {
  id: string;
  title: string;
  subject: string;
  grade: number;
  level?: string;
  authors: string[];
  year: number;
  isbn: string;
  rating: number;
  downloads: number;
  synopsis: string;
  status: 'synced' | 'pending';
  featured: boolean;
  pages: number;
  cover: { from: string; to: string };
  color: string;
  coverUrl?: string;
  fileUrl?: string;
  bookType?: string;
  audience?: 'student' | 'teacher';
  publisher?: string;
  curriculum?: string;
  sourceId?: string;
  slug?: string;
  chapters: Chapter[];
  chapterCount?: number;
  firstChapter?: string;
  tags: string[];
  license: string;
  progress?: { percent: number; lastPage: number; updatedAt?: string } | null;
  teacherName?: string;
}

export interface ScheduleItem {
  day: string;
  start: string;
  end: string;
  subject: string;
  room: string;
  teacherId?: string;
  teacherName?: string;
  classId?: string;
  className?: string;
  date: string;
  dateLabel: string;
  isToday: boolean;
}

export interface ClassRoom {
  id: string;
  name: string;
  grade: number;
  academicYear: string;
  homeroomId: string;
  homeroomName?: string;
  room: string;
  studentIds: string[];
  studentCount: number;
  average?: number;
  attendanceRate?: number;
  subjects: string[];
  schedule: ScheduleItem[];
  students?: User[];
  upcoming?: ScheduleItem[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  classId: string;
  className?: string;
  teacherId: string;
  teacherName?: string;
  subject: string;
  bookId?: string;
  chapterId?: string;
  type: string;
  maxScore: number;
  dueAt: string;
  createdAt: string;
  status: 'open' | 'closed';
  submittedCount: number;
  totalStudents: number;
  submission?: Submission | null;
}

export interface Submission {
  id: string;
  taskId: string;
  studentId: string;
  studentName?: string;
  taskTitle?: string;
  submittedAt: string;
  fileName: string;
  status: 'menunggu' | 'dinilai';
  score?: number;
}

export interface Assessment {
  id: string;
  classId: string;
  title: string;
  type: string;
  weight: number;
  maxScore: number;
  date: string;
}

export interface ScoreRow {
  id: string;
  assessmentId: string;
  studentId: string;
  score: number;
  updatedAt: string;
}

export interface SubjectGrade {
  subject: string;
  color: string;
  tugas: number;
  kuis: number;
  uts: number;
  uas: number;
  final: number;
  mastery: number;
}

export interface AttendanceSummary {
  total?: number;
  totalSessions?: number;
  present?: number;
  late?: number;
  sick?: number;
  excused?: number;
  absent?: number;
  hadir?: number;
  terlambat?: number;
  sakit?: number;
  izin?: number;
  alfa?: number;
  rate: number;
  totalMinutes?: number;
}

export interface AttendanceRecord {
  studentId: string;
  studentName?: string;
  status: string;
  joinedAt: string | null;
  durationMin: number;
  date: string;
  topic: string;
  sessionId?: string;
  sessionTitle?: string;
}

export interface AttendanceSession {
  id: string;
  classId: string;
  date: string;
  topic: string;
  records: (AttendanceRecord & { studentName?: string })[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer?: number;
  explanation?: string;
}

export interface QuizSummary {
  id: string;
  title: string;
  subject: string;
  bookId: string;
  chapterId: string;
  durationMin: number;
  difficulty: string;
  questionCount: number;
  teacherName: string;
  classId: string;
  attempts: number;
  bestScore: number;
  leaderboard: LeaderboardEntry[];
}

export interface QuizDetail extends Omit<QuizSummary, 'attempts' | 'questionCount'> {
  questions: QuizQuestion[];
  bookTitle: string;
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  score: number;
  submittedAt?: string;
}

export interface LiveSession {
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
  status: 'live' | 'scheduled' | 'ended';
  startedAt?: string;
  endedAt?: string;
  scheduledAt: string;
  durationMin?: number;
  participants: number;
  recording?: boolean;
  isMine?: boolean;
}

export interface LessonPlan {
  id: string;
  week: number;
  classId: string;
  className?: string;
  subject: string;
  topic: string;
  chapterId: string;
  dates: string;
  status: 'selesai' | 'berlangsung' | 'mendatang';
  activities: string[];
  assessment: string;
  bookTitle?: string;
}

export interface ParentNote {
  id: string;
  teacherId: string;
  teacherName?: string;
  teacherTitle?: string;
  studentId: string;
  date: string;
  subject: string;
  text: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  text: string;
  at: string;
  unread: boolean;
}

export interface ActivityLog {
  id: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  at: string;
  ip: string;
}

export interface ActivityLog {
  id: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  at: string;
  ip: string;
}

export interface Flashcard {
  id: string;
  bookId: string;
  chapterId: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
  nextReview?: string;
  successCount: number;
}

export interface DashboardData {
  role: Role;
  summary: Record<string, number>;
  activeSession?: LiveSession;
  books?: Book[];
  tasks?: Task[];
  upcoming?: ScheduleItem[];
  weeklyStudy?: { label: string; minutes: number; target: number }[];
  subjects?: SubjectGrade[];
  leaderboard?: LeaderboardEntry[];
  attendance?: AttendanceSummary;
  className?: string;
  pending?: Submission[];
  classes?: ClassRoom[];
  performance?: { label: string; score: number; classAvg?: number }[];
  todaySchedule?: ScheduleItem[];
  scoreDistribution?: { label: string; value: number }[];
  child?: User;
  notes?: ParentNote[];
  attendanceRecords?: AttendanceRecord[];
  recentGrades?: SubjectGrade[];
  userGrowth?: { label: string; students: number; teachers: number; parents: number }[];
  roleDistribution?: { label: string; value: number; color: string }[];
  sync?: {
    lastSyncedAt: string;
    booksCount: number;
    conflicts: number;
    source: string;
    status: string;
  };
  logs?: ActivityLog[];
  pendingTeachers?: User[];
  system?: Record<string, string | number>;
}
