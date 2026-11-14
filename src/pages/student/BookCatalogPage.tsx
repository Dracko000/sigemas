import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowUpDown,
  BookOpen,
  Library,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import type { Book } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState, SectionHeader, Skeleton } from '../../components/ui/Misc';
import { BookCard } from '../../components/books/BookCard';
import { BookCover } from '../../components/books/BookCover';
import { SigemasMascot } from '../../components/SigemasMascot';
import { cx } from '../../lib/format';

const levels = ['Semua jenjang', 'SD/MI', 'SMA/MA'];

export function BookCatalogPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canSeeTeacherGuides = user?.role === 'teacher' || user?.role === 'admin';
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('Semua');
  const [level, setLevel] = useState('SD/MI');
  const [audience, setAudience] = useState('all');
  const [sort, setSort] = useState<'relevan' | 'rating' | 'populer' | 'judul'>('relevan');
  const [onlyProgress, setOnlyProgress] = useState(false);

  const load = () => {
    setLoading(true);
    setError('');
    api<Book[]>('/api/books')
      .then(setBooks)
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat katalog.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const subjects = useMemo(
    () => ['Semua', ...new Set(books.map((book) => book.subject))],
    [books]
  );

  const filtered = useMemo(() => {
    let list = books.filter((book) => {
      const matchQuery = `${book.title} ${book.subject} ${book.authors.join(' ')}`.toLowerCase().includes(query.toLowerCase());
      const matchSubject = subject === 'Semua' || book.subject === subject;
      const matchLevel = level === 'Semua jenjang' || (book.level || 'SMA/MA') === level;
      const matchAudience = audience === 'all' || (book.audience || 'student') === audience;
      const matchProgress = !onlyProgress || (book.progress?.percent ?? 0) > 0;
      return matchQuery && matchSubject && matchLevel && matchAudience && matchProgress;
    });
    list = [...list].sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'populer') return b.downloads - a.downloads;
      if (sort === 'judul') return a.title.localeCompare(b.title);
      return Number(b.featured) - Number(a.featured) || b.rating - a.rating;
    });
    return list;
  }, [books, query, subject, level, audience, sort, onlyProgress]);

  const featured = books.find((book) => book.featured) || books[0];
  const inProgress = books.filter((book) => (book.progress?.percent ?? 0) > 0).length;

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-panel border border-border bg-surface shadow-card">
        <div className="mesh-hero absolute inset-0" aria-hidden="true" />
        <div className="relative grid gap-5 p-5 sm:p-7 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="primary" dot>Katalog SIBI</Badge>
              <Badge tone="success">{books.length} buku tersinkron</Badge>
            </div>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-text sm:text-3xl">
              Perpustakaan digitalmu, siap dibaca.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              Akses buku teks resmi SD/MI dan SMA/MA dari Kemendikdasmen dengan pencarian teks, bookmark, catatan pribadi,
              dan progres per bab. Semua terhubung dengan kelas live dan kuis.
            </p>
            <div className="mt-5 flex max-w-xl items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari judul, mapel, atau penulis…"
                  aria-label="Cari buku"
                  className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-9 text-sm text-text outline-none transition placeholder:text-muted/65 focus:border-primary focus:ring-4 focus:ring-primary/12"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted transition hover:text-text"
                    aria-label="Hapus pencarian"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
              <Button variant="secondary" onClick={load} className="shrink-0" aria-label="Muat ulang katalog">
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {featured && (
            <button
              type="button"
              onClick={() => navigate(`/baca/${featured.id}`)}
              className="group relative hidden overflow-hidden rounded-2xl border border-border bg-surface p-3 text-left shadow-card transition hover:border-primary/40 lg:block"
            >
              <div className="flex gap-3">
                <BookCover book={featured} size="sm" className="w-28 shrink-0" />
                <div className="min-w-0 flex-1 py-1">
                  <Badge tone="accent">Pilihan minggu ini</Badge>
                  <p className="mt-2 line-clamp-2 text-xs font-bold leading-snug text-text">{featured.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-muted">
                    <Star className="h-3 w-3 fill-accent text-accent" aria-hidden="true" />
                    {featured.rating} · {featured.chapterCount} bab
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-primary-strong dark:text-primary">
                    Baca sekarang <ArrowUpDown className="h-3 w-3 rotate-45" aria-hidden="true" />
                  </span>
                </div>
              </div>
              <SigemasMascot size={58} decorative className="absolute -bottom-1 right-1 opacity-90" />
            </button>
          )}
        </div>
      </section>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar" role="group" aria-label="Filter mata pelajaran">
          {subjects.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSubject(item)}
              className={cx(
                'shrink-0 rounded-full border px-3.5 py-2 text-[11px] font-semibold transition',
                subject === item
                  ? 'border-primary bg-primary-soft text-primary-strong dark:text-primary'
                  : 'border-border bg-surface text-muted hover:border-primary/30 hover:text-text'
              )}
              aria-pressed={subject === item}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-[11px] text-muted">
            <span className="sr-only">Jenjang</span>
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              className="cursor-pointer bg-transparent text-[11px] font-semibold text-text outline-none"
              aria-label="Filter jenjang"
            >
              {levels.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          {canSeeTeacherGuides && (
            <label className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-[11px] text-muted">
              <span className="sr-only">Jenis buku</span>
              <select
                value={audience}
                onChange={(event) => setAudience(event.target.value)}
                className="cursor-pointer bg-transparent text-[11px] font-semibold text-text outline-none"
                aria-label="Filter jenis buku"
              >
                <option value="all">Semua jenis</option>
                <option value="student">Buku siswa</option>
                <option value="teacher">Panduan guru</option>
              </select>
            </label>
          )}
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-[11px] font-medium text-muted">
            <input
              type="checkbox"
              checked={onlyProgress}
              onChange={(event) => setOnlyProgress(event.target.checked)}
              className="h-3.5 w-3.5 accent-[var(--primary)]"
            />
            Sedang dibaca ({inProgress})
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-[11px] text-muted">
            <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Urutkan</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as typeof sort)}
              className="cursor-pointer bg-transparent text-[11px] font-semibold text-text outline-none"
              aria-label="Urutkan buku"
            >
              <option value="relevan">Relevan</option>
              <option value="rating">Rating tertinggi</option>
              <option value="populer">Paling populer</option>
              <option value="judul">Judul A–Z</option>
            </select>
          </label>
        </div>
      </div>

      <SectionHeader
        title={level !== 'Semua jenjang' ? `Buku ${level}${subject !== 'Semua' ? ` · ${subject}` : ''}` : subject === 'Semua' ? 'Semua buku' : subject}
        subtitle={`${filtered.length} buku ditemukan${query ? ` untuk “${query}”` : ''}`}
        action={<Badge tone="neutral"><Library className="h-3 w-3" aria-hidden="true" /> Koleksi SIBI</Badge>}
      />

      {loading && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[360px]" />
          ))}
        </div>
      )}

      {!loading && error && (
        <Card className="p-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-danger-soft text-danger">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-3 text-sm font-semibold text-text">{error}</p>
          <Button className="mt-3" onClick={load}>Coba lagi</Button>
        </Card>
      )}

      {!loading && !error && filtered.length === 0 && (
        <Card>
          <EmptyState
            icon={BookOpen}
            title="Buku tidak ditemukan"
            description="Coba ubah kata kunci atau filter mata pelajaran."
            action={
              <Button variant="secondary" onClick={() => { setQuery(''); setSubject('Semua'); setLevel('Semua jenjang'); setOnlyProgress(false); }}>
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Reset filter
              </Button>
            }
          />
        </Card>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
