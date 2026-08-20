import React, {type CSSProperties} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {useBeat} from '../core/rhythm';
import {EASE, TIMING} from '../core/timing';

/**
 * A number that ramps to its value.
 *
 * Measured on day-summary: 0 at frame 6, 1 at frame 11, 19 at frame 17, final
 * 23 by frame 24 — an ease-out over ~18-24 frames, not a linear count.
 * Digits are rendered tabular so the layout never jitters.
 */
export const Counter: React.FC<{
  to: number;
  from?: number;
  delay?: number;
  duration?: number;
  /** e.g. (n) => n.toLocaleString('en-US') or (n) => `${n}%` */
  format?: (n: number) => string;
  /** Decimal places to keep while ramping. */
  decimals?: number;
  style?: CSSProperties;
}> = ({to, from = 0, delay = 0, duration = TIMING.counter, format, decimals = 0, style}) => {
  const frame = useCurrentFrame();
  const b = useBeat();
  const start = b(delay);

  const raw = interpolate(frame, [start, start + b(duration)], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.out,
  });
  const factor = 10 ** decimals;
  const value = Math.round(raw * factor) / factor;

  return (
    <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>
      {format ? format(value) : value.toFixed(decimals)}
    </span>
  );
};
