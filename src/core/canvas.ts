import {useVideoConfig} from 'remotion';

export type Format = 'landscape' | 'portrait' | 'square';

/**
 * One design unit. Templates are authored in "design px" and multiplied by `u`.
 *
 * The base width differs per format on purpose: a headline should occupy a
 * larger share of a 9:16 frame than of a 16:9 frame. Scaling everything by a
 * single global factor is the "brute scale/crop" failure the validation matrix
 * calls out.
 */
const BASE_WIDTH: Record<Format, number> = {
  landscape: 1920,
  portrait: 1080,
  square: 1080,
};

export const formatOf = (width: number, height: number): Format => {
  const ratio = width / height;
  if (ratio > 1.15) return 'landscape';
  if (ratio < 0.87) return 'portrait';
  return 'square';
};

export const useCanvas = () => {
  const {width, height, fps, durationInFrames} = useVideoConfig();
  const format = formatOf(width, height);
  const u = width / BASE_WIDTH[format];
  // Safe area: video-first, not web-first. Key content never touches these.
  const safeX = format === 'landscape' ? width * 0.06 : width * 0.075;
  const safeY = format === 'landscape' ? height * 0.09 : height * 0.06;
  return {
    width,
    height,
    fps,
    durationInFrames,
    format,
    u,
    safeX,
    safeY,
    contentW: width - safeX * 2,
    contentH: height - safeY * 2,
    isPortrait: format === 'portrait',
    isLandscape: format === 'landscape',
  };
};
