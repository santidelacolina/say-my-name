import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CardData,
  CardOutcome,
  CategoryId,
  GameConfig,
  Phase,
  RoundConfig,
  Team,
  TurnCardResult,
} from '@/types/game';
import { ROUNDS, TOTAL_ROUNDS } from '@/config/rounds';
import { buildDeck } from '@/utils/cards';
import { newId } from '@/utils/random';
import { decodeGameConfig, encodeGameConfig } from '@/utils/shareCode';

/**
 * Store principal del juego.
 *
 * Analogía .NET: es un servicio Singleton con estado + eventos, donde cada
 * acción es un método público que muta el estado de forma inmutable
 * (como un reducer). Los componentes se "suscriben" con `useGameStore(selector)`,
 * igual que un `computed` de Vue sobre un store de Pinia.
 */
interface GameState {
  phase: Phase;
  categoryId: CategoryId;
  seed: number;
  shareCode: string | null;
  teams: Team[];
  /** 0..3 */
  roundIndex: number;
  /** Índice del equipo que está jugando el turno actual. */
  turnTeamIndex: number;
  /** Cartas restantes del mazo de la ronda actual. */
  deck: CardData[];
  currentCard: CardData | null;
  turnResults: TurnCardResult[];
  /** Cartas sacadas en el turno (para el límite de Relámpago). */
  turnCardsDrawn: number;

  // Navegación
  goHome: () => void;
  openSetup: () => void;
  openJoin: () => void;

  // Ciclo de vida de la partida
  createGame: (config: GameConfig) => void;
  joinGame: (code: string) => boolean;
  resetGame: () => void;

  // Flujo de rondas y turnos
  startRound: () => void;
  startTurn: () => void;
  resolveCard: (outcome: CardOutcome) => void;
  endTurn: () => void;
  nextTurn: () => void;
}

const initialState = {
  phase: 'home' as Phase,
  categoryId: 'principal' as CategoryId,
  seed: 0,
  shareCode: null as string | null,
  teams: [] as Team[],
  roundIndex: 0,
  turnTeamIndex: 0,
  deck: [] as CardData[],
  currentCard: null as CardData | null,
  turnResults: [] as TurnCardResult[],
  turnCardsDrawn: 0,
};

/** Semilla distinta por ronda para que el orden del mazo cambie en cada una. */
function roundSeed(seed: number, roundIndex: number): number {
  return (seed + roundIndex * 7919) >>> 0;
}

function deckForRound(categoryId: CategoryId, seed: number, roundIndex: number): CardData[] {
  const round = ROUNDS[roundIndex];
  const deckCategory: CategoryId = round.deck === 'relampago' ? 'relampago' : categoryId;
  return buildDeck(deckCategory, roundSeed(seed, roundIndex));
}

