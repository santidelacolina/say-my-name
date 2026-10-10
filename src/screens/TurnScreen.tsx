import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { TimerRing } from '@/components/game/TimerRing';
import { WordCard } from '@/components/game/WordCard';
import { TeamBadge } from '@/components/game/TeamBadge';
import { useSound } from '@/hooks/useSound';
import { useTimer } from '@/hooks/useTimer';
import { selectActivePlayer, selectActiveTeam, selectCurrentRound, useGameStore } from '@/store/gameStore';
import { cn } from '@/utils/cn';

/**
 * Pantalla del jugador activo: carta + cronómetro + acciones.
 *
 * El cronómetro vive en este componente (hook `useTimer`) y el store solo
 * recibe los eventos (`resolveCard`, `endTurn`). Analogía: el componente es
 * la "vista" y el store el "servicio de dominio".
 */
export function TurnScreen() {
  const round = useGameStore(selectCurrentRound);
  const team = useGameStore(selectActiveTeam);
  const player = useGameStore(selectActivePlayer);
  const card = useGameStore((s) => s.currentCard);
  const turnResults = useGameStore((s) => s.turnResults);
  const turnCardsDrawn = useGameStore((s) => s.turnCardsDrawn);
  const resolveCard = useGameStore((s) => s.resolveCard);
  const endTurn = useGameStore((s) => s.endTurn);
  const { play } = useSound();

  const [shake, setShake] = useState(false);
  const [paused, setPaused] = useState(false);

  const guessedThisTurn = turnResults.filter((r) => r.outcome === 'guessed').length;

  const onExpire = useCallback(() => {
    if (round.timerPerCard) {
      // Relámpago: se pierde la carta y sigue la próxima (el efecto de abajo reinicia el reloj).
      play('skip');
      resolveCard('timeout');
    } else {
      play('timeUp');
      endTurn();
    }
  }, [round.timerPerCard, play, resolveCard, endTurn]);

  const onTick = useCallback(
    (secondsLeft: number) => {
      if (secondsLeft > 0 && secondsLeft <= (round.timerPerCard ? 3 : 5)) play('tick');
    },
    [round.timerPerCard, play],
  );

  const timer = useTimer({ seconds: round.seconds, autoStart: true, onExpire, onTick });

  // Modo Relámpago: cada carta nueva reinicia el cronómetro.
  const cardId = card?.id;
  useEffect(() => {
    if (round.timerPerCard && cardId) timer.restart(round.seconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId, round.timerPerCard, round.seconds]);

  const act = (outcome: 'guessed' | 'skipped' | 'foul') => {
    if (paused || !card) return;
    if (outcome === 'guessed') play('success');
    if (outcome === 'skipped') play('skip');
    if (outcome === 'foul') {
      play('foul');
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
    }
    resolveCard(outcome);
  };

  const togglePause = () => {
    if (paused) timer.start();
    else timer.pause();
    setPaused((p) => !p);
  };

  if (!team || !card) return null;

  return (
    <Screen className="gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <TeamBadge team={team} active compact />
          <p className="mt-1 truncate px-1 text-xs text-ink-500">
            {round.emoji} {round.subtitle}
            {player && <> · actúa <strong>{player}</strong></>}
            {round.cardsPerTurn && (
              <>
                {' '}
                · carta {turnCardsDrawn}/{round.cardsPerTurn}
              </>
            )}
          </p>
        </div>
        <TimerRing secondsLeft={timer.secondsLeft} progress={timer.progress} size={108} urgentAt={round.timerPerCard ? 2 : 5} />
      </div>

      <div className="relative flex min-h-[18rem] flex-1">
        <WordCard key={card.id} card={card} shake={shake} />
        {paused && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-[2rem] bg-ink-900/85 text-white backdrop-blur">
            <span className="text-5xl">⏸️</span>
            <p className="font-display text-2xl font-black">Pausa</p>
            <Button variant="primary" onClick={togglePause}>
              Reanudar
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-ink-600 dark:text-ink-300">
          ✅ {guessedThisTurn} en este turno
        </span>
        <button
          type="button"
          onClick={togglePause}
          className="rounded-full px-3 py-1 text-xs font-bold text-ink-500 hover:bg-ink-900/5 dark:hover:bg-white/10"
        >
          {paused ? '▶️ Reanudar' : '⏸️ Pausar'}
        </button>
      </div>

      <div className={cn('grid grid-cols-2 gap-3', paused && 'pointer-events-none opacity-40')}>
        <Button size="xl" variant="success" icon="✅" onClick={() => act('guessed')}>
          Adivinada
        </Button>
        <Button size="xl" variant="outline" icon="⏭️" onClick={() => act('skipped')}>
          Saltar
        </Button>
        <Button
          size="md"
          variant="danger"
          icon="🚫"
          className="col-span-2"
          onClick={() => act('foul')}
          title="El jugador activo dijo la palabra clave: la carta se invalida y no suma"
        >
          ¡Falta! Dijo la palabra
        </Button>
      </div>
    </Screen>
  );
}
