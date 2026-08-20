import React, {type CSSProperties} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {useBeat} from '../core/rhythm';
import {EASE} from '../core/timing';

/**
 * A wipe that uncovers its children along one edge.
 *
 * NOT observed in the 41 kept clips — the reference material reveals with
 * opacity and spring only. This is a documented extension for image and video
 * content, which Locomotion's set never contained. Treat it as unproven against
 * Yoru's taste until it has been through a benchmark render.
 */
export const MaskedReveal: React.FC<{
  delay?: number;
  duration?: number;
  from?: 'left' | 'right' | 'top' | 'bottom';
  style?: CSSProperties;
  children?: React.ReactNode;
}> = ({delay = 0, duration = 16, from = 'left', style, children}) => {
  const frame = useCurrentFrame();
  const b = useBeat();
  const start = b(delay);

  const p = interpolate(frame, [start, start + b(duration)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.out,
  });
  const hidden = (1 - p) * 100;
  const clip =
    from === 'left'
      ? `inset(0 ${hidden}% 0 0)`
      : from === 'right'
        ? `inset(0 0 0 ${hidden}%)`
        : from === 'top'
          ? `inset(0 0 ${hidden}% 0)`
          : `inset(${hidden}% 0 0 0)`;

  return <div style={{clipPath: clip, ...style}}>{children}</div>;
};
