import type { TeamColor } from '@/types/game';

export const MAX_TEAMS = 4;
export const MIN_TEAMS = 2;
export const MAX_PLAYERS_PER_TEAM = 6;

export const TEAM_COLORS: readonly TeamColor[] = ['turquoise', 'magenta', 'sun', 'lime'];

export const DEFAULT_TEAM_NAMES = ['Turquesas', 'Magentas', 'Soles', 'Limas'];

/** Clases Tailwind por color de equipo (se resuelven en build, por eso son literales). */
export const TEAM_THEME: Record<
  TeamColor,
  { bg: string; text: string; ring: string; soft: string; gradient: string }
> = {
  turquoise: {
    bg: 'bg-turquoise-500',
    text: 'text-turquoise-500',
    ring: 'ring-turquoise-500',
    soft: 'bg-turquoise-500/15 text-turquoise-700 dark:text-turquoise-300',
    gradient: 'from-turquoise-400 to-turquoise-600',
  },
  magenta: {
    bg: 'bg-magenta-500',
    text: 'text-magenta-500',
    ring: 'ring-magenta-500',
    soft: 'bg-magenta-500/15 text-magenta-700 dark:text-magenta-300',
    gradient: 'from-magenta-400 to-magenta-600',
  },
  sun: {
    bg: 'bg-sun-500',
    text: 'text-sun-600',
    ring: 'ring-sun-500',
    soft: 'bg-sun-500/20 text-sun-700 dark:text-sun-300',
    gradient: 'from-sun-400 to-sun-600',
  },
  lime: {
    bg: 'bg-lime-500',
    text: 'text-lime-600',
    ring: 'ring-lime-500',
    soft: 'bg-lime-500/20 text-lime-700 dark:text-lime-300',
    gradient: 'from-lime-400 to-lime-600',
  },
};
