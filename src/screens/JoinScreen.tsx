import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { useGameStore } from '@/store/gameStore';

/** Extrae el código si el usuario pegó el link completo. */
function extractCode(input: string): string {
  const match = /join=([A-Za-z0-9_-]+)/.exec(input);
  return match ? match[1] : input.trim();
}

export function JoinScreen() {
  const joinGame = useGameStore((s) => s.joinGame);
  const goHome = useGameStore((s) => s.goHome);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const ok = joinGame(extractCode(input));
    if (!ok) setError('Ese código no es válido. Pedile al anfitrión que lo vuelva a compartir.');
  };

  return (
    <Screen center className="gap-5">
      <header className="text-center">
        <div className="mb-3 text-5xl">📲</div>
        <h1 className="font-display text-3xl font-black tracking-tight">Unirse a una partida</h1>
        <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">
          Pegá el código o el link que te compartieron. Vas a cargar el mismo mazo, en el mismo orden,
          para seguir la partida desde tu celular.
        </p>
      </header>

      <Panel className="space-y-3">
        <TextField
          value={input}
          autoFocus
          placeholder="Código o link de la partida"
          aria-label="Código de la partida"
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        {error && (
          <p role="alert" className="text-sm font-semibold text-magenta-600 dark:text-magenta-300">
            {error}
          </p>
        )}
        <Button fullWidth size="lg" variant="secondary" disabled={!input.trim()} onClick={submit}>
          Unirse
        </Button>
      </Panel>

      <Button variant="ghost" onClick={goHome}>
        Volver
      </Button>
    </Screen>
  );
}
