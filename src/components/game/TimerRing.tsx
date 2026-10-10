import { cn } from '@/utils/cn';

interface TimerRingProps {
  secondsLeft: number;
  /** 0..1 */
  progress: number;
  size?: number;
  /** Segundos a partir de los cuales el anillo se pone "urgente". */
  urgentAt?: number;
}

/**
 * Cronómetro circular SVG. El color pasa de turquesa a magenta cuando queda poco.
 */
export function TimerRing({ secondsLeft, progress, size = 132, urgentAt = 5 }: TimerRingProps) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * Math.max(0, Math.min(1, progress));
  const urgent = secondsLeft <= urgentAt;

  return (
    <div
      className={cn('relative shrink-0', urgent && secondsLeft > 0 && 'animate-pulse-ring')}
      style={{ width: size, height: size }}
      role="timer"
      aria-live="off"
      aria-label={`${secondsLeft} segundos restantes`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-ink-900/10 dark:stroke-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          className={cn(
            'transition-[stroke-dasharray,stroke] duration-100 ease-linear',
            urgent ? 'stroke-magenta-500' : 'stroke-turquoise-500',
          )}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            'font-display text-4xl font-black tabular-nums tracking-tight',
            urgent ? 'text-magenta-500' : 'text-ink-900 dark:text-ink-50',
          )}
        >
          {secondsLeft}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">seg</span>
      </div>
    </div>
  );
}
