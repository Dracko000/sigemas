import { useEffect, useMemo, useState } from 'react';
import { Activity, Download, RefreshCw, ScrollText, Search, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';
import { downloadCsv, formatDateTime, roleLabel } from '../../lib/format';
import { useToast } from '../../context/ToastContext';
import type { ActivityLog } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, PageLoader, StatCard } from '../../components/ui/Misc';
import { Tabs } from '../../components/ui/Tabs';

const roleTone = (role: string) => {
  if (role === 'admin') return 'info' as const;
  if (role === 'teacher') return 'accent' as const;
  if (role === 'student') return 'primary' as const;
  return 'success' as const;
};

export function AdminLogPage() {
  const toast = useToast();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [query, setQuery] = useState('');

  const load = () => {
    setLoading(true);
    api<ActivityLog[]>('/api/logs')
      .then((rows) => {
        setLogs(rows);
        setError('');
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Gagal memuat log.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return logs.filter((log) => {
      if (roleFilter !== 'all' && log.role !== roleFilter) return false;
      if (!term) return true;
      return `${log.actor} ${log.action} ${log.target}`.toLowerCase().includes(term);
    });
  }, [logs, roleFilter, query]);

  const exportLogs = () => {
    downloadCsv('log-aktivitas-sigemas.csv', [
      ['Waktu', 'Aktor', 'Peran', 'Aksi', 'Target', 'IP'],
      ...filtered.map((log) => [log.at, log.actor, roleLabel[log.role] || log.role, log.action, log.target, log.ip]),
    ]);
    toast.success('Log diekspor', `${filtered.length} baris tersimpan sebagai CSV.`);
  };

  if (loading && logs.length === 0) return <PageLoader label="Memuat log aktivitas…" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-text sm:text-2xl">Log Aktivitas</h1>
          <p className="mt-0.5 text-sm text-muted">Jejak audit tindakan pengguna di seluruh platform.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={load} loading={loading}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Muat ulang
          </Button>
          <Button variant="outline" onClick={exportLogs}>
            <Download className="h-4 w-4" aria-hidden="true" /> Ekspor
          </Button>
        </div>
      </div>

      {error && <div className="rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{error}</div>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total aktivitas" value={logs.length} icon={ScrollText} tone="primary" hint="Tercatat di sistem" />
        <StatCard label="Aksi guru" value={logs.filter((log) => log.role === 'teacher').length} icon={Activity} tone="accent" hint="Pengelolaan kelas" />
        <StatCard label="Aksi siswa" value={logs.filter((log) => log.role === 'student').length} icon={Activity} tone="success" hint="Aktivitas belajar" />
        <StatCard label="Aksi admin" value={logs.filter((log) => log.role === 'admin').length} icon={ShieldCheck} tone="info" hint="Administrasi sistem" />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <Tabs
            items={[
              { id: 'all', label: 'Semua', count: logs.length },
              { id: 'teacher', label: 'Guru', count: logs.filter((log) => log.role === 'teacher').length },
              { id: 'student', label: 'Siswa', count: logs.filter((log) => log.role === 'student').length },
              { id: 'admin', label: 'Admin', count: logs.filter((log) => log.role === 'admin').length },
            ]}
            value={roleFilter}
            onChange={setRoleFilter}
          />
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari aktivitas…"
              className="h-9 w-48 rounded-lg border border-border bg-surface pl-8 pr-2 text-[11px] text-text outline-none focus:border-primary"
              aria-label="Cari log aktivitas"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={ScrollText} title="Tidak ada log" description="Ubah filter peran atau kata kunci pencarian." />
        ) : (
          <div className="max-h-[640px] overflow-y-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="sticky top-0 z-10 bg-surface-2 text-[9px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-2.5 font-bold">Waktu</th>
                  <th className="px-3 py-2.5 font-bold">Aktor</th>
                  <th className="px-3 py-2.5 font-bold">Aktivitas</th>
                  <th className="px-3 py-2.5 font-bold">Target</th>
                  <th className="px-4 py-2.5 font-bold">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((log) => (
                  <tr key={log.id} className="transition hover:bg-surface-2/50">
                    <td className="whitespace-nowrap px-4 py-2.5 text-[9px] tabular-nums text-muted">{formatDateTime(log.at)}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar name={log.actor} size="xs" />
                        <div>
                          <p className="text-[10px] font-semibold text-text">{log.actor}</p>
                          <Badge tone={roleTone(log.role)} className="mt-0.5 px-1.5 py-0 text-[8px]">{roleLabel[log.role] || log.role}</Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-[10px] font-medium text-text">{log.action}</td>
                    <td className="max-w-[280px] px-3 py-2.5">
                      <p className="truncate text-[10px] text-muted" title={log.target}>{log.target}</p>
                    </td>
                    <td className="px-4 py-2.5 text-[9px] tabular-nums text-muted">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2.5 text-[10px] text-muted">
          <span>{filtered.length} dari {logs.length} aktivitas</span>
          <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-success" aria-hidden="true" /> Log audit hanya dapat dilihat administrator</span>
        </div>
      </Card>
    </div>
  );
}
