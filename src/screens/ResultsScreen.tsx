import { useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Screen } from '@/components/ui/Screen';
import { Confetti } from '@/components/game/Confetti';
import { TEAM_THEME } from '@/config/teams';
import { useSound } from '@/hooks/useSound';
import { rankTeams, useGameStore } from '@/store/gameStore';
import { randomSeed } from '@/utils/random';
import { cn } from '@/utils/cn';

const MEDALS = ['🥇', '🥈', '🥉', '🏅'];

export function ResultsScreen() {
  const teams = useGameStore((s) => s.teams);
  const ranking = useMemo(() => rankTeams(teams), [teams]);
  const categoryId = useGameStore((s) => s.categoryId);
  const createGame = useGameStore((s) => s.createGame);
  const resetGame = useGameStore((s) => s.resetGame);
  const { play } = useSound();
  const played = useRef(false);

  useEffect(() => {
    if (played.current) return;
    played.current = true;
    play('fanfare');
  }, [play]);

  const winner = ranking[0];
  const tie = ranking.length > 1 && ranking[0].score === ranking[1].score;

  /** Revancha: mismos equipos y categoría, mazo nuevo. */
  const rematch = () =>
    createGame({
      categoryId,
      seed: randomSeed(),
      teams: ranking.map(({ name, color, players }) => ({ name, color, players })),
    });

  return (
    <Screen className="gap-5">
      <Confetti />
      <header className="text-center animate-pop">
        <div className="text-7xl animate-wiggle" aria-hidden>
          🏆
        </div>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.3em] text-ink-500">Resultado final</p>
        <h1 className="font-display text-4xl font-black tracking-tight">
          {tie ? '¡Empate!' : `¡Ganan ${winner?.name}!`}
        </h1>
        <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">
          {tie ? 'Campeones compartidos del caos.' : 'Campeones del caos.'}
        </p>
      </header>

      <ol className="space-y-2">
        {ranking.map((team, i) => {
          const theme = TEAM_THEME[team.color];
          return (
            <li key={team.id} style={{ animationDelay: `${i * 80}ms` }} className="animate-fade-up">
              <Panel className={cn('flex items-center gap-3', i === 0 && !tie && cn('ring-2', theme.ring))}>
                <span className="text-3xl" aria-hidden>
                  {MEDALS[i] ?? MEDALS[3]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg font-bold">{team.name}</p>
                  {team.players.length > 0 && (
                    <p className="truncate text-xs text-ink-500">{team.players.join(', ')}</p>
                  )}
                </div>
                <span className={cn('font-display text-4xl font-black tabular-nums', theme.text)}>
                  {team.score}
                </span>
              </Panel>
            </li>
          );
        })}
      </ol>

      <details className="rounded-2xl bg-ink-900/5 p-3 text-sm dark:bg-white/5">
        <summary className="cursor-pointer font-bold">Cartas adivinadas por equipo</summary>
        <div className="mt-3 space-y-3">
          {ranking.map((team) => (
            <div key={team.id}>
              <p className="font-semibold">{team.name}</p>
              <p className="text-ink-600 dark:text-ink-300">
                {team.guessed.length ? team.guessed.map((c) => c.text).join(' · ') : 'Ninguna 😅'}
              </p>
            </div>
          ))}
        </div>
      </details>

      <div className="mt-auto flex flex-col gap-2">
        <Button size="xl" fullWidth icon="🔁" onClick={rematch}>
          Revancha
        </Button>
        <Button variant="ghost" fullWidth onClick={resetGame}>
          Volver al inicio
        </Button>
      </div>
    </Screen>
  );
}
