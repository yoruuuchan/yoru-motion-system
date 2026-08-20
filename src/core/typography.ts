import type {CSSProperties} from 'react';
import {bodyFont, type Theme} from './theme';

/**
 * Type scale in design-px. Because the canvas unit is format-relative
 * (see core/canvas.ts), the same number is ~4.6% of frame width in 16:9 and
 * ~8% in 9:16 — which is what you want: portrait type must be relatively
 * larger. `title` at 88 also clears the 84px headline floor for 1080-wide
 * compositions from Remotion's own video-layout guidance.
 */
export const TYPE = {
  display: 128,
  title: 88,
  subtitle: 54,
  body: 44,
  label: 30,
  caption: 34,
  dataValue: 132,
  dataLabel: 34,
  dataTick: 32,
} as const;

export type TypeRole = keyof typeof TYPE;

/** Line heights are tight for video: long leading reads as dead space on screen. */
const LEADING: Record<TypeRole, number> = {
  display: 1.02,
  title: 1.12,
  subtitle: 1.3,
  body: 1.45,
  label: 1.2,
  caption: 1.35,
  dataValue: 1.0,
  dataLabel: 1.2,
  dataTick: 1.2,
};

const TRACKING: Record<TypeRole, string> = {
  display: '-0.03em',
  title: '-0.02em',
  subtitle: '-0.01em',
  body: '0em',
  label: '0.14em',
  caption: '0em',
  dataValue: '-0.03em',
  dataLabel: '0em',
  dataTick: '0.02em',
};

const WEIGHT: Record<TypeRole, number> = {
  display: 650,
  title: 650,
  subtitle: 400,
  body: 400,
  label: 500,
  caption: 400,
  dataValue: 650,
  dataLabel: 500,
  dataTick: 400,
};

/**
 * One call produces every typographic property for a role, already themed and
 * scaled. `u` comes from useCanvas().
 */
export const textStyle = (t: Theme, u: number, role: TypeRole, over?: CSSProperties): CSSProperties => {
  const isLabel = role === 'label';
  return {
    fontFamily: role === 'label' || t.skin.monoBody ? (t.skin.monoBody ? t.font.mono : bodyFont(t)) : t.font.sans,
    fontSize: TYPE[role] * u,
    lineHeight: LEADING[role],
    letterSpacing: TRACKING[role],
    fontWeight: WEIGHT[role],
    textTransform: isLabel && t.skin.upperLabels ? 'uppercase' : 'none',
    fontVariantNumeric: role === 'dataValue' || role === 'dataTick' ? 'tabular-nums' : 'normal',
    margin: 0,
    ...over,
  };
};
