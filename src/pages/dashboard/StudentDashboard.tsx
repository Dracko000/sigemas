import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Flame,
  ListChecks,
  Play,
  Radio,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  UserCheck,
} from 'lucide-react';
import type { DashboardData } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Progress } from '../../components/ui/Progress';
import { SectionHeader, StatCard } from '../../components/ui/Misc';
import { SigemasMascot } from '../../components/SigemasMascot';
import { BookCard } from '../../components/books/BookCard';
import { BarChart } from '../../components/charts/Charts';
import { subjectIcon } from '../../components/books/BookCover';
import {
  cx,
  deadlineLabel,
  formatTime,
  greeting,
} from '../../lib/format';

export function StudentDashboard({ data }: { data: DashboardData }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const summary = data.summary;
  const active = data.activeSession;
  const books = data.books ?? [];
  const tasks = data.tasks ?? [];
  const upcoming = data.upcoming ?? [];
  const leaderboard = data.leaderboard ?? [];
  const subjects = data.subjects ?? [];
  const weekly = data.weeklyStudy ?? [];
  const firstName = user?.name.split(' ')[0] ?? 'Siswa';
  const nextBook = books[0];
  const targetDays = weekly.filter((d) => d.minutes >= (d.target || 60)).length;

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-panel border border-border bg-surface shadow-card">
        <div className="mesh-hero absolute inset-0" aria-hidden="true" />
        <div className="pattern-dots absolute inset-0 text-primary/30 opacity-20" aria-hidden="true" />
        <div className="relative grid gap-4 p-5 sm:p-7 md:grid-cols-[1fr_230px] md:items-center">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="primary" dot>
                {data.className || user?.title?.split(' · ').pop()}
              </Badge>
              <Badge tone="accent">
                <Flame className="h-3 w-3" aria-hidden="true" /> {summary.streakDays} hari beruntun
              </Badge>
            </div>
            <p className="mt-4 text-sm font-medium text-muted">{greeting()},</p>
            <h2 className="mt-0.5 text-2xl font-extrabold tracking-tight text-text sm:text-3xl">
              {firstName}, siap lanjut belajar?
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
              {active
                ? 'Kelas live sedang berlangsung. Gabung sekarang dan catat poin penting di buku digitalmu.'
                : nextBook
                  ? `Lanjutkan ${nextBook.subject} bab terakhirmu, lalu selesaikan satu tugas hari ini.`
                  : 'Pilih buku dari katalog SIBI untuk memulai perjalanan belajarmu.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {nextBook && (
                <Button onClick={() => navigate(`/baca/${nextBook.id}`)}>
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  Lanjutkan membaca
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
              {active ? (
                <Button variant="accent" onClick={() => navigate(`/live/${active.id}`)}>
                  <Radio className="h-4 w-4" aria-hidden="true" />
                  Gabung kelas live
                </Button>
              ) : (
                <Button variant="outline" onClick={() => navigate('/katalog')}>
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Jelajahi katalog
                </Button>
              )}
            </div>
            {nextBook && (
              <div className="mt-5 max-w-md rounded-xl border border-border bg-surface/75 p-3 backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-[11px] font-semibold text-text">{nextBook.title}</p>
                  <span className="shrink-0 text-[10px] font-bold tabular-nums text-primary-strong dark:text-primary">
                    {nextBook.progress?.percent ?? 0}%
                  </span>
                </div>
                <Progress value={nextBook.progress?.percent ?? 0} size="sm" className="mt-2" />
              </div>
            )}
          </div>

          <div className="relative hidden justify-center md:flex">
            <div className="absolute inset-0 m-auto h-44 w-44 rounded-full border border-primary/10 bg-primary-soft/40" aria-hidden="true" />
            <SigemasMascot size={210} wave className="relative drop-shadow-xl" />
            <div className="absolute -right-1 top-1 rounded-2xl rounded-br-sm border border-border bg-surface px-3 py-2 shadow-card">
              <p className="text-[9px] font-semibold text-muted">Target hari ini</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs font-extrabold text-text">
                <Target className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                30 menit
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Jam belajar"
          value={`${summary.studyHours} jam`}
          hint={
            <span className="inline-flex items-center gap-1 text-success">
              <TrendingUp className="h-3 w-3" aria-hidden="true" /> +18% dari pekan lalu
            </span>
          }
          icon={Clock3}
          tone="primary"
        />
        <StatCard
          label="Rata-rata nilai"
          value={summary.averageScore}
          hint={`Peringkat #${summary.rank} dari kelas`}
          icon={Trophy}
          tone="accent"
        />
        <StatCard
          label="Modul selesai"
          value={summary.modulesDone}
          hint="dari katalog SIBI"
          icon={BookOpen}
          tone="success"
        />
        <StatCard
          label="Kehadiran"
          value={`${summary.attendanceRate}%`}
          hint={`${summary.streakDays} hari belajar beruntun`}
          icon={UserCheck}
          tone="info"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          {active && (
            <div className="relative overflow-hidden rounded-card border border-primary/15 bg-[linear-gradient(120deg,#0D47A1,#1565C0_55%,#1E88E5)] p-5 text-white shadow-card">
              <div className="pattern-grid absolute inset-0 text-white/20 opacity-25" aria-hidden="true" />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3.5">
                  <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15">
                    <Radio className="h-6 w-6" aria-hidden="true" />
                    <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-[#1565C0] bg-accent" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-danger px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider">
                        <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-white" />
                        Live sekarang
                      </span>
                      <span className="text-[10px] text-blue-100/75">{active.participants} siswa bergabung</span>
                    </div>
                    <h3 className="mt-1.5 text-base font-bold sm:text-lg">{active.title}</h3>
                    <p className="mt-0.5 text-xs text-blue-100/75">
                      {active.teacherName} · {active.className}
                    </p>
                  </div>
                </div>
                <Button variant="accent" onClick={() => navigate(`/live/${active.id}`)} className="shrink-0">
                  <Play className="h-4 w-4" aria-hidden="true" />
                  Bergabung
                </Button>
              </div>
            </div>
          )}

          <section aria-labelledby="continue-heading">
            <SectionHeader
              title="Lanjutkan belajar"
              subtitle="Buku SIBI yang sedang kamu pelajari"
              action={
                <Link to="/katalog" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-strong hover:underline dark:text-primary">
                  Semua buku <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              }
            />
            <div id="continue-heading" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {books.slice(0, 3).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>

          <Card>
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-soft text-accent-strong dark:text-accent">
                  <ClipboardList className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-text">Tugas mendatang</h3>
                  <p className="text-[11px] text-muted">{tasks.length} tugas perlu perhatian</p>
                </div>
              </div>
              <Link to="/jadwal" className="text-xs font-semibold text-primary-strong hover:underline dark:text-primary">
                Lihat semua
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {tasks.length === 0 && (
                <li className="px-5 py-8 text-center text-sm text-muted">Tidak ada tugas aktif. Waktu yang tepat untuk mengulang materi.</li>
              )}
              {tasks.map((task) => {
                const submitted = Boolean(task.submission);
                return (
                  <li key={task.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition hover:bg-surface-2/60">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-strong dark:text-primary">
                      <ListChecks className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-text">{task.title}</p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {task.subject} · {task.type} · {task.maxScore} poin
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {submitted ? (
                        <Badge tone="success">
                          <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Terkumpul
                        </Badge>
                      ) : (
                        <Badge tone={task.dueAt && new Date(task.dueAt).getTime() - Date.now() < 2 * 86400000 ? 'danger' : 'warning'}>
                          {deadlineLabel(task.dueAt)}
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant={submitted ? 'ghost' : 'secondary'}
                        onClick={() => navigate(task.type === 'Kuis' ? '/kuis' : '/jadwal')}
                      >
                        {submitted ? 'Lihat' : 'Kerjakan'}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-text">Ritme belajar</h3>
                <p className="mt-0.5 text-[11px] text-muted">Menit belajar 7 hari terakhir</p>
              </div>
              <Badge tone="primary">{summary.studyHours} jam</Badge>
            </div>
            <div className="mt-5">
              <BarChart
                data={weekly.map((d) => ({ label: d.label, value: d.minutes }))}
                target={60}
                height={150}
                suffix=" mnt"
              />
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-success-soft px-3 py-2 text-[11px] font-medium text-success">
              <Target className="h-3.5 w-3.5" aria-hidden="true" />
              {targetDays} dari 7 hari mencapai target 60 menit
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
                <h3 className="text-sm font-bold text-text">Jadwal berikutnya</h3>
              </div>
              <Link to="/jadwal" className="text-[11px] font-semibold text-primary-strong hover:underline dark:text-primary">
                Semua
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {upcoming.slice(0, 3).map((item) => (
                <li key={`${item.date}-${item.start}`} className="flex items-center gap-3 px-5 py-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-center">
                    <span className="text-[9px] font-semibold uppercase text-muted">{item.day.slice(0, 3)}</span>
                    <span className="text-sm font-extrabold leading-none text-text">{new Date(item.date).getDate()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-text">{item.subject}</p>
                    <p className="mt-0.5 text-[10px] text-muted">
                      {item.start}–{item.end} · {item.room}
                    </p>
                  </div>
                  {item.isToday && <Badge tone="accent">Hari ini</Badge>}
                </li>
              ))}
              {upcoming.length === 0 && (
                <li className="px-5 py-6 text-center text-xs text-muted">Belum ada jadwal.</li>
              )}
            </ul>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-accent" aria-hidden="true" />
                <h3 className="text-sm font-bold text-text">Papan peringkat</h3>
              </div>
              <Link to="/kuis" className="text-[11px] font-semibold text-primary-strong hover:underline dark:text-primary">
                Arena kuis
              </Link>
            </div>
            <ul className="space-y-1 p-2">
              {leaderboard.slice(0, 5).map((entry) => (
                <li
                  key={entry.studentId}
                  className={cx(
                    'flex items-center gap-2.5 rounded-xl px-3 py-2',
                    entry.studentId === user?.id && 'bg-primary-soft/60'
                  )}
                >
                  <span
                    className={cx(
                      'grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[10px] font-extrabold',
                      entry.rank === 1 && 'bg-accent text-[#2b1a00]',
                      entry.rank === 2 && 'bg-surface-3 text-text',
                      entry.rank === 3 && 'bg-accent-soft text-accent-strong',
                      entry.rank > 3 && 'bg-surface-2 text-muted'
                    )}
                  >
                    {entry.rank}
                  </span>
                  <Avatar name={entry.name} size="xs" />
                  <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-text">
                    {entry.name}
                    {entry.studentId === user?.id && <span className="ml-1 text-[9px] font-bold text-primary-strong dark:text-primary">(kamu)</span>}
                  </span>
                  <span className="text-[11px] font-extrabold tabular-nums text-text">{entry.score}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Card className="p-5 sm:p-6">
        <SectionHeader
          title="Penguasaan materi"
          subtitle="Rata-rata capaian per mata pelajaran"
          action={<Badge tone="success" dot>Progres sehat</Badge>}
        />
        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {subjects.map((subject) => {
            const Icon = subjectIcon(subject.subject);
            return (
              <div key={subject.subject}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2 text-xs font-semibold text-text">
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                      style={{ background: `${subject.color}18`, color: subject.color }}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="truncate">{subject.subject}</span>
                  </span>
                  <span className="shrink-0 text-[11px] font-bold tabular-nums text-text">
                    {subject.final} <span className="font-medium text-muted">/ 100</span>
                  </span>
                </div>
                <Progress value={subject.mastery} tone={subject.mastery >= 85 ? 'success' : subject.mastery >= 75 ? 'primary' : 'warning'} size="sm" />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
