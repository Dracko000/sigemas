import { useEffect, useRef, useState } from 'react';
import {
  Award,
  Bell,
  ClipboardList,
  Database,
  FileCheck2,
  FileText,
  Radio,
  UserCheck,
  Users,
} from 'lucide-react';
import { api } from '../lib/api';
import { cx, relativeDate } from '../lib/format';
import type { NotificationItem } from '../types';

const icons: Record<string, typeof Bell> = {
  live: Radio,
  task: ClipboardList,
  grade: Award,
  system: Database,
  report: FileText,
  attendance: UserCheck,
  user: Users,
  submission: FileCheck2,
};

const tones: Record<string, string> = {
  live: 'bg-danger-soft text-danger',
  task: 'bg-accent-soft text-accent-strong dark:text-accent',
  grade: 'bg-primary-soft text-primary-strong dark:text-primary',
  system: 'bg-info-soft text-info',
  report: 'bg-success-soft text-success',
  attendance: 'bg-success-soft text-success',
  user: 'bg-surface-2 text-muted',
  submission: 'bg-warning-soft text-warning',
};

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const unread = items.filter((item) => item.unread).length;

  useEffect(() => {
    api<NotificationItem[]>('/api/notifications')
      .then((data) => {
        setItems(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const markAllRead = () => setItems((rows) => rows.map((row) => ({ ...row, unread: false })));

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-muted transition hover:border-primary/40 hover:bg-primary-soft/40 hover:text-primary-strong dark:hover:text-primary"
        aria-label={unread ? `Notifikasi, ${unread} belum dibaca` : 'Notifikasi'}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell className="h-4.5 w-4.5" aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[9px] font-extrabold text-[#2b1a00]">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="animate-pop absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-surface shadow-pop">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-bold text-text">Notifikasi</p>
              <p className="text-[11px] text-muted">{unread ? `${unread} belum dibaca` : 'Semua sudah dibaca'}</p>
            </div>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="rounded-lg px-2 py-1 text-[11px] font-semibold text-primary-strong transition hover:bg-primary-soft dark:text-primary"
              >
                Tandai dibaca
              </button>
            )}
          </div>
          <ul className="max-h-[360px] overflow-y-auto">
            {!loaded && <li className="px-4 py-6 text-center text-xs text-muted">Memuat notifikasi…</li>}
            {loaded && items.length === 0 && (
              <li className="px-4 py-8 text-center text-xs text-muted">Belum ada notifikasi baru.</li>
            )}
            {items.map((item) => {
              const Icon = icons[item.type] || Bell;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setItems((rows) =>
                        rows.map((row) => (row.id === item.id ? { ...row, unread: false } : row))
                      )
                    }
                    className={cx(
                      'flex w-full items-start gap-3 border-b border-border/70 px-4 py-3 text-left transition last:border-0 hover:bg-surface-2',
                      item.unread && 'bg-primary-soft/25'
                    )}
                  >
                    <span className={cx('mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg', tones[item.type] || 'bg-surface-2 text-muted')}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-text">{item.title}</span>
                        {item.unread && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-label="Belum dibaca" />}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-relaxed text-muted">{item.text}</span>
                      <span className="mt-1 block text-[10px] font-medium text-muted/80">{relativeDate(item.at)}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
