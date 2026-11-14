import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../lib/format';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  children: ReactNode;
}

export function Card({ interactive, className, children, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={cx(
        'rounded-card border border-border bg-surface shadow-card',
        interactive && 'card-hover cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('p-5 sm:p-6', className)}>{children}</div>;
}
