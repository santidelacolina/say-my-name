import type { Team } from '@/types/game';
import { TEAM_THEME } from '@/config/teams';
import { cn } from '@/utils/cn';

interface TeamBadgeProps {
  team: Team;
  active?: boolean;
  compact?: boolean;
}

/** Pastilla con el nombre del equipo y su puntaje, coloreada según el equipo. */
export function TeamBadge({ team, active, compact }: TeamBadgeProps) {
  const theme = TEAM_THEME[team.color];
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-2xl px-3 py-2 transition-all',
        theme.soft,
        active && cn('ring-2 scale-[1.02]', theme.ring),
        compact && 'px-2.5 py-1.5',
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className={cn('h-3 w-3 shrink-0 rounded-full', theme.bg)} aria-hidden />
        <span className={cn('truncate font-display font-bold', compact ? 'text-sm' : 'text-base')}>
          {team.name}
        </span>
      </div>
      <span
        className={cn(
          'font-display font-black tabular-nums',
          compact ? 'text-lg' : 'text-2xl',
        )}
        aria-label={`${team.score} puntos`}
      >
        {team.score}
      </span>
    </div>
  );
}
