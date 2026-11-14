import { useId } from 'react';
import { cx } from '../lib/format';

export function SigemasMascot({
  size = 180,
  className,
  decorative = false,
  wave = false,
}: {
  size?: number;
  className?: string;
  decorative?: boolean;
  wave?: boolean;
}) {
  const raw = useId();
  const uid = raw.replace(/[^a-zA-Z0-9]/g, '');
  const cover = `cover-${uid}`;
  const accent = `accent-${uid}`;
  const shine = `shine-${uid}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cx(wave && 'animate-floaty', className)}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : 'SiGEMAS, maskot buku pintar'}
    >
      <defs>
        <linearGradient id={cover} x1="40" y1="60" x2="220" y2="210" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E88E5" />
          <stop offset="0.55" stopColor="#1565C0" />
          <stop offset="1" stopColor="#0D47A1" />
        </linearGradient>
        <linearGradient id={accent} x1="90" y1="90" x2="190" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB300" />
          <stop offset="1" stopColor="#FF9800" />
        </linearGradient>
        <linearGradient id={shine} x1="70" y1="80" x2="120" y2="190" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <ellipse cx="130" cy="237" rx="72" ry="10" fill="#0D47A1" opacity="0.12" />

      {/* graduation cap */}
      <g transform="rotate(-8 132 52)">
        <path d="M132 24 205 52l-73 28-73-28 73-28Z" fill="#082A52" />
        <path d="M132 34 188 56l-56 21-56-21 56-21Z" fill="#0D47A1" />
        <path d="M74 56v18c0 9 26 17 58 17s58-8 58-17V56" stroke="#FFB300" strokeWidth="4" />
        <path d="M196 58v30" stroke="#FFB300" strokeWidth="3" strokeLinecap="round" />
        <circle cx="196" cy="92" r="5.5" fill="#FFB300" />
      </g>

      {/* feet */}
      <rect x="73" y="211" width="38" height="19" rx="9.5" fill="#0B3E7A" />
      <rect x="149" y="211" width="38" height="19" rx="9.5" fill="#0B3E7A" />

      {/* arms */}
      <g transform={wave ? 'rotate(-18 45 154)' : undefined}>
        <rect x="24" y="138" width="34" height="16" rx="8" fill="#1565C0" transform="rotate(-18 24 138)" />
        <circle cx="28" cy="135" r="12" fill="#FFE0B2" />
      </g>
      <rect x="202" y="138" width="34" height="16" rx="8" fill="#1565C0" transform="rotate(18 236 138)" />
      <circle cx="232" cy="135" r="12" fill="#FFE0B2" />

      {/* book body */}
      <rect x="46" y="62" width="168" height="150" rx="26" fill={`url(#${cover})`} />
      <rect x="46" y="62" width="24" height="150" rx="12" fill="#0B3E7A" />
      <rect x="46" y="62" width="168" height="150" rx="26" fill={`url(#${shine})`} />

      {/* page stack */}
      <rect x="200" y="78" width="20" height="116" rx="8" fill="#F8FBFF" />
      <path d="M206 94h8M206 110h8M206 126h8M206 142h8M206 158h8" stroke="#CBD9E8" strokeWidth="3" strokeLinecap="round" />

      {/* bookmark */}
      <path d="M164 62h22v55l-11-9-11 9V62Z" fill={`url(#${accent})`} />
      <path d="M168 70h14" stroke="#FFE0B2" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />

      {/* face card */}
      <rect x="81" y="94" width="94" height="80" rx="20" fill="#F8FBFF" />
      <rect x="81" y="94" width="94" height="80" rx="20" fill="#EAF3FF" opacity="0.5" />

      {/* eyes */}
      <circle cx="109" cy="126" r="10" fill="#0D47A1" />
      <circle cx="143" cy="126" r="10" fill="#0D47A1" />
      <circle cx="112" cy="122.5" r="3.5" fill="#ffffff" />
      <circle cx="146" cy="122.5" r="3.5" fill="#ffffff" />
      <circle cx="106.5" cy="129" r="1.8" fill="#ffffff" opacity="0.8" />
      <circle cx="140.5" cy="129" r="1.8" fill="#ffffff" opacity="0.8" />

      {/* cheeks and smile */}
      <ellipse cx="96" cy="144" rx="8" ry="4.5" fill="#FFB74D" opacity="0.75" />
      <ellipse cx="156" cy="144" rx="8" ry="4.5" fill="#FFB74D" opacity="0.75" />
      <path d="M114 145c4 7 12 11 20 10 6 0 11-3 14-8" stroke="#0D47A1" strokeWidth="4" strokeLinecap="round" />

      {/* cover details */}
      <path d="M68 186h58" stroke="#7CC4FF" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
      <path d="M68 198h36" stroke="#7CC4FF" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
      <circle cx="186" cy="190" r="14" fill={`url(#${accent})`} />
      <path d="M180 190h12M186 184v12" stroke="#4A2A00" strokeWidth="2.6" strokeLinecap="round" />

      {/* sparkles */}
      <path d="M226 82l3.2 7.4 7.4 3.2-7.4 3.2-3.2 7.4-3.2-7.4-7.4-3.2 7.4-3.2L226 82Z" fill="#FFB300" />
      <path d="M36 100l2.2 5 5 2.2-5 2.2-2.2 5-2.2-5-5-2.2 5-2.2 2.2-5Z" fill="#64B5F6" />
    </svg>
  );
}
