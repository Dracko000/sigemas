import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cx } from '../../lib/format';

const baseField =
  'w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/12 disabled:cursor-not-allowed disabled:opacity-55';

function Label({ htmlFor, children, required }: { htmlFor: string; children: ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-text">
      {children}
      {required && (
        <span className="ml-0.5 text-danger" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

function Messages({ hint, error, id }: { hint?: string; error?: string; id: string }) {
  if (!hint && !error) return null;
  return (
    <p id={id} className={cx('mt-1.5 text-[11px] leading-relaxed', error ? 'text-danger' : 'text-muted')}>
      {error || hint}
    </p>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
  suffix?: ReactNode;
}

export function Input({ label, hint, error, icon, suffix, className, id, required, ...rest }: InputProps) {
  const generated = useId();
  const fieldId = id || generated;
  return (
    <div>
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
            {icon}
          </span>
        )}
        <input
          {...rest}
          id={fieldId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={hint || error ? `${fieldId}-msg` : undefined}
          className={cx(baseField, icon ? 'pl-10' : undefined, suffix ? 'pr-11' : undefined, className)}
        />
        {suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2">{suffix}</span>}
      </div>
      <Messages id={`${fieldId}-msg`} hint={hint} error={error} />
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function Textarea({ label, hint, error, className, id, required, ...rest }: TextareaProps) {
  const generated = useId();
  const fieldId = id || generated;
  return (
    <div>
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      <textarea
        {...rest}
        id={fieldId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={hint || error ? `${fieldId}-msg` : undefined}
        className={cx(baseField, 'min-h-24 resize-y', className)}
      />
      <Messages id={`${fieldId}-msg`} hint={hint} error={error} />
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function Select({ label, hint, error, className, id, required, children, ...rest }: SelectProps) {
  const generated = useId();
  const fieldId = id || generated;
  return (
    <div>
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      <select
        {...rest}
        id={fieldId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={hint || error ? `${fieldId}-msg` : undefined}
        className={cx(baseField, 'cursor-pointer appearance-none pr-9', className)}
      >
        {children}
      </select>
      <Messages id={`${fieldId}-msg`} hint={hint} error={error} />
    </div>
  );
}
