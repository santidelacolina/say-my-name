import { ROUNDS } from '@/config/rounds';
import { cn } from '@/utils/cn';

interface RoundStepsProps {
  current: number;
}

/** Indicador de progreso de las 4 rondas. */
export function RoundSteps({ current }: RoundStepsProps) {
  return (
    <ol className="flex items-center justify-center gap-2" aria-label="Progreso de rondas">
      {ROUNDS.map((round, i) => (
        <li
          key={round.number}
          aria-current={i === current ? 'step' : undefined}
          className={cn(
            'flex h-8 items-center gap-1 rounded-full px-2.5 text-xs font-bold transition-all',
            i < current && 'bg-turquoise-500/20 text-turquoise-700 dark:text-turquoise-300',
            i === current && 'bg-magenta-500 text-white shadow-glow-magenta',
            i > current && 'bg-ink-900/8 text-ink-400 dark:bg-white/10',
          )}
        >
          <span aria-hidden>{round.emoji}</span>
          <span className={i === current ? '' : 'sr-only sm:not-sr-only'}>R{round.number}</span>
        </li>
      ))}
    </ol>
  );
}
