# Agent Instructions

This repository is the **implementation** side of Yoru's motion work. The curation and
the taste data live in `yoru-motion-research`; this repo turns them into code.

## The one rule that matters

**Every timing number must be traceable to a measurement or marked as unproven.**

If you add a delay, a duration, an easing or a spring config, either:

1. cite the clip and frame numbers it came from, in the comment above it; or
2. say plainly in the comment that it is an assumption and has not been through
   Yoru's review.

Do not invent motion values that read as reasonable. The whole point of this repo is
that the numbers came from clips she actually chose. `docs/02-motion-rules.md` records
how measurements were taken; reuse that method.

## Source of truth

- Taste decisions: `yoru-motion-research/curation/locomotion-2026-08-19.json.bz2`
- Statistics and pre-screening rules: `yoru-motion-research/evaluation/locomotion-preference-profile.md`
- Acceptance criteria: `yoru-motion-research/evaluation/validation-matrix.md`
- Licence state: `yoru-motion-research/legal/license-tracker.yml`

Locomotion is `reference_only`. Its source is not copied into this repository. Timing
measurements were taken from a local rendered-reference set; those reference videos are
not distributed here.

## Structural rules the templates must keep

- **Layout is laid out at frame 0 and never reflows.** Animate opacity and transform.
  Never append or remove elements mid-clip in a way that moves neighbours.
- **Text does not overshoot; solids do.** `FadeRise` for copy, `SpringIn` / `GrowBar`
  for bars, cards, chips and badges.
- **Motion ends before the clip does.** Compute duration with `durationFor()`; the
  trailing hold is required, not padding.
- **Skin is surface treatment only.** If a change to a skin moves anything, it belongs
  in the template, not in the skin.
- **Colour ramps encode data by lightness.** Accent is for state (selected, after, CTA).
- **Both formats or it does not ship.** Register 16:9 and 9:16 and look at both.

## Public-fixture rule

Committed examples must be synthetic, self-authored, or explicitly redistributable.
Private production material may be used locally for stress testing, but identifying
names, local paths, screenshots, URLs, metrics, and unpublished copy stay outside Git.

## Making a new piece

Before writing any new composition:

1. Read `QUICK-PICKS.md` at the root of
   [`yoru-motion-research`](https://github.com/yoruuuchan/yoru-motion-research)
   and route from there to concrete shots. Clone that repo if you are in a container.
2. Pick 1–3 shots for the piece, list their paths, and wait for Yoru's
   confirmation before implementing.
3. Copy geometry, stagger, easing and timing from the chosen shot implementations
   unchanged — swap content only. New numbers: ask first, then mark ASSUMPTION
   (see the one rule above).
4. Reference assets with `staticFile()` from `public/assets/`. Never inline
   base64 into source files. If an asset is missing, say so and stop.

A composition that references no shot implementation from the library is a fail.
Redo it — pan/zoom/crossfade invented from scratch is exactly what this system
exists to prevent.

## Working from a cloud container (ChatGPT Work / Codex)

Some sandboxes block `os.networkInterfaces()`, which crashes Remotion before
rendering. Prefix every `remotion` command with:

    export NODE_OPTIONS="--require $PWD/scripts/codex-netif-patch.cjs"

The patch is a no-op in normal environments.

- **Look at what you render.** Before the full render, produce 3–5 key stills
  and open them with your image tooling: composition, text, overflow, cropping.
  After the final render, run ffprobe and extract 2–3 frames for another look.
- **Report every step** with the command and its result. On failure, paste the
  key lines of the actual error. Never substitute process suggestions for
  results. If you cannot do something, say so and why.
- **Deliver** the rendered file via task artifacts / file download. Push source
  to a fresh branch; leave `main` alone.

## Before calling a template done

1. `npx tsc --noEmit`
2. `node scripts/stills.mjs <TemplateName>` and actually look at the stills
3. render one real MP4 — a Studio preview is not acceptance
4. check it in at least two skins and both formats
5. state what is measured and what is assumed

## Style

Comments and commit messages in English. Docs written for Yoru in Chinese. Keep
comments explaining *why a number is that number*, not what the code does.
