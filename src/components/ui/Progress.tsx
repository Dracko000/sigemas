import { cx } from '../../lib/format';

type Tone = 'primary' | 'accent' | 'success' | 'warning' | 'danger';

const fills: Record<Tone, string> = {
  primary: 'gradient-primary',
  accent: 'gradient-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

export function Progress({
  value,
  tone = 'primary',
  label,
  showValue,
  size = 'md',
  className,
}: {
  value: number;
  tone?: Tone;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
          {label && <span className="font-medium text-muted">{label}</span>}
          {showValue && <span className="font-semibold tabular-nums text-text">{clamped}%</span>}
        </div>
      )}
      <div
        className={cx('w-full overflow-hidden rounded-full bg-surface-2', size === 'sm' ? 'h-1.5' : 'h-2.5')}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? `Progres ${clamped}%`}
      >
        <div
          className={cx('h-full rounded-full transition-[width] duration-700 ease-out', fills[tone])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export function ProgressRing({
  value,
  size = 88,
  stroke = 9,
  color = 'var(--primary)',
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (clamped / 100) * circumference}
          style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <span className="text-lg font-extrabold tabular-nums leading-none">{label ?? `${clamped}%`}</span>
        {sublabel && <span className="mt-0.5 text-[10px] font-medium text-muted">{sublabel}</span>}
      </div>
    </div>
  );
}
