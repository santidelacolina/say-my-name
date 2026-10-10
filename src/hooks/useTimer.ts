import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTimerOptions {
  /** Duración en segundos. */
  seconds: number;
  /** Se ejecuta una sola vez cuando el tiempo llega a cero. */
  onExpire?: () => void;
  /** Se ejecuta en cada segundo entero restante (útil para el "tic"). */
  onTick?: (secondsLeft: number) => void;
  autoStart?: boolean;
}

interface UseTimerResult {
  /** Milisegundos restantes. */
  remainingMs: number;
  /** Segundos restantes redondeados hacia arriba (lo que se muestra). */
  secondsLeft: number;
  /** 0..1, cuánto del tiempo total queda. */
  progress: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  /** Reinicia al total (o a `seconds` nuevos) y arranca de nuevo. */
  restart: (seconds?: number) => void;
}

const TICK_MS = 50;

/**
 * Cronómetro basado en `Date.now()` (no acumula drift aunque el navegador
 * frene el `setInterval` en segundo plano).
 *
 * Analogía Vue: es un composable `useTimer()` con `ref`s reactivos.
 */
export function useTimer({ seconds, onExpire, onTick, autoStart = false }: UseTimerOptions): UseTimerResult {
  const [totalMs, setTotalMs] = useState(seconds * 1000);
  const [remainingMs, setRemainingMs] = useState(seconds * 1000);
  const [isRunning, setIsRunning] = useState(autoStart);
  // Se incrementa en cada restart() para forzar el recálculo del deadline
  // aunque el cronómetro ya estuviera corriendo (p. ej. nueva carta en Relámpago).
  const [runId, setRunId] = useState(0);

  const deadlineRef = useRef<number | null>(null);
  const lastWholeSecondRef = useRef<number>(seconds);
  const expiredRef = useRef(false);

  // Refs para callbacks: evitan reiniciar el intervalo cuando el padre re-renderiza.
  const onExpireRef = useRef(onExpire);
  const onTickRef = useRef(onTick);
  useEffect(() => {
    onExpireRef.current = onExpire;
    onTickRef.current = onTick;
  }, [onExpire, onTick]);

  const start = useCallback(() => {
    if (expiredRef.current) return;
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => setIsRunning(false), []);

  const restart = useCallback(
    (nextSeconds?: number) => {
      const ms = (nextSeconds ?? totalMs / 1000) * 1000;
      expiredRef.current = false;
      deadlineRef.current = null;
      lastWholeSecondRef.current = Math.ceil(ms / 1000);
      setTotalMs(ms);
      setRemainingMs(ms);
      setIsRunning(true);
      setRunId((n) => n + 1);
    },
    [totalMs],
  );

  useEffect(() => {
    if (!isRunning) {
      deadlineRef.current = null;
      return;
    }

    // Al (re)arrancar, calculamos la hora límite a partir de lo que queda.
    deadlineRef.current = Date.now() + remainingMs;

    const id = window.setInterval(() => {
      const deadline = deadlineRef.current;
      if (deadline === null) return;
      const left = Math.max(0, deadline - Date.now());
      setRemainingMs(left);

      const whole = Math.ceil(left / 1000);
      if (whole !== lastWholeSecondRef.current) {
        lastWholeSecondRef.current = whole;
        onTickRef.current?.(whole);
      }

      if (left <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        setIsRunning(false);
        onExpireRef.current?.();
      }
    }, TICK_MS);

    return () => window.clearInterval(id);
    // remainingMs solo se usa como valor inicial al (re)arrancar; no reiniciar el intervalo por cada tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, runId]);

  return {
    remainingMs,
    secondsLeft: Math.ceil(remainingMs / 1000),
    progress: totalMs === 0 ? 0 : remainingMs / totalMs,
    isRunning,
    start,
    pause,
    restart,
  };
}
