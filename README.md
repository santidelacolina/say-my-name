# Say My Name · versión web 📱🗣️

Versión interactiva del party game **Say My Name**: el celular hace de **mazo de cartas** y
**cronómetro**. Se juega en equipos, un jugador actúa y el resto adivina sin que se diga la
palabra clave. Cuatro rondas con restricciones progresivas, puntuación en tiempo real y
resultados finales con confeti.

> "Se juega en equipos, se elige una categoría y se arma el caos para adivinar la mayor
> cantidad de tarjetas posible."

- **100 % gratis**: se publica en GitHub Pages con un workflow de GitHub Actions.
- **Instalable (PWA)**: funciona offline y se agrega a la pantalla de inicio del celular.
- **Sin backend**: todo corre en el navegador. Otro celular se "une" cargando el mismo mazo
  con un link o código.

---

## Cómo desplegarlo (desde el celular, gratis)

1. Cada push a `main` ejecuta `.github/workflows/deploy.yml`, que compila la app y publica
   la carpeta `dist/` en la rama `gh-pages`. GitHub activa Pages solo al detectar esa rama,
   no hace falta configurar nada en Settings.
2. La app queda en `https://<tu-usuario>.github.io/say-my-name/`. El primer deploy puede
   tardar un par de minutos en aparecer; los siguientes son casi inmediatos.
3. Abrí ese link en el celular y usá **"Agregar a pantalla de inicio"** para tenerlo como app.

Si en Settings → Pages el origen quedara distinto de `gh-pages`, elegí **Deploy from a
branch → gh-pages / (root)**.

Si preferís Vercel o Netlify, el build es estándar (`npm run build`, carpeta `dist`). Solo
definí la variable `VITE_BASE=/` para que los assets no apunten a `/say-my-name/`.

---

## Cómo se juega en la app

1. **Crear partida**: elegí la categoría para las rondas 1 a 3 (la ronda 4 siempre usa el
   mazo ⚡ Relámpago), armá de 2 a 4 equipos y, opcionalmente, cargá los jugadores de cada uno
   para que la app rote quién actúa en cada turno.
2. **Compartir** (opcional): en la intro de cada ronda hay un botón para enviar el link de la
   partida. Quien lo abra carga el mismo mazo en el mismo orden, así cada equipo puede tener
   el mazo en su propio celular.
3. **Turno**: la pantalla muestra a qué equipo le toca y quién actúa. Al tocar
   **"¡Listo, empezar!"** aparece la carta y arranca el cronómetro.
   - ✅ **Adivinada**: suma 1 punto al instante y pasa a la próxima carta.
   - ⏭️ **Saltar**: la carta vuelve al fondo del mazo.
   - 🚫 **¡Falta! Dijo la palabra**: la carta se invalida y no suma (la regla clave del juego).
   - ⏸️ **Pausar** por si alguien interrumpe.
4. **Resumen del turno**: puntos ganados y qué pasó con cada carta.
5. **Resultados**: ranking, cartas adivinadas por equipo y botón de **Revancha** (mismos
   equipos y categoría, mazo nuevo).

### Las 4 rondas

| Ronda | Regla | Tiempo | Mazo |
| --- | --- | --- | --- |
| 1 🗣️ Vale hablar | Hablar, actuar, sonidos y gestos. Prohibida la palabra clave. | 30 s por turno | Categoría elegida |
| 2 ☝️ Una sola palabra | Una palabra por carta + expresión corporal. | 30 s por turno | Categoría elegida |
| 3 🤫 Silencio total | Solo mímica y sonidos. | 30 s por turno | Categoría elegida |
| 4 ⚡ Relámpago | 5 segundos por carta, 8 cartas por turno. Si vence el tiempo la carta se pierde. | 5 s por carta | Relámpago |

Cada carta adivinada vale **1 punto**. Gana el equipo con más puntos al terminar la ronda 4.

### Categorías (50 cartas cada una)

- 🎬 **Títulos**: películas, series, libros, canciones y referencias pop.
- 🧑‍🎤 **Personas**: famosos, figuras históricas y personajes de ficción.
- 🎲 **Vale Todo**: objetos, acciones, animales y conceptos.
- ⭐ **Principal**: el mazo clave, más difícil.
- ⚡ **Relámpago**: palabras cortas para la ronda final.

Las cartas viven en `src/data/cards.json`. Para agregar o cambiar cartas alcanza con editar
ese archivo.

---

## Stack

