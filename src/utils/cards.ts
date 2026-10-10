import data from '@/data/cards.json';
import type { CardData, Category, CategoryId } from '@/types/game';
import { createRng, shuffle } from './random';

export const CATEGORIES = data.categories as Category[];

export function getCategory(id: CategoryId): Category {
  const found = CATEGORIES.find((c) => c.id === id);
  if (!found) throw new Error(`Categoría desconocida: ${id}`);
  return found;
}

/** Construye el mazo de una categoría barajado con una semilla determinística. */
export function buildDeck(categoryId: CategoryId, seed: number): CardData[] {
  const category = getCategory(categoryId);
  const cards: CardData[] = category.cards.map((text, index) => ({
    id: `${categoryId}-${index}`,
    text,
    category: categoryId,
  }));
  return shuffle(cards, createRng(seed));
}

const STOP_WORDS = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'y', 'a', 'en', 'al', 'un', 'una']);

/**
 * Palabras que el jugador activo NO puede decir. Se derivan de la carta
 * (sin artículos ni preposiciones) para mostrarlas como recordatorio.
 */
export function forbiddenWords(text: string): string[] {
  return text
    .split(/[\s\-/]+/)
    .map((w) => w.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter((w) => w.length > 0 && !STOP_WORDS.has(w.toLowerCase()));
}
