import type { CategoryId } from '@/types/game';
import { CATEGORIES } from '@/utils/cards';
import { cn } from '@/utils/cn';

interface CategoryPickerProps {
  value: CategoryId;
  onChange: (id: CategoryId) => void;
}

/** Grilla de categorías. La ronda Relámpago usa siempre su propio mazo. */
export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Categoría">
      {CATEGORIES.map((category) => {
        const selected = category.id === value;
        return (
          <button
            key={category.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(category.id)}
            className={cn(
              'flex flex-col items-start gap-1 rounded-2xl p-3 text-left transition-all active:scale-[0.97]',
              'bg-white ring-2 dark:bg-ink-800',
              selected
                ? 'ring-magenta-500 shadow-glow-magenta'
                : 'ring-ink-200 hover:ring-turquoise-400 dark:ring-ink-700',
            )}
          >
            <span className="text-2xl" aria-hidden>
              {category.emoji}
            </span>
            <span className="font-display text-base font-bold leading-tight">{category.name}</span>
            <span className="text-xs leading-snug text-ink-500 dark:text-ink-300">
              {category.description}
            </span>
            <span className="mt-1 text-[11px] font-semibold text-turquoise-700 dark:text-turquoise-300">
              {category.cards.length} cartas
            </span>
          </button>
        );
      })}
    </div>
  );
}
