/**
 * Generador pseudoaleatorio determinístico (mulberry32).
 * Con la misma semilla produce la misma secuencia: así dos celulares que
 * se unen a la misma partida ven el mazo en el mismo orden.
 *
 * Analogía .NET: `new Random(seed)`.
 */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates con RNG inyectable. No muta el array original. */
export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 0xffffffff);
}

export function newId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
