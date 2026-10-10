import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  icon?: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-turquoise-500 text-white shadow-glow-turquoise hover:bg-turquoise-400 active:bg-turquoise-600',
  secondary:
    'bg-magenta-500 text-white shadow-glow-magenta hover:bg-magenta-400 active:bg-magenta-600',
  success: 'bg-lime-500 text-ink-900 shadow-pop hover:bg-lime-400 active:bg-lime-600',
  danger: 'bg-ink-800 text-magenta-300 ring-2 ring-magenta-500/60 hover:bg-ink-700 dark:bg-ink-700',
  ghost: 'bg-transparent text-ink-700 hover:bg-ink-900/5 dark:text-ink-200 dark:hover:bg-white/10',
  outline:
    'bg-transparent text-ink-800 ring-2 ring-ink-300 hover:bg-ink-900/5 dark:text-ink-100 dark:ring-ink-600 dark:hover:bg-white/10',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm rounded-xl gap-1.5',
  md: 'h-12 px-5 text-base rounded-2xl gap-2',
  lg: 'h-14 px-6 text-lg rounded-2xl gap-2',
  xl: 'h-16 px-8 text-xl rounded-3xl gap-3',
};

/**
 * Botón base con variantes. Analogía Vue: un `<BaseButton>` con props
 * `variant`/`size` y un `<slot>` (acá es `children`).
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  icon,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center font-display font-bold tracking-tight transition-all duration-150',
        'active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-turquoise-400/50',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {icon && <span className="shrink-0 text-[1.15em] leading-none">{icon}</span>}
      {children}
    </button>
  );
}
