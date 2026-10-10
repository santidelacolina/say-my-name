import { useGameStore } from '@/store/gameStore';
import { useSettingsStore } from '@/store/settingsStore';
import { IconButton } from '@/components/ui/IconButton';

const THEME_ICON = { system: '🌓', light: '☀️', dark: '🌙' } as const;
const THEME_LABEL = { system: 'Tema: automático', light: 'Tema: claro', dark: 'Tema: oscuro' } as const;

interface AppHeaderProps {
  /** Muestra el botón para volver al inicio (confirma si hay partida en curso). */
  showHome?: boolean;
}

/** Barra superior con accesos a inicio, tema y sonido. */
export function AppHeader({ showHome = true }: AppHeaderProps) {
  const phase = useGameStore((s) => s.phase);
  const resetGame = useGameStore((s) => s.resetGame);
  const { theme, soundEnabled, cycleTheme, toggleSound } = useSettingsStore();

  const inGame = !['home', 'setup', 'join', 'results'].includes(phase);

  const goHome = () => {
    if (inGame && !window.confirm('¿Abandonar la partida en curso?')) return;
    resetGame();
  };

  return (
    <header className="safe-top mx-auto flex w-full max-w-lg items-center justify-between px-4 pb-2">
      <div>
        {showHome && phase !== 'home' && (
          <IconButton label="Volver al inicio" onClick={goHome}>
            🏠
          </IconButton>
        )}
      </div>
      <div className="flex gap-2">
        <IconButton label={THEME_LABEL[theme]} onClick={cycleTheme}>
          {THEME_ICON[theme]}
        </IconButton>
        <IconButton label={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'} onClick={toggleSound}>
          {soundEnabled ? '🔊' : '🔇'}
        </IconButton>
      </div>
    </header>
  );
}
