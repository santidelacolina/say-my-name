import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Screen } from '@/components/ui/Screen';
import { RoundSteps } from '@/components/game/RoundSteps';
import { Scoreboard } from '@/components/game/Scoreboard';
import { TEAM_THEME } from '@/config/teams';
import { useSound } from '@/hooks/useSound';
import { selectActivePlayer, selectActiveTeam, selectCurrentRound, useGameStore } from '@/store/gameStore';
import { cn } from '@/utils/cn';

/** Pantalla de "pasá el celular": muestra quién actúa y arranca el turno. */
export function TurnReadyScreen() {
  const round = useGameStore(selectCurrentRound);
  const roundIndex = useGameStore((s) => s.roundIndex);
  const team = useGameStore(selectActiveTeam);
  const player = useGameStore(selectActivePlayer);
  const teams = useGameStore((s) => s.teams);
  const startTurn = useGameStore((s) => s.startTurn);
  const { play, unlock } = useSound();

  if (!team) return null;
  const theme = TEAM_THEME[team.color];

  return (
    <Screen className="gap-5">
      <RoundSteps current={roundIndex} />

      <Panel className="space-y-4 text-center animate-pop">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-ink-500">Turno de</p>
        <div
          className={cn(
            'mx-auto inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-5 py-2 font-display text-2xl font-black text-white shadow-pop',
            theme.gradient,
          )}
        >
          {team.name}
        </div>

        <div>
          <p className="text-sm text-ink-600 dark:text-ink-300">
            {player ? 'Pasale el celular a' : 'Jugador activo:'}
          </p>
          <p className="font-display text-4xl font-black tracking-tight">
            {player ?? 'quien actúa ahora'}
          </p>
        </div>

        <div className="rounded-2xl bg-ink-900/5 p-3 text-sm dark:bg-white/5">
          <p className="font-bold">
            {round.emoji} {round.subtitle} · ⏱️ {round.seconds}s{round.timerPerCard ? ' por carta' : ''}
          </p>
          <p className="mt-1 text-ink-600 dark:text-ink-300">{round.description}</p>
        </div>

        <p className="text-xs text-ink-500">
          El resto del equipo no debe ver la pantalla. Apretá cuando estés listo: el cronómetro arranca
          al instante.
        </p>
      </Panel>

      <Scoreboard teams={teams} activeTeamId={team.id} compact />

      <div className="mt-auto">
        <Button
          size="xl"
          fullWidth
          variant="secondary"
          icon="⏱️"
          onClick={() => {
            unlock();
            play('roundStart');
            startTurn();
          }}
        >
          ¡Listo, empezar!
        </Button>
      </div>
    </Screen>
  );
}
