import { useState } from 'react';
import type { CategoryId, GameConfig, TeamColor } from '@/types/game';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { CategoryPicker } from '@/components/game/CategoryPicker';
import { DEFAULT_TEAM_NAMES, MAX_PLAYERS_PER_TEAM, MAX_TEAMS, MIN_TEAMS, TEAM_COLORS, TEAM_THEME } from '@/config/teams';
import { useGameStore } from '@/store/gameStore';
import { randomSeed } from '@/utils/random';
import { cn } from '@/utils/cn';

interface TeamDraft {
  name: string;
  color: TeamColor;
  players: string[];
  playerInput: string;
}

function makeTeam(index: number): TeamDraft {
  return { name: DEFAULT_TEAM_NAMES[index], color: TEAM_COLORS[index], players: [], playerInput: '' };
}

/**
 * Configuración de la partida: categoría + equipos + jugadores.
 * Analogía Vue: cada `useState` es un `ref`; `TeamDraft` es el v-model del form.
 */
export function SetupScreen() {
  const createGame = useGameStore((s) => s.createGame);
  const goHome = useGameStore((s) => s.goHome);

  const [categoryId, setCategoryId] = useState<CategoryId>('principal');
  const [teams, setTeams] = useState<TeamDraft[]>([makeTeam(0), makeTeam(1)]);

  const updateTeam = (index: number, patch: Partial<TeamDraft>) =>
    setTeams((prev) => prev.map((t, i) => (i === index ? { ...t, ...patch } : t)));

  const addPlayer = (index: number) => {
    const team = teams[index];
    const name = team.playerInput.trim();
    if (!name || team.players.length >= MAX_PLAYERS_PER_TEAM) return;
    updateTeam(index, { players: [...team.players, name], playerInput: '' });
  };

  const removePlayer = (index: number, player: string) =>
    updateTeam(index, { players: teams[index].players.filter((p) => p !== player) });

  const valid = teams.every((t) => t.name.trim().length > 0);

  const submit = () => {
    if (!valid) return;
    const config: GameConfig = {
      categoryId,
      seed: randomSeed(),
      teams: teams.map(({ name, color, players }) => ({ name: name.trim(), color, players })),
    };
    createGame(config);
  };

  return (
    <Screen className="gap-5 pb-28">
      <header>
        <h1 className="font-display text-3xl font-black tracking-tight">Nueva partida</h1>
        <p className="text-sm text-ink-600 dark:text-ink-300">
          Elegí el mazo para las rondas 1 a 3. La ronda 4 siempre usa el mazo ⚡ Relámpago.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="font-display text-lg font-bold">1. Categoría</h2>
        <CategoryPicker value={categoryId} onChange={setCategoryId} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">2. Equipos</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={teams.length <= MIN_TEAMS}
              onClick={() => setTeams((prev) => prev.slice(0, -1))}
            >
              −
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={teams.length >= MAX_TEAMS}
              onClick={() => setTeams((prev) => [...prev, makeTeam(prev.length)])}
            >
              +
            </Button>
          </div>
        </div>

        {teams.map((team, index) => {
          const theme = TEAM_THEME[team.color];
          return (
            <Panel key={team.color} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={cn('h-4 w-4 shrink-0 rounded-full', theme.bg)} aria-hidden />
                <TextField
                  value={team.name}
                  maxLength={20}
                  aria-label={`Nombre del equipo ${index + 1}`}
                  onChange={(e) => updateTeam(index, { name: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <TextField
                  value={team.playerInput}
                  placeholder="Agregar jugador (opcional)"
                  maxLength={16}
                  enterKeyHint="done"
                  aria-label={`Jugador del equipo ${team.name}`}
                  onChange={(e) => updateTeam(index, { playerInput: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPlayer(index);
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => addPlayer(index)}
                  disabled={!team.playerInput.trim() || team.players.length >= MAX_PLAYERS_PER_TEAM}
                  aria-label="Agregar jugador"
                >
                  +
                </Button>
              </div>

              {team.players.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {team.players.map((player) => (
                    <li key={player}>
                      <button
                        type="button"
                        onClick={() => removePlayer(index, player)}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold',
                          theme.soft,
                        )}
                        aria-label={`Quitar a ${player}`}
                      >
                        {player} <span aria-hidden>×</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Si cargás jugadores, la app rota quién actúa en cada turno.
              </p>
            </Panel>
          );
        })}
      </section>

      <div className="safe-bottom fixed inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink-50 via-ink-50/95 to-transparent px-4 pt-6 dark:from-ink-900 dark:via-ink-900/95">
        <div className="mx-auto flex max-w-lg gap-2">
          <Button variant="ghost" onClick={goHome}>
            Volver
          </Button>
          <Button size="lg" fullWidth icon="🚀" disabled={!valid} onClick={submit}>
            Crear partida
          </Button>
        </div>
      </div>
    </Screen>
  );
}
