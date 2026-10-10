import { useCallback, useRef } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

export type SoundName = 'tick' | 'success' | 'skip' | 'foul' | 'timeUp' | 'roundStart' | 'fanfare';

type Note = { freq: number; at: number; dur: number; type?: OscillatorType; gain?: number };

/** Partituras minimalistas sintetizadas con Web Audio (sin assets externos). */
const SOUNDS: Record<SoundName, Note[]> = {
  tick: [{ freq: 1200, at: 0, dur: 0.05, type: 'square', gain: 0.08 }],
  success: [
    { freq: 660, at: 0, dur: 0.1 },
    { freq: 880, at: 0.1, dur: 0.18 },
  ],
  skip: [{ freq: 330, at: 0, dur: 0.12, type: 'triangle' }],
  foul: [
    { freq: 180, at: 0, dur: 0.18, type: 'sawtooth', gain: 0.18 },
    { freq: 140, at: 0.18, dur: 0.28, type: 'sawtooth', gain: 0.18 },
  ],
  timeUp: [
    { freq: 520, at: 0, dur: 0.15 },
    { freq: 390, at: 0.15, dur: 0.15 },
    { freq: 260, at: 0.3, dur: 0.35 },
  ],
  roundStart: [
    { freq: 523, at: 0, dur: 0.12 },
    { freq: 659, at: 0.12, dur: 0.12 },
    { freq: 784, at: 0.24, dur: 0.25 },
  ],
  fanfare: [
    { freq: 523, at: 0, dur: 0.15 },
    { freq: 659, at: 0.15, dur: 0.15 },
    { freq: 784, at: 0.3, dur: 0.15 },
    { freq: 1046, at: 0.45, dur: 0.45 },
  ],
};

/**
 * Hook para reproducir efectos de sonido sintetizados.
 * El AudioContext se crea de forma perezosa en el primer gesto del usuario
 * (requisito de iOS/Android para poder reproducir audio).
 */
export function useSound() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const ctxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined' || typeof window.AudioContext === 'undefined') return null;
    if (!ctxRef.current) ctxRef.current = new window.AudioContext();
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!soundEnabled) return;
      const ctx = getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      for (const note of SOUNDS[name]) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = note.type ?? 'sine';
        osc.frequency.value = note.freq;
        const level = note.gain ?? 0.12;
        gain.gain.setValueAtTime(0.0001, now + note.at);
        gain.gain.exponentialRampToValueAtTime(level, now + note.at + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + note.at + note.dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + note.at);
        osc.stop(now + note.at + note.dur + 0.02);
      }
    },
    [soundEnabled, getContext],
  );

  /** Llamar en un gesto del usuario para "desbloquear" el audio en móviles. */
  const unlock = useCallback(() => {
    getContext();
  }, [getContext]);

  return { play, unlock, soundEnabled };
}
