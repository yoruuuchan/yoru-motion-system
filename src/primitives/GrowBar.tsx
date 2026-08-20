import React, {type CSSProperties} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useBeat} from '../core/rhythm';
import {EASE, SPRING, TIMING} from '../core/timing';

/**
 * A bar that grows from its baseline with the measured spring, optionally
 * carrying a value label on its growing edge.
 *
 * bar-chart-reveal, bar 1: heights 5, 15, 27, 38, 48, 56, 61, 64, 66, 66, 65,
 * 63 ... settling at 59 — an 11% overshoot with a 1px counter-swing, i.e. a
 * genuinely under-damped spring rather than a back-ease.
 *
 * The `cap` rides the bar. Measured: the "65%" label sits at row 137 when the
 * bar top is at 148, then 124 / 120 / 126 as the bar overshoots and settles —
 * it tracks the bar top through the whole spring rather than waiting at the
 * final position.
 */
export const GrowBar: React.FC<{
  /** Final size along the growth axis, in px (already scaled by the caller). */
  size: number;
  delay?: number;
  direction?: 'up' | 'right';
  color: string;
  radius?: number;
  /** Cross-axis size, in px, or a CSS length such as '100%'. */
  thickness: number | string;
  /** Rendered on the growing edge, e.g. the value label. */
  cap?: React.ReactNode;
  /** Design-px gap between bar and cap, already scaled by the caller. */
  capGap?: number;
  style?: CSSProperties;
}> = ({
  size,
  delay = 0,
  direction = 'up',
  color,
  radius = 0,
  thickness,
  cap,
  capGap = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = useBeat();
  const start = b(delay);

  const s = spring({frame: frame - start, fps, config: SPRING.pop});
  const opacity = interpolate(frame, [start, start + b(TIMING.fade)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.out,
  });
  const grown = Math.max(0, s * size);
  const vertical = direction === 'up';

  const bar = (
    <div
      style={{
        width: vertical ? thickness : grown,
        height: vertical ? grown : thickness,
        background: color,
        borderRadius: radius,
        flexShrink: 0,
      }}
    />
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        alignItems: vertical ? 'center' : 'center',
        justifyContent: vertical ? 'flex-end' : 'flex-start',
        height: vertical ? '100%' : undefined,
        width: '100%',
        opacity,
        ...style,
      }}
    >
      {vertical ? (
        <>
          {cap ? <div style={{marginBottom: capGap}}>{cap}</div> : null}
          {bar}
        </>
      ) : (
        <>
          {bar}
          {cap ? <div style={{marginLeft: capGap}}>{cap}</div> : null}
        </>
      )}
    </div>
  );
};
