import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clock,
  Copy,
  Hand,
  MonitorPlay,
  PenLine,
  PlayCircle,
  Plus,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  Wifi,
} from 'lucide-react';
import { api } from '../../lib/api';
import { formatDateShort, formatDateTime, formatTime, relativeDate } from '../../lib/format';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import type { Book, ClassRoom, LiveSession } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Field';
import { EmptyState, PageLoader, SectionHeader, StatCard } from '../../components/ui/Misc';
import { Modal } from '../../components/ui/Modal';
import { SigemasMascot } from '../../components/SigemasMascot';

type Mode = 'now' | 'schedule';

const defaultScheduleValue = () => {
  const date = new Date(Date.now() + 86400000);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T09:00`;
};

export function TeacherLivePage() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('now');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [classId, setClassId] = useState('');
  const [bookId, setBookId] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('90');
  const [scheduledAt, setScheduledAt] = useState(defaultScheduleValue());

  const loadSessions = () => {
    return api<LiveSession[]>('/api/live-sessions')
      .then((data) => {
        setSessions(data);
        setError('');
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Gagal memuat kelas live.'));
  };

  useEffect(() => {
    let active = true;
    Promise.all([api<LiveSession[]>('/api/live-sessions'), api<ClassRoom[]>('/api/classes'), api<Book[]>('/api/books')])
      .then(([sessionRows, classRows, bookRows]) => {
        if (!active) return;
        const classBooks = bookRows.filter((book) => book.audience !== 'teacher');
        setSessions(sessionRows);
        setClasses(classRows);
        setBooks(classBooks);
        setClassId(classRows[0]?.id || '');
        setBookId(classBooks[0]?.id || '');
        setChapterId(classBooks[0]?.chapters[0]?.id || '');
        setError('');
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Gagal memuat data studio.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const selectedBook = useMemo(() => books.find((book) => book.id === bookId), [books, bookId]);
  const live = sessions.filter((session) => session.status === 'live');
  const scheduled = sessions
    .filter((session) => session.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const ended = sessions.filter((session) => session.status === 'ended');
  const totalStudents = classes.reduce((sum, item) => sum + item.studentCount, 0);
  const active = live[0];

  const openModal = (nextMode: Mode = 'now') => {
    setMode(nextMode);
    setFormError('');
    setTitle('');
    setDuration('90');
    setScheduledAt(defaultScheduleValue());
    if (!classId && classes[0]) setClassId(classes[0].id);
    if (!bookId && books[0]) {
      setBookId(books[0].id);
      setChapterId(books[0].chapters[0]?.id || '');
    }
    setOpen(true);
  };

  const buildTitle = () => {
    const chapter = selectedBook?.chapters.find((item) => item.id === chapterId);
    return `${selectedBook?.subject || 'Pembelajaran'} · ${chapter ? `Bab ${chapter.number}: ${chapter.title}` : 'Sesi diskusi'}`;
  };

  const startClass = async () => {
    if (!classId) {
      setFormError('Pilih kelas terlebih dahulu.');
      return;
    }
    if (!selectedBook) {
      setFormError('Pilih buku SIBI yang akan dibahas.');
      return;
    }
    if (mode === 'schedule' && !scheduledAt) {
      setFormError('Tentukan tanggal dan waktu kelas.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const created = await api<LiveSession>('/api/live-sessions', {
        method: 'POST',
        body: {
          classId,
          bookId,
          chapterId,
          title: title.trim() || buildTitle(),
          durationMin: Number(duration) || 90,
          startNow: mode === 'now',
          scheduledAt: mode === 'schedule' ? new Date(scheduledAt).toISOString() : undefined,
        },
      });
      if (mode === 'now') {
        toast.success('Kelas live dimulai', 'Studio live siap digunakan.');
        navigate(`/live/${created.id}`);
      } else {
        toast.success('Kelas dijadwalkan', formatDateTime(created.scheduledAt));
        setOpen(false);
        await loadSessions();
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Gagal membuat kelas live.');
    } finally {
      setSaving(false);
    }
  };

  const copyLink = async (sessionId: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/live/${sessionId}`);
      toast.success('Tautan disalin', 'Bagikan tautan kelas kepada siswa bila perlu.');
    } catch {
      toast.error('Gagal menyalin tautan', 'Salin URL dari bilah alamat browser.');
    }
  };

  if (loading) return <PageLoader label="Menyiapkan studio live…" />;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="relative overflow-hidden bg-[linear-gradient(122deg,#0A335C,#12579A_58%,#1E88E5)] px-5 py-6 text-white sm:px-7 sm:py-7">
          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_190px]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="accent" className="border-white/10 bg-accent text-[#2b1a00]">
                  <Sparkles className="h-3 w-3" aria-hidden="true" /> Studio pengajar
                </Badge>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/80">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Presensi otomatis
                </span>
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">Mulai kelas yang hidup</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
                Buka papan tulis pribadi, jalankan polling, dan kelola peserta dalam satu ruang. Kehadiran siswa tercatat saat mereka bergabung.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="accent" size="lg" onClick={() => openModal('now')}>
                  <Video className="h-4 w-4" aria-hidden="true" /> Mulai kelas sekarang
                </Button>
                <Button variant="outline" size="lg" className="border-white/25 bg-white/10 text-white hover:bg-white/20" onClick={() => openModal('schedule')}>
                  <CalendarClock className="h-4 w-4" aria-hidden="true" /> Jadwalkan kelas
                </Button>
              </div>
              <div className="mt-5 flex flex-wrap gap-4 text-[10px] font-semibold text-white/70">
                <span className="inline-flex items-center gap-1.5"><PenLine className="h-3.5 w-3.5" aria-hidden="true" /> Papan tulis pribadi</span>
                <span className="inline-flex items-center gap-1.5"><BarChart3 className="h-3.5 w-3.5" aria-hidden="true" /> Polling instan</span>
                <span className="inline-flex items-center gap-1.5"><Hand className="h-3.5 w-3.5" aria-hidden="true" /> Antrean tangan</span>
              </div>
            </div>
            <div className="hidden items-center justify-center lg:flex">
              <SigemasMascot className="h-36 w-36 drop-shadow-2xl" wave />
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <div className="rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{error}</div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Kelas aktif" value={live.length} icon={Radio} tone="danger" hint={live.length ? 'Studio siap dipakai' : 'Belum ada sesi live'} />
        <StatCard label="Sesi terjadwal" value={scheduled.length} icon={CalendarClock} tone="primary" hint="Menunggu waktu mulai" />
        <StatCard label="Siswa terjangkau" value={totalStudents} icon={Users} tone="success" hint={`${classes.length} kelas diampu`} />
        <StatCard label="Sesi selesai" value={ended.length} icon={CheckCircle2} tone="info" hint="Riwayat kelas live" />
      </div>

      {active && (
        <Card className="overflow-hidden border-danger/25">
          <div className="h-1 w-full bg-danger" aria-hidden="true" />
          <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="danger" dot>Sedang live</Badge>
                <span className="text-[10px] font-semibold text-muted">
                  {formatTime(active.startedAt)} · {active.participants} peserta
                </span>
              </div>
              <h2 className="mt-1.5 truncate text-lg font-extrabold tracking-tight text-text">{active.title}</h2>
              <p className="mt-1 truncate text-xs text-muted">{active.className} · {active.bookTitle} · {active.chapter}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] font-semibold text-success">
                <span className="inline-flex items-center gap-1"><Wifi className="h-3 w-3" aria-hidden="true" /> Realtime tersambung</span>
                <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3" aria-hidden="true" /> Presensi berjalan</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => copyLink(active.id)}>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" /> Salin tautan
              </Button>
              <Link to={`/live/${active.id}`}>
                <Button variant="danger" size="sm">
                  <MonitorPlay className="h-4 w-4" aria-hidden="true" /> Masuk studio
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      <section>
        <SectionHeader
          title="Sesi kelas live"
          subtitle="Kelola kelas aktif, terjadwal, dan riwayat mengajar."
          action={
            <Button size="sm" variant="outline" onClick={() => openModal('now')}>
              <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Sesi baru
            </Button>
          }
        />
        <div className="space-y-3">
          {live.length === 0 && scheduled.length === 0 && (
            <Card>
              <EmptyState
                icon={Radio}
                title="Belum ada sesi aktif atau terjadwal"
                description="Mulai kelas sekarang untuk membuka papan tulis pribadi, polling, dan presensi otomatis bersama siswa."
                action={<Button onClick={() => openModal('now')}>Mulai kelas sekarang</Button>}
              />
            </Card>
          )}

          {scheduled.map((session) => (
            <Card key={session.id} className="flex flex-wrap items-center gap-3 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-strong dark:text-primary">
                <CalendarClock className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-bold text-text">{session.title}</p>
                  <Badge tone="primary" className="px-2 py-0.5 text-[9px]">Terjadwal</Badge>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-muted">
                  {formatDateTime(session.scheduledAt)} · {session.className} · {session.bookTitle}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-accent-strong dark:text-accent">{relativeDate(session.scheduledAt)}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Button size="sm" variant="ghost" onClick={() => copyLink(session.id)} aria-label="Salin tautan kelas">
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
                <Link to={`/live/${session.id}`}>
                  <Button size="sm" variant="outline">
                    Buka <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}

          {ended.length > 0 && (
            <Card className="overflow-hidden">
              <div className="border-b border-border px-4 py-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Riwayat sesi</p>
              </div>
              <div className="divide-y divide-border">
                {ended.slice(0, 8).map((session) => (
                  <div key={session.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-muted">
                      <PlayCircle className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-text">{session.title}</p>
                      <p className="truncate text-[10px] text-muted">
                        {formatDateShort(session.endedAt || session.scheduledAt)} · {formatTime(session.startedAt)} · {session.className} · {session.participants} peserta
                      </p>
                    </div>
                    <Link to={`/live/${session.id}`} className="text-[11px] font-bold text-primary hover:underline">
                      Ringkasan
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-success-soft text-success">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-text">Presensi otomatis</h3>
              <p className="text-[10px] text-muted">Tercatat saat siswa masuk dan keluar kelas</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Setiap siswa yang bergabung akan tercatat beserta durasi kehadirannya. Buka halaman presensi untuk meninjau rekap dan mengekspor data.
          </p>
          <Link to="/guru/presensi" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline">
            Buka rekap presensi <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-soft text-accent-strong">
              <Clock className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-text">Sebelum memulai</h3>
              <p className="text-[10px] text-muted">Persiapan singkat agar kelas lancar</p>
            </div>
          </div>
          <ul className="mt-3 space-y-1.5 text-[11px] text-muted">
            <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" /> Pastikan materi dan bab SIBI sudah dipilih</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" /> Uji kamera, mikrofon, dan berbagi layar</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" /> Siapkan satu pertanyaan polling pembuka</li>
          </ul>
        </Card>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={mode === 'now' ? 'Mulai kelas live' : 'Jadwalkan kelas live'}
        description="Pilih kelas dan bab SIBI. Judul dapat disesuaikan dengan topik pertemuan."
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button variant={mode === 'now' ? 'primary' : 'accent'} loading={saving} onClick={startClass}>
              {mode === 'now' ? <Video className="h-4 w-4" aria-hidden="true" /> : <CalendarClock className="h-4 w-4" aria-hidden="true" />}
              {mode === 'now' ? 'Mulai sekarang' : 'Simpan jadwal'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface-2 p-1">
            {(['now', 'schedule'] as Mode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={
                  mode === item
                    ? 'rounded-lg bg-surface px-3 py-2 text-xs font-bold text-primary-strong shadow-sm dark:text-primary'
                    : 'rounded-lg px-3 py-2 text-xs font-semibold text-muted transition hover:text-text'
                }
                aria-pressed={mode === item}
              >
                {item === 'now' ? 'Mulai sekarang' : 'Jadwalkan'}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Select label="Kelas" value={classId} onChange={(event) => setClassId(event.target.value)} required>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>{item.name} · {item.room}</option>
              ))}
            </Select>
            <Select
              label="Buku SIBI"
              value={bookId}
              onChange={(event) => {
                const nextBook = books.find((book) => book.id === event.target.value);
                setBookId(event.target.value);
                setChapterId(nextBook?.chapters[0]?.id || '');
                setTitle('');
              }}
              required
            >
              {books.map((book) => (
                <option key={book.id} value={book.id}>{book.subject} · Kelas {book.grade}</option>
              ))}
            </Select>
          </div>

          <Select
            label="Bab / materi"
            value={chapterId}
            onChange={(event) => {
              setChapterId(event.target.value);
              setTitle('');
            }}
            hint={selectedBook ? `${selectedBook.chapters.length} bab tersedia dari ${selectedBook.title}` : undefined}
            required
          >
            {selectedBook?.chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>Bab {chapter.number}: {chapter.title}</option>
            ))}
          </Select>

          <Input
            label="Judul sesi"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={buildTitle()}
            hint="Kosongkan untuk memakai judul otomatis."
            maxLength={120}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Durasi (menit)"
              type="number"
              min={15}
              max={240}
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
            />
            {mode === 'schedule' ? (
              <Input
                label="Tanggal & waktu"
                type="datetime-local"
                value={scheduledAt}
                onChange={(event) => setScheduledAt(event.target.value)}
                required
              />
            ) : (
              <div className="flex items-end">
                <div className="flex w-full items-center gap-2 rounded-xl border border-success/20 bg-success-soft px-3 py-2.5 text-[11px] font-semibold text-success">
                  <Radio className="h-4 w-4" aria-hidden="true" /> Studio langsung terbuka
                </div>
              </div>
            )}
          </div>

          {formError && <p className="rounded-lg bg-danger-soft px-3 py-2 text-xs font-semibold text-danger">{formError}</p>}

          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-surface-2 px-3 py-2.5 text-[10px] text-muted">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{selectedBook?.title || 'Pilih buku'} · {user?.classIds?.length || classes.length} kelas terhubung</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
