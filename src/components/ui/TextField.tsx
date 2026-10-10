import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export function TextField({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-12 w-full rounded-2xl bg-white px-4 text-base text-ink-900 ring-2 ring-ink-200 outline-none transition placeholder:text-ink-400',
        'focus:ring-turquoise-500 dark:bg-ink-800 dark:text-ink-50 dark:ring-ink-600',
        className,
      )}
      {...rest}
    />
  );
}
