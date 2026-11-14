import { Link } from 'react-router-dom';
import { ArrowUpRight, Bookmark, Star } from 'lucide-react';
import type { Book } from '../../types';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { BookCover } from './BookCover';
import { cx } from '../../lib/format';

export function BookCard({ book, className }: { book: Book; className?: string }) {
  const progress = book.progress?.percent ?? 0;
  const chapterCount = book.chapterCount ?? book.chapters?.length ?? 0;
  return (
    <Link
      to={`/baca/${book.id}`}
      className={cx(
        'group flex flex-col overflow-hidden rounded-card border border-border bg-surface shadow-card transition duration-200',
        'hover:-translate-y-1 hover:border-primary/35 hover:shadow-pop',
        className
      )}
      aria-label={`Buka buku ${book.title}`}
    >
      <div className="p-2.5 pb-0">
        <BookCover book={book} />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            <Badge tone="primary">{book.subject}</Badge>
            {book.audience === 'teacher' && <Badge tone="accent">Panduan Guru</Badge>}
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted">
            <Star className="h-3 w-3 fill-accent text-accent" aria-hidden="true" />
            {book.rating.toFixed(1)}
          </span>
        </div>
        <h3 className="mt-2.5 line-clamp-2 text-sm font-bold leading-snug text-text group-hover:text-primary-strong dark:group-hover:text-primary">
          {book.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-[11px] text-muted">
          {book.authors?.join(', ')} · {book.year}
        </p>
        <div className="mt-3 flex items-center gap-2 text-[10px] text-muted">
          <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
          {chapterCount} bab · {book.pages} halaman
        </div>

        <div className="mt-auto pt-3.5">
          {progress > 0 ? (
            <>
              <Progress value={progress} size="sm" showValue label="Progres membaca" />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] font-medium text-muted">
                  {book.progress?.lastPage ? `Halaman ${book.progress.lastPage}` : 'Lanjutkan'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-strong transition group-hover:gap-2 dark:text-primary">
                  Lanjut <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-[10px] text-muted">Belum dimulai</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-strong dark:text-primary">
                Mulai baca <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
