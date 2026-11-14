import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  Highlighter,
  ListTree,
  Loader2,
  Moon,
  PanelRightOpen,
  Search,
  StickyNote,
  Sun,
  Trash2,
  Type,
  X,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import type { Book } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Progress } from '../../components/ui/Progress';
import { EmptyState, Skeleton } from '../../components/ui/Misc';
import { BookCover } from '../../components/books/BookCover';
import { cx } from '../../lib/format';

interface PageNote {
  id: string;
  page: number;
  text: string;
  createdAt: string;
}

const readerThemes = {
  light: { bg: '#ffffff', text: '#0b1728', muted: '#5a6b7f', border: '#e1e8f0', label: 'Terang' },
  sepia: { bg: '#fbf6ea', text: '#3d3325', muted: '#7a6a52', border: '#e6dcc6', label: 'Sepia' },
  dark: { bg: '#1a1f26', text: '#e9f0f8', muted: '#a1afc0', border: '#2d3946', label: 'Gelap' },
};

export function ReaderPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [notes, setNotes] = useState<PageNote[]>([]);
  const [noteDraft, setNoteDraft] = useState('');
  const [panelTab, setPanelTab] = useState<'notes' | 'bookmarks'>('notes');
  const [readerTheme, setReaderTheme] = useState<keyof typeof readerThemes>('light');
  const [fontSize, setFontSize] = useState(17);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [jumpValue, setJumpValue] = useState('');
  const [saving, setSaving] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const storageKey = user ? `sigemas.reader.${user.id}.${bookId}` : '';

  useEffect(() => {
    if (!bookId) return;
    setLoading(true);
    api<Book>(`/api/books/${bookId}`)
      .then((data) => {
        setBook(data);
        const start = data.progress?.lastPage && data.progress.lastPage <= data.pages ? data.progress.lastPage : 1;
        setPageNo(start);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Buku tidak dapat dimuat.'))
      .finally(() => setLoading(false));
  }, [bookId]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
      setBookmarks(Array.isArray(stored.bookmarks) ? stored.bookmarks : []);
      setNotes(Array.isArray(stored.notes) ? stored.notes : []);
      if (stored.theme && readerThemes[stored.theme as keyof typeof readerThemes]) {
        setReaderTheme(stored.theme);
      }
      if (typeof stored.fontSize === 'number') setFontSize(stored.fontSize);
    } catch {
      /* ignore corrupt local data */
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify({ bookmarks, notes, theme: readerTheme, fontSize }));
  }, [bookmarks, notes, readerTheme, fontSize, storageKey]);

  const pages = useMemo(
    () =>
      book
        ? book.chapters.flatMap((chapter) =>
            chapter.pages.map((page) => ({ ...page, chapter }))
          )
        : [],
    [book]
  );
  const totalPages = pages.length;
  const current = pages.find((page) => page.page === pageNo) || pages[0];
  const percent = totalPages ? Math.round((pageNo / totalPages) * 100) : 0;
  const theme = readerThemes[readerTheme];

  useEffect(() => {
    if (!book || loading) return;
    setSaving(true);
    const timer = window.setTimeout(() => {
      api('/api/progress', {
        method: 'POST',
        body: { bookId: book.id, lastPage: pageNo, percent },
      })
        .catch(() => undefined)
        .finally(() => setSaving(false));
    }, 700);
    return () => window.clearTimeout(timer);
  }, [book, pageNo, percent, loading]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (event.key === 'ArrowRight') setPageNo((currentPage) => Math.min(totalPages, currentPage + 1));
      if (event.key === 'ArrowLeft') setPageNo((currentPage) => Math.max(1, currentPage - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [totalPages]);

  useEffect(() => {
    if (searchOpen) {
      const timer = window.setTimeout(() => searchInputRef.current?.focus(), 80);
      return () => window.clearTimeout(timer);
    }
  }, [searchOpen]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 2) return [];
    return pages
      .filter((page) =>
        `${page.chapter.title} ${page.heading} ${page.paragraphs.join(' ')}`.toLowerCase().includes(term)
      )
      .slice(0, 8);
  }, [pages, query]);

  const toggleBookmark = () => {
    setBookmarks((rows) =>
      rows.includes(pageNo) ? rows.filter((page) => page !== pageNo) : [...rows, pageNo].sort((a, b) => a - b)
    );
  };

  const addNote = (event: FormEvent) => {
    event.preventDefault();
    const text = noteDraft.trim();
    if (!text) return;
    setNotes((rows) => [
      { id: `note-${Date.now()}`, page: pageNo, text, createdAt: new Date().toISOString() },
      ...rows,
    ]);
    setNoteDraft('');
    toast.success('Catatan disimpan', `Ditambahkan pada halaman ${pageNo}.`);
  };

  const deleteNote = (id: string) => {
    setNotes((rows) => rows.filter((note) => note.id !== id));
    toast.info('Catatan dihapus');
  };

  const jumpToPage = (value: number) => {
    const target = Math.max(1, Math.min(totalPages, Math.round(value)));
    setPageNo(target);
    setSearchOpen(false);
    setJumpValue('');
    panelRef.current?.scrollTo({ top: 0 });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20" />
        <div className="grid gap-4 lg:grid-cols-[230px_1fr]">
          <Skeleton className="h-[520px]" />
          <Skeleton className="h-[520px]" />
        </div>
      </div>
    );
  }

  if (error || !book || !current) {
    return (
      <Card>
        <EmptyState
          icon={AlertCircle}
          title="Buku tidak dapat dibuka"
          description={error || 'Konten buku tidak tersedia saat ini.'}
          action={<Button onClick={() => navigate('/katalog')}>Kembali ke katalog</Button>}
        />
      </Card>
    );
  }

  const isBookmarked = bookmarks.includes(pageNo);
  const chapterNotes = notes.filter((note) => note.page === pageNo);

  const panelContent = (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-surface-2 p-1" role="tablist" aria-label="Panel catatan">
        {[
          { id: 'notes' as const, label: `Catatan (${notes.length})` },
          { id: 'bookmarks' as const, label: `Bookmark (${bookmarks.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={panelTab === tab.id}
            onClick={() => setPanelTab(tab.id)}
            className={cx(
              'rounded-lg px-2 py-2 text-[11px] font-semibold transition',
              panelTab === tab.id ? 'bg-surface text-text shadow-sm' : 'text-muted hover:text-text'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {panelTab === 'notes' ? (
        <>
          <form onSubmit={addNote} className="mt-3">
            <label htmlFor="reader-note" className="mb-1.5 block text-[10px] font-semibold text-muted">
              Catatan untuk halaman {pageNo}
            </label>
            <textarea
              id="reader-note"
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              placeholder="Tulis gagasan, pertanyaan, atau rangkuman singkat…"
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-surface px-3 py-2 text-xs text-text outline-none transition placeholder:text-muted/65 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <Button type="submit" size="sm" className="mt-2 w-full" disabled={!noteDraft.trim()}>
              <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
              Simpan catatan
            </Button>
          </form>
          <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-0.5">
            {notes.length === 0 && (
              <p className="rounded-xl border border-dashed border-border px-3 py-5 text-center text-[11px] leading-relaxed text-muted">
                Belum ada catatan. Tandai bagian penting saat membaca.
              </p>
            )}
            {notes.map((note) => (
              <div key={note.id} className="rounded-xl border border-border bg-surface p-3">
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => jumpToPage(note.page)}
                    className="text-[10px] font-bold text-primary-strong hover:underline dark:text-primary"
                  >
                    Halaman {note.page}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteNote(note.id)}
                    className="rounded-md p-0.5 text-muted transition hover:text-danger"
                    aria-label={`Hapus catatan halaman ${note.page}`}
                  >
                    <Trash2 className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">{note.text}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-3 flex-1 space-y-2 overflow-y-auto">
          {bookmarks.length === 0 && (
            <p className="rounded-xl border border-dashed border-border px-3 py-5 text-center text-[11px] leading-relaxed text-muted">
              Tandai halaman penting dengan tombol bookmark di toolbar.
            </p>
          )}
          {bookmarks.map((page) => {
            const target = pages.find((item) => item.page === page);
            return (
              <button
                key={page}
                type="button"
                onClick={() => jumpToPage(page)}
                className="flex w-full items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-left transition hover:bg-surface-2"
              >
                <BookmarkCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold text-text">Halaman {page}</span>
                  <span className="block truncate text-[9px] text-muted">{target?.chapter.title}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <Card className="p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/katalog')}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted transition hover:bg-surface-2 hover:text-text"
            aria-label="Kembali ke katalog"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-text sm:text-sm">{book.title}</p>
            <p className="truncate text-[10px] text-muted">
              {book.authors.join(', ')} · {book.subject} · Kelas {book.grade}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant={searchOpen ? 'primary' : 'outline'}
              onClick={() => setSearchOpen((value) => !value)}
              aria-expanded={searchOpen}
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Cari</span>
            </Button>
            {book.fileUrl && (
              <a
                href={book.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-[11px] font-semibold text-text transition hover:bg-surface-2"
                title="Buka PDF resmi dari SIBI"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">PDF Resmi</span>
              </a>
            )}
            <button
              type="button"
              onClick={toggleBookmark}
              className={cx(
                'grid h-9 w-9 place-items-center rounded-xl border transition',
                isBookmarked
                  ? 'border-accent/30 bg-accent-soft text-accent-strong'
                  : 'border-border bg-surface text-muted hover:bg-surface-2 hover:text-text'
              )}
              aria-label={isBookmarked ? 'Hapus bookmark halaman ini' : 'Tandai halaman ini'}
              aria-pressed={isBookmarked}
            >
              {isBookmarked ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
            </button>
            <Button size="sm" variant="outline" onClick={() => setMobilePanelOpen(true)} className="xl:hidden">
              <PanelRightOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Catatan</span>
              {notes.length > 0 && <span className="rounded-full bg-primary-soft px-1.5 text-[9px] text-primary-strong">{notes.length}</span>}
            </Button>
            <span className="hidden items-center gap-1 text-[10px] text-muted sm:flex">
              {saving ? <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" /> : <Check className="h-3 w-3 text-success" aria-hidden="true" />}
              {saving ? 'Menyimpan…' : 'Tersimpan'}
            </span>
          </div>
        </div>

        {searchOpen && (
          <div className="mt-3 rounded-xl border border-border bg-surface-2/50 p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari teks di seluruh buku…"
                aria-label="Cari teks dalam buku"
                className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-8 text-xs text-text outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted" aria-label="Hapus pencarian">
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
            {query.trim().length >= 2 && (
              <div className="mt-2 max-h-56 space-y-1 overflow-y-auto">
                {results.length === 0 && <p className="px-2 py-3 text-center text-[11px] text-muted">Tidak ada hasil untuk “{query}”.</p>}
                {results.map((result) => (
                  <button
                    key={result.page}
                    type="button"
                    onClick={() => jumpToPage(result.page)}
                    className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-surface"
                  >
                    <span className="mt-0.5 rounded-md bg-primary-soft px-1.5 py-0.5 text-[9px] font-bold text-primary-strong dark:text-primary">
                      Hlm {result.page}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-semibold text-text">{result.chapter.title}</span>
                      <span className="block truncate text-[10px] text-muted">
                        {snippet(result.paragraphs.join(' '), query)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <label className="flex min-w-0 items-center gap-1.5 text-[10px] font-medium text-muted lg:hidden">
            <ListTree className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Pilih bab</span>
            <select
              value={current.chapter.id}
              onChange={(event) => {
                const chapter = book.chapters.find((item) => item.id === event.target.value);
                if (chapter) jumpToPage(chapter.startPage);
              }}
              className="max-w-[170px] cursor-pointer rounded-lg border border-border bg-surface px-2 py-1.5 text-[11px] font-semibold text-text outline-none"
            >
              {book.chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  Bab {chapter.number}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center gap-0.5 rounded-lg border border-border bg-surface p-0.5" role="group" aria-label="Tema pembaca">
            {(Object.keys(readerThemes) as (keyof typeof readerThemes)[]).map((key) => {
              const Icon = key === 'dark' ? Moon : key === 'sepia' ? BookOpen : Sun;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setReaderTheme(key)}
                  aria-label={`Tema ${readerThemes[key].label}`}
                  aria-pressed={readerTheme === key}
                  className={cx(
                    'grid h-7 w-7 place-items-center rounded-md transition',
                    readerTheme === key ? 'bg-primary-soft text-primary-strong dark:text-primary' : 'text-muted hover:bg-surface-2'
                  )}
                  title={readerThemes[key].label}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-0.5 rounded-lg border border-border bg-surface p-0.5" role="group" aria-label="Ukuran huruf">
            <button
              type="button"
              onClick={() => setFontSize((size) => Math.max(14, size - 1))}
              className="grid h-7 w-7 place-items-center rounded-md text-[11px] font-bold text-muted transition hover:bg-surface-2 hover:text-text"
              aria-label="Perkecil huruf"
            >
              A−
            </button>
            <span className="px-1 text-[9px] text-muted">{fontSize}px</span>
            <button
              type="button"
              onClick={() => setFontSize((size) => Math.min(24, size + 1))}
              className="grid h-7 w-7 place-items-center rounded-md text-[13px] font-bold text-muted transition hover:bg-surface-2 hover:text-text"
              aria-label="Perbesar huruf"
            >
              A+
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1 text-[10px] text-muted sm:flex">
              <Clock3 className="h-3 w-3" aria-hidden="true" />
              ±{Math.max(2, Math.round((current.paragraphs.join(' ').split(' ').length || 300) / 180))} menit baca
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => jumpToPage(pageNo - 1)}
                disabled={pageNo <= 1}
                className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-surface text-muted transition hover:bg-surface-2 hover:text-text disabled:opacity-40"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="min-w-[64px] text-center text-[10px] font-semibold tabular-nums text-text">
                {pageNo} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => jumpToPage(pageNo + 1)}
                disabled={pageNo >= totalPages}
                className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-surface text-muted transition hover:bg-surface-2 hover:text-text disabled:opacity-40"
                aria-label="Halaman berikutnya"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[230px_minmax(0,1fr)_300px]">
        <aside className="hidden space-y-4 xl:block" aria-label="Daftar isi buku">
          <Card className="overflow-hidden">
            <div className="border-b border-border px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Daftar isi</p>
              <Progress value={percent} size="sm" className="mt-2" label="Progres baca" showValue />
            </div>
            <ol className="max-h-[420px] space-y-0.5 overflow-y-auto p-2">
              {book.chapters.map((chapter) => {
                const active = current.chapter.id === chapter.id;
                return (
                  <li key={chapter.id}>
                    <button
                      type="button"
                      onClick={() => jumpToPage(chapter.startPage)}
                      className={cx(
                        'flex w-full items-start gap-2 rounded-xl px-2.5 py-2 text-left transition',
                        active ? 'bg-primary-soft/60 text-text' : 'text-muted hover:bg-surface-2 hover:text-text'
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span
                        className={cx(
                          'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md text-[9px] font-bold',
                          active ? 'bg-primary text-white' : 'bg-surface-2 text-muted'
                        )}
                      >
                        {chapter.number}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] font-semibold leading-snug">{chapter.title}</span>
                        <span className="mt-0.5 block text-[9px] opacity-70">Hlm {chapter.startPage}–{chapter.endPage}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Card>

          <Card className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Informasi buku</p>
            <div className="mt-2 space-y-1.5 text-[10px] leading-relaxed text-muted">
              <p><span className="font-semibold text-text">Penulis:</span> {book.authors.join(', ')}</p>
              <p><span className="font-semibold text-text">Penerbit:</span> {book.publisher || 'Pusat Perbukuan, Kemendikdasmen'}</p>
              <p><span className="font-semibold text-text">Jenis:</span> {book.bookType || 'Buku Siswa'}</p>
              <p><span className="font-semibold text-text">Jenjang:</span> {book.level || 'SMA/MA'} · Kelas {book.grade}</p>
              <p><span className="font-semibold text-text">Tahun:</span> {book.year}</p>
              <p><span className="font-semibold text-text">ISBN:</span> {book.isbn}</p>
            </div>
            <p className="mt-3 rounded-lg bg-surface-2 px-2.5 py-2 text-[9px] leading-relaxed text-muted">
              {book.license}. Tampilan pembaca disimulasikan untuk demonstrasi.
            </p>
          </Card>
        </aside>

        <div className="min-w-0">
          <article
            className="reader-page relative mx-auto overflow-hidden rounded-panel border"
            style={{ backgroundColor: theme.bg, color: theme.text, borderColor: theme.border }}
          >
            <div
              className="flex items-center justify-between border-b px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] sm:px-8"
              style={{ borderColor: theme.border, color: theme.muted }}
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                {book.subject}
              </span>
              <span>Halaman {pageNo}</span>
            </div>

            <div className="px-5 py-7 sm:px-10 sm:py-10 lg:px-14">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <Badge tone="accent">
                  Bab {current.chapter.number} · {current.kind}
                </Badge>
                {isBookmarked && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold" style={{ color: theme.muted }}>
                    <BookmarkCheck className="h-3.5 w-3.5" aria-hidden="true" /> Ditandai
                  </span>
                )}
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: theme.muted }}>
                {current.chapter.title}
              </p>
              <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight sm:text-[30px]">
                {current.heading}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]" style={{ color: theme.muted }}>
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-3 w-3" aria-hidden="true" />
                  {Math.max(2, Math.round((current.paragraphs.join(' ').split(' ').length || 300) / 180))} menit baca
                </span>
                <span>·</span>
                <span>{current.paragraphs.join(' ').split(' ').length} kata</span>
              </div>

              <div className="prose-reader mt-6" style={{ fontSize, color: theme.text }}>
                {current.paragraphs.map((paragraph, index) => (
                  <p key={index}>
                    <HighlightedText text={paragraph} query={searchOpen ? query : ''} tone={readerTheme} />
                  </p>
                ))}
              </div>

              <div
                className="mt-7 rounded-2xl border p-4"
                style={{ borderColor: theme.border, backgroundColor: readerTheme === 'light' ? '#F5F9FF' : readerTheme === 'sepia' ? '#F4ECD9' : '#222932' }}
              >
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: theme.muted }}>
                  <Highlighter className="h-3.5 w-3.5" aria-hidden="true" />
                  Poin kunci bab
                </p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.text }}>
                  {current.chapter.summary}
                </p>
                <ul className="mt-2 space-y-1">
                  {current.chapter.objectives.slice(0, 2).map((objective) => (
                    <li key={objective} className="flex items-start gap-1.5 text-[11px] leading-relaxed" style={{ color: theme.muted }}>
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full" style={{ background: theme.muted }} />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              {chapterNotes.length > 0 && (
                <div className="mt-5 space-y-1.5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: theme.muted }}>
                    Catatanmu di halaman ini
                  </p>
                  {chapterNotes.map((note) => (
                    <p key={note.id} className="rounded-lg border-l-2 border-accent py-1 pl-2.5 text-[11px] leading-relaxed" style={{ color: theme.muted }}>
                      {note.text}
                    </p>
                  ))}
                </div>
              )}

              <div className="mt-8 flex items-center justify-between gap-3 border-t pt-4" style={{ borderColor: theme.border }}>
                <button
                  type="button"
                  onClick={() => jumpToPage(pageNo - 1)}
                  disabled={pageNo <= 1}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold transition hover:opacity-70 disabled:opacity-30"
                  style={{ color: theme.text }}
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Sebelumnya
                </button>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (jumpValue) jumpToPage(Number(jumpValue));
                  }}
                  className="flex items-center gap-1"
                >
                  <label htmlFor="jump-page" className="sr-only">Lompat ke halaman</label>
                  <input
                    id="jump-page"
                    value={jumpValue}
                    onChange={(event) => setJumpValue(event.target.value.replace(/\D/g, ''))}
                    placeholder={String(pageNo)}
                    inputMode="numeric"
                    className="w-12 rounded-md border px-1.5 py-1 text-center text-[11px] outline-none"
                    style={{ borderColor: theme.border, backgroundColor: 'transparent', color: theme.text }}
                  />
                  <span className="text-[10px]" style={{ color: theme.muted }}>/ {totalPages}</span>
                </form>
                <button
                  type="button"
                  onClick={() => jumpToPage(pageNo + 1)}
                  disabled={pageNo >= totalPages}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold transition hover:opacity-70 disabled:opacity-30"
                  style={{ color: theme.text }}
                >
                  Berikutnya
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>

          <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2.5">
            <div className="flex items-center gap-2">
              <BookCover book={book} size="sm" className="hidden !h-10 w-8 rounded-md sm:block" />
              <div>
                <p className="max-w-[150px] truncate text-[10px] font-semibold text-text sm:max-w-xs">{book.title}</p>
                <p className="text-[9px] text-muted">Progres {percent}% · {book.chapters.length} bab</p>
              </div>
            </div>
            <Progress value={percent} size="sm" className="ml-3 max-w-[120px] flex-1" />
          </div>
        </div>

        <aside ref={panelRef} className="hidden xl:block" aria-label="Catatan dan bookmark">
          <div className="sticky top-[84px] max-h-[calc(100dvh-110px)] rounded-card border border-border bg-surface p-4 shadow-card">
            {panelContent}
          </div>
        </aside>
      </div>

      <Modal
        open={mobilePanelOpen}
        onClose={() => setMobilePanelOpen(false)}
        title="Catatan & bookmark"
        description={`Halaman ${pageNo} · ${current.chapter.title}`}
        size="sm"
      >
        <div className="min-h-[320px]">{panelContent}</div>
      </Modal>
    </div>
  );
}

function snippet(text: string, query: string) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index < 0) return text.slice(0, 90);
  const start = Math.max(0, index - 32);
  return `${start > 0 ? '…' : ''}${text.slice(start, start + 100)}…`;
}

function HighlightedText({
  text,
  query,
  tone,
}: {
  text: string;
  query: string;
  tone: keyof typeof readerThemes;
}) {
  const term = query.trim();
  if (term.length < 2) return <>{text}</>;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <mark
            key={index}
            className="rounded px-0.5"
            style={{
              backgroundColor: tone === 'dark' ? '#5c4818' : '#FFE082',
              color: tone === 'dark' ? '#fff3cd' : '#3d2a00',
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}
