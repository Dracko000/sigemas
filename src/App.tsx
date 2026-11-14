import type { ReactNode } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import type { Role } from './types';
import { PageLoader } from './components/ui/Misc';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { BookCatalogPage } from './pages/student/BookCatalogPage';
import { ReaderPage } from './pages/student/ReaderPage';
import { StudentLivePage } from './pages/student/StudentLivePage';
import { QuizListPage } from './pages/student/QuizListPage';
import { QuizRunnerPage } from './pages/student/QuizRunnerPage';
import { SchedulePage } from './pages/student/SchedulePage';
import { GradesPage } from './pages/student/GradesPage';
import { LiveRoomPage } from './pages/live/LiveRoomPage';
import { TeacherLivePage } from './pages/teacher/TeacherLivePage';
import { ExtractorPage } from './pages/teacher/ExtractorPage';
import { GradebookPage } from './pages/teacher/GradebookPage';
import { AttendancePage } from './pages/teacher/AttendancePage';
import { LessonPlansPage } from './pages/teacher/LessonPlansPage';
import { ParentDevelopmentPage } from './pages/parent/ParentDevelopmentPage';
import { ParentReportsPage } from './pages/parent/ParentReportsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCatalogPage } from './pages/admin/AdminCatalogPage';
import { AdminClassesPage } from './pages/admin/AdminClassesPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminLogPage } from './pages/admin/AdminLogPage';
import { FlashcardPage } from './pages/student/FlashcardPage';
import { MindmapPage } from './pages/student/MindmapPage';
import { StudyQuestPage } from './pages/student/StudyQuestPage';
import { NotFoundPage } from './pages/NotFoundPage';

function FullPageLoader() {
  return (
    <div className="grid min-h-dvh place-items-center bg-bg">
      <PageLoader label="Memuat SiGEMAS…" />
    </div>
  );
}

function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/katalog" element={<RequireRole roles={['student', 'teacher', 'admin']}><BookCatalogPage /></RequireRole>} />
          <Route path="/baca/:bookId" element={<RequireRole roles={['student', 'teacher', 'admin']}><ReaderPage /></RequireRole>} />
          <Route path="/live/:id" element={<RequireRole roles={['student', 'teacher']}><LiveRoomPage /></RequireRole>} />

          <Route path="/live" element={<RequireRole roles={['student']}><StudentLivePage /></RequireRole>} />
          <Route path="/flashcards" element={<RequireRole roles={['student']}><FlashcardPage /></RequireRole>} />
          <Route path="/mindmap" element={<RequireRole roles={['student']}><MindmapPage /></RequireRole>} />
          <Route path="/quest" element={<RequireRole roles={['student']}><StudyQuestPage /></RequireRole>} />
          <Route path="/kuis" element={<RequireRole roles={['student']}><QuizListPage /></RequireRole>} />
          <Route path="/kuis/:id" element={<RequireRole roles={['student']}><QuizRunnerPage /></RequireRole>} />
          <Route path="/jadwal" element={<RequireRole roles={['student']}><SchedulePage /></RequireRole>} />
          <Route path="/nilai" element={<RequireRole roles={['student']}><GradesPage /></RequireRole>} />

          <Route path="/guru/live" element={<RequireRole roles={['teacher']}><TeacherLivePage /></RequireRole>} />
          <Route path="/guru/ekstraktor" element={<RequireRole roles={['teacher']}><ExtractorPage /></RequireRole>} />
          <Route path="/guru/nilai" element={<RequireRole roles={['teacher']}><GradebookPage /></RequireRole>} />
          <Route path="/guru/presensi" element={<RequireRole roles={['teacher']}><AttendancePage /></RequireRole>} />
          <Route path="/guru/rpp" element={<RequireRole roles={['teacher']}><LessonPlansPage /></RequireRole>} />

          <Route path="/ortu/perkembangan" element={<RequireRole roles={['parent']}><ParentDevelopmentPage /></RequireRole>} />
          <Route path="/ortu/laporan" element={<RequireRole roles={['parent']}><ParentReportsPage /></RequireRole>} />

          <Route path="/admin/pengguna" element={<RequireRole roles={['admin']}><AdminUsersPage /></RequireRole>} />
          <Route path="/admin/katalog" element={<RequireRole roles={['admin']}><AdminCatalogPage /></RequireRole>} />
          <Route path="/admin/kelas" element={<RequireRole roles={['admin']}><AdminClassesPage /></RequireRole>} />
          <Route path="/admin/analitik" element={<RequireRole roles={['admin']}><AdminAnalyticsPage /></RequireRole>} />
          <Route path="/admin/log" element={<RequireRole roles={['admin']}><AdminLogPage /></RequireRole>} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
