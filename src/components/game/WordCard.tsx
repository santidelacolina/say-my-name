import type { CardData } from '@/types/game';
import { forbiddenWords, getCategory } from '@/utils/cards';
import { cn } from '@/utils/cn';
import { Chip } from '@/components/ui/Chip';

interface WordCardProps {
  card: CardData;
  /** Dispara la animación de "falta" (sacudida). */
  shake?: boolean;
}

/**
 * La carta física del juego: palabra grande, categoría y recordatorio de
 * las palabras prohibidas. `key={card.id}` en el padre reinicia la animación.
 */
export function WordCard({ card, shake }: WordCardProps) {
  const category = getCategory(card.category);
  const banned = forbiddenWords(card.text);
  const long = card.text.length > 18;

  return (
    <article
      className={cn(
        'relative flex w-full flex-1 flex-col overflow-hidden rounded-[2rem] bg-white p-6 text-center shadow-pop ring-1 ring-ink-900/5 dark:bg-ink-800 dark:ring-white/10',
        'animate-card-in',
        shake && 'animate-shake',
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-turquoise-500 via-sun-500 to-magenta-500"
        aria-hidden
      />
      <div className="flex items-center justify-between">
        <Chip tone="turquoise">
          {category.emoji} {category.name}
        </Chip>
        <span className="text-xs font-semibold text-ink-400">#{card.id.split('-').pop()}</span>
      </div>

      <div className="flex flex-1 items-center justify-center py-6">
        <h2
          className={cn(
            'font-display font-black leading-[1.05] tracking-tight text-ink-900 dark:text-white',
            long ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl',
          )}
        >
          {card.text}
        </h2>
      </div>

      <div className="rounded-2xl bg-magenta-500/8 p-3 dark:bg-magenta-500/15">
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-magenta-600 dark:text-magenta-300">
          🚫 Prohibido decir
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {banned.map((w) => (
            <Chip key={w} tone="danger">
              {w}
            </Chip>
          ))}
        </div>
      </div>
    </article>
  );
}
