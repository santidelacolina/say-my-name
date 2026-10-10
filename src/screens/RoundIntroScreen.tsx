import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Panel } from '@/components/ui/Panel';
import { Screen } from '@/components/ui/Screen';
import { RoundSteps } from '@/components/game/RoundSteps';
import { Scoreboard } from '@/components/game/Scoreboard';
import { ShareGame } from '@/components/game/ShareGame';
import { useSound } from '@/hooks/useSound';
import { selectCurrentRound, useGameStore } from '@/store/gameStore';
import { getCategory } from '@/utils/cards';

/** Presenta la ronda que empieza: regla, tiempo y mazo. */
export function RoundIntroScreen() {
  const round = useGameStore(selectCurrentRound);
  const roundIndex = useGameStore((s) => s.roundIndex);
  const teams = useGameStore((s) => s.teams);
  const categoryId = useGameStore((s) => s.categoryId);
  const startRound = useGameStore((s) => s.startRound);
  const { play } = useSound();

  const deck = getCategory(round.deck === 'relampago' ? 'relampago' : categoryId);

  return (
    <Screen className="gap-5">
      <RoundSteps current={roundIndex} />

      <div className="text-center animate-pop">
        <div className="text-7xl" aria-hidden>
          {round.emoji}
        </div>
        <p className="mt-2 text-sm font-bold uppercase tracking-[0.3em] text-magenta-500">{round.title}</p>
        <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">{round.subtitle}</h1>
        <p className="mx-auto mt-3 max-w-sm text-base text-ink-600 dark:text-ink-300">{round.description}</p>
      </div>

      <Panel className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-turquoise-600 dark:text-turquoise-300">
            ✅ Permitido
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {round.allowed.map((a) => (
              <li key={a}>
                <Chip tone="turquoise">{a}</Chip>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-magenta-600 dark:text-magenta-300">
            🚫 Prohibido
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {round.forbidden.map((f) => (
              <li key={f}>
                <Chip tone="magenta">{f}</Chip>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 flex items-center justify-between rounded-2xl bg-ink-900/5 px-4 py-3 dark:bg-white/5">
          <span className="flex items-center gap-2 text-sm font-semibold">
            ⏱️ {round.seconds}s {round.timerPerCard ? 'por carta' : 'por turno'}
          </span>
          <span className="flex items-center gap-2 text-sm font-semibold">
            {deck.emoji} Mazo {deck.name}
          </span>
        </div>
      </Panel>

      <Scoreboard teams={teams} compact />

      <div className="mt-auto flex flex-col gap-3">
        <ShareGame />
        <Button
          size="xl"
          fullWidth
          icon="▶️"
          onClick={() => {
            play('roundStart');
            startRound();
          }}
        >
          Empezar {round.title.toLowerCase()}
        </Button>
      </div>
    </Screen>
  );
}
