/**
 * Tipos del dominio del juego.
 *
 * Analogía .NET: este archivo equivale a la carpeta `Models/` o `Domain/`
 * con tus DTOs y enums. En TS usamos `type` unions en lugar de `enum`
 * porque se serializan como strings planos en JSON.
 */

export type CategoryId = 'titulos' | 'personas' | 'vale-todo' | 'principal' | 'relampago';

export interface Category {
  id: CategoryId;
  name: string;
  emoji: string;
  description: string;
  cards: string[];
}

export interface CardData {
  id: string;
  text: string;
  category: CategoryId;
}

export type TeamColor = 'turquoise' | 'magenta' | 'sun' | 'lime';

export interface Team {
  id: string;
  name: string;
  color: TeamColor;
  players: string[];
  /** Índice del jugador que actuará en el próximo turno de este equipo. */
  nextPlayerIndex: number;
  score: number;
  guessed: CardData[];
}

/** Resultado de una carta dentro de un turno. */
export type CardOutcome = 'guessed' | 'skipped' | 'foul' | 'timeout';

export interface TurnCardResult {
  card: CardData;
  outcome: CardOutcome;
}

export type RoundNumber = 1 | 2 | 3 | 4;

export type RoundRule = 'speak' | 'one-word' | 'silence' | 'lightning';

export interface RoundConfig {
  number: RoundNumber;
  rule: RoundRule;
  title: string;
  subtitle: string;
  description: string;
  allowed: string[];
  forbidden: string[];
  emoji: string;
  /** Segundos del cronómetro. En Relámpago aplica por carta. */
  seconds: number;
  /** `selected`: mazo de la categoría elegida. `relampago`: mazo Relámpago. */
  deck: 'selected' | 'relampago';
  /** Si es true el cronómetro se reinicia por cada carta (modo Relámpago). */
  timerPerCard: boolean;
  /** Cantidad máxima de cartas por turno (solo modo Relámpago). */
  cardsPerTurn?: number;
}

/** Máquina de estados de la UI (equivalente a las "vistas" de un router). */
export type Phase =
  | 'home'
  | 'setup'
  | 'join'
  | 'round-intro'
  | 'turn-ready'
  | 'turn'
  | 'turn-summary'
  | 'results';

/** Configuración serializable para compartir una partida por link/código. */
export interface GameConfig {
  categoryId: CategoryId;
  seed: number;
  teams: Array<Pick<Team, 'name' | 'color' | 'players'>>;
}
