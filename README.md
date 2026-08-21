# YORU Motion System

A Remotion template layer derived from Yoru's manual motion curation.

Every structure here comes from a template family she **kept** in
[`yoru-motion-research`](https://github.com/yoruuuchan/yoru-motion-research), and every
timing constant was measured frame-by-frame from the source clips rather than guessed.
Nothing in `src/` is copied from upstream code — Locomotion is `reference_only` in the
[companion research repo's license tracker](https://github.com/yoruuuchan/yoru-motion-research/blob/main/legal/license-tracker.yml), and no Locomotion source was ever downloaded.

- [`docs/01-archetypes.md`](docs/01-archetypes.md) — the 41 keeps sorted into 7 archetypes, with the count for every family
- [`docs/02-motion-rules.md`](docs/02-motion-rules.md) — the measured structure and motion rules, with the numbers and how they were taken
- [`workflow/making-a-video.md`](workflow/making-a-video.md) — how to get from an idea to a rendered file

## Provenance

This public repository was rebuilt on 2026-08-20 as a **sanitized mirror** of the private
working repo. Everything engineering-relevant is published: the archetypes, the measured
motion rules, the templates and the theme system. Not published: internal hand-off notes
and raw benchmark records involving real client material — their engineering findings are
kept, anonymized, in `docs/` and in the research repo's
[`benchmark-a-results.md`](https://github.com/yoruuuchan/yoru-motion-research/blob/main/evaluation/benchmark-a-results.md).
## Run it

```bash
npm install
npm run studio
```

Every template is registered twice — `Landscape-16x9` and `Portrait-9x16` — so a
template that only survives its authoring aspect ratio is visible immediately.

```bash
npm run render -- BarChartReveal out/chart.mp4
node scripts/stills.mjs                 # one still per composition, single bundle
node scripts/theme-matrix.mjs UiFlow    # one template across all 5 palettes x 4 skins
```

## Layout

```
src/
├── core/          tokens, canvas unit, timing constants, type scale, fonts
├── primitives/    Stage, Surface, FadeRise, SpringIn, useStagger, Counter,
│                  DrawLine, Typewriter, GrowBar, Arc, MaskedReveal, Placeholder
├── themes/        5 palettes x 4 skins
├── presets/       formats and fps
├── templates/     18 templates in 6 groups
└── examples/      demo content for every template
```

### The two theme axes

Locomotion shipped 7 "styles" per template. Comparing them frame by frame showed the
layout and the timeline were identical across all 7 — only border, radius, shadow and
type family changed. So this system splits that into two independent axes:

| Palette | | Skin | |
|---|---|---|---|
| `neutral-light` | reverse-engineered from the kept clips | `hairline` | the "default" treatment (16.4% keep rate) |
| `neutral-dark` | | `brutalist` | 2px hard edge, offset shadow, mono (13.1%) |
| `yoru-light` | YORU Content Design System | `glass` | borderless, deep soft shadow (11.5%) |
| `yoru-dark` | | `flat` | no border, no shadow (cleaned-up `minimal`) |
| `warm-paper` | anonymized finding from a private real-material stress test | | |

`neo` and `rounded` are not shipped: 2 keeps each out of 61 is noise, not evidence.

### Rhythm

`rhythm` is `slow` / `medium` / `fast` and multiplies every delay and duration
(×1.5 / ×1 / ×0.7). The choreography stays intact; only its pace changes.

## Using a template in your own project

```tsx
import {BarChartReveal, barChartRevealDuration} from 'yoru-motion-system/templates';

const props = {
  palette: 'yoru-light',
  skin: 'hairline',
  rhythm: 'medium',
  title: '季度增长',
  bars: [
    {label: 'Q1', value: 65, display: '65%'},
    {label: 'Q4', value: 100, display: '100%'},
  ],
} as const;

<Composition
  id="Chart"
  component={BarChartReveal}
  defaultProps={props}
  durationInFrames={barChartRevealDuration(props)}
  fps={30}
  width={1920}
  height={1080}
/>
```

Every template exports a matching `xxxDuration(props)`. Adding a row lengthens the
composition automatically — the duration is `last beat + settle + hold`, and the hold
is part of the design, not slack.

## What is proven and what is not

**Measured from the kept clips** — the spring config, the 8-frame stagger, the 8-frame
text fade, the phase offset, the second beat on interactive rows, the "layout never
reflows" rule, the lightness-ramp colour rule, and the fact that motion ends well
before the clip does.

**Our own rules, not yet accepted by Yoru** — everything about 9:16 (the source
material is entirely 16:9), the `Placeholder` behaviour for real photos and video (the
source only ever showed grey skeleton blocks), `MaskedReveal` (no masking appears
anywhere in the source), and the Chinese typography settings.

**Not built** — intro / outro. The data does not support it: `intro-outro` is
0 keep / 2 maybe / 5 reject and `logo-reveal` is 0 / 0 / 7. See §8 of
[`docs/01-archetypes.md`](docs/01-archetypes.md).

## Licensing

- Code here is written for this repository. No upstream implementation was copied.
- Fonts in `public/fonts/` are SIL OFL 1.1 (Inter, JetBrains Mono, Source Han Sans SC),
  taken from the YORU Content Design System. Their licence files ship alongside them.
- Remotion is a dependency with its own license and eligibility terms; check the upstream license before commercial deployment.

## Versions

Remotion 4.0.441 / React 19.2.4 / zod 4.3.6. The newer `Interactive.*` components and
`@remotion/media` are not available at this version; templates use plain elements and
`Img` / `OffthreadVideo`. Upgrading is a separate decision — see `remotion-upgrade`.
