import type { CardOutcome } from '@/types/game';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Screen } from '@/components/ui/Screen';
import { Scoreboard } from '@/components/game/Scoreboard';
import { TOTAL_ROUNDS } from '@/config/rounds';
import { TEAM_THEME } from '@/config/teams';
import { selectActiveTeam, selectCurrentRound, useGameStore } from '@/store/gameStore';
import { cn } from '@/utils/cn';

const OUTCOME_META: Record<CardOutcome, { icon: string; label: string; tone: string }> = {
  guessed: { icon: '✅', label: '+1', tone: 'text-lime-700 dark:text-lime-300' },
  skipped: { icon: '⏭️', label: 'saltada', tone: 'text-ink-500' },
  foul: { icon: '🚫', label: 'falta', tone: 'text-magenta-600 dark:text-magenta-300' },
  timeout: { icon: '⏱️', label: 'sin tiempo', tone: 'text-ink-500' },
};

/** Resumen del turno: puntos ganados y detalle de cada carta. */
export function TurnSummaryScreen() {
  const round = useGameStore(selectCurrentRound);
  const roundIndex = useGameStore((s) => s.roundIndex);
  const team = useGameStore(selectActiveTeam);
  const teams = useGameStore((s) => s.teams);
  const turnTeamIndex = useGameStore((s) => s.turnTeamIndex);
  const turnResults = useGameStore((s) => s.turnResults);
  const nextTurn = useGameStore((s) => s.nextTurn);

  if (!team) return null;
  const theme = TEAM_THEME[team.color];
  const points = turnResults.filter((r) => r.outcome === 'guessed').length;

  const isLastTeam = turnTeamIndex === teams.length - 1;
  const isLastRound = roundIndex === TOTAL_ROUNDS - 1;
  const nextLabel = !isLastTeam
    ? `Siguiente: ${teams[turnTeamIndex + 1].name}`
    : isLastRound
      ? 'Ver resultados finales'
      : `Ir a la ronda ${roundIndex + 2}`;

  return (
    <Screen className="gap-4">
      <header className="text-center animate-pop">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-ink-500">
          {round.title} · {round.subtitle}
        </p>
        <h1 className="font-display text-3xl font-black tracking-tight">¡Tiempo!</h1>
        <div
          className={cn(
            'mx-auto mt-3 inline-flex items-baseline gap-2 rounded-3xl bg-gradient-to-r px-6 py-3 text-white shadow-pop',
            theme.gradient,
          )}
        >
          <span className="font-display text-lg font-bold">{team.name}</span>
          <span className="font-display text-5xl font-black tabular-nums">+{points}</span>
        </div>
      </header>

      <Panel className="max-h-[38vh] overflow-y-auto">
        {turnResults.length === 0 ? (
          <p className="text-center text-sm text-ink-500">No se jugó ninguna carta.</p>
        ) : (
          <ul className="divide-y divide-ink-900/5 dark:divide-white/10">
            {turnResults.map((result, i) => {
              const meta = OUTCOME_META[result.outcome];
              return (
                <li key={`${result.card.id}-${i}`} className="flex items-center justify-between py-2 text-sm">
                  <span className="flex items-center gap-2 font-semibold">
                    <span aria-hidden>{meta.icon}</span>
                    {result.card.text}
                  </span>
                  <span className={cn('text-xs font-bold uppercase', meta.tone)}>{meta.label}</span>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      <Scoreboard teams={teams} activeTeamId={team.id} compact />

      <div className="mt-auto">
        <Button size="xl" fullWidth icon="➡️" onClick={nextTurn}>
          {nextLabel}
        </Button>
      </div>
    </Screen>
  );
}
