import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  Radio,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';
import { api } from '../../lib/api';
import { downloadCsv, formatDate, formatDateTime } from '../../lib/format';
import type { AttendanceRecord, AttendanceSession, AttendanceSummary, ClassRoom, User } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Field';
import { EmptyState, PageLoader, SectionHeader, StatCard } from '../../components/ui/Misc';
import { Progress } from '../../components/ui/Progress';
import { Tabs } from '../../components/ui/Tabs';

interface StudentAttendance {
  studentId: string;
  hadir: number;
  terlambat: number;
  sakit: number;
  izin: number;
  alfa: number;
}

interface AttendanceData {
  class: ClassRoom;
  students: (User & { summary: StudentAttendance })[];
  sessions: (AttendanceSession & { records: (AttendanceRecord & { studentName?: string })[] })[];
  live: {
    id: string;
    sessionId: string;
    studentId: string;
    studentName?: string;
    sessionTitle?: string;
    joinedAt: string;
    durationMin: number;
    leftAt?: string | null;
  }[];
  summary: AttendanceSummary & { totalSessions: number };
}

const statusTone = (status: string) => {
  if (status === 'hadir') return 'success' as const;
  if (status === 'terlambat') return 'warning' as const;
  if (status === 'sakit') return 'info' as const;
  if (status === 'izin') return 'primary' as const;
  return 'danger' as const;
};

const statusLabel: Record<string, string> = {
  hadir: 'Hadir',
  terlambat: 'Terlambat',
  sakit: 'Sakit',
  izin: 'Izin',
  alfa: 'Alfa',
};

