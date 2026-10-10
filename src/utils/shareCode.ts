import type { GameConfig } from '@/types/game';
import { CATEGORIES } from './cards';
import { TEAM_COLORS } from '@/config/teams';

/**
 * Serializa la configuración de la partida en un código compacto (base64url)
 * para que otro celular pueda "unirse" cargando el mismo mazo y orden.
 *
 * Analogía: es como un query string firmado por convención, sin backend.
 */
export function encodeGameConfig(config: GameConfig): string {
  const compact = {
    c: config.categoryId,
    s: config.seed,
    t: config.teams.map((t) => [t.name, t.color, t.players]),
  };
  const json = JSON.stringify(compact);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeGameConfig(code: string): GameConfig | null {
  try {
    const normalized = code.trim().replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as {
      c: string;
      s: number;
      t: Array<[string, string, string[]]>;
    };

    if (!CATEGORIES.some((c) => c.id === parsed.c)) return null;
    if (typeof parsed.s !== 'number' || !Array.isArray(parsed.t) || parsed.t.length < 2) return null;

    return {
      categoryId: parsed.c as GameConfig['categoryId'],
      seed: parsed.s,
      teams: parsed.t.map(([name, color, players]) => ({
        name: String(name),
        color: (TEAM_COLORS as readonly string[]).includes(color)
          ? (color as GameConfig['teams'][number]['color'])
          : 'turquoise',
        players: Array.isArray(players) ? players.map(String) : [],
      })),
    };
  } catch {
    return null;
  }
}

export function buildShareUrl(code: string): string {
  const url = new URL(window.location.href);
  url.hash = `join=${code}`;
  return url.toString();
}

/** Lee `#join=CODE` de la URL actual (si existe). */
export function readJoinCodeFromUrl(): string | null {
  const match = /join=([A-Za-z0-9_-]+)/.exec(window.location.hash);
  return match ? match[1] : null;
}
