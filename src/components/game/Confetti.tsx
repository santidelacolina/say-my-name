const PIECES = Array.from({ length: 28 }, (_, i) => i);
const COLORS = ['bg-turquoise-500', 'bg-magenta-500', 'bg-sun-500', 'bg-lime-500'];

/** Lluvia de confeti en CSS puro para la pantalla de resultados. */
export function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {PIECES.map((i) => (
        <span
          key={i}
          className={`absolute top-0 block h-3 w-2 rounded-sm animate-confetti ${COLORS[i % COLORS.length]}`}
          style={{
            left: `${(i * 37) % 100}%`,
            animationDelay: `${(i % 7) * 0.35}s`,
            animationDuration: `${2.4 + (i % 5) * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}
