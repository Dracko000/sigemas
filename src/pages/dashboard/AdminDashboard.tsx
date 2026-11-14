import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CloudDownload,
  Database,
  Gauge,
  Layers,
  RefreshCw,
  School,
  Server,
  ShieldCheck,
  Users,
  UserPlus,
  Video,
} from 'lucide-react';
import type { DashboardData, User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { SectionHeader, StatCard } from '../../components/ui/Misc';
import { AreaChart, DonutChart } from '../../components/charts/Charts';
import { formatDateTime, greeting, relativeDate } from '../../lib/format';

const roleTone: Record<string, 'primary' | 'accent' | 'success' | 'info' | 'neutral'> = {
  student: 'primary',
  teacher: 'accent',
  parent: 'success',
  admin: 'info',
  system: 'neutral',
};

export function AdminDashboard({ data }: { data: DashboardData }) {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const summary = data.summary;
  const growth = data.userGrowth ?? [];
  const roles = data.roleDistribution ?? [];
  const logs = data.logs ?? [];
  const classes = data.classes ?? [];
  const system = data.system ?? {};
  const [sync, setSync] = useState(data.sync);
  const [syncing, setSyncing] = useState(false);
  const [pending, setPending] = useState<User[]>(data.pendingTeachers ?? []);
  const [approving, setApproving] = useState<string | null>(null);
  const firstName = user?.name.split(' ')[0] ?? 'Admin';

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await api<{ sync: typeof sync; books: number }>('/api/catalog/sync', { method: 'POST' });
      setSync(result.sync);
      toast.success('Sinkronisasi selesai', `${result.books} buku SIBI berhasil diverifikasi.`);
    } catch (error) {
      toast.error('Sinkronisasi gagal', error instanceof Error ? error.message : 'Coba lagi.');
    } finally {
      setSyncing(false);
    }
  };

  const approve = async (teacher: User) => {
    setApproving(teacher.id);
    try {
      await api(`/api/users/${teacher.id}`, { method: 'PATCH', body: { status: 'aktif' } });
      setPending((rows) => rows.filter((row) => row.id !== teacher.id));
      toast.success('Akun diaktifkan', `${teacher.name} dapat masuk ke SiGEMAS.`);
    } catch (error) {
      toast.error('Gagal mengaktifkan akun', error instanceof Error ? error.message : 'Coba lagi.');
    } finally {
      setApproving(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <section className="relative overflow-hidden rounded-panel border border-border bg-[linear-gradient(125deg,#082A52,#0D47A1_55%,#1565C0)] p-5 text-white shadow-card sm:p-7">
          <div className="pattern-grid absolute inset-0 text-white/25 opacity-20" aria-hidden="true" />
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-white/20 bg-white/10 text-white" dot>Sistem sehat</Badge>
              <span className="text-[10px] text-blue-100/60">Uptime {system.uptimeHours} jam · {system.latencyMs} ms</span>
            </div>
            <p className="mt-4 text-sm font-medium text-blue-100/70">{greeting()},</p>
            <h2 className="mt-0.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {firstName}, ekosistem SiGEMAS terkendali.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-100/70">
              {summary.activeUsers} akun aktif, {summary.syncedBooks} buku SIBI tersinkron, dan{' '}
              {summary.liveNow} sesi live berjalan. Pantau kesehatan sistem dan aktivitas pengguna dari sini.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button variant="accent" onClick={() => navigate('/admin/pengguna')}>
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Kelola pengguna
              </Button>
              <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/15" onClick={() => navigate('/admin/analitik')}>
                <Activity className="h-4 w-4" aria-hidden="true" />
                Analitik sistem
              </Button>
            </div>
            <div className="mt-6 grid max-w-lg grid-cols-3 gap-3">
              {[
                { label: 'CPU', value: '34%' },
                { label: 'Memori', value: `${system.memoryMb} MB` },
                { label: 'Storage', value: String(system.storage) },
              ].map((metric) => (
                <div key={metric.label} className="rounded-xl border border-white/15 bg-white/[0.07] px-3 py-2">
                  <p className="text-[9px] uppercase tracking-wider text-blue-100/55">{metric.label}</p>
                  <p className="mt-0.5 text-sm font-bold">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary-strong dark:text-primary">
                <CloudDownload className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-text">Sinkronisasi SIBI</h3>
                <p className="text-[10px] text-muted">{sync?.source}</p>
              </div>
            </div>
            <Badge tone={sync?.status === 'sinkron' ? 'success' : 'warning'} dot>
              {sync?.status || 'menunggu'}
            </Badge>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="rounded-xl bg-surface-2 p-3">
              <p className="text-[10px] text-muted">Buku tersinkron</p>
              <p className="mt-0.5 text-xl font-extrabold tabular-nums text-text">{sync?.booksCount ?? 0}</p>
            </div>
            <div className="rounded-xl bg-surface-2 p-3">
              <p className="text-[10px] text-muted">Konflik</p>
              <p className="mt-0.5 text-xl font-extrabold tabular-nums text-success">{sync?.conflicts ?? 0}</p>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[10px] text-muted">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
            Terakhir: {relativeDate(sync?.lastSyncedAt)} · {formatDateTime(sync?.lastSyncedAt)}
          </p>
          <Button className="mt-3 w-full" size="sm" onClick={handleSync} loading={syncing}>
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Sinkronkan sekarang
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Total pengguna" value={summary.totalUsers} hint={`${summary.activeUsers} aktif`} icon={Users} tone="primary" />
        <StatCard label="Buku SIBI" value={summary.totalBooks} hint="Katalog tersinkron" icon={BookOpen} tone="accent" />
        <StatCard label="Kelas & rombel" value={summary.totalClasses} hint="Tahun ajaran 2025/2026" icon={School} tone="success" />
        <StatCard label="Sesi live" value={summary.liveNow} hint="Sedang berlangsung" icon={Video} tone="info" />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Card className="p-5 sm:p-6">
            <SectionHeader
              title="Pertumbuhan pengguna"
              subtitle="Enam bulan terakhir"
              action={<Badge tone="primary">+{Math.round((growth[growth.length - 1]?.students / growth[0]?.students - 1) * 100) || 0}% siswa</Badge>}
            />
            <AreaChart
              data={growth.map((g) => ({ label: g.label, value: g.students, secondary: g.parents }))}
              primaryLabel="Siswa"
              secondaryLabel="Orang tua"
              height={240}
              color="#1E88E5"
              secondaryColor="#FF9800"
            />
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-info-soft text-info">
                  <Activity className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-text">Aktivitas terbaru</h3>
                  <p className="text-[11px] text-muted">Audit log sistem</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => navigate('/admin/log')}>
                Semua log
              </Button>
            </div>
            <ul className="divide-y divide-border">
              {logs.map((log) => (
                <li key={log.id} className="flex items-center gap-3 px-5 py-3">
                  <Avatar name={log.actor} size="xs" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-semibold text-text">
                      {log.actor} <span className="font-normal text-muted">{log.action.toLowerCase()}</span>
                    </p>
                    <p className="truncate text-[10px] text-muted">{log.target}</p>
                  </div>
                  <Badge tone={roleTone[log.role] || 'neutral'}>{log.role}</Badge>
                  <span className="hidden shrink-0 text-[10px] text-muted sm:block">{relativeDate(log.at)}</span>
                </li>
              ))}
            </ul>
          </Card>

          <div>
            <SectionHeader
              title="Rombongan belajar"
              subtitle="Ringkasan kelas aktif"
              action={<Button size="sm" variant="secondary" onClick={() => navigate('/admin/kelas')}>Kelola kelas</Button>}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {classes.map((cls) => (
                <Card key={cls.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-text">{cls.name}</h3>
                      <p className="mt-0.5 text-[10px] text-muted">Wali: {cls.homeroomName}</p>
                    </div>
                    <Badge tone="primary">{cls.room}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="flex items-center gap-1.5 text-[10px] text-muted">
                      <Users className="h-3.5 w-3.5" aria-hidden="true" />
                      {cls.studentCount ?? cls.studentIds.length} siswa
                    </span>
                    <span className="text-[10px] text-muted">Rata-rata</span>
                    <span className="text-xs font-extrabold tabular-nums text-text">{cls.average || '—'}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="text-sm font-bold text-text">Komposisi peran</h3>
            <p className="mt-0.5 text-[11px] text-muted">Distribusi akun terdaftar</p>
            <div className="mt-4">
              <DonutChart data={roles} size={150} centerValue={summary.totalUsers} centerLabel="akun" />
            </div>
            <button
              type="button"
              onClick={() => navigate('/admin/pengguna')}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-[11px] font-semibold text-primary-strong transition hover:bg-surface-2 dark:text-primary"
            >
              Kelola akun <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </button>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text">Menunggu verifikasi</h3>
              <Badge tone={pending.length ? 'warning' : 'success'}>{pending.length}</Badge>
            </div>
            {pending.length === 0 ? (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-success-soft px-3 py-2.5 text-[11px] font-medium text-success">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Semua akun sudah terverifikasi.
              </div>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {pending.map((teacher) => (
                  <li key={teacher.id} className="flex items-center gap-2.5 rounded-xl border border-border p-2.5">
                    <Avatar name={teacher.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-text">{teacher.name}</p>
                      <p className="truncate text-[9px] text-muted">{teacher.title}</p>
                    </div>
                    <Button size="sm" onClick={() => approve(teacher)} loading={approving === teacher.id}>
                      Aktifkan
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-text">
              <Server className="h-4 w-4 text-primary" aria-hidden="true" />
              Kesehatan sistem
            </h3>
            <ul className="mt-3 space-y-3">
              {[
                { label: 'API gateway', value: 'Operasional', icon: Gauge, tone: 'text-success' },
                { label: 'Realtime socket', value: 'Terhubung', icon: Layers, tone: 'text-success' },
                { label: 'Database', value: 'PostgreSQL · sehat', icon: Database, tone: 'text-success' },
                { label: 'Penyimpanan', value: String(system.storage), icon: Server, tone: 'text-warning' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label} className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2 text-muted">
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="flex-1 text-[11px] text-muted">{item.label}</span>
                    <span className={`text-[10px] font-semibold ${item.tone}`}>{item.value}</span>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