function teamsFromConfig(config: GameConfig): Team[] {
  return config.teams.map((t) => ({
    id: newId('team'),
    name: t.name,
    color: t.color,
    players: t.players,
    nextPlayerIndex: 0,
    score: 0,
    guessed: [],
  }));
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      goHome: () => set({ phase: 'home' }),
      openSetup: () => set({ phase: 'setup' }),
      openJoin: () => set({ phase: 'join' }),

      createGame: (config) => {
        set({
          ...initialState,
          phase: 'round-intro',
          categoryId: config.categoryId,
          seed: config.seed,
          shareCode: encodeGameConfig(config),
          teams: teamsFromConfig(config),
          deck: deckForRound(config.categoryId, config.seed, 0),
        });
      },

      joinGame: (code) => {
        const config = decodeGameConfig(code);
        if (!config) return false;
        get().createGame(config);
        return true;
      },

      resetGame: () => set({ ...initialState }),

      startRound: () => {
        const { categoryId, seed, roundIndex } = get();
        set({
          phase: 'turn-ready',
          turnTeamIndex: 0,
          deck: deckForRound(categoryId, seed, roundIndex),
          currentCard: null,
          turnResults: [],
          turnCardsDrawn: 0,
        });
      },

      startTurn: () => {
        const { deck } = get();
        const [first, ...rest] = deck;
        set({
          phase: 'turn',
          currentCard: first ?? null,
          deck: rest,
          turnResults: [],
          turnCardsDrawn: first ? 1 : 0,
        });
        if (!first) get().endTurn();
      },

      resolveCard: (outcome) => {
        const state = get();
        const { currentCard } = state;
        if (!currentCard || state.phase !== 'turn') return;

        const round: RoundConfig = ROUNDS[state.roundIndex];
        const turnResults = [...state.turnResults, { card: currentCard, outcome }];

        // Puntuación en tiempo real: la carta adivinada suma apenas se marca.
        const teams = state.teams.map((team, i) =>
          i === state.turnTeamIndex && outcome === 'guessed'
            ? { ...team, score: team.score + 1, guessed: [...team.guessed, currentCard] }
            : team,
        );

        // Saltar devuelve la carta al fondo del mazo; el resto la descarta.
        const deck = outcome === 'skipped' ? [...state.deck, currentCard] : [...state.deck];

        const reachedLimit =
          round.cardsPerTurn !== undefined && state.turnCardsDrawn >= round.cardsPerTurn;
        const [next, ...rest] = deck;

        if (reachedLimit || !next) {
          set({ teams, turnResults, deck, currentCard: null });
          get().endTurn();
          return;
        }

        set({
          teams,
          turnResults,
          deck: rest,
          currentCard: next,
          turnCardsDrawn: state.turnCardsDrawn + 1,
        });
      },

      endTurn: () => {
        const state = get();
        // Si quedó una carta en pantalla al terminar el tiempo, vuelve al mazo.
        const deck = state.currentCard ? [...state.deck, state.currentCard] : state.deck;
        const teams = state.teams.map((team, i) =>
          i === state.turnTeamIndex
            ? {
                ...team,
                nextPlayerIndex:
                  team.players.length > 0 ? (team.nextPlayerIndex + 1) % team.players.length : 0,
              }
            : team,
        );
        set({ phase: 'turn-summary', deck, currentCard: null, teams });
      },

      nextTurn: () => {
        const { turnTeamIndex, teams, roundIndex } = get();
        const nextTeam = turnTeamIndex + 1;

        if (nextTeam < teams.length) {
          set({ phase: 'turn-ready', turnTeamIndex: nextTeam, turnResults: [], turnCardsDrawn: 0 });
          return;
        }

        if (roundIndex + 1 < TOTAL_ROUNDS) {
          set({ phase: 'round-intro', roundIndex: roundIndex + 1, turnTeamIndex: 0, turnResults: [] });
          return;
        }

        set({ phase: 'results' });
      },
    }),
    {
      name: 'smn-game',
      // Si la página se recarga en medio de un turno, cerramos el turno con lo logrado.
      onRehydrateStorage: () => (state) => {
        if (state?.phase === 'turn') state.endTurn();
      },
    },
  ),
);

// Selectores reutilizables (análogos a `getters` de Pinia).
export const selectCurrentRound = (s: GameState): RoundConfig => ROUNDS[s.roundIndex];
export const selectActiveTeam = (s: GameState): Team | undefined => s.teams[s.turnTeamIndex];
export const selectActivePlayer = (s: GameState): string | null => {
  const team = selectActiveTeam(s);
  if (!team || team.players.length === 0) return null;
  return team.players[team.nextPlayerIndex] ?? null;
};
/**
 * Ordena equipos por puntaje. Es una función pura (no un selector del store):
 * Zustand v5 exige que los selectores devuelvan referencias estables, y un
 * `.sort()` crea un array nuevo en cada render. Usar con `useMemo`.
 */
export const rankTeams = (teams: Team[]): Team[] => [...teams].sort((a, b) => b.score - a.score);
