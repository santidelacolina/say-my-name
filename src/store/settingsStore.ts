import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'system' | 'light' | 'dark';

interface SettingsState {
  theme: ThemeMode;
  soundEnabled: boolean;
  setTheme: (theme: ThemeMode) => void;
  cycleTheme: () => void;
  toggleSound: () => void;
}

/**
 * Preferencias del usuario persistidas en localStorage.
 * Analogía Vue: un store de Pinia con el plugin de persistencia.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      soundEnabled: true,
      setTheme: (theme) => set({ theme }),
      cycleTheme: () => {
        const order: ThemeMode[] = ['system', 'light', 'dark'];
        const next = order[(order.indexOf(get().theme) + 1) % order.length];
        set({ theme: next });
      },
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
    }),
    { name: 'smn-settings' },
  ),
);
