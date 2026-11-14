import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Download,
  GraduationCap,
  MapPin,
  School,
  UserRound,
  Users,
} from 'lucide-react';
import { api } from '../../lib/api';
import { downloadCsv } from '../../lib/format';
import { useToast } from '../../context/ToastContext';
import type { ClassRoom, ScheduleItem, User } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { EmptyState, PageLoader, StatCard } from '../../components/ui/Misc';
import { Progress } from '../../components/ui/Progress';
import { BarChart } from '../../components/charts/Charts';

interface ClassDetail extends ClassRoom {
  homeroomName?: string;
  students: (User & { average: number })[];
  upcoming: ScheduleItem[];
}

export function AdminClassesPage() {
  const toast = useToast();
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState<ClassDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    let active = true;
    api<ClassRoom[]>('/api/classes')
      .then((rows) => {
        if (active) {
          setClasses(rows);
          setError('');
        }
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Gagal memuat kelas.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const students = classes.reduce((sum, item) => sum + item.studentCount, 0);
    const graded = classes.filter((item) => (item.average ?? 0) > 0);
    const average = graded.length
      ? Math.round(graded.reduce((sum, item) => sum + (item.average ?? 0), 0) / graded.length)
      : 0;
    return { students, average, teachers: new Set(classes.map((item) => item.homeroomId)).size };
  }, [classes]);

  const openClass = async (classId: string) => {
    setDetailLoading(true);
    try {
      const payload = await api<ClassDetail>(`/api/classes/${classId}`);
      setDetail(payload);
    } catch (err) {
      toast.error('Gagal memuat rombel', err instanceof Error ? err.message : undefined);
    } finally {
      setDetailLoading(false);
    }
  };

  const exportClasses = () => {
    downloadCsv('rombel-sigemas.csv', [
      ['Kelas', 'Ruang', 'Wali Kelas', 'Jumlah Siswa', 'Rata-rata'],
      ...classes.map((item) => [item.name, item.room, item.homeroomName || '-', item.studentCount, item.average ?? 0]),
    ]);
    toast.success('Data rombel diekspor', 'Berkas CSV siap dibuka.');
  };

  if (loading) return <PageLoader label="Memuat rombel…" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-text sm:text-2xl">Kelas & Rombel</h1>
          <p className="mt-0.5 text-sm text-muted">Pantau komposisi siswa, wali kelas, dan capaian tiap rombel.</p>
        </div>
        <Button variant="outline" onClick={exportClasses}>
          <Download className="h-4 w-4" aria-hidden="true" /> Ekspor rombel
        </Button>
      </div>

      {error && <div className="rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{error}</div>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Rombel" value={classes.length} icon={School} tone="primary" hint="Kelas aktif" />
        <StatCard label="Total siswa" value={stats.students} icon={Users} tone="info" hint="Terdaftar" />
        <StatCard label="Rata-rata capaian" value={stats.average} icon={GraduationCap} tone="success" hint="Rombel berpenilaian" />
        <StatCard label="Wali kelas" value={stats.teachers} icon={UserRound} tone="accent" hint="Guru pendamping" />
      </div>

      {classes.length > 0 && (
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-text">Perbandingan rata-rata rombel</h2>
              <p className="text-[10px] text-muted">Nilai rata-rata siswa per kelas</p>
            </div>
            <Badge tone="primary">{classes.length} kelas</Badge>
          </div>
          <BarChart data={classes.map((item) => ({ label: item.name, value: item.average ?? 0 }))} height={190} target={75} />
        </Card>
      )}

      {classes.length === 0 ? (
        <Card><EmptyState icon={School} title="Belum ada rombel" description="Data kelas akan ditampilkan setelah dibuat oleh administrator." /></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classes.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex items-center gap-3 border-b border-border bg-surface-2/60 px-4 py-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white">
                  <School className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-text">{item.name}</p>
                  <p className="text-[10px] text-muted">{item.academicYear} · {item.room}</p>
                </div>
                <Badge tone="neutral" className="px-2 py-0.5 text-[9px]">{item.studentCount} siswa</Badge>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-surface-2 p-2.5">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-muted">Rata-rata</p>
                    <p className="text-lg font-extrabold tabular-nums text-text">{item.average ?? 0}</p>
                  </div>
                  <div className="rounded-lg bg-surface-2 p-2.5">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-muted">Kehadiran</p>
                    <p className="text-lg font-extrabold tabular-nums text-text">{item.attendanceRate ?? 0}%</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5 text-[10px] text-muted">
                  <p className="flex items-center gap-1.5"><UserRound className="h-3 w-3" aria-hidden="true" /> {item.homeroomName || '—'}</p>
                  <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3" aria-hidden="true" /> Ruang {item.room}</p>
                  <p className="flex items-center gap-1.5"><BookOpen className="h-3 w-3" aria-hidden="true" /> {item.subjects.slice(0, 3).join(', ')}</p>
                </div>
                <div className="mt-3">
                  <Progress value={item.average ?? 0} tone={(item.average ?? 0) >= 75 ? 'success' : 'primary'} size="sm" />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="inline-flex items-center gap-1 text-[9px] text-muted">
                    <CalendarDays className="h-3 w-3" aria-hidden="true" /> {item.schedule.length} sesi/pekan
                  </span>
                  <button
                    type="button"
                    onClick={() => openClass(item.id)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                  >
                    Lihat rombel <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(detail) || detailLoading}
        onClose={() => setDetail(null)}
        title={detail ? `${detail.name} · ${detail.room}` : 'Memuat rombel…'}
        description={detail ? `${detail.homeroomName || 'Wali kelas'} · ${detail.students.length} siswa · ${detail.academicYear}` : undefined}
        size="lg"
      >
        {detailLoading && <p className="py-6 text-center text-sm text-muted">Memuat data rombel…</p>}
        {detail && !detailLoading && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-surface-2 p-3 text-center">
                <p className="text-lg font-extrabold text-text">{detail.average ?? 0}</p>
                <p className="text-[8px] font-semibold uppercase text-muted">Rata-rata</p>
              </div>
              <div className="rounded-xl bg-surface-2 p-3 text-center">
                <p className="text-lg font-extrabold text-text">{detail.studentCount}</p>
                <p className="text-[8px] font-semibold uppercase text-muted">Siswa</p>
              </div>
              <div className="rounded-xl bg-surface-2 p-3 text-center">
                <p className="text-lg font-extrabold text-text">{detail.schedule.length}</p>
                <p className="text-[8px] font-semibold uppercase text-muted">Sesi/pekan</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-text">Daftar siswa</p>
              <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-surface-2 text-[9px] uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-3 py-2 font-bold">Nama</th>
                      <th className="px-2 py-2 font-bold">NISN</th>
                      <th className="px-3 py-2 text-right font-bold">Rata-rata</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {detail.students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Avatar name={student.name} size="xs" />
                            <span className="text-[10px] font-semibold text-text">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2 text-[9px] text-muted">{student.nisn}</td>
                        <td className={`px-3 py-2 text-right text-[10px] font-bold tabular-nums ${student.average >= 75 ? 'text-success' : 'text-warning'}`}>{student.average}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-text">Jadwal kelas</p>
              <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {detail.schedule.map((slot, index) => (
                  <div key={`${slot.day}-${index}`} className="flex items-center gap-2 rounded-lg bg-surface-2 px-2.5 py-2">
                    <span className="w-14 text-[9px] font-bold uppercase text-muted">{slot.day}</span>
                    <span className="text-[9px] tabular-nums text-muted">{slot.start}–{slot.end}</span>
                    <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-text">{slot.subject}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
