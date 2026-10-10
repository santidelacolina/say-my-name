import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ChipProps {
  children: ReactNode;
  className?: string;
  tone?: 'neutral' | 'turquoise' | 'magenta' | 'danger' | 'success';
}

const TONES = {
  neutral: 'bg-ink-900/8 text-ink-700 dark:bg-white/10 dark:text-ink-200',
  turquoise: 'bg-turquoise-500/15 text-turquoise-700 dark:text-turquoise-300',
  magenta: 'bg-magenta-500/15 text-magenta-700 dark:text-magenta-300',
  danger: 'bg-magenta-500/15 text-magenta-700 dark:text-magenta-300 line-through',
  success: 'bg-lime-500/25 text-lime-700 dark:text-lime-300',
};

export function Chip({ children, className, tone = 'neutral' }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
