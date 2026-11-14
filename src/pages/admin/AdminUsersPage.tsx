import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  Download,
  GraduationCap,
  Plus,
  Search,
  ShieldCheck,
  UserCog,
  UserPlus,
  Users,
} from 'lucide-react';
import { api } from '../../lib/api';
import { downloadCsv, formatDate, roleLabel } from '../../lib/format';
import { useToast } from '../../context/ToastContext';
import type { ClassRoom, Role, User } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Field';
import { Modal } from '../../components/ui/Modal';
import { EmptyState, PageLoader, StatCard } from '../../components/ui/Misc';
import { Tabs } from '../../components/ui/Tabs';

interface UsersPayload {
  users: User[];
  stats: { total: number; aktif: number; guru: number; siswa: number; ortu: number };
}

const roleTone = (role: Role) => {
  if (role === 'teacher') return 'accent' as const;
  if (role === 'student') return 'primary' as const;
  if (role === 'parent') return 'success' as const;
  return 'info' as const;
};

export function AdminUsersPage() {
  const toast = useToast();
  const [payload, setPayload] = useState<UsersPayload | null>(null);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'student',
    password: 'demo1234',
    title: '',
    classId: '',
    childId: '',
  });

  const load = () => {
    setLoading(true);
    Promise.all([api<UsersPayload>('/api/users'), api<ClassRoom[]>('/api/classes')])
      .then(([users, classRows]) => {
        setPayload(users);
        setClasses(classRows);
        setError('');
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Gagal memuat pengguna.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const students = useMemo(() => payload?.users.filter((user) => user.role === 'student') ?? [], [payload]);

  const filtered = useMemo(() => {
    if (!payload) return [];
    const term = query.trim().toLowerCase();
    return payload.users.filter((user) => {
      if (roleFilter !== 'all' && user.role !== roleFilter) return false;
      if (statusFilter !== 'all' && user.status !== statusFilter) return false;
      if (!term) return true;
      return (
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.className || '').toLowerCase().includes(term)
      );
    });
  }, [payload, query, roleFilter, statusFilter]);

  const openCreate = () => {
    setForm({ name: '', email: '', role: 'student', password: 'demo1234', title: '', classId: classes[0]?.id || '', childId: '' });
    setFormError('');
    setOpen(true);
  };

  const createUser = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Nama dan email wajib diisi.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      await api('/api/users', {
        method: 'POST',
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          password: form.password || 'demo1234',
          title: form.title.trim() || undefined,
          classId: form.role === 'student' ? form.classId || undefined : undefined,
          childIds: form.role === 'parent' && form.childId ? [form.childId] : undefined,
          subject: form.role === 'teacher' ? form.title.trim() || 'Pengajar' : undefined,
        },
      });
      toast.success('Akun dibuat', `${form.name} dapat masuk dengan kata sandi awal.`);
      setOpen(false);
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Gagal membuat akun.');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (user: User) => {
    const nextStatus = user.status === 'aktif' ? 'nonaktif' : 'aktif';
    try {
      await api(`/api/users/${user.id}`, { method: 'PATCH', body: { status: nextStatus } });
      toast.success(nextStatus === 'aktif' ? 'Akun diaktifkan' : 'Akun dinonaktifkan', user.name);
      setPayload((current) =>
        current
          ? {
              ...current,
              users: current.users.map((row) => (row.id === user.id ? { ...row, status: nextStatus } : row)),
              stats: {
                ...current.stats,
                aktif: current.stats.aktif + (nextStatus === 'aktif' ? 1 : -1),
              },
            }
          : current
      );
    } catch (err) {
      toast.error('Gagal memperbarui akun', err instanceof Error ? err.message : undefined);
    }
  };

  const exportUsers = () => {
    if (!payload) return;
    downloadCsv('pengguna-sigemas.csv', [
      ['Nama', 'Email', 'Peran', 'Status', 'Kelas', 'Bergabung'],
      ...payload.users.map((user) => [user.name, user.email, roleLabel[user.role], user.status, user.className || '-', user.joinedAt || '-']),
    ]);
    toast.success('Data diekspor', 'Daftar pengguna tersimpan sebagai CSV.');
  };

  if (loading && !payload) return <PageLoader label="Memuat pengguna…" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-text sm:text-2xl">Manajemen Akun</h1>
          <p className="mt-0.5 text-sm text-muted">Kelola akses siswa, guru, orang tua, dan administrator.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportUsers}>
            <Download className="h-4 w-4" aria-hidden="true" /> Ekspor
          </Button>
          <Button onClick={openCreate}>
            <UserPlus className="h-4 w-4" aria-hidden="true" /> Tambah akun
          </Button>
        </div>
      </div>

      {error && <div className="rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{error}</div>}

      {payload && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total akun" value={payload.stats.total} icon={Users} tone="primary" hint={`${payload.stats.aktif} aktif`} />
            <StatCard label="Siswa" value={payload.stats.siswa} icon={GraduationCap} tone="info" hint="Terdaftar di rombel" />
            <StatCard label="Guru" value={payload.stats.guru} icon={UserCog} tone="accent" hint="Pengajar aktif" />
            <StatCard label="Orang tua" value={payload.stats.ortu} icon={ShieldCheck} tone="success" hint="Akun pendamping" />
          </div>

          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
              <Tabs
                items={[
                  { id: 'all', label: 'Semua', count: payload.users.length },
                  { id: 'student', label: 'Siswa', count: payload.stats.siswa },
                  { id: 'teacher', label: 'Guru', count: payload.stats.guru },
                  { id: 'parent', label: 'Orang tua', count: payload.stats.ortu },
                ]}
                value={roleFilter}
                onChange={setRoleFilter}
              />
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Cari akun…"
                    className="h-9 w-44 rounded-lg border border-border bg-surface pl-8 pr-2 text-[11px] text-text outline-none focus:border-primary"
                    aria-label="Cari pengguna"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-9 rounded-lg border border-border bg-surface px-2 text-[11px] font-semibold text-text outline-none focus:border-primary"
                  aria-label="Filter status akun"
                >
                  <option value="all">Semua status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <EmptyState icon={Users} title="Tidak ada akun" description="Ubah filter pencarian atau tambahkan akun baru." action={<Button size="sm" onClick={openCreate}>Tambah akun</Button>} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left text-xs">
                  <thead className="bg-surface-2 text-[10px] uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-4 py-2.5 font-bold">Pengguna</th>
                      <th className="px-3 py-2.5 font-bold">Peran</th>
                      <th className="px-3 py-2.5 font-bold">Kelas / Anak</th>
                      <th className="px-3 py-2.5 font-bold">Status</th>
                      <th className="px-3 py-2.5 font-bold">Aktivitas</th>
                      <th className="px-4 py-2.5 text-right font-bold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((user) => (
                      <tr key={user.id} className="transition hover:bg-surface-2/50">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={user.name} size="sm" />
                            <div className="min-w-0">
                              <p className="truncate text-[11px] font-semibold text-text">{user.name}</p>
                              <p className="truncate text-[9px] text-muted">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge tone={roleTone(user.role)} className="px-2 py-0.5 text-[9px]">{roleLabel[user.role]}</Badge>
                        </td>
                        <td className="px-3 py-2.5 text-[10px] text-muted">
                          {user.role === 'student' && (user.className || '—')}
                          {user.role === 'parent' && (user.childNames?.join(', ') || '—')}
                          {user.role === 'teacher' && (user.subject || user.title || '—')}
                          {user.role === 'admin' && 'Administrator'}
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge tone={user.status === 'aktif' ? 'success' : 'neutral'} dot className="px-2 py-0.5 text-[9px]">{user.status}</Badge>
                        </td>
                        <td className="px-3 py-2.5 text-[10px] text-muted">{user.lastActive || (user.joinedAt ? formatDate(user.joinedAt) : '—')}</td>
                        <td className="px-4 py-2.5 text-right">
                          <Button
                            size="sm"
                            variant={user.status === 'aktif' ? 'ghost' : 'outline'}
                            className="h-7 px-2 text-[10px]"
                            onClick={() => toggleStatus(user)}
                          >
                            {user.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2.5 text-[10px] text-muted">
              <span>{filtered.length} dari {payload.users.length} akun ditampilkan</span>
              <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" aria-hidden="true" /> Perubahan status langsung berlaku</span>
            </div>
          </Card>
        </>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Tambah akun baru"
        description="Akun dapat langsung digunakan dengan kata sandi awal. Minta pengguna menggantinya setelah masuk."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" form="user-form" loading={saving}>
              <Plus className="h-4 w-4" aria-hidden="true" /> Buat akun
            </Button>
          </>
        }
      >
        <form id="user-form" onSubmit={createUser} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Nama lengkap" value={form.name} onChange={(event) => setForm((rows) => ({ ...rows, name: event.target.value }))} required maxLength={80} />
            <Input label="Email" type="email" value={form.email} onChange={(event) => setForm((rows) => ({ ...rows, email: event.target.value }))} required placeholder="nama@sigemas.id" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Select label="Peran" value={form.role} onChange={(event) => setForm((rows) => ({ ...rows, role: event.target.value }))}>
              <option value="student">Siswa</option>
              <option value="teacher">Guru</option>
              <option value="parent">Orang tua</option>
              <option value="admin">Administrator</option>
            </Select>
            <Input label="Kata sandi awal" value={form.password} onChange={(event) => setForm((rows) => ({ ...rows, password: event.target.value }))} minLength={6} required />
          </div>
          {form.role === 'student' && (
            <Select label="Kelas" value={form.classId} onChange={(event) => setForm((rows) => ({ ...rows, classId: event.target.value }))}>
              {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </Select>
          )}
          {form.role === 'parent' && (
            <Select label="Anak" value={form.childId} onChange={(event) => setForm((rows) => ({ ...rows, childId: event.target.value }))} hint="Hubungkan akun orang tua dengan siswa.">
              <option value="">Pilih siswa…</option>
              {students.map((student) => <option key={student.id} value={student.id}>{student.name} · {student.className}</option>)}
            </Select>
          )}
          {form.role !== 'student' && (
            <Input
              label={form.role === 'teacher' ? 'Mata pelajaran' : 'Jabatan'}
              value={form.title}
              onChange={(event) => setForm((rows) => ({ ...rows, title: event.target.value }))}
              placeholder={form.role === 'teacher' ? 'Matematika' : 'Administrator SiGEMAS'}
            />
          )}
          {formError && <p className="rounded-lg bg-danger-soft px-3 py-2 text-xs font-semibold text-danger">{formError}</p>}
        </form>
      </Modal>
    </div>
  );
}
