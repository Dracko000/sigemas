import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Library,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { api } from '../../lib/api';
import { formatDateTime } from '../../lib/format';
import { useToast } from '../../context/ToastContext';
import type { Book, DashboardData } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { EmptyState, PageLoader, StatCard } from '../../components/ui/Misc';
import { Tabs } from '../../components/ui/Tabs';
import { BookCover } from '../../components/books/BookCover';

export function AdminCatalogPage() {
  const toast = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [sync, setSync] = useState<DashboardData['sync'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [subject, setSubject] = useState('all');
  const [level, setLevel] = useState('all');
  const [selected, setSelected] = useState<Book | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([api<Book[]>('/api/books'), api<DashboardData>('/api/dashboard')])
      .then(([bookRows, dashboard]) => {
        setBooks(bookRows);
        setSync(dashboard.sync ?? null);
        setError('');
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Gagal memuat katalog.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const subjects = useMemo(() => [...new Set(books.map((book) => book.subject))], [books]);
  const levels = useMemo(() => [...new Set(books.map((book) => book.level || 'SMA/MA'))], [books]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return books.filter((book) => {
      if (filter !== 'all' && book.status !== filter) return false;
      if (subject !== 'all' && book.subject !== subject) return false;
      if (level !== 'all' && (book.level || 'SMA/MA') !== level) return false;
      if (!term) return true;
      return (
        book.title.toLowerCase().includes(term) ||
        book.subject.toLowerCase().includes(term) ||
        book.authors.join(' ').toLowerCase().includes(term)
      );
    });
  }, [books, query, filter, subject, level]);

  const syncCatalog = async () => {
    setSyncing(true);
    try {
      const result = await api<{ sync: NonNullable<DashboardData['sync']>; books: number }>('/api/catalog/sync', { method: 'POST' });
      setSync(result.sync);
      toast.success('Katalog tersinkron', `${result.books} buku SIBI diperbarui.`);
      load();
    } catch (err) {
      toast.error('Sinkronisasi gagal', err instanceof Error ? err.message : undefined);
    } finally {
      setSyncing(false);
    }
  };

  const openDetail = async (book: Book) => {
    setSelected(book);
    setDetailLoading(true);
    try {
      const detail = await api<Book>(`/api/books/${book.id}`);
      setSelected(detail);
    } catch (err) {
      toast.error('Gagal memuat detail buku', err instanceof Error ? err.message : undefined);
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading && books.length === 0) return <PageLoader label="Memuat katalog SIBI…" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-text sm:text-2xl">Katalog SIBI</h1>
          <p className="mt-0.5 text-sm text-muted">Kelola ketersediaan dan sinkronisasi buku digital.</p>
        </div>
        <Button loading={syncing} onClick={syncCatalog}>
          <RefreshCw className={syncing ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} aria-hidden="true" /> Sinkronkan katalog
        </Button>
      </div>

      {error && <div className="rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{error}</div>}

      <Card className="overflow-hidden">
        <div className="relative overflow-hidden bg-[linear-gradient(122deg,#0A335C,#12579A_58%,#1E88E5)] px-5 py-5 text-white sm:px-7">
          <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-wrap items-center gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <Library className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">Integrasi perbukuan</p>
              <h2 className="text-lg font-extrabold tracking-tight">{books.length} buku digital SIBI</h2>
              <p className="mt-0.5 text-[11px] text-white/65">
                {sync ? `Sinkron terakhir ${formatDateTime(sync.lastSyncedAt)} · ${sync.source}` : 'Katalog siap disinkronkan dengan pusat perbukuan.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> {sync?.conflicts ?? 0} konflik
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Lisensi terverifikasi
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total buku" value={books.length} icon={BookOpen} tone="primary" hint={`${subjects.length} mata pelajaran`} />
        <StatCard label="Tersinkron" value={books.filter((book) => book.status === 'synced').length} icon={CheckCircle2} tone="success" hint="Siap dibaca siswa" />
        <StatCard label="Menunggu" value={books.filter((book) => book.status === 'pending').length} icon={Clock} tone="warning" hint="Perlu verifikasi" />
        <StatCard label="Unduhan" value={books.reduce((sum, book) => sum + book.downloads, 0).toLocaleString('id-ID')} icon={Download} tone="accent" hint="Sepanjang semester" />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <Tabs
            items={[
              { id: 'all', label: 'Semua', count: books.length },
              { id: 'synced', label: 'Tersinkron', count: books.filter((book) => book.status === 'synced').length },
              { id: 'pending', label: 'Menunggu', count: books.filter((book) => book.status === 'pending').length },
            ]}
            value={filter}
            onChange={setFilter}
          />
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari buku…"
                className="h-9 w-44 rounded-lg border border-border bg-surface pl-8 pr-2 text-[11px] text-text outline-none focus:border-primary"
                aria-label="Cari buku"
              />
            </div>
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              className="h-9 rounded-lg border border-border bg-surface px-2 text-[11px] font-semibold text-text outline-none focus:border-primary"
              aria-label="Filter jenjang"
            >
              <option value="all">Semua jenjang</option>
              {levels.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="h-9 rounded-lg border border-border bg-surface px-2 text-[11px] font-semibold text-text outline-none focus:border-primary"
              aria-label="Filter mata pelajaran"
            >
              <option value="all">Semua mapel</option>
              {subjects.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Library} title="Buku tidak ditemukan" description="Ubah filter atau kata kunci pencarian." />
        ) : (
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((book) => (
              <Card key={book.id} className="overflow-hidden">
                <div className="p-2.5 pb-0">
                  <BookCover book={book} size="sm" />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone={book.status === 'synced' ? 'success' : 'warning'} dot className="px-2 py-0.5 text-[8px]">
                      {book.status === 'synced' ? 'Tersinkron' : 'Menunggu'}
                    </Badge>
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-accent-strong dark:text-accent">
                      <Star className="h-3 w-3 fill-current" aria-hidden="true" /> {book.rating}
                    </span>
                  </div>
                  <h3 className="mt-1.5 line-clamp-2 text-xs font-bold text-text">{book.title}</h3>
                  <p className="mt-0.5 truncate text-[9px] text-muted">{book.subject} · Kelas {book.grade} · {book.authors.join(', ')}</p>
                  {book.audience === 'teacher' && (
                    <Badge tone="accent" className="mt-1 px-2 py-0.5 text-[8px]">Khusus guru</Badge>
                  )}
                  <div className="mt-2 flex flex-wrap gap-3 text-[9px] font-semibold text-muted">
                    <span className="inline-flex items-center gap-1"><FileText className="h-3 w-3" aria-hidden="true" /> {book.chapterCount} bab</span>
                    <span className="inline-flex items-center gap-1"><Download className="h-3 w-3" aria-hidden="true" /> {book.downloads.toLocaleString('id-ID')}</span>
                    <span className="inline-flex items-center gap-1"><Sparkles className="h-3 w-3" aria-hidden="true" /> {book.pages} hlm</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-2">
                    <span className="truncate text-[8px] text-muted" title={book.license}>{book.license}</span>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-[10px]" onClick={() => openDetail(book)}>
                      Detail
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.title || 'Detail buku'}
        description={selected ? `${selected.subject} · Kelas ${selected.grade} · ${selected.authors.join(', ')}` : undefined}
        size="lg"
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
              <BookCover book={selected} size="md" />
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge tone={selected.status === 'synced' ? 'success' : 'warning'}>{selected.status === 'synced' ? 'Tersinkron' : 'Menunggu'}</Badge>
                  <Badge tone="primary">{selected.level || 'SMA/MA'} · Kelas {selected.grade}</Badge>
                  {selected.bookType && <Badge tone="accent">{selected.bookType}</Badge>}
                  <Badge tone="neutral">ISBN {selected.isbn}</Badge>
                  <Badge tone="neutral">{selected.year}</Badge>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-muted">{selected.synopsis}</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-surface-2 p-2 text-center">
                    <p className="text-sm font-extrabold text-text">{selected.pages}</p>
                    <p className="text-[8px] font-semibold uppercase text-muted">Halaman</p>
                  </div>
                  <div className="rounded-lg bg-surface-2 p-2 text-center">
                    <p className="text-sm font-extrabold text-text">{selected.chapters?.length ?? selected.chapterCount ?? 0}</p>
                    <p className="text-[8px] font-semibold uppercase text-muted">Bab</p>
                  </div>
                  <div className="rounded-lg bg-surface-2 p-2 text-center">
                    <p className="text-sm font-extrabold text-text">{selected.rating}</p>
                    <p className="text-[8px] font-semibold uppercase text-muted">Rating</p>
                  </div>
                </div>
                <p className="mt-2 text-[9px] text-muted">Lisensi: {selected.license} · {selected.downloads.toLocaleString('id-ID')} unduhan</p>
                {selected.fileUrl && (
                  <a
                    href={selected.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-[10px] font-bold text-primary-strong transition hover:bg-surface-2 dark:text-primary"
                  >
                    <ExternalLink className="h-3 w-3" aria-hidden="true" /> Buka PDF resmi
                  </a>
                )}
                {selected.audience === 'teacher' && (
                  <p className="mt-2 rounded-lg bg-accent-soft px-2.5 py-1.5 text-[9px] font-semibold text-accent-strong dark:text-accent">
                    Buku panduan guru hanya dapat diakses oleh guru dan admin.
                  </p>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-text">Daftar bab</p>
              <div className="mt-2 space-y-1.5">
                {detailLoading && <p className="text-[11px] text-muted">Memuat bab…</p>}
                {(selected.chapters ?? []).map((chapter) => (
                  <div key={chapter.id} className="flex items-start gap-2 rounded-lg border border-border px-3 py-2">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary-soft text-[9px] font-extrabold text-primary-strong dark:text-primary">{chapter.number}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold text-text">{chapter.title}</p>
                      <p className="line-clamp-1 text-[9px] text-muted">{chapter.summary}</p>
                    </div>
                    <span className="shrink-0 text-[9px] text-muted">hlm. {chapter.startPage}–{chapter.endPage}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selected.tags.map((tag) => <span key={tag} className="rounded-full bg-surface-2 px-2 py-0.5 text-[9px] font-semibold text-muted">{tag}</span>)}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
