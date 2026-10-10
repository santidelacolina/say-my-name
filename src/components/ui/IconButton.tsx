import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function IconButton({ label, className, children, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'glass inline-flex h-11 w-11 items-center justify-center rounded-full text-xl shadow-pop ring-1 ring-ink-900/5 transition active:scale-95 dark:ring-white/10',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
