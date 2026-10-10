import { useEffect } from 'react';
import { AppHeader } from '@/components/game/AppHeader';
import { useTheme } from '@/hooks/useTheme';
import { useGameStore } from '@/store/gameStore';
import { readJoinCodeFromUrl } from '@/utils/shareCode';
import { HomeScreen } from '@/screens/HomeScreen';
import { SetupScreen } from '@/screens/SetupScreen';
import { JoinScreen } from '@/screens/JoinScreen';
import { RoundIntroScreen } from '@/screens/RoundIntroScreen';
import { TurnReadyScreen } from '@/screens/TurnReadyScreen';
import { TurnScreen } from '@/screens/TurnScreen';
import { TurnSummaryScreen } from '@/screens/TurnSummaryScreen';
import { ResultsScreen } from '@/screens/ResultsScreen';

/**
 * Router por fase. Analogía Vue: un `<component :is="...">` que elige la
 * vista según el estado del store, sin vue-router porque es una sola página.
 */
const SCREENS = {
  home: HomeScreen,
  setup: SetupScreen,
  join: JoinScreen,
  'round-intro': RoundIntroScreen,
  'turn-ready': TurnReadyScreen,
  turn: TurnScreen,
  'turn-summary': TurnSummaryScreen,
  results: ResultsScreen,
} as const;

export default function App() {
  useTheme();
  const phase = useGameStore((s) => s.phase);
  const joinGame = useGameStore((s) => s.joinGame);

  // Si abren un link compartido (#join=CODE) cargamos esa partida directamente.
  useEffect(() => {
    const code = readJoinCodeFromUrl();
    if (!code) return;
    joinGame(code);
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }, [joinGame]);

  const CurrentScreen = SCREENS[phase];

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      {/* key={phase} reinicia la animación de entrada al cambiar de pantalla */}
      <CurrentScreen key={phase} />
    </div>
  );
}
