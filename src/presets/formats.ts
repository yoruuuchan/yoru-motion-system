import type {Format} from '../core/canvas';

/**
 * The three delivery formats. Templates re-lay-out per format rather than
 * scaling one design — the validation matrix fails "just a brute scale/crop".
 */
export const FORMATS: Record<Format, {width: number; height: number}> = {
  landscape: {width: 1920, height: 1080},
  portrait: {width: 1080, height: 1920},
  square: {width: 1080, height: 1080},
};

export const FPS = 30;
