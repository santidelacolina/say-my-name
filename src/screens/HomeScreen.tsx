import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Screen } from '@/components/ui/Screen';
import { ROUNDS } from '@/config/rounds';
import { useGameStore } from '@/store/gameStore';
import { useSound } from '@/hooks/useSound';

export function HomeScreen() {
  const openSetup = useGameStore((s) => s.openSetup);
  const openJoin = useGameStore((s) => s.openJoin);
  const { unlock } = useSound();
  const [showRules, setShowRules] = useState(false);

  return (
    <Screen center className="gap-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-turquoise-400 to-magenta-500 text-5xl shadow-pop animate-float">
          🗣️
        </div>
        <h1 className="font-display text-5xl font-black tracking-tighter sm:text-6xl">
          <span className="text-gradient-brand">Say My Name</span>
        </h1>
        <p className="mt-3 text-base text-ink-600 dark:text-ink-300">
          Mímica, gestos y caos en equipo. Tu celular es el mazo de cartas y el cronómetro.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          size="xl"
          fullWidth
          icon="🎉"
          onClick={() => {
            unlock();
            openSetup();
          }}
        >
          Crear partida
        </Button>
        <Button
          size="lg"
          variant="secondary"
          fullWidth
          icon="📲"
          onClick={() => {
            unlock();
            openJoin();
          }}
        >
          Unirse con código
        </Button>
        <Button size="md" variant="ghost" fullWidth onClick={() => setShowRules((v) => !v)}>
          {showRules ? 'Ocultar reglas' : '¿Cómo se juega?'}
        </Button>
      </div>

      {showRules && (
        <Panel className="animate-pop space-y-3 text-sm">
          <p>
            <strong>Objetivo:</strong> hacé que tu equipo adivine la mayor cantidad de cartas sin decir
            la palabra clave. Cada carta adivinada vale <strong>1 punto</strong>.
          </p>
          <ol className="space-y-2">
            {ROUNDS.map((round) => (
              <li key={round.number} className="flex gap-2">
                <span className="text-lg" aria-hidden>
                  {round.emoji}
                </span>
                <span>
                  <strong>
                    {round.title} · {round.subtitle}
                  </strong>{' '}
                  <span className="text-ink-600 dark:text-ink-300">
                    ({round.seconds}s{round.timerPerCard ? ' por carta' : ''}). {round.description}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <p className="text-ink-600 dark:text-ink-300">
            Si el jugador activo dice la palabra prohibida, el equipo marca <strong>¡Falta!</strong> y la
            carta no suma. El jugador activo rota en cada turno.
          </p>
        </Panel>
      )}
    </Screen>
  );
}
