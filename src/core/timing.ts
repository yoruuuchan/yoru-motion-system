/**
 * Motion constants measured frame-by-frame from the 41 clips Yoru kept in
 * curation/locomotion-2026-08-19.json.bz2. Every number here is an observation,
 * not a preference — see docs/02-motion-rules.md for the measurements.
 *
 * The reference material is 90 frames @ 30fps (3.0s), 960x540.
 */
import {Easing} from 'remotion';

/** Frame counts at 30fps. Scale with `rhythm` if the clip runs slower or faster. */
export const TIMING = {
  /** Text and flat surfaces fade 0 -> 1 in 8 frames. Measured on concept-breakdown. */
  fade: 8,
  /** Text rises this many design-px while fading. Measured ~25px at 1080p. */
  rise: 24,
  /** Frames between two siblings in a stagger. Measured 8 on bar-chart-reveal. */
  stagger: 8,
  /** Frames between two *phases* (e.g. BEFORE block -> AFTER block). */
  phase: 18,
  /** A number ramp settles in 24 frames. Measured on day-summary (0 -> 23). */
  counter: 24,
  /** An underline / connector draws in 10 frames. Measured on step-explainer. */
  draw: 10,
  /** Frames a template holds still after the last beat, so the frame can be read. */
  hold: 26,
} as const;

/**
 * Springs. The reference material grows bars with ~11% overshoot, first peak at
 * frame 9, settled by frame 26. Fitting a damped oscillator to the measured
 * heights gives stiffness 150 / damping 14 / mass 1 (mean abs error 0.7%, overshoot 11.1%
 * against a measured 11.9%).
 * Remotion's default 100/10/1 overshoots 16% and is measurably bouncier.
 */
export const SPRING = {
  /** Solids that grow or pop in: bars, cards, chips, badges. */
  pop: {stiffness: 150, damping: 14, mass: 1},
  /** Large surfaces that should barely overshoot: modals, windows, screens. */
  surface: {stiffness: 190, damping: 22, mass: 1},
} as const;

/** Easings. Text never overshoots in the reference material — only solids do. */
export const EASE = {
  /** Default text / opacity curve. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
} as const;

export type Rhythm = 'slow' | 'medium' | 'fast';

/** Multiplier applied to every duration and delay above. */
export const RHYTHM: Record<Rhythm, number> = {
  slow: 1.5,
  medium: 1,
  fast: 0.7,
};

/** Round to whole frames — sub-frame delays are invisible and cost determinism. */
export const beat = (frames: number, rhythm: Rhythm = 'medium') =>
  Math.round(frames * RHYTHM[rhythm]);
