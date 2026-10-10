import type { Team } from '@/types/game';
import { TeamBadge } from './TeamBadge';

interface ScoreboardProps {
  teams: Team[];
  activeTeamId?: string;
  compact?: boolean;
}

/** Marcador en tiempo real: una fila por equipo. */
export function Scoreboard({ teams, activeTeamId, compact }: ScoreboardProps) {
  return (
    <div className={compact ? 'grid grid-cols-2 gap-2' : 'flex flex-col gap-2'}>
      {teams.map((team) => (
        <TeamBadge key={team.id} team={team} active={team.id === activeTeamId} compact={compact} />
      ))}
    </div>
  );
}
