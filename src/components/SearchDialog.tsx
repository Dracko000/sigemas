import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  Loader2,
  School,
  Search,
  User as UserIcon,
} from 'lucide-react';
import { Modal } from './ui/Modal';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { navByRole } from '../lib/nav';
import { cx } from '../lib/format';
import type { Book, ClassRoom, Task, User } from '../types';

interface Results {
  books: Book[];
  users: User[];
  classes: ClassRoom[];
  tasks: Task[];
}

const empty: Results = { books: [], users: [], classes: [], tasks: [] };

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Results>(empty);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setResults(empty);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open || query.trim().length < 2) {
      setResults(empty);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = window.setTimeout(() => {
      api<Results>(`/api/search?q=${encodeURIComponent(query.trim())}`)
        .then(setResults)
        .catch(() => setResults(empty))
        .finally(() => setLoading(false));
    }, 260);
    return () => window.clearTimeout(timer);
  }, [query, open]);

  const quickNav = useMemo(() => {
    if (!user) return [];
    const items = navByRole[user.role];
    if (!query.trim()) return items;
    return items.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));
  }, [query, user]);

  const go = (to: string) => {
    onClose();
    navigate(to);
  };

  const total = results.books.length + results.users.length + results.classes.length + results.tasks.length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Cari di SiGEMAS"
      description="Temukan buku SIBI, kelas, tugas, atau pengguna."
      size="lg"
    >
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ketik minimal 2 karakter…"
          aria-label="Kata kunci pencarian"
          className="w-full rounded-xl border border-border bg-surface-2 py-3 pl-11 pr-4 text-sm text-text outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/12"
        />
        {loading && <Loader2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted" aria-hidden="true" />}
      </div>

      <div className="mt-4 space-y-5">
        {quickNav.length > 0 && (
          <section aria-labelledby="quick-nav-label">
            <p id="quick-nav-label" className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
              Navigasi cepat
            </p>
            <div className="grid gap-1 sm:grid-cols-2">
              {quickNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.to}
                    type="button"
                    onClick={() => go(item.to)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-text transition hover:bg-surface-2"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary-strong dark:text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="flex-1 font-medium">{item.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {query.trim().length >= 2 && !loading && total === 0 && (
          <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
            <p className="text-sm font-semibold text-text">Tidak ada hasil untuk “{query}”</p>
            <p className="mt-1 text-xs text-muted">Coba kata kunci lain, seperti “Matematika” atau “fungsi”.</p>
          </div>
        )}

        {results.books.length > 0 && (
          <ResultGroup label="Buku SIBI">
            {results.books.map((book) => (
              <ResultRow
                key={book.id}
                icon={BookOpen}
                title={book.title}
                meta={`${book.subject} · ${book.authors[0]}`}
                onClick={() => go(`/baca/${book.id}`)}
              />
            ))}
          </ResultGroup>
        )}
        {results.users.length > 0 && (
          <ResultGroup label="Pengguna">
            {results.users.map((row) => (
              <ResultRow
                key={row.id}
                icon={UserIcon}
                title={row.name}
                meta={`${row.email} · ${row.title || row.role}`}
                onClick={() => go('/admin/pengguna')}
              />
            ))}
          </ResultGroup>
        )}
        {results.classes.length > 0 && (
          <ResultGroup label="Kelas">
            {results.classes.map((row) => (
              <ResultRow
                key={row.id}
                icon={School}
                title={`${row.name} · ${row.room}`}
                meta={`${row.studentIds.length} siswa · ${row.academicYear}`}
                onClick={() => go(user?.role === 'admin' ? '/admin/kelas' : '/dashboard')}
              />
            ))}
          </ResultGroup>
        )}
        {results.tasks.length > 0 && (
          <ResultGroup label="Tugas">
            {results.tasks.map((row) => (
              <ResultRow
                key={row.id}
                icon={ClipboardList}
                title={row.title}
                meta={`${row.subject} · ${row.className || row.classId || ''}`}
                onClick={() => go(user?.role === 'teacher' ? '/guru/nilai' : '/jadwal')}
              />
            ))}
          </ResultGroup>
        )}
      </div>
    </Modal>
  );
}

function ResultGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

function ResultRow({
  icon: Icon,
  title,
  meta,
  onClick,
}: {
  icon: typeof BookOpen;
  title: string;
  meta: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-surface-2"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-muted">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-text">{title}</span>
        <span className={cx('block truncate text-[11px] text-muted')}>{meta}</span>
      </span>
      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
    </button>
  );
}
