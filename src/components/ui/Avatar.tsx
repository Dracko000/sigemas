import { avatarGradient, cx, initials } from '../../lib/format';

const sizes = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
};

export function Avatar({
  name,
  size = 'md',
  className,
  status,
  muted,
}: {
  name: string;
  size?: keyof typeof sizes;
  className?: string;
  status?: 'online' | 'offline' | 'busy';
  muted?: boolean;
}) {
  return (
    <span className={cx('relative inline-flex shrink-0', className)}>
      <span
        className={cx(
          'grid place-items-center rounded-full font-bold text-white ring-2 ring-surface',
          sizes[size],
          muted && 'grayscale'
        )}
        style={{ backgroundImage: avatarGradient(name) }}
        aria-hidden="true"
      >
        {initials(name)}
      </span>
      {status && (
        <span
          className={cx(
            'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface',
            status === 'online' && 'bg-success',
            status === 'offline' && 'bg-muted',
            status === 'busy' && 'bg-accent'
          )}
          aria-label={status === 'online' ? 'Online' : status === 'busy' ? 'Sibuk' : 'Offline'}
        />
      )}
    </span>
  );
}
