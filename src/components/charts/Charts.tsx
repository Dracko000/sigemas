import { useId, useState } from 'react';
import { cx } from '../../lib/format';

interface Point {
  label: string;
  value: number;
  secondary?: number;
}

const W = 640;
const H = 220;
const PAD = { top: 18, right: 18, bottom: 30, left: 36 };

function catmullRom(points: { x: number; y: number }[]) {
  if (!points.length) return '';
  return points.reduce((d, point, index, arr) => {
    if (index === 0) return `M ${point.x},${point.y}`;
    const p0 = arr[index - 2] || arr[index - 1];
    const p1 = arr[index - 1];
    const p2 = point;
    const p3 = arr[index + 1] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    return `${d} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }, '');
}

export function AreaChart({
  data,
  height = 220,
  color = '#1E88E5',
  secondaryColor = '#FF9800',
  primaryLabel = 'Nilai',
  secondaryLabel,
  suffix = '',
  className,
}: {
  data: Point[];
  height?: number;
  color?: string;
  secondaryColor?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  suffix?: string;
  className?: string;
}) {
  const gradientId = `area-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const [hover, setHover] = useState<number | null>(null);
  const values = data.flatMap((d) => [d.value, d.secondary ?? d.value]);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const min = Math.max(0, Math.floor((rawMin - 6) / 5) * 5);
  const max = Math.ceil((rawMax + 4) / 5) * 5 || 10;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const xFor = (index: number) =>
    data.length === 1 ? PAD.left + innerW / 2 : PAD.left + (index / (data.length - 1)) * innerW;
  const yFor = (value: number) =>
    PAD.top + innerH - ((value - min) / (max - min || 1)) * innerH;
  const points = data.map((d, index) => ({ x: xFor(index), y: yFor(d.value) }));
  const secPoints = data.map((d, index) => ({
    x: xFor(index),
    y: yFor(d.secondary ?? d.value),
  }));
  const line = catmullRom(points);
  const secLine = catmullRom(secPoints);
  const area = `${line} L ${points[points.length - 1]?.x ?? PAD.left},${PAD.top + innerH} L ${points[0]?.x ?? PAD.left},${PAD.top + innerH} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const last = data[data.length - 1];

  return (
    <figure className={cx('relative', className)}>
      <div className="relative w-full" style={{ aspectRatio: `640 / ${height}` }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-full w-full overflow-visible"
          role="img"
          aria-label={`Grafik ${primaryLabel}: ${data.map((d) => `${d.label} ${d.value}${suffix}`).join(', ')}`}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.24" />
              <stop offset="100%" stopColor={color} stopOpacity="0.01" />
            </linearGradient>
          </defs>
          {ticks.map((tick) => {
            const y = PAD.top + innerH * tick;
            const value = Math.round(max - (max - min) * tick);
            return (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={W - PAD.right}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth="1"
                  strokeDasharray={tick === 1 ? '0' : '4 6'}
                  opacity={0.8}
                />
                <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="var(--muted)">
                  {value}
                </text>
              </g>
            );
          })}
          {data.map((d, index) => (
            <text
              key={d.label}
              x={xFor(index)}
              y={H - 8}
              textAnchor="middle"
              fontSize="10"
              fill="var(--muted)"
            >
              {d.label}
            </text>
          ))}
          <path d={area} fill={`url(#${gradientId})`} />
          {data[0]?.secondary !== undefined && (
            <path
              d={secLine}
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="5 6"
              opacity="0.75"
            />
          )}
          <path d={line} fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
          {points.map((point, index) => (
            <g key={data[index].label}>
              <circle
                cx={point.x}
                cy={point.y}
                r={hover === index ? 5.5 : 3.5}
                fill="var(--surface)"
                stroke={color}
                strokeWidth="2.4"
                tabIndex={0}
                role="button"
                aria-label={`${data[index].label}: ${data[index].value}${suffix}`}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(index)}
                onBlur={() => setHover(null)}
                className="cursor-pointer outline-none"
              >
                <title>{`${data[index].label}: ${data[index].value}${suffix}`}</title>
              </circle>
            </g>
          ))}
          {last && (
            <g>
              <rect
                x={Math.min(xFor(data.length - 1) - 24, W - PAD.right - 48)}
                y={yFor(last.value) - 28}
                width="48"
                height="20"
                rx="8"
                fill="var(--text)"
                opacity="0.92"
              />
              <text
                x={Math.min(xFor(data.length - 1), W - PAD.right - 24)}
                y={yFor(last.value) - 14}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="var(--surface)"
              >
                {last.value}
                {suffix}
              </text>
            </g>
          )}
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl border border-border bg-surface px-2.5 py-1.5 text-[11px] shadow-pop"
            style={{
              left: `${(xFor(hover) / W) * 100}%`,
              top: `${(yFor(data[hover].value) / H) * 100 - 2}%`,
            }}
          >
            <p className="font-semibold text-text">{data[hover].label}</p>
            <p className="text-muted">
              {primaryLabel}: <span className="font-bold text-text">{data[hover].value}{suffix}</span>
            </p>
            {data[hover].secondary !== undefined && (
              <p className="text-muted">
                {secondaryLabel || 'Pembanding'}:{' '}
                <span className="font-bold text-text">{data[hover].secondary}{suffix}</span>
              </p>
            )}
          </div>
        )}
      </div>
      <figcaption className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: color }} />
          {primaryLabel}
        </span>
        {secondaryLabel && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full" style={{ background: secondaryColor }} />
            {secondaryLabel}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

export function BarChart({
  data,
  color = '#1E88E5',
  height = 200,
  suffix = '',
  target,
  className,
}: {
  data: { label: string; value: number; color?: string }[];
  color?: string;
  height?: number;
  suffix?: string;
  target?: number;
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), target || 0, 1) * 1.15;
  return (
    <div className={cx('w-full', className)}>
      <div className="relative flex items-end gap-1.5 sm:gap-2.5" style={{ height }} role="img" aria-label={data.map((d) => `${d.label} ${d.value}${suffix}`).join(', ')}>
        {target !== undefined && (
          <div
            className="pointer-events-none absolute inset-x-0 border-t border-dashed border-warning/60"
            style={{ bottom: `${(target / max) * 100}%` }}
          >
            <span className="absolute -top-4 right-0 rounded bg-warning-soft px-1.5 py-0.5 text-[9px] font-semibold text-warning">
              target {target}{suffix}
            </span>
          </div>
        )}
        {data.map((item) => (
          <div key={item.label} className="group relative flex h-full min-w-0 flex-1 flex-col justify-end">
            <span className="mb-1 text-center text-[10px] font-bold tabular-nums text-text opacity-80">
              {item.value}
            </span>
            <div
              className="w-full rounded-t-lg transition-all duration-500 hover:brightness-110"
              style={{
                height: `${Math.max(3, (item.value / max) * 100)}%`,
                background: item.color || color,
                opacity: 0.9,
              }}
              title={`${item.label}: ${item.value}${suffix}`}
            />
            <span className="mt-1.5 truncate text-center text-[9px] font-medium text-muted sm:text-[10px]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <p className="sr-only">
        {data.map((d) => `${d.label}: ${d.value}${suffix}`).join('. ')}
      </p>
    </div>
  );
}

export function DonutChart({
  data,
  size = 168,
  thickness = 18,
  centerValue,
  centerLabel,
  className,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerValue?: string | number;
  centerLabel?: string;
  className?: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const gradientId = `donut-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  let offset = 0;

  return (
    <div className={cx('flex flex-wrap items-center gap-5', className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          role="img"
          aria-label={data.map((d) => `${d.label} ${d.value}`).join(', ')}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#1E88E5" />
              <stop offset="1" stopColor="#0D47A1" />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--surface-2)" strokeWidth={thickness} />
          {total > 0 &&
            data.map((item) => {
              const fraction = item.value / total;
              const dash = Math.max(0, fraction * circumference - 2.5);
              const element = (
                <circle
                  key={item.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={thickness}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                >
                  <title>{`${item.label}: ${item.value} (${Math.round(fraction * 100)}%)`}</title>
                </circle>
              );
              offset += fraction * circumference;
              return element;
            })}
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center">
          <span className="text-2xl font-extrabold tabular-nums leading-none text-text">
            {centerValue ?? total}
          </span>
          {centerLabel && <span className="mt-1 text-[10px] font-semibold text-muted">{centerLabel}</span>}
        </div>
      </div>
      <ul className="min-w-[120px] space-y-2">
        {data.map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-2 text-muted">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
              {item.label}
            </span>
            <span className="font-bold tabular-nums text-text">
              {item.value}
              {total > 0 && (
                <span className="ml-1 font-medium text-muted">
                  {Math.round((item.value / total) * 100)}%
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Sparkline({
  values,
  color = '#1E88E5',
  width = 120,
  height = 36,
  className,
}: {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const points = values.map((value, index) => ({
    x: (index / Math.max(values.length - 1, 1)) * width,
    y: height - ((value - min) / (max - min || 1)) * (height - 6) - 3,
  }));
  const path = catmullRom(points);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden="true">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}
