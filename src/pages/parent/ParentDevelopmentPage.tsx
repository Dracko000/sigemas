import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  MessageSquareQuote,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { api } from '../../lib/api';
import { formatDate, roleLabel } from '../../lib/format';
import type {
  AttendanceRecord,
  AttendanceSummary,
  DashboardData,
  ParentNote,
  SubjectGrade,
  Task,
  User,
} from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, PageLoader, SectionHeader } from '../../components/ui/Misc';
import { Progress } from '../../components/ui/Progress';
import { AreaChart, BarChart } from '../../components/charts/Charts';
import { SigemasMascot } from '../../components/SigemasMascot';

interface ParentData {
  child: User;
  className?: string;
  summary: Record<string, number>;
  performance: { label: string; score: number; classAvg?: number }[];
  subjects: SubjectGrade[];
  attendance: AttendanceSummary;
  attendanceRecords: AttendanceRecord[];
  notes: ParentNote[];
  tasks: Task[];
  weeklyStudy?: { label: string; minutes: number; target: number }[];
}

export function ParentDevelopmentPage() {
  const [data, setData] = useState<ParentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api<DashboardData>('/api/dashboard')
      .then((payload) => {
        if (!active) return;
        if (!payload.child) {
          setError('Data anak tidak ditemukan pada akun ini.');
          return;
        }
        setData(payload as unknown as ParentData);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Gagal memuat perkembangan anak.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const focusSubject = useMemo(() => {
    if (!data?.subjects.length) return null;
    return [...data.subjects].sort((a, b) => a.final - b.final)[0];
  }, [data]);

  const bestSubject = useMemo(() => {
    if (!data?.subjects.length) return null;
    return [...data.subjects].sort((a, b) => b.final - a.final)[0];
  }, [data]);

  if (loading) return <PageLoader label="Memuat perkembangan anak…" />;

  if (error || !data) {
    return (
      <Card>
        <EmptyState
          icon={AlertCircle}
          title="Data tidak tersedia"
          description={error || 'Terjadi kendala saat memuat data perkembangan.'}
          action={<Button onClick={() => window.location.reload()}>Muat ulang</Button>}
        />
      </Card>
    );
  }

  const child = data.child;
  const attendanceRate = data.summary.attendanceRate ?? data.attendance.rate ?? 0;
  const average = data.summary.averageScore ?? 0;
  const studyHours = data.summary.studyHours ?? 0;
  const rank = data.summary.rank ?? 0;
  const totalStudents = data.summary.totalStudents ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-text sm:text-2xl">Perkembangan Belajar</h1>
          <p className="mt-0.5 text-sm text-muted">Pantau capaian, kebiasaan belajar, dan catatan guru.</p>
        </div>
        <Link to="/ortu/laporan">
          <Button variant="outline" size="sm">
            <GraduationCap className="h-4 w-4" aria-hidden="true" /> Buka rapor lengkap
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="relative overflow-hidden bg-[linear-gradient(122deg,#0A335C,#12579A_58%,#1E88E5)] px-5 py-6 text-white sm:px-7">
          <div className="absolute -right-14 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_190px] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full ring-4 ring-white/15">
                  <Avatar name={child.name} size="lg" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">Anak terhubung · {roleLabel[child.role]}</p>
                  <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{child.name}</h2>
                  <p className="mt-0.5 text-[11px] text-white/65">{data.className} · NISN {child.nisn || '—'}</p>
                </div>
              </div>
              <div className="mt-5 grid max-w-xl grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { label: 'Rata-rata', value: average, suffix: '' },
                  { label: 'Kehadiran', value: attendanceRate, suffix: '%' },
                  { label: 'Peringkat', value: rank, suffix: `/${totalStudents}` },
                  { label: 'Jam belajar', value: studyHours, suffix: ' jam' },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-white/55">{item.label}</p>
                    <p className="mt-0.5 text-xl font-extrabold tabular-nums">
                      {item.value}<span className="text-[10px] font-semibold text-white/60">{item.suffix}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden justify-center lg:flex">
              <SigemasMascot className="h-36 w-36 drop-shadow-2xl" wave />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <Card className="p-5">
          <SectionHeader
            title="Tren capaian"
            subtitle="Nilai anak dibandingkan rata-rata kelas"
            action={<Badge tone="primary">6 pekan</Badge>}
          />
          <AreaChart
            data={data.performance.map((point) => ({ label: point.label, value: point.score, secondary: point.classAvg ?? point.score }))}
            primaryLabel="Nilai anak"
            secondaryLabel="Rata-rata kelas"
            height={230}
          />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-primary-soft/60 px-3 py-2">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted">Nilai terbaru</p>
              <p className="text-lg font-extrabold tabular-nums text-primary-strong dark:text-primary">{data.performance.at(-1)?.score ?? average}</p>
            </div>
            <div className="rounded-xl bg-surface-2 px-3 py-2">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted">Selisih kelas</p>
              <p className="text-lg font-extrabold tabular-nums text-text">
                {(data.performance.at(-1)?.score ?? 0) - (data.performance.at(-1)?.classAvg ?? 0) >= 0 ? '+' : ''}
                {(data.performance.at(-1)?.score ?? 0) - (data.performance.at(-1)?.classAvg ?? 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Ritme belajar" subtitle="Menit belajar tujuh hari terakhir" action={<Badge tone="accent"><Flame className="h-3 w-3" aria-hidden="true" /> {studyHours} jam</Badge>} />
          <BarChart
            data={(data.weeklyStudy ?? []).map((day) => ({ label: day.label, value: day.minutes }))}
            height={190}
            target={60}
            suffix=" mnt"
          />
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-success-soft px-3 py-2 text-[10px] font-semibold text-success">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            {(data.weeklyStudy ?? []).filter((day) => day.minutes >= day.target).length} dari 7 hari mencapai target
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="p-5">
          <SectionHeader title="Penguasaan mata pelajaran" subtitle="Nilai akhir dan capaian materi" />
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {data.subjects.map((subject) => (
              <div key={subject.subject}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2 text-xs font-semibold text-text">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg" style={{ background: `${subject.color}18`, color: subject.color }}>
                      <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="truncate">{subject.subject}</span>
                  </span>
                  <span className="shrink-0 text-[11px] font-bold tabular-nums text-text">
                    {subject.final}<span className="font-medium text-muted">/100</span>
                  </span>
                </div>
                <Progress value={subject.mastery} tone={subject.mastery >= 85 ? 'success' : subject.mastery >= 75 ? 'primary' : 'warning'} size="sm" />
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="border-success/20 bg-success-soft/30 p-4">
            <div className="flex items-center gap-2 text-success">
              <Award className="h-4 w-4" aria-hidden="true" />
              <p className="text-xs font-bold">Kekuatan utama</p>
            </div>
            {bestSubject ? (
              <>
                <p className="mt-1 text-lg font-extrabold text-text">{bestSubject.subject}</p>
                <p className="text-[11px] text-muted">Nilai {bestSubject.final} dengan penguasaan {bestSubject.mastery}%. Berikan apresiasi atas konsistensi belajar.</p>
              </>
            ) : (
              <p className="mt-1 text-[11px] text-muted">Belum ada data mata pelajaran.</p>
            )}
          </Card>
          <Card className="border-warning/20 bg-warning-soft/30 p-4">
            <div className="flex items-center gap-2 text-warning">
              <Target className="h-4 w-4" aria-hidden="true" />
              <p className="text-xs font-bold">Fokus pendampingan</p>
            </div>
            {focusSubject ? (
              <>
                <p className="mt-1 text-lg font-extrabold text-text">{focusSubject.subject}</p>
                <p className="text-[11px] leading-relaxed text-muted">
                  Nilai {focusSubject.final}. Ajak anak meninjau materi di perpustakaan SIBI dan mengerjakan kuis terkait.
                </p>
                <Link to="/ortu/laporan" className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline">
                  Lihat rincian nilai <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </>
            ) : (
              <p className="mt-1 text-[11px] text-muted">Belum ada data mata pelajaran.</p>
            )}
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary-strong dark:text-primary">
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-text">Kehadiran</h3>
                <p className="text-[10px] text-muted">{attendanceRate}% tingkat kehadiran</p>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between rounded-lg bg-surface-2 px-2.5 py-1.5">
                <span className="text-muted">Hadir</span>
                <span className="font-bold text-success">{data.attendance.hadir ?? data.attendance.present ?? 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-2 px-2.5 py-1.5">
                <span className="text-muted">Sakit / izin</span>
                <span className="font-bold text-info">{(data.attendance.sakit ?? 0) + (data.attendance.izin ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-2 px-2.5 py-1.5">
                <span className="text-muted">Alfa</span>
                <span className="font-bold text-danger">{data.attendance.alfa ?? 0}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <section>
        <SectionHeader
          title="Catatan guru"
          subtitle="Umpan balik terbaru tentang perkembangan anak"
          action={<Link to="/ortu/laporan" className="text-[11px] font-bold text-primary hover:underline">Rapor lengkap</Link>}
        />
        {data.notes.length === 0 ? (
          <Card><EmptyState icon={MessageSquareQuote} title="Belum ada catatan" description="Catatan dari guru akan tampil di sini." /></Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {data.notes.slice(0, 4).map((note) => (
              <Card key={note.id} className="p-4">
                <div className="flex items-center gap-2">
                  <Avatar name={note.teacherName || 'Guru'} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-text">{note.teacherName}</p>
                    <p className="text-[9px] text-muted">{note.teacherTitle} · {formatDate(note.date)}</p>
                  </div>
                  <Badge tone="neutral" className="px-2 py-0.5 text-[8px]">{note.subject}</Badge>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-muted">“{note.text}”</p>
              </Card>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-soft text-accent-strong">
              <Clock className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-text">Tenggat tugas</h3>
              <p className="text-[10px] text-muted">Bantu anak mengatur waktu</p>
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            {data.tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center gap-2 rounded-lg bg-surface-2 px-2.5 py-2">
                <BookOpen className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-semibold text-text">{task.title}</p>
                  <p className="text-[9px] text-muted">{task.subject} · {formatDate(task.dueAt)}</p>
                </div>
              </div>
            ))}
            {data.tasks.length === 0 && <p className="rounded-lg bg-surface-2 px-3 py-3 text-center text-[10px] text-muted">Tidak ada tugas aktif.</p>}
          </div>
        </Card>

        <Card className="flex flex-wrap items-center gap-3 border-primary/20 bg-primary-soft/30 p-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-primary shadow-sm">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-text">Pendampingan bermakna</p>
            <p className="text-[11px] leading-relaxed text-muted">
              Apresiasi usaha, bukan hanya hasil. Diskusikan satu target kecil setiap pekan bersama anak agar belajar terasa menyenangkan.
            </p>
          </div>
          <Link to="/ortu/laporan">
            <Button size="sm" variant="outline">Lihat rapor</Button>
          </Link>
        </Card>
      </div>

      <Card className="flex items-center gap-2 border-border/70 bg-surface-2/50 p-3 text-[10px] text-muted">
        <TrendingUp className="h-3.5 w-3.5 text-success" aria-hidden="true" />
        Data diperbarui dari aktivitas belajar, nilai, dan presensi anak di SiGEMAS.
      </Card>
    </div>
  );
}