| Capa | Tecnología |
| --- | --- |
| UI | React 19 + TypeScript |
| Estilos | Tailwind CSS 4 (paleta turquesa / magenta, modo oscuro por clase) |
| Estado | Zustand 5 (con persistencia en `localStorage`) |
| Build | Vite 7 |
| PWA | `vite-plugin-pwa` (manifest + service worker con precache) |
| Deploy | GitHub Actions → GitHub Pages |

Sin dependencias de UI pesadas: las animaciones son CSS puro y los sonidos se sintetizan con
Web Audio API (no hay archivos de audio que descargar).

## Scripts

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo
npm run build      # typecheck + build de producción en dist/
npm run preview    # servir dist/ localmente
npm run typecheck  # solo TypeScript
npm run icons      # regenerar los PNG de la PWA desde public/icons/icon.svg (usa Playwright)
```

## Estructura de carpetas

```
src/
├── data/cards.json        # las 250 cartas (5 categorías × 50)
├── types/game.ts          # tipos del dominio (Team, CardData, RoundConfig, Phase...)
├── config/
│   ├── rounds.ts          # las 4 rondas: regla, tiempo, mazo
│   └── teams.ts           # colores y límites de equipos
├── store/
│   ├── gameStore.ts       # máquina de estados de la partida (Zustand)
│   └── settingsStore.ts   # tema y sonido
├── hooks/
│   ├── useTimer.ts        # cronómetro basado en Date.now() (sin drift)
│   ├── useSound.ts        # efectos con Web Audio
│   └── useTheme.ts        # aplica la clase `dark`
├── utils/
│   ├── cards.ts           # mazo barajado por semilla, palabras prohibidas
│   ├── random.ts          # RNG determinístico (mulberry32) + shuffle
│   └── shareCode.ts       # codifica/decodifica la partida en un link
├── components/
│   ├── ui/                # Button, Panel, Chip, TextField, Screen... (genéricos)
│   └── game/              # WordCard, TimerRing, Scoreboard, CategoryPicker...
├── screens/               # una pantalla por fase del juego
├── App.tsx                # elige la pantalla según `phase`
└── main.tsx
```

### Flujo de fases

```
home → setup ─┐
home → join ──┴→ round-intro → turn-ready → turn → turn-summary ─┬→ turn-ready (otro equipo)
                       ▲                                        ├→ round-intro (otra ronda)
                       └──────────── revancha ◄── results ◄──────┘
```

---

## Para quien viene de .NET / Vue / SQL

Algunas equivalencias para leer el código más rápido:

| En este proyecto | Equivalente que ya conocés |
| --- | --- |
| `src/types/game.ts` | Carpeta `Models/` con DTOs. Las `type` unions (`'speak' \| 'silence'`) son enums que se serializan como string. |
| `store/gameStore.ts` (Zustand) | Un store de **Pinia**: estado + acciones. En .NET, un servicio Singleton con estado y métodos que devuelven un estado nuevo (inmutable, estilo reducer). |
| `useGameStore((s) => s.teams)` | Un `computed` sobre el store. El componente se re-renderiza solo si cambia esa porción. |
| Hooks (`useTimer`, `useSound`) | **Composables** de Vue 3 (`useX()` que devuelve refs y funciones). |
| `useEffect` | `watch` / `onMounted` + `onUnmounted` juntos: corre cuando cambian sus dependencias y limpia al desmontar. |
| Componentes con `children` | Componentes con `<slot>`. Las props son la misma idea. |
| `App.tsx` con el mapa `SCREENS[phase]` | `<component :is="...">`: un router "a mano" porque es una sola página. |
| `persist()` de Zustand | Pinia persisted state. Guarda el store en `localStorage` para sobrevivir recargas. |
| Semilla + `shuffle` determinístico | `new Random(seed)`: misma semilla, mismo orden de mazo en todos los celulares. |
| Tailwind `@theme` en `index.css` | Variables de SCSS / design tokens. Las clases `bg-turquoise-500` salen de ahí. |

Una diferencia importante respecto de Vue: en React el estado es **inmutable**. En vez de
`team.score++` se construye un objeto nuevo (`{ ...team, score: team.score + 1 }`), como
harías con un `record` en C# usando `with`.

---

## Limitaciones conocidas

- **No hay sincronización en vivo entre celulares.** "Unirse" carga la misma configuración y
  el mismo orden de mazo, pero cada celular lleva su propio puntaje. Para sincronizar en
  tiempo real haría falta un backend (por ejemplo Firebase o Supabase, ambos con capa
  gratuita).
- La validación de "no decir la palabra clave" es manual: la carta muestra las palabras
  prohibidas y el equipo marca **¡Falta!** cuando ocurre. El navegador no escucha el audio.

## Licencia

Este proyecto es una adaptación de una experiencia de juego de mesa para uso creativo y lúdico.
