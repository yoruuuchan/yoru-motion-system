import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {useBeat} from '../core/rhythm';
import {EASE} from '../core/timing';

export type ArcSegment = {value: number; color: string};

/**
 * A donut whose segments sweep clockwise from 12 o'clock.
 *
 * Measured on portfolio-breakdown: the ring starts at frame 5 as a stub and
 * completes around frame 33 — a single ~28-frame sweep across all segments,
 * not one spring per segment. Legend rows stagger separately on top.
 */
export const Arc: React.FC<{
  segments: ArcSegment[];
  size: number;
  thickness: number;
  delay?: number;
  duration?: number;
  track?: string;
}> = ({segments, size, thickness, delay = 0, duration = 28, track}) => {
  const frame = useCurrentFrame();
  const b = useBeat();
  const start = b(delay);

  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;

  const swept = interpolate(frame, [start, start + b(duration)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.out,
  });

  let offset = 0;
  return (
    <svg width={size} height={size} style={{rotate: '-90deg', overflow: 'visible'}}>
      {track ? (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={track}
          strokeWidth={thickness}
        />
      ) : null}
      {segments.map((seg, i) => {
        const startFrac = offset / total;
        const endFrac = (offset + seg.value) / total;
        offset += seg.value;
        const shown = Math.min(Math.max(swept - startFrac, 0), endFrac - startFrac);
        return (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={thickness}
            strokeDasharray={`${shown * circumference} ${circumference}`}
            strokeDashoffset={-startFrac * circumference}
            strokeLinecap="butt"
          />
        );
      })}
    </svg>
  );
};
