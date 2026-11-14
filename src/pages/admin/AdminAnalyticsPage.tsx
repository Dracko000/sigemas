import { useEffect, useState } from 'react';
import {
  Activity,
  BookOpen,
  BrainCircuit,
  Download,
  Gauge,
  HardDrive,
  Server,
  Users,
  Video,
} from 'lucide-react';
import { api } from '../../lib/api';
import { downloadCsv } from '../../lib/format';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, PageLoader, SectionHeader, StatCard } from '../../components/ui/Misc';
import { AreaChart, BarChart, DonutChart } from '../../components/charts/Charts';

interface AnalyticsData {
  userGrowth: { label: string; students: number; teachers: number; parents: number }[];
  roleDistribution: { label: string; value: number; color: string }[];
  topBooks: { label: string; value: number; title: string }[];
  engagement: { label: string; score: number; classAvg: number }[];
  liveStats: { totalSessions: number; liveNow: number; avgParticipants: number; quizAttempts: number };
  system: { uptimeHours: number; memoryMb: number; latencyMs: number; storage: string };
}

export function AdminAnalyticsPage() {
  const toast = useToast();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api<AnalyticsData>('/api/analytics')
      .then((payload) => {
        if (active) {
          setData(payload);
          setError('');
        }
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Gagal memuat analitik.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <PageLoader label="Menghitung analitik…" />;

  if (error || !data) {
    return (
      <Card>
        <EmptyState
          icon={Activity}
          title="Analitik tidak tersedia"
          description={error || 'Terjadi kendala saat memuat data analitik.'}
          action={<Button onClick={() => window.location.reload()}>Muat ulang</Button>}
        />
      </Card>
    );
  }

  const totalUsers = data.roleDistribution.reduce((sum, item) => sum + item.value, 0);
  const growth = data.userGrowth.map((point) => ({
    label: point.label,
    value: point.students,
    secondary: point.teachers,
  }));
  const engagement = data.engagement.map((point) => ({ label: point.label, value: point.score, secondary: point.classAvg }));

  const exportAnalytics = () => {
    downloadCsv('analitik-sigemas.csv', [
      ['Metrik', 'Nilai'],
      ['Total pengguna', totalUsers],
      ['Sesi live', data.liveStats.totalSessions],
      ['Live sekarang', data.liveStats.liveNow],
      ['Rata-rata peserta', data.liveStats.avgParticipants],
      ['Percobaan kuis', data.liveStats.quizAttempts],
      [],
      ['Bulan', 'Siswa', 'Guru', 'Orang tua'],
      ...data.userGrowth.map((point) => [point.label, point.students, point.teachers, point.parents]),
      [],
      ['Mata pelajaran', 'Judul', 'Unduhan'],
      ...data.topBooks.map((book) => [book.label, book.title, book.value]),
    ]);
    toast.success('Analitik diekspor', 'Ringkasan tersimpan sebagai CSV.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-text sm:text-2xl">Analitik Sistem</h1>
          <p className="mt-0.5 text-sm text-muted">Gambaran penggunaan platform dan kesehatan layanan.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="success" dot>Data langsung</Badge>
          <Button variant="outline" onClick={exportAnalytics}>
            <Download className="h-4 w-4" aria-hidden="true" /> Ekspor
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total pengguna" value={totalUsers} icon={Users} tone="primary" hint="Semua peran aktif" />
        <StatCard label="Kelas live" value={data.liveStats.totalSessions} icon={Video} tone="accent" hint={`${data.liveStats.liveNow} sedang berlangsung`} />
        <StatCard label="Percobaan kuis" value={data.liveStats.quizAttempts} icon={BrainCircuit} tone="success" hint={`Rata-rata ${data.liveStats.avgParticipants} peserta live`} />
        <StatCard label="Latensi API" value={`${data.system.latencyMs} ms`} icon={Gauge} tone="info" hint={`Uptime ${data.system.uptimeHours} jam`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <SectionHeader
            title="Pertumbuhan pengguna"
            subtitle="Siswa dan guru yang bergabung"
            action={
              <div className="flex items-center gap-3 text-[10px] font-semibold text-muted">
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" /> Siswa</span>
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" /> Guru</span>
              </div>
            }
          />
          <AreaChart data={growth} primaryLabel="Siswa" secondaryLabel="Guru" height={240} />
        </Card>

        <Card className="p-5">
          <SectionHeader title="Komposisi peran" subtitle="Distribusi akun" />
          <div className="flex flex-col items-center gap-4">
            <DonutChart data={data.roleDistribution} size={170} centerValue={totalUsers} centerLabel="Pengguna" />
            <div className="grid w-full grid-cols-2 gap-1.5">
              {data.roleDistribution.map((role) => (
                <div key={role.label} className="flex items-center gap-2 rounded-lg bg-surface-2 px-2.5 py-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: role.color }} aria-hidden="true" />
                  <span className="flex-1 text-[10px] text-muted">{role.label}</span>
                  <span className="text-[10px] font-bold tabular-nums text-text">{role.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeader title="Keterlibatan belajar" subtitle="Nilai anak vs rata-rata kelas" />
          <AreaChart data={engagement} primaryLabel="Nilai" secondaryLabel="Rata-rata kelas" height={220} />
        </Card>

        <Card className="p-5">
          <SectionHeader title="Buku paling diunduh" subtitle="Lima besar katalog SIBI" action={<BookOpen className="h-4 w-4 text-muted" aria-hidden="true" />} />
          <BarChart
            data={data.topBooks.map((book) => ({ label: book.label, value: book.value }))}
            height={220}
            suffix=" unduhan"
          />
          <div className="mt-2 space-y-1">
            {data.topBooks.map((book, index) => (
              <div key={book.title} className="flex items-center gap-2 text-[9px]">
                <span className="grid h-4 w-4 place-items-center rounded bg-surface-2 font-bold text-muted">{index + 1}</span>
                <span className="min-w-0 flex-1 truncate text-muted">{book.title}</span>
                <span className="font-bold tabular-nums text-text">{book.value.toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-bold text-text">Kesehatan sistem</h2>
          <p className="text-[10px] text-muted">Pemantauan runtime SiGEMAS</p>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: Server, label: 'Uptime server', value: `${data.system.uptimeHours} jam`, tone: 'text-success' },
            { icon: HardDrive, label: 'Penggunaan memori', value: `${data.system.memoryMb} MB`, tone: 'text-primary' },
            { icon: Gauge, label: 'Latensi rata-rata', value: `${data.system.latencyMs} ms`, tone: 'text-accent-strong' },
            { icon: Activity, label: 'Penyimpanan', value: data.system.storage, tone: 'text-info' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 rounded-xl bg-surface-2 p-3">
                <span className={`grid h-9 w-9 place-items-center rounded-lg bg-surface ${item.tone} shadow-sm`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-text">{item.value}</p>
                  <p className="text-[9px] text-muted">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="flex flex-wrap items-center gap-3 border-primary/20 bg-primary-soft/30 p-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-primary shadow-sm">
          <Activity className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-text">Catatan analitik</p>
          <p className="text-[11px] leading-relaxed text-muted">
            Data dihitung dari aktivitas runtime sejak server dimulai. Untuk pelaporan jangka panjang, hubungkan ke penyimpanan PostgreSQL dan metrik harian.
          </p>
        </div>
      </Card>
    </div>
  );
}
