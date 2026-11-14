import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileScan,
  GraduationCap,
  MonitorPlay,
  NotebookPen,
  Play,
  Radio,
  Sparkles,
  Target,
  Users,
  Video,
} from 'lucide-react';
import type { DashboardData } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Progress } from '../../components/ui/Progress';
import { SectionHeader, StatCard } from '../../components/ui/Misc';
import { AreaChart, BarChart } from '../../components/charts/Charts';
import { formatTime, greeting, relativeDate } from '../../lib/format';

const quickActions = [
  { label: 'Mulai kelas live', desc: 'Studio & whiteboard', icon: Video, to: '/guru/live', tone: 'bg-primary-soft text-primary-strong dark:text-primary' },
  { label: 'Ekstrak PDF SIBI', desc: 'Jadikan bahan ajar', icon: FileScan, to: '/guru/ekstraktor', tone: 'bg-accent-soft text-accent-strong dark:text-accent' },
  { label: 'Input nilai', desc: 'Buku nilai digital', icon: ClipboardList, to: '/guru/nilai', tone: 'bg-success-soft text-success' },
  { label: 'Susun RPP', desc: 'Rencana per minggu', icon: NotebookPen, to: '/guru/rpp', tone: 'bg-info-soft text-info' },
];

export function TeacherDashboard({ data }: { data: DashboardData }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const summary = data.summary;
  const active = data.activeSession;
  const pending = data.pending ?? [];
  const classes = data.classes ?? [];
  const todaySchedule = data.todaySchedule ?? [];
  const performance = data.performance ?? [];
  const distribution = data.scoreDistribution ?? [];
  const firstName = user?.name.split(' ')[0] ?? 'Guru';
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <section className="relative overflow-hidden rounded-panel border border-border bg-surface p-5 shadow-card sm:p-7">
          <div className="mesh-hero absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="primary" dot>{today}</Badge>
              <Badge tone="accent">Semester Ganjil 2025/2026</Badge>
            </div>
            <p className="mt-4 text-sm font-medium text-muted">{greeting()},</p>
            <h2 className="mt-0.5 text-2xl font-extrabold tracking-tight text-text sm:text-3xl">
              {firstName}, kelas siap dimulai.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              {active
                ? `Kamu sedang mengajar ${active.className}. ${summary.activeStudents} siswa sudah bergabung di ruang live.`
                : 'Kelola kelas, nilai, dan bahan ajar dari satu ruang. Mulai sesi live atau siapkan modul dari buku SIBI.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button onClick={() => navigate(active ? `/live/${active.id}` : '/guru/live')}>
                <Video className="h-4 w-4" aria-hidden="true" />
                {active ? 'Masuk studio live' : 'Mulai kelas live'}
              </Button>
              <Button variant="outline" onClick={() => navigate('/guru/ekstraktor')}>
                <FileScan className="h-4 w-4" aria-hidden="true" />
                Ekstrak materi PDF
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" aria-hidden="true" /> {summary.totalStudents} siswa diampu
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" /> {classes.length} kelas aktif
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" aria-hidden="true" /> Rata-rata {summary.classAverage}
              </span>
            </div>
          </div>
        </section>

        <Card className="relative overflow-hidden p-5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold text-text">
              <Radio className="h-4 w-4 text-danger" aria-hidden="true" />
              Kontrol sesi live
            </h3>
            {active ? (
              <Badge tone="danger" dot>Sedang live</Badge>
            ) : (
              <Badge tone="neutral">Belum ada sesi</Badge>
            )}
          </div>
          {active ? (
            <div className="mt-4">
              <p className="text-sm font-bold leading-snug text-text">{active.title}</p>
              <p className="mt-1 text-[11px] text-muted">
                {active.className} · dimulai {formatTime(active.startedAt)}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="rounded-xl bg-surface-2 p-3">
                  <p className="text-[10px] text-muted">Siswa aktif</p>
                  <p className="mt-0.5 text-xl font-extrabold tabular-nums text-text">{summary.activeStudents}</p>
                </div>
                <div className="rounded-xl bg-surface-2 p-3">
                  <p className="text-[10px] text-muted">Partisipasi</p>
                  <p className="mt-0.5 text-xl font-extrabold tabular-nums text-success">92%</p>
                </div>
              </div>
              <Button className="mt-4 w-full" onClick={() => navigate(`/live/${active.id}`)}>
                <Play className="h-4 w-4" aria-hidden="true" />
                Buka studio
              </Button>
              <button
                type="button"
                onClick={() => navigate('/guru/presensi')}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-semibold text-muted transition hover:bg-surface-2 hover:text-text"
              >
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                Lihat presensi otomatis
              </button>
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center rounded-xl border border-dashed border-border bg-surface-2/40 px-4 py-6 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary-strong dark:text-primary">
                <MonitorPlay className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-bold text-text">Studio siap digunakan</p>
              <p className="mt-1 max-w-[240px] text-[11px] leading-relaxed text-muted">
                Video guru, papan tulis pribadi, polling, chat, dan presensi otomatis tersedia.
              </p>
              <Button size="sm" className="mt-4" onClick={() => navigate('/guru/live')}>
                Mulai sesi <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </div>
          )}
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-accent-soft px-3 py-2 text-[10px] font-medium text-accent-strong dark:text-accent">
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Tip: gunakan polling di tengah sesi untuk cek pemahaman.
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Siswa di kelas live"
          value={summary.activeStudents}
          hint={active ? 'Bergabung saat ini' : 'Tidak ada sesi aktif'}
          icon={Users}
          tone="primary"
        />
        <StatCard
          label="Kelas hari ini"
          value={summary.classesToday}
          hint="Sesi terjadwal"
          icon={CalendarClock}
          tone="accent"
        />
        <StatCard
          label="Menunggu penilaian"
          value={summary.pendingReviews}
          hint={summary.pendingReviews ? 'Perlu tindak lanjut' : 'Semua sudah dinilai'}
          icon={FileCheck2}
          tone={summary.pendingReviews ? 'warning' : 'success'}
        />
        <StatCard
          label="Rata-rata kelas"
          value={summary.classAverage}
          hint="Skala 0–100"
          icon={GraduationCap}
          tone="success"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Card className="p-5 sm:p-6">
            <SectionHeader
              title="Tren performa kelas"
              subtitle="Rata-rata nilai 8 pekan terakhir"
              action={<Badge tone="success">+6 poin</Badge>}
            />
            <AreaChart
              data={performance.map((p) => ({ label: p.label.replace('Pekan ', 'P'), value: p.score }))}
              height={230}
              primaryLabel="Rata-rata kelas"
              suffix=""
            />
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-warning-soft text-warning">
                  <ClipboardList className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-text">Perlu dinilai</h3>
                  <p className="text-[11px] text-muted">{pending.length} pengumpulan menunggu</p>
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={() => navigate('/guru/nilai')}>
                Buka buku nilai
              </Button>
            </div>
            {pending.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-success" aria-hidden="true" />
                <p className="mt-2 text-sm font-semibold text-text">Semua tugas sudah dinilai</p>
                <p className="text-[11px] text-muted">Kerja bagus, tidak ada antrean penilaian.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {pending.map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                    <Avatar name={item.studentName || 'Siswa'} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-text">{item.studentName}</p>
                      <p className="mt-0.5 truncate text-[10px] text-muted">
                        {item.taskTitle} · {item.fileName}
                      </p>
                    </div>
                    <span className="text-[10px] font-medium text-muted">{relativeDate(item.submittedAt)}</span>
                    <Button size="sm" variant="outline" onClick={() => navigate('/guru/nilai')}>
                      Nilai
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <div>
            <SectionHeader title="Kelas yang diampu" subtitle="Ringkasan capaian per rombel" />
            <div className="grid gap-3 sm:grid-cols-2">
              {classes.map((cls) => (
                <Card key={cls.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-text">{cls.name}</h3>
                      <p className="mt-0.5 text-[10px] text-muted">
                        {cls.studentCount ?? cls.studentIds.length} siswa · {cls.room}
                      </p>
                    </div>
                    <Badge tone="primary">{cls.room}</Badge>
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-muted">Rata-rata</p>
                      <p className="text-2xl font-extrabold tabular-nums text-text">
                        {cls.average ? cls.average : '—'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted">Kehadiran</p>
                      <p className="text-sm font-bold text-success">{cls.attendanceRate ?? 96}%</p>
                    </div>
                  </div>
                  <Progress value={cls.average || 0} size="sm" className="mt-3" />
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] text-muted">Wali: {cls.homeroomName}</span>
                    <button
                      type="button"
                      onClick={() => navigate('/guru/nilai')}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-strong hover:underline dark:text-primary"
                    >
                      Kelola <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="text-sm font-bold text-text">Aksi cepat</h3>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => navigate(action.to)}
                    className="group rounded-xl border border-border bg-surface p-3 text-left transition hover:border-primary/35 hover:bg-surface-2"
                  >
                    <span className={`grid h-8 w-8 place-items-center rounded-lg ${action.tone}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="mt-2 text-[11px] font-bold leading-tight text-text">{action.label}</p>
                    <p className="mt-0.5 text-[9px] text-muted">{action.desc}</p>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-text">
                <CalendarClock className="h-4 w-4 text-primary" aria-hidden="true" />
                Agenda hari ini
              </h3>
              <button type="button" onClick={() => navigate('/guru/rpp')} className="text-[11px] font-semibold text-primary-strong hover:underline dark:text-primary">
                RPP
              </button>
            </div>
            <ul className="divide-y divide-border">
              {todaySchedule.length === 0 && (
                <li className="px-5 py-6 text-center text-xs text-muted">Tidak ada sesi terjadwal hari ini.</li>
              )}
              {todaySchedule.map((item) => (
                <li key={`${item.classId}-${item.start}`} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-12 shrink-0 text-center">
                    <p className="text-xs font-extrabold tabular-nums text-text">{item.start}</p>
                    <p className="text-[9px] text-muted">{item.end}</p>
                  </div>
                  <span className="h-8 w-0.5 rounded-full bg-primary/60" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-text">{item.subject}</p>
                    <p className="text-[10px] text-muted">{item.className} · {item.room}</p>
                  </div>
                  <Badge tone="neutral">{item.className}</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-text">Distribusi nilai</h3>
                <p className="mt-0.5 text-[11px] text-muted">X IPA 2 · seluruh asesmen</p>
              </div>
              <Badge tone="primary">32 siswa</Badge>
            </div>
            <div className="mt-4">
              <BarChart data={distribution} height={150} />
            </div>
            <p className="mt-3 text-[10px] text-muted">
              <span className="font-semibold text-success">65% siswa</span> berada di rentang 80–100.
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-info-soft text-info">
                <BookOpen className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold text-text">Materi siap diajar</p>
                <p className="text-[10px] text-muted">67 buku SIBI tersinkron</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => navigate('/katalog')}>
              Buka katalog
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
