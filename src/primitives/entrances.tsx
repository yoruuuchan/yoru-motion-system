import React, {type CSSProperties} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useCanvas} from '../core/canvas';
import {useBeat} from '../core/rhythm';
import {EASE, SPRING, TIMING} from '../core/timing';

/**
 * Text entrance. 8-frame fade plus a short rise, no overshoot.
 *
 * Measured on concept-breakdown-dark: luminance ramps 0 -> full over 7-8 frames
 * while the block's centroid travels ~25 design-px upward and stops dead. Text
 * in the reference material never bounces; only solids do.
 */
export const FadeRise: React.FC<{
  delay?: number;
  /** Design-px of travel. 0 makes it a pure fade. */
  distance?: number;
  /** Direction the element travels *from*. */
  from?: 'bottom' | 'top' | 'left' | 'right';
  style?: CSSProperties;
  children?: React.ReactNode;
}> = ({delay = 0, distance = TIMING.rise, from = 'bottom', style, children}) => {
  const frame = useCurrentFrame();
  const {u} = useCanvas();
  const b = useBeat();
  const start = b(delay);
  const end = start + b(TIMING.fade);

  const p = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.out,
  });
  const travel = (1 - p) * distance * u;
  const offset =
    from === 'bottom'
      ? `0px ${travel}px`
      : from === 'top'
        ? `0px ${-travel}px`
        : from === 'left'
          ? `${-travel}px 0px`
          : `${travel}px 0px`;

  // Animated properties are applied last on purpose: passing `translate` or
  // `opacity` through `style` would otherwise silently freeze the entrance.
  // Positioning belongs on a wrapper element, not on this one.
  return (
    <div style={{...style, opacity: p, translate: offset, willChange: 'opacity, translate'}}>
      {children}
    </div>
  );
};

/**
 * Solid entrance: a spring-driven scale with a fade underneath.
 *
 * Measured on bar-chart-reveal: ~11% overshoot, first peak at frame 9, settled
 * by frame 26. See SPRING.pop in core/timing.ts for the fit.
 */
export const SpringIn: React.FC<{
  delay?: number;
  /** Starting scale. 0.94 is the card value in the reference material. */
  from?: number;
  /** 'surface' uses the barely-overshooting config for large panels. */
  config?: 'pop' | 'surface';
  style?: CSSProperties;
  children?: React.ReactNode;
}> = ({delay = 0, from = 0.94, config = 'pop', style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = useBeat();
  const start = b(delay);

  const s = spring({frame: frame - start, fps, config: SPRING[config]});
  const opacity = interpolate(frame, [start, start + b(TIMING.fade)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.out,
  });

  return (
    <div
      style={{
        ...style,
        opacity,
        scale: from + (1 - from) * s,
        willChange: 'opacity, scale',
      }}
    >
      {children}
    </div>
  );
};

/**
 * Delays for a run of siblings.
 *
 * The reference material staggers at a constant 8 frames: bar-chart-reveal
 * starts its four bars at frames 11, 19, 27, 35 exactly. Not a ratio, not an
 * ease — a fixed frame step.
 */
export const useStagger = (
  count: number,
  opts?: {delay?: number; step?: number},
): number[] => {
  const b = useBeat();
  const delay = b(opts?.delay ?? 0);
  const step = b(opts?.step ?? TIMING.stagger);
  return Array.from({length: count}, (_, i) => delay + i * step);
};
