import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Medal,
  Target,
  TrendingUp,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { api } from '../../lib/api';
import { downloadCsv, formatDate, formatDateTime, roleLabel } from '../../lib/format';
import type {
  Assessment,
  AttendanceRecord,
  AttendanceSummary,
  ScoreRow,
  SubjectGrade,
  User,
} from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, PageLoader, SectionHeader } from '../../components/ui/Misc';
import { Progress, ProgressRing } from '../../components/ui/Progress';
import { Tabs } from '../../components/ui/Tabs';
import { BarChart, DonutChart } from '../../components/charts/Charts';

interface GradesData {
  student: User;
  className?: string;
  subjects: SubjectGrade[];
  assessments: Assessment[];
  scores: ScoreRow[];
  attendance: AttendanceSummary;
  attendanceRecords: AttendanceRecord[];
  average: number;
  rank: number;
  totalStudents: number;
  trend?: { label: string; score: number; classAvg?: number }[];
}

const statusTone = (status: string) => {
  const key = status.toLowerCase();
  if (key === 'hadir') return 'success' as const;
  if (key === 'terlambat') return 'warning' as const;
  if (key === 'sakit') return 'info' as const;
  if (key === 'izin') return 'primary' as const;
  return 'danger' as const;
};

const attendanceLabel: Record<string, string> = {
  hadir: 'Hadir',
  terlambat: 'Terlambat',
  sakit: 'Sakit',
  izin: 'Izin',
  alfa: 'Alfa',
};

