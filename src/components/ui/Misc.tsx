import type { ComponentType, ReactNode } from 'react';
import { cx } from '../../lib/format';

export function SectionHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('mb-4 flex flex-wrap items-end justify-between gap-3', className)}>
      <div>
        <h2 className="text-lg font-bold tracking-tight text-text sm:text-xl">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const statTones = {
  primary: 'bg-primary-soft text-primary-strong dark:text-primary',
  accent: 'bg-accent-soft text-accent-strong dark:text-accent',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  info: 'bg-info-soft text-info',
  danger: 'bg-danger-soft text-danger',
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'primary',
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: ComponentType<{ className?: string }>;
  tone?: keyof typeof statTones;
  className?: string;
}) {
  return (
    <div className={cx('rounded-card border border-border bg-surface p-4 shadow-card sm:p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold text-muted">{label}</p>
        <span className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-xl', statTones[tone])}>
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-extrabold tracking-tight tabular-nums text-text sm:text-[28px]">
        {value}
      </p>
      {hint && <div className="mt-1 text-[11px] leading-relaxed text-muted">{hint}</div>}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('flex flex-col items-center justify-center px-6 py-12 text-center', className)}>
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary-strong dark:text-primary">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-base font-bold text-text">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx('shimmer rounded-xl', className)} aria-hidden="true" />;
}

export function PageLoader({ label = 'Memuat data…' }: { label?: string }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label={label}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Skeleton className="h-80 xl:col-span-2" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cx('h-px w-full bg-border', className)} />;
}