export function AttendancePage() {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [classId, setClassId] = useState('');
  const [data, setData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('siswa');
  const [query, setQuery] = useState('');

  useEffect(() => {
    api<ClassRoom[]>('/api/classes')
      .then((rows) => {
        setClasses(rows);
        setClassId((current) => current || rows[0]?.id || '');
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Gagal memuat kelas.'));
  }, []);

  useEffect(() => {
    if (!classId) return;
    setLoading(true);
    api<AttendanceData>(`/api/attendance?classId=${classId}`)
      .then((payload) => {
        setData(payload);
        setError('');
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Gagal memuat presensi.'))
      .finally(() => setLoading(false));
  }, [classId]);

  const filteredStudents = useMemo(() => {
    if (!data) return [];
    const term = query.trim().toLowerCase();
    if (!term) return data.students;
    return data.students.filter((student) => student.name.toLowerCase().includes(term) || student.nisn?.includes(term));
  }, [data, query]);

  const rateFor = (summary: StudentAttendance) => {
    const total = summary.hadir + summary.terlambat + summary.sakit + summary.izin + summary.alfa;
    return total ? Math.round(((summary.hadir + summary.terlambat) / total) * 100) : 0;
  };

  const exportCsv = () => {
    if (!data) return;
    downloadCsv(`${data.class.name.toLowerCase().replace(/\s+/g, '-')}-presensi.csv`, [
      ['Nama', 'NISN', 'Hadir', 'Terlambat', 'Sakit', 'Izin', 'Alfa', 'Tingkat Kehadiran'],
      ...data.students.map((student) => [
        student.name,
        student.nisn || '-',
        student.summary.hadir,
        student.summary.terlambat,
        student.summary.sakit,
        student.summary.izin,
        student.summary.alfa,
        `${rateFor(student.summary)}%`,
      ]),
    ]);
  };

  if (loading && !data) return <PageLoader label="Memuat presensi…" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-text sm:text-2xl">Presensi Kelas</h1>
          <p className="mt-0.5 text-sm text-muted">Rekap kehadiran kelas reguler dan kelas live.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-48">
            <Select label="Kelas" value={classId} onChange={(event) => setClassId(event.target.value)}>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </Select>
          </div>
          <Button variant="outline" onClick={exportCsv} disabled={!data}>
            <Download className="h-4 w-4" aria-hidden="true" /> Ekspor
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{error}</div>
      )}

      {data && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Tingkat kehadiran" value={`${data.summary.rate}%`} icon={UserCheck} tone="success" hint={`${data.summary.totalSessions} sesi tercatat`} />
            <StatCard label="Hadir" value={data.summary.hadir} icon={CheckCircle2} tone="primary" hint={`${data.summary.terlambat} terlambat`} />
            <StatCard label="Sakit / izin" value={(data.summary.sakit ?? 0) + (data.summary.izin ?? 0)} icon={CalendarCheck} tone="info" hint="Dengan keterangan" />
            <StatCard label="Alfa" value={data.summary.alfa} icon={XCircle} tone="danger" hint="Tanpa keterangan" />
          </div>

          <Card className="flex flex-wrap items-center gap-3 border-success/20 bg-success-soft/40 p-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-success shadow-sm">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-text">Presensi live otomatis</p>
              <p className="text-[11px] leading-relaxed text-muted">
                Siswa yang bergabung ke kelas live tercatat otomatis. Durasi kehadiran dihitung dari waktu masuk hingga keluar.
              </p>
            </div>
            <Link to="/guru/live">
              <Button size="sm" variant="outline">
                <Radio className="h-3.5 w-3.5" aria-hidden="true" /> Studio live
              </Button>
            </Link>
          </Card>

          <Tabs
            items={[
              { id: 'siswa', label: 'Rekap siswa', icon: Users, count: data.students.length },
              { id: 'sesi', label: 'Sesi kelas', icon: CalendarCheck, count: data.sessions.length },
              { id: 'live', label: 'Live', icon: Radio, count: data.live.length },
            ]}
            value={tab}
            onChange={setTab}
            variant="underline"
          />

          {tab === 'siswa' && (
            <Card className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-text">{data.class.name}</p>
                  <p className="text-[10px] text-muted">Total {data.students.length} siswa · semester berjalan</p>
                </div>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Cari siswa…"
                    className="h-9 w-44 rounded-lg border border-border bg-surface pl-8 pr-2 text-[11px] text-text outline-none focus:border-primary"
                    aria-label="Cari siswa"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-xs">
                  <thead className="bg-surface-2 text-[10px] uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-4 py-2.5 font-bold">Siswa</th>
                      <th className="px-2 py-2.5 text-center font-bold">Hadir</th>
                      <th className="px-2 py-2.5 text-center font-bold">Terlambat</th>
                      <th className="px-2 py-2.5 text-center font-bold">Sakit</th>
                      <th className="px-2 py-2.5 text-center font-bold">Izin</th>
                      <th className="px-2 py-2.5 text-center font-bold">Alfa</th>
                      <th className="px-4 py-2.5 font-bold">Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredStudents.map((student) => {
                      const rate = rateFor(student.summary);
                      return (
                        <tr key={student.id} className="transition hover:bg-surface-2/50">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <Avatar name={student.name} size="xs" />
                              <div>
                                <p className="text-[11px] font-semibold text-text">{student.name}</p>
                                <p className="text-[9px] text-muted">{student.nisn}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-2.5 text-center font-bold tabular-nums text-success">{student.summary.hadir}</td>
                          <td className="px-2 py-2.5 text-center font-bold tabular-nums text-warning">{student.summary.terlambat}</td>
                          <td className="px-2 py-2.5 text-center tabular-nums text-muted">{student.summary.sakit}</td>
                          <td className="px-2 py-2.5 text-center tabular-nums text-muted">{student.summary.izin}</td>
                          <td className="px-2 py-2.5 text-center font-bold tabular-nums text-danger">{student.summary.alfa}</td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <Progress value={rate} size="sm" tone={rate >= 90 ? 'success' : rate >= 75 ? 'primary' : 'warning'} className="w-24" />
                              <span className="w-8 text-right text-[10px] font-bold tabular-nums text-text">{rate}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {tab === 'sesi' && (
            <div className="space-y-3">
              <SectionHeader title="Riwayat sesi" subtitle="Rekap kehadiran per pertemuan" />
              {data.sessions.length === 0 ? (
                <Card><EmptyState icon={CalendarCheck} title="Belum ada sesi presensi" description="Presensi akan muncul setelah sesi kelas dicatat." /></Card>
              ) : (
                data.sessions.map((session) => {
                  const present = session.records.filter((record) => record.status === 'hadir').length;
                  const late = session.records.filter((record) => record.status === 'terlambat').length;
                  const absent = session.records.filter((record) => record.status === 'alfa').length;
                  return (
                    <details key={session.id} className="group overflow-hidden rounded-card border border-border bg-surface shadow-card">
                      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 px-4 py-3 transition hover:bg-surface-2/50">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-strong dark:text-primary">
                          <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-text">{session.topic}</p>
                          <p className="text-[10px] text-muted">{formatDate(session.date)} · {session.records.length} siswa</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge tone="success">{present} hadir</Badge>
                          {late > 0 && <Badge tone="warning">{late} terlambat</Badge>}
                          {absent > 0 && <Badge tone="danger">{absent} alfa</Badge>}
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted transition group-open:rotate-180" aria-hidden="true" />
                      </summary>
                      <div className="overflow-x-auto border-t border-border">
                        <table className="w-full min-w-[540px] text-left text-xs">
                          <thead className="bg-surface-2 text-[9px] uppercase tracking-wider text-muted">
                            <tr>
                              <th className="px-4 py-2 font-bold">Siswa</th>
                              <th className="px-2 py-2 font-bold">Status</th>
                              <th className="px-2 py-2 font-bold">Masuk</th>
                              <th className="px-4 py-2 font-bold">Durasi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {session.records.map((record) => (
                              <tr key={`${session.id}-${record.studentId}`}>
                                <td className="px-4 py-2 text-[11px] font-semibold text-text">{record.studentName}</td>
                                <td className="px-2 py-2"><Badge tone={statusTone(record.status)} dot className="px-2 py-0.5 text-[9px]">{statusLabel[record.status] || record.status}</Badge></td>
                                <td className="px-2 py-2 text-[10px] text-muted">{record.joinedAt ? formatDateTime(record.joinedAt) : '—'}</td>
                                <td className="px-4 py-2 text-[10px] text-muted">{record.durationMin ? `${record.durationMin} mnt` : '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </details>
                  );
                })
              )}
            </div>
          )}

          {tab === 'live' && (
            <div className="space-y-3">
              <SectionHeader title="Kehadiran live" subtitle="Catatan masuk dan keluar dari studio live" />
              {data.live.length === 0 ? (
                <Card>
                  <EmptyState
                    icon={Radio}
                    title="Belum ada presensi live"
                    description="Buka studio live dan siswa yang bergabung akan tercatat otomatis di sini."
                    action={<Link to="/guru/live"><Button size="sm">Buka studio live</Button></Link>}
                  />
                </Card>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {data.live.map((entry) => (
                    <Card key={entry.id} className="flex items-center gap-3 p-4">
                      <Avatar name={entry.studentName || 'Siswa'} size="sm" status="online" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-text">{entry.studentName}</p>
                        <p className="truncate text-[10px] text-muted">{entry.sessionTitle || 'Kelas live'}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-[9px] text-muted">
                          <Clock className="h-2.5 w-2.5" aria-hidden="true" /> Masuk {formatDateTime(entry.joinedAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold tabular-nums text-text">{entry.durationMin}<span className="ml-0.5 text-[9px] font-semibold text-muted">mnt</span></p>
                        <Badge tone={entry.leftAt ? 'neutral' : 'success'} className="px-2 py-0.5 text-[8px]">{entry.leftAt ? 'Selesai' : 'Di kelas'}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          <Card className="flex flex-wrap items-center gap-3 border-primary/20 bg-primary-soft/30 p-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-primary shadow-sm">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-text">Kehadiran dan capaian belajar</p>
              <p className="text-[11px] leading-relaxed text-muted">
                Siswa dengan kehadiran di bawah 75% perlu pendampingan. Gunakan data ini untuk berdiskusi dengan wali kelas dan orang tua.
              </p>
            </div>
            <Link to="/guru/nilai" className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline">
              Buku nilai <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Card>
        </>
      )}
    </div>
  );
}
