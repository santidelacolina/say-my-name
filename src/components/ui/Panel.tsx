import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

/** Tarjeta/contenedor con fondo translúcido, bordes redondeados y sombra. */
export function Panel({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'glass rounded-3xl p-4 shadow-pop ring-1 ring-ink-900/5 dark:ring-white/10',
        className,
      )}
      {...rest}
    />
  );
}
