import {z} from 'zod';

/** Every template takes these three. They are the theme/rhythm axes, nothing else. */
export const zPalette = z.enum(['neutral-light', 'neutral-dark', 'yoru-light', 'yoru-dark', 'warm-paper']);
export const zSkin = z.enum(['hairline', 'brutalist', 'glass', 'flat']);
export const zRhythm = z.enum(['slow', 'medium', 'fast']);

export const stageShape = {
  palette: zPalette,
  skin: zSkin,
  rhythm: zRhythm,
};

export type StageProps = {
  palette: z.infer<typeof zPalette>;
  skin: z.infer<typeof zSkin>;
  rhythm: z.infer<typeof zRhythm>;
};

/** Rhythm multiplier, mirrored from core/timing so duration math can use it. */
const RHYTHM_FACTOR = {slow: 1.5, medium: 1, fast: 0.7} as const;

/**
 * Composition length for a template: the last beat, plus the spring settle,
 * plus a hold so the finished frame can actually be read.
 *
 * The reference material ends all motion between frame 32 and 66 of 90 and
 * then holds — the still frame is part of the design, not leftover timeline.
 */
export const durationFor = (
  lastBeat: number,
  rhythm: StageProps['rhythm'],
  opts?: {settle?: number; hold?: number},
) => {
  const settle = opts?.settle ?? 26;
  const hold = opts?.hold ?? 26;
  return Math.round((lastBeat + settle + hold) * RHYTHM_FACTOR[rhythm]);
};
