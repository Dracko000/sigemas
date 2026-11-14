import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarCheck2,
  ClipboardList,
  Clock3,
  Download,
  GraduationCap,
  MessageSquare,
  Sparkles,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import type { DashboardData } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Progress } from '../../components/ui/Progress';
import { SectionHeader, StatCard } from '../../components/ui/Misc';
import { AreaChart, BarChart, DonutChart } from '../../components/charts/Charts';
import { subjectIcon } from '../../components/books/BookCover';
import { SigemasMascot } from '../../components/SigemasMascot';
import { deadlineLabel, formatDate, greeting, relativeDate } from '../../lib/format';

export function ParentDashboard({ data }: { data: DashboardData }) {
  const navigate = useNavigate();
  const child = data.child;
  const summary = data.summary;
  const subjects = data.subjects ?? [];
  const notes = data.notes ?? [];
  const tasks = data.tasks ?? [];
  const attendance = data.attendance;
  const weekly = data.weeklyStudy ?? [];
  const performance = data.performance ?? [];

  const donut = [
    { label: 'Hadir', value: attendance?.present ?? 0, color: '#16A34A' },
    { label: 'Terlambat', value: attendance?.late ?? 0, color: '#FF9800' },
    { label: 'Sakit', value: attendance?.sick ?? 0, color: '#00ACC1' },
    { label: 'Izin', value: attendance?.excused ?? 0, color: '#8E24AA' },
    { label: 'Alfa', value: attendance?.absent ?? 0, color: '#DC2626' },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <section className="relative overflow-hidden rounded-panel border border-border bg-surface p-5 shadow-card sm:p-7">
          <div className="mesh-hero absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <Badge tone="success" dot>Laporan aktif · {formatDate(new Date().toISOString())}</Badge>
            <p className="mt-4 text-sm font-medium text-muted">{greeting()}, Bapak/Ibu</p>
            <h2 className="mt-0.5 text-2xl font-extrabold tracking-tight text-text sm:text-3xl">
              Perkembangan {child?.name.split(' ')[0]} minggu ini.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              {child?.name} menunjukkan kemajuan stabil di {subjects[0]?.subject || 'Matematika'} dan
              kehadiran yang konsisten. Ada {notes.length} catatan guru dan {tasks.length} tugas terdekat
              yang bisa Anda dampingi.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button onClick={() => navigate('/ortu/laporan')}>
                <FileReportIcon />
                Lihat laporan lengkap
              </Button>
              <Button variant="outline" onClick={() => navigate('/ortu/perkembangan')}>
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                Analisis perkembangan
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Nilai rapor aman', 'Kehadiran baik', 'Partisipasi aktif'].map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/70 px-2.5 py-1 text-[10px] font-semibold text-muted backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <SigemasMascot size={110} decorative className="absolute -bottom-2 right-2 hidden opacity-90 sm:block" />
        </section>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text">Profil anak</h3>
            <Badge tone="primary">{data.className}</Badge>
          </div>
          <div className="mt-4 flex items-center gap-3.5">
            <Avatar name={child?.name || 'Siswa'} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold text-text">{child?.name}</p>
              <p className="text-[11px] text-muted">NISN {child?.nisn || '—'}</p>
              <p className="mt-1 text-[10px] text-muted">Wali kelas: Raka Pradana, S.Pd.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="rounded-xl bg-surface-2 p-3">
              <p className="text-[10px] text-muted">Peringkat</p>
              <p className="mt-0.5 text-lg font-extrabold tabular-nums text-text">
                #{summary.rank}
                <span className="ml-1 text-[10px] font-medium text-muted">/ {summary.totalStudents}</span>
              </p>
            </div>
            <div className="rounded-xl bg-surface-2 p-3">
              <p className="text-[10px] text-muted">Rata-rata</p>
              <p className="mt-0.5 text-lg font-extrabold tabular-nums text-text">{summary.averageScore}</p>
            </div>
          </div>
          <Button size="sm" variant="secondary" className="mt-3 w-full" onClick={() => navigate('/ortu/laporan')}>
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Unduh ringkasan
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Rata-rata nilai"
          value={summary.averageScore}
          hint={<span className="inline-flex items-center gap-1 text-success"><TrendingUp className="h-3 w-3" aria-hidden="true" /> +4 poin dari bulan lalu</span>}
          icon={Award}
          tone="primary"
        />
        <StatCard
          label="Peringkat kelas"
          value={`#${summary.rank}`}
          hint={`dari ${summary.totalStudents} siswa`}
          icon={GraduationCap}
          tone="accent"
        />
        <StatCard
          label="Kehadiran"
          value={`${summary.attendanceRate}%`}
          hint={`${attendance?.total ?? 0} sesi tercatat`}
          icon={UserCheck}
          tone="success"
        />
        <StatCard
          label="Jam belajar"
          value={`${summary.studyHours} jam`}
          hint="7 hari terakhir"
          icon={Clock3}
          tone="info"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Card className="p-5 sm:p-6">
            <SectionHeader
              title="Perkembangan nilai"
              subtitle="Perbandingan dengan rata-rata kelas"
              action={<Badge tone="success">Di atas rata-rata</Badge>}
            />
            <AreaChart
              data={performance.map((p) => ({
                label: p.label.replace('Pekan ', 'P'),
                value: p.score,
                secondary: p.classAvg,
              }))}
              primaryLabel={child?.name.split(' ')[0] || 'Ananda'}
              secondaryLabel="Rata-rata kelas"
              height={240}
            />
          </Card>

          <Card className="p-5 sm:p-6">
            <SectionHeader
              title="Penguasaan mata pelajaran"
              subtitle="Capaian kompetensi per mapel"
              action={<Button size="sm" variant="ghost" onClick={() => navigate('/ortu/laporan')}>Detail</Button>}
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
                        {subject.mastery}%
                      </span>
                    </div>
                    <Progress
                      value={subject.mastery}
                      tone={subject.mastery >= 85 ? 'success' : subject.mastery >= 75 ? 'primary' : 'warning'}
                      size="sm"
                    />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary-strong dark:text-primary">
                  <MessageSquare className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-text">Catatan guru</h3>
                  <p className="text-[11px] text-muted">{notes.length} catatan terbaru</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => navigate('/ortu/laporan')}>
                Semua catatan
              </Button>
            </div>
            <ul className="divide-y divide-border">
              {notes.slice(0, 3).map((note) => (
                <li key={note.id} className="flex gap-3 px-5 py-4">
                  <Avatar name={note.teacherName || 'Guru'} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-bold text-text">{note.teacherName}</p>
                      <span className="text-[10px] text-muted">{relativeDate(note.date)}</span>
                    </div>
                    <Badge tone="neutral" className="mt-1">{note.subject}</Badge>
                    <p className="mt-2 text-[11px] leading-relaxed text-muted">{note.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold text-text">
                <CalendarCheck2 className="h-4 w-4 text-success" aria-hidden="true" />
                Presensi
              </h3>
              <Badge tone="success">{summary.attendanceRate}%</Badge>
            </div>
            <div className="mt-4">
              <DonutChart
                data={donut}
                size={148}
                thickness={16}
                centerValue={`${summary.attendanceRate}%`}
                centerLabel="Kehadiran"
              />
            </div>
            <Button size="sm" variant="outline" className="mt-4 w-full" onClick={() => navigate('/ortu/laporan')}>
              Riwayat presensi
            </Button>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold text-text">
                <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
                Tugas terdekat
              </h3>
              <Badge tone="accent">{tasks.length}</Badge>
            </div>
            <ul className="mt-3 space-y-2.5">
              {tasks.length === 0 && <li className="text-xs text-muted">Tidak ada tugas aktif.</li>}
              {tasks.slice(0, 3).map((task) => (
                <li key={task.id} className="rounded-xl border border-border bg-surface-2/50 p-3">
                  <p className="line-clamp-2 text-[11px] font-semibold leading-snug text-text">{task.title}</p>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <span className="text-[9px] text-muted">{task.subject}</span>
                    <Badge tone={deadlineLabel(task.dueAt).includes('Kurang') ? 'danger' : 'warning'}>
                      {deadlineLabel(task.dueAt)}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
            <Button size="sm" variant="ghost" className="mt-2 w-full" onClick={() => navigate('/ortu/laporan')}>
              <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
              Lihat semua tugas
            </Button>
          </Card>

          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-text">Ritme belajar</h3>
                <p className="mt-0.5 text-[11px] text-muted">Menit belajar 7 hari terakhir</p>
              </div>
              <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
            </div>
            <div className="mt-4">
              <BarChart
                data={weekly.map((d) => ({ label: d.label, value: d.minutes }))}
                target={60}
                height={130}
                suffix=" mnt"
              />
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-muted">
              Rata-rata <span className="font-bold text-text">{Math.round(weekly.reduce((sum, d) => sum + d.minutes, 0) / Math.max(weekly.length, 1))} menit</span> per hari. Dampingi anak menjaga konsistensi.
            </p>
          </Card>

          <Button className="w-full" variant="secondary" onClick={() => navigate('/ortu/laporan')}>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            Buka semua laporan
          </Button>
        </div>
      </div>
    </div>
  );
}

function FileReportIcon() {
  return <Download className="h-4 w-4" aria-hidden="true" />;
}
