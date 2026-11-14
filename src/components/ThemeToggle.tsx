import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cx } from '../lib/format';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      className={cx(
        'grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-muted transition hover:border-primary/40 hover:bg-primary-soft/40 hover:text-primary-strong dark:hover:text-primary',
        className
      )}
      aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      title={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
    >
      {theme === 'dark' ? (
        <Sun className="h-4.5 w-4.5" aria-hidden="true" />
      ) : (
        <Moon className="h-4.5 w-4.5" aria-hidden="true" />
      )}
    </button>
  );
}