export function GradesPage() {
  const [data, setData] = useState<GradesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('nilai');

  useEffect(() => {
    let active = true;
    api<GradesData>('/api/grades')
      .then((payload) => {
        if (active) {
          setData(payload);
          setError('');
        }
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Gagal memuat nilai.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const attendanceDonut = useMemo(() => {
    if (!data) return [];
    const summary = data.attendance;
    return [
      { label: 'Hadir', value: summary.hadir ?? summary.present ?? 0, color: '#16A34A' },
      { label: 'Terlambat', value: summary.terlambat ?? summary.late ?? 0, color: '#FF9800' },
      { label: 'Sakit', value: summary.sakit ?? summary.sick ?? 0, color: '#00ACC1' },
      { label: 'Izin', value: summary.izin ?? summary.excused ?? 0, color: '#1E88E5' },
      { label: 'Alfa', value: summary.alfa ?? summary.absent ?? 0, color: '#DC2626' },
    ].filter((item) => item.value > 0);
  }, [data]);

  const assessmentRows = useMemo(() => {
    if (!data) return [];
    return data.assessments.map((assessment) => {
      const score = data.scores.find((row) => row.assessmentId === assessment.id);
      return { assessment, score: score?.score ?? null };
    });
  }, [data]);

  if (loading) return <PageLoader label="Memuat nilai dan presensi…" />;

  if (error || !data) {
    return (
      <Card>
        <EmptyState
          icon={FileText}
          title="Nilai belum dapat dimuat"
          description={error || 'Terjadi kendala saat mengambil data nilai.'}
          action={<Button onClick={() => window.location.reload()}>Muat ulang</Button>}
        />
      </Card>
    );
  }

  const attendance = data.attendance;
  const absent = attendance.alfa ?? attendance.absent ?? 0;
  const rate = attendance.rate ?? 0;

  const exportGrades = () => {
    downloadCsv('nilai-sigemas.csv', [
      ['Mata Pelajaran', 'Tugas', 'Kuis', 'UTS', 'UAS', 'Nilai Akhir', 'Penguasaan'],
      ...data.subjects.map((subject) => [
        subject.subject,
        subject.tugas,
        subject.kuis,
        subject.uts,
        subject.uas,
        subject.final,
        `${subject.mastery}%`,
      ]),
    ]);
  };

  const exportAttendance = () => {
    downloadCsv('presensi-sigemas.csv', [
      ['Tanggal', 'Topik', 'Status', 'Durasi (menit)', 'Sesi'],
      ...data.attendanceRecords.map((record) => [
        record.date,
        record.topic,
        attendanceLabel[record.status] || record.status,
        record.durationMin,
        record.sessionTitle || 'Pembelajaran',
      ]),
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-text sm:text-2xl">Nilai & Presensi</h1>
          <p className="mt-0.5 text-sm text-muted">{data.className} · {data.student.name}</p>
        </div>
        <Badge tone="primary">
          <GraduationCap className="h-3 w-3" aria-hidden="true" /> Semester berjalan
        </Badge>
      </div>

      <Card className="overflow-hidden">
        <div className="relative overflow-hidden bg-[linear-gradient(122deg,#0A335C,#12579A_58%,#1E88E5)] px-5 py-6 text-white sm:px-7">
          <div className="absolute -right-14 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
          <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex flex-wrap items-center gap-5">
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">Rata-rata</p>
                <p className="mt-1 text-5xl font-extrabold leading-none tabular-nums">{data.average}</p>
                <p className="mt-1 text-[10px] font-semibold text-white/60">dari 100</p>
              </div>
              <div className="h-16 w-px bg-white/15" aria-hidden="true" />
              <div>
                <Badge tone="accent" className="border-white/10 bg-accent text-[#2b1a00]">
                  <Medal className="h-3 w-3" aria-hidden="true" /> Peringkat {data.rank} dari {data.totalStudents}
                </Badge>
                <h2 className="mt-2 text-xl font-extrabold tracking-tight">
                  {data.average >= 85 ? 'Prestasi gemilang!' : data.average >= 75 ? 'Terus pertahankan!' : 'Ayo tingkatkan lagi!'}
                </h2>
                <p className="mt-1 max-w-md text-xs leading-relaxed text-white/70">
                  Nilai akhir menggabungkan tugas, kuis, UTS, dan UAS. Presensi memengaruhi kesiapan belajarmu.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <ProgressRing value={rate} size={92} stroke={8} color="#FFB300" />
                <div className="-mt-[64px] mb-[34px]">
                  <p className="text-lg font-extrabold tabular-nums">{rate}%</p>
                  <p className="text-[8px] font-bold uppercase tracking-wider text-white/55">Hadir</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid divide-y divide-border sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {[
            { label: 'Mata pelajaran', value: data.subjects.length, icon: Award },
            { label: 'Penilaian', value: data.assessments.length, icon: FileText },
            { label: 'Hadir', value: attendance.hadir ?? attendance.present ?? 0, icon: CheckCircle2 },
            { label: 'Alfa', value: absent, icon: XCircle },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 px-5 py-3.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2 text-primary">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-lg font-extrabold tabular-nums text-text">{item.value}</p>
                  <p className="text-[10px] text-muted">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Tabs
        items={[
          { id: 'nilai', label: 'Rapor nilai', icon: Award },
          { id: 'presensi', label: 'Presensi', icon: UserCheck, count: data.attendanceRecords.length },
        ]}
        value={tab}
        onChange={setTab}
        variant="underline"
      />

      {tab === 'nilai' ? (
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <Card className="p-5">
              <SectionHeader title="Capaian per mata pelajaran" subtitle="Nilai akhir semester berjalan" />
              <BarChart
                data={data.subjects.map((subject) => ({ label: subject.subject, value: subject.final, color: subject.color }))}
                height={220}
                target={75}
              />
            </Card>
            <Card className="p-5">
              <SectionHeader
                title="Rincian nilai"
                subtitle="Bobot komponen penilaian"
                action={
                  <Button size="sm" variant="outline" onClick={exportGrades}>
                    <Download className="h-3.5 w-3.5" aria-hidden="true" /> CSV
                  </Button>
                }
              />
              <div className="space-y-4">
                {data.subjects.map((subject) => (
                  <div key={subject.subject}>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-semibold text-text">{subject.subject}</span>
                      <span className="text-[11px] font-bold tabular-nums text-text">
                        {subject.final} <span className="font-medium text-muted">/100</span>
                      </span>
                    </div>
                    <Progress value={subject.mastery} tone={subject.mastery >= 85 ? 'success' : subject.mastery >= 75 ? 'primary' : 'warning'} size="sm" />
                    <div className="mt-1 flex gap-3 text-[9px] text-muted">
                      <span>Tugas {subject.tugas}</span>
                      <span>Kuis {subject.kuis}</span>
                      <span>UTS {subject.uts}</span>
                      <span>UAS {subject.uas}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
              <div>
                <h3 className="text-sm font-bold text-text">Riwayat penilaian</h3>
                <p className="text-[10px] text-muted">Nilai tugas, kuis, dan ujian yang tercatat</p>
              </div>
              <Badge tone="neutral">{assessmentRows.length} penilaian</Badge>
            </div>
            {assessmentRows.length === 0 ? (
              <EmptyState icon={FileText} title="Belum ada penilaian" description="Nilai akan muncul setelah guru memasukkan penilaian." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-xs">
                  <thead className="bg-surface-2 text-[10px] uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-5 py-2.5 font-bold">Penilaian</th>
                      <th className="px-3 py-2.5 font-bold">Jenis</th>
                      <th className="px-3 py-2.5 font-bold">Tanggal</th>
                      <th className="px-3 py-2.5 font-bold">Bobot</th>
                      <th className="px-5 py-2.5 text-right font-bold">Nilai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {assessmentRows.map(({ assessment, score }) => (
                      <tr key={assessment.id} className="transition hover:bg-surface-2/60">
                        <td className="px-5 py-3 font-semibold text-text">{assessment.title}</td>
                        <td className="px-3 py-3"><Badge tone="neutral" className="px-2 py-0.5 text-[9px]">{assessment.type}</Badge></td>
                        <td className="px-3 py-3 text-muted">{formatDate(assessment.date)}</td>
                        <td className="px-3 py-3 tabular-nums text-muted">{assessment.weight}%</td>
                        <td className="px-5 py-3 text-right">
                          {score === null ? (
                            <Badge tone="warning" className="px-2 py-0.5 text-[9px]">Belum dinilai</Badge>
                          ) : (
                            <span className={score >= 75 ? 'font-extrabold tabular-nums text-success' : 'font-extrabold tabular-nums text-danger'}>
                              {score}<span className="ml-0.5 text-[9px] font-medium text-muted">/{assessment.maxScore}</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
            <Card className="p-5">
              <SectionHeader title="Ringkasan kehadiran" subtitle={`Tingkat kehadiran ${rate}%`} />
              {attendanceDonut.length ? (
                <DonutChart
                  data={attendanceDonut}
                  size={180}
                  centerValue={`${rate}%`}
                  centerLabel="Kehadiran"
                />
              ) : (
                <EmptyState icon={CalendarCheck} title="Belum ada data presensi" />
              )}
              <div className="mt-4 space-y-1.5">
                {attendanceDonut.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-[11px]">
                    <span className="h-2 w-2 rounded-full" style={{ background: item.color }} aria-hidden="true" />
                    <span className="flex-1 text-muted">{item.label}</span>
                    <span className="font-bold tabular-nums text-text">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid gap-3 sm:grid-cols-2">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-success-soft text-success"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /></span>
                  <span className="text-2xl font-extrabold tabular-nums text-text">{attendance.hadir ?? attendance.present ?? 0}</span>
                </div>
                <p className="mt-2 text-xs font-bold text-text">Hadir</p>
                <p className="text-[10px] text-muted">Tepat waktu di kelas</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-warning-soft text-warning"><Clock className="h-4 w-4" aria-hidden="true" /></span>
                  <span className="text-2xl font-extrabold tabular-nums text-text">{attendance.terlambat ?? attendance.late ?? 0}</span>
                </div>
                <p className="mt-2 text-xs font-bold text-text">Terlambat</p>
                <p className="text-[10px] text-muted">Masuk setelah bel</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-info-soft text-info"><CalendarCheck className="h-4 w-4" aria-hidden="true" /></span>
                  <span className="text-2xl font-extrabold tabular-nums text-text">{(attendance.sakit ?? 0) + (attendance.izin ?? 0)}</span>
                </div>
                <p className="mt-2 text-xs font-bold text-text">Sakit / izin</p>
                <p className="text-[10px] text-muted">Dengan keterangan</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-danger-soft text-danger"><XCircle className="h-4 w-4" aria-hidden="true" /></span>
                  <span className="text-2xl font-extrabold tabular-nums text-text">{absent}</span>
                </div>
                <p className="mt-2 text-xs font-bold text-text">Alfa</p>
                <p className="text-[10px] text-muted">Tanpa keterangan</p>
              </Card>
              <div className="sm:col-span-2 rounded-card border border-primary/20 bg-primary-soft/40 p-4">
                <div className="flex items-center gap-2 text-primary-strong dark:text-primary">
                  <TrendingUp className="h-4 w-4" aria-hidden="true" />
                  <p className="text-xs font-bold">Jaga ritme kehadiran</p>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">
                  Kehadiran minimal 90% membantu kamu mengikuti alur materi SIBI dan diskusi kelas live tanpa tertinggal.
                </p>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
              <div>
                <h3 className="text-sm font-bold text-text">Riwayat presensi</h3>
                <p className="text-[10px] text-muted">Kelas tatap muka dan sesi live</p>
              </div>
              <Button size="sm" variant="outline" onClick={exportAttendance}>
                <Download className="h-3.5 w-3.5" aria-hidden="true" /> CSV
              </Button>
            </div>
            {data.attendanceRecords.length === 0 ? (
              <EmptyState icon={CalendarCheck} title="Belum ada catatan presensi" description="Presensi kelas live tercatat otomatis saat kamu bergabung." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-xs">
                  <thead className="bg-surface-2 text-[10px] uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-5 py-2.5 font-bold">Tanggal</th>
                      <th className="px-3 py-2.5 font-bold">Topik</th>
                      <th className="px-3 py-2.5 font-bold">Status</th>
                      <th className="px-3 py-2.5 font-bold">Durasi</th>
                      <th className="px-5 py-2.5 font-bold">Sumber</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.attendanceRecords.map((record, index) => (
                      <tr key={`${record.sessionId || record.date}-${index}`} className="transition hover:bg-surface-2/60">
                        <td className="px-5 py-3 font-semibold text-text">{formatDate(record.date)}</td>
                        <td className="px-3 py-3 text-muted">{record.topic}</td>
                        <td className="px-3 py-3"><Badge tone={statusTone(record.status)} dot className="px-2 py-0.5 text-[9px]">{attendanceLabel[record.status] || record.status}</Badge></td>
                        <td className="px-3 py-3 tabular-nums text-muted">{record.durationMin ? `${record.durationMin} mnt` : '—'}</td>
                        <td className="px-5 py-3 text-muted">{record.sessionTitle ? 'Kelas live' : 'Kelas reguler'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      <Card className="flex flex-wrap items-center gap-3 p-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent-strong">
          <Target className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-text">Target semester</p>
          <p className="text-[11px] leading-relaxed text-muted">
            Pertahankan nilai di atas 75 dan kehadiran minimal 90%. Buka Arena Kuis untuk berlatih soal dari bab yang belum dikuasai.
          </p>
        </div>
        <Badge tone="success" dot>{roleLabel[data.student.role]} aktif</Badge>
      </Card>
    </div>
  );
}
