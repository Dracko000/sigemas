import type { ComponentType } from 'react';
import { cx } from '../../lib/format';

export interface TabItem {
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  count?: number;
}

export function Tabs({
  items,
  value,
  onChange,
  variant = 'pill',
  className,
}: {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  variant?: 'pill' | 'underline';
  className?: string;
}) {
  if (variant === 'underline') {
    return (
      <div className={cx('flex gap-1 overflow-x-auto border-b border-border no-scrollbar', className)} role="tablist">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.id === value;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(item.id)}
              className={cx(
                'relative inline-flex shrink-0 items-center gap-2 px-4 py-2.5 text-sm font-semibold transition',
                active ? 'text-primary-strong dark:text-primary' : 'text-muted hover:text-text'
              )}
            >
              {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
              {item.label}
              {item.count !== undefined && (
                <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] font-bold text-muted">
                  {item.count}
                </span>
              )}
              {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cx('inline-flex flex-wrap gap-1 rounded-2xl border border-border bg-surface-2 p-1', className)}
      role="tablist"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cx(
              'inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition',
              active ? 'bg-surface text-text shadow-sm' : 'text-muted hover:text-text'
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
            {item.label}
            {item.count !== undefined && (
              <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] font-bold text-muted">
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
