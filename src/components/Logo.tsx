import { cx } from '../lib/format';

export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="14" fill="url(#sigemas-mark)" />
      <path
        d="M12 16.5c4-2 8-2 12 0v17c-4-2-8-2-12 0v-17Z"
        fill="#F8FBFF"
        opacity="0.97"
      />
      <path
        d="M36 16.5c-4-2-8-2-12 0v17c4-2 8-2 12 0v-17Z"
        fill="#D6E9FF"
      />
      <path d="M24 16.5v17" stroke="#0D47A1" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15.5 21.5c2.2-.7 4.2-.6 6 .2M15.5 25.5c2.2-.7 4.2-.6 6 .2M26.5 21.7c1.8-.8 3.8-.9 6-.2M26.5 25.7c1.8-.8 3.8-.9 6-.2" stroke="#1E88E5" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="35" cy="12" r="5.5" fill="#FFB300" />
      <path d="M32.8 12h4.4M35 9.8v4.4" stroke="#4A2A00" strokeWidth="1.6" strokeLinecap="round" />
      <defs>
        <linearGradient id="sigemas-mark" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E88E5" />
          <stop offset="1" stopColor="#0D47A1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Logo({
  compact = false,
  className,
  light = false,
}: {
  compact?: boolean;
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={cx('flex items-center gap-2.5', className)}>
      <LogoMark size={compact ? 32 : 40} />
      <div className="min-w-0">
        <p
          className={cx(
            'text-[17px] font-extrabold leading-none tracking-tight',
            light ? 'text-white' : 'text-text'
          )}
        >
          SiGEMAS
        </p>
        {!compact && (
          <p
            className={cx(
              'mt-1 text-[9px] font-semibold uppercase leading-none tracking-[0.18em]',
              light ? 'text-white/60' : 'text-muted'
            )}
          >
            SIBI Learning OS
          </p>
        )}
      </div>
    </div>
  );
}
