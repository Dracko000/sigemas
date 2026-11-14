import { useState } from 'react';
import { Activity, Atom, BookOpen, Code2, Cpu, Languages, Landmark, Palette, Sigma } from 'lucide-react';
import type { Book } from '../../types';
import { cx } from '../../lib/format';
import { LogoMark } from '../Logo';

const subjectIcons = {
  Matematika: Sigma,
  'Bahasa Indonesia': Languages,
  IPA: Atom,
  IPAS: Atom,
  'Sejarah Indonesia': Landmark,
  'Bahasa Inggris': Languages,
  Informatika: Cpu,
  'Koding & Kecerdasan Artifisial': Code2,
  PJOK: Activity,
  'Pendidikan Pancasila': Landmark,
  'Seni Musik': Palette,
  'Seni Rupa': Palette,
  'Seni Tari': Palette,
  'Seni Teater': Palette,
} as const;

export function BookCover({
  book,
  className,
  size = 'md',
}: {
  book: Pick<Book, 'title' | 'subject' | 'authors' | 'cover' | 'grade'> & {
    coverUrl?: string;
    level?: string;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(book.coverUrl) && !imageFailed;
  const Icon = subjectIcons[book.subject as keyof typeof subjectIcons] || BookOpen;
  return (
    <div
      className={cx(
        'relative isolate overflow-hidden rounded-2xl text-white',
        size === 'sm' && 'h-36',
        size === 'md' && 'h-44',
        size === 'lg' && 'h-56',
        className
      )}
      style={{ backgroundImage: `linear-gradient(135deg, ${book.cover.from}, ${book.cover.to})` }}
      aria-hidden="true"
    >
      {showImage ? (
        <>
          <img
            src={book.coverUrl}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,16,31,0.18),transparent_38%,rgba(4,16,31,0.72))]" />
        </>
      ) : (
        <>
          <div className="pattern-grid absolute inset-0 text-white/25 opacity-30" />
          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10 blur-sm" />
          <div className="absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-black/10" />
          <Icon
            className={cx(
              'absolute right-2 top-12 text-white/15',
              size === 'sm' ? 'h-20 w-20' : 'h-32 w-32'
            )}
            strokeWidth={1.2}
          />
        </>
      )}
      <div className="absolute right-3 top-3">
        <LogoMark size={26} />
      </div>
      <div className="absolute left-3.5 top-3.5 rounded-full border border-white/25 bg-[#04101f]/45 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
        SIBI · {book.level ? `${book.level} · Kelas ${book.grade}` : `Kelas ${book.grade}`}
      </div>
      {!showImage && (
        <div className="absolute inset-x-3.5 bottom-3.5">
          <p
            className={cx(
              'line-clamp-3 font-extrabold leading-tight drop-shadow-sm',
              size === 'sm' ? 'text-xs' : 'text-sm'
            )}
          >
            {book.title}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-0.5 w-5 rounded-full bg-accent" />
            <p className={cx('truncate font-medium text-white/70', size === 'sm' ? 'text-[8px]' : 'text-[10px]')}>
              {book.authors?.[0]}
            </p>
          </div>
        </div>
      )}
      {showImage && (
        <div className="absolute inset-x-3.5 bottom-3 line-clamp-2 text-[10px] font-bold leading-tight text-white drop-shadow">
          {book.title}
        </div>
      )}
    </div>
  );
}

export const subjectIcon = (subject: string) =>
  subjectIcons[subject as keyof typeof subjectIcons] || BookOpen;
