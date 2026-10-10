import type { RoundConfig } from '@/types/game';

export const NORMAL_ROUND_SECONDS = 30;
export const LIGHTNING_ROUND_SECONDS = 5;
export const LIGHTNING_CARDS_PER_TURN = 8;

/**
 * Las 4 rondas con restricciones progresivas.
 * Analogía: es un `static readonly` array de configuración, como un
 * `appsettings.json` tipado.
 */
export const ROUNDS: readonly RoundConfig[] = [
  {
    number: 1,
    rule: 'speak',
    title: 'Ronda 1',
    subtitle: 'Vale hablar',
    emoji: '🗣️',
    description: 'Podés hablar, actuar, hacer sonidos y gesticular. Lo único prohibido: la palabra clave.',
    allowed: ['Hablar', 'Actuar', 'Sonidos', 'Gestos'],
    forbidden: ['La palabra clave', 'Sus variantes'],
    seconds: NORMAL_ROUND_SECONDS,
    deck: 'selected',
    timerPerCard: false,
  },
  {
    number: 2,
    rule: 'one-word',
    title: 'Ronda 2',
    subtitle: 'Una sola palabra',
    emoji: '☝️',
    description: 'Solo podés decir UNA palabra por carta. El resto es expresión corporal y creatividad.',
    allowed: ['1 palabra por carta', 'Actuar', 'Gestos'],
    forbidden: ['La palabra clave', 'Frases largas'],
    seconds: NORMAL_ROUND_SECONDS,
    deck: 'selected',
    timerPerCard: false,
  },
  {
    number: 3,
    rule: 'silence',
    title: 'Ronda 3',
    subtitle: 'Silencio total',
    emoji: '🤫',
    description: 'Nada de palabras. Solo sonidos y gestos. El equipo interpreta y adivina.',
    allowed: ['Mímica', 'Sonidos', 'Gestos'],
    forbidden: ['Hablar', 'La palabra clave'],
    seconds: NORMAL_ROUND_SECONDS,
    deck: 'selected',
    timerPerCard: false,
  },
  {
    number: 4,
    rule: 'lightning',
    title: 'Ronda 4',
    subtitle: 'Relámpago',
    emoji: '⚡',
    description: `Mazo Relámpago. ${LIGHTNING_ROUND_SECONDS} segundos por carta. Si se acaba el tiempo, la carta se pierde.`,
    allowed: ['Vale todo', 'Rapidez', 'Precisión'],
    forbidden: ['La palabra clave', 'Dudar'],
    seconds: LIGHTNING_ROUND_SECONDS,
    deck: 'relampago',
    timerPerCard: true,
    cardsPerTurn: LIGHTNING_CARDS_PER_TURN,
  },
];

export const TOTAL_ROUNDS = ROUNDS.length;
