import React, {type CSSProperties} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {useCanvas} from '../core/canvas';
import {useBeat} from '../core/rhythm';
import {EASE, TIMING} from '../core/timing';
import {useTheme} from '../core/theme';

/**
 * A rule that draws itself along one axis.
 *
 * Measured on step-explainer-glass: the underline under each step label sweeps
 * left-to-right over ~10 frames, starting as the label finishes fading in.
 * Also used for the dashed connectors between timeline steps.
 */
export const DrawLine: React.FC<{
  delay?: number;
  duration?: number;
  /** Design-px. Height for a horizontal rule, width for a vertical one. */
  thickness?: number;
  direction?: 'right' | 'left' | 'down';
  color?: string;
  dashed?: boolean;
  style?: CSSProperties;
}> = ({
  delay = 0,
  duration = TIMING.draw,
  thickness = 2,
  direction = 'right',
  color,
  dashed = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const {u} = useCanvas();
  const t = useTheme();
  const b = useBeat();
  const start = b(delay);

  const p = interpolate(frame, [start, start + b(duration)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.out,
  });

  const stroke = color ?? t.palette.line;
  const vertical = direction === 'down';

  if (dashed) {
    // A dashed connector reveals through a clip so the dash phase never shifts.
    return (
      <div
        style={{
          height: vertical ? '100%' : thickness * u,
          width: vertical ? thickness * u : '100%',
          clipPath: vertical ? `inset(0 0 ${(1 - p) * 100}% 0)` : `inset(0 ${(1 - p) * 100}% 0 0)`,
          backgroundImage: `repeating-linear-gradient(${
            vertical ? 'to bottom' : 'to right'
          }, ${stroke} 0 ${7 * u}px, transparent ${7 * u}px ${15 * u}px)`,
          ...style,
        }}
      />
    );
  }

  return (
    <div
      style={{
        height: vertical ? `${p * 100}%` : thickness * u,
        width: vertical ? thickness * u : `${p * 100}%`,
        background: stroke,
        marginLeft: direction === 'left' ? 'auto' : undefined,
        ...style,
      }}
    />
  );
};
