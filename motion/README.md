# Motion pieces (Remotion)

The two short loops on the demo pages are made in code with [Remotion](https://www.remotion.dev) and rendered to `../media/`.

| Composition | Used on | Size · length | Source |
|---|---|---|---|
| `Rosetta` | C · `rosetta.html` (inside the hero cup) | 1080×1080 · 7 s loop | `src/Rosetta.tsx` |
| `ShotFig` | D · `counter.html` (FIG. 2) | 1200×900 · 8 s loop | `src/ShotFig.tsx` |

## Edit and preview

```bash
npm install
```

```bash
npx remotion studio
```

## Render to the site

Run from this `motion/` folder:

```bash
npx remotion render Rosetta ../media/rosetta.mp4 --codec=h264 --crf=26
```

```bash
npx remotion render ShotFig ../media/fig-shot.mp4 --codec=h264 --crf=28
```

```bash
npx remotion still Rosetta ../media/rosetta-poster.jpg --frame=170 --image-format=jpeg --jpeg-quality=82
```

```bash
npx remotion still ShotFig ../media/fig-shot-poster.jpg --frame=225 --image-format=jpeg --jpeg-quality=85
```

Both loops start and end on the same frame (crema at rest, blank paper), so they repeat without a seam. The pages pause them off-screen and for visitors who prefer reduced motion.

Remotion is free for individuals and small teams; some companies need a company license ([terms](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)).
