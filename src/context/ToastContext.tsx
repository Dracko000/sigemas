import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { cx } from '../lib/format';

type ToastTone = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  tone: ToastTone;
  title: string;
  message?: string;
}

interface ToastContextValue {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const tones = {
  success: 'text-success bg-success-soft border-success/20',
  error: 'text-danger bg-danger-soft border-danger/20',
  info: 'text-info bg-info-soft border-info/20',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((rows) => rows.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (tone: ToastTone, title: string, message?: string) => {
      const id = ++counter.current;
      setToasts((rows) => [...rows.slice(-3), { id, tone, title, message }]);
      window.setTimeout(() => remove(id), 4800);
    },
    [remove]
  );

  const value = useMemo(
    () => ({
      success: (title: string, message?: string) => push('success', title, message),
      error: (title: string, message?: string) => push('error', title, message),
      info: (title: string, message?: string) => push('info', title, message),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          className="fixed right-4 top-4 z-[120] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:right-6 sm:top-6"
          aria-live="polite"
          aria-atomic="false"
        >
          {toasts.map((toast) => {
            const Icon = icons[toast.tone];
            return (
              <div
                key={toast.id}
                className={cx(
                  'animate-slide-in flex items-start gap-3 rounded-2xl border bg-surface p-3.5 shadow-pop',
                  'border-border'
                )}
                role="status"
              >
                <span className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-xl border', tones[toast.tone])}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm font-semibold text-text">{toast.title}</p>
                  {toast.message && <p className="mt-0.5 text-xs leading-relaxed text-muted">{toast.message}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => remove(toast.id)}
                  className="rounded-lg p-1 text-muted transition hover:bg-surface-2 hover:text-text"
                  aria-label="Tutup notifikasi"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast harus digunakan di dalam ToastProvider');
  return context;
}
