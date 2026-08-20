import React, {type CSSProperties} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {useBeat} from '../core/rhythm';
import {useTheme} from '../core/theme';

/**
 * Character-by-character typing with a blinking caret.
 *
 * Measured on typewriter-reveal: 1 character at frame 6 and 20 characters at
 * frame 88 — 4.3 frames per character, i.e. ~7 characters per second. The
 * caret stays visible while typing and blinks on a ~15-frame cycle.
 *
 * The full string is rendered invisibly underneath so the line never reflows
 * mid-type. That is the single most important detail: the reference material
 * lays every template out at frame 0 and only animates opacity and transform.
 */
export const Typewriter: React.FC<{
  text: string;
  delay?: number;
  /** Characters per second. 7 is the measured rate. */
  cps?: number;
  caret?: boolean;
  style?: CSSProperties;
}> = ({text, delay = 0, cps = 7, caret = true, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = useTheme();
  const b = useBeat();
  const start = b(delay);

  const shown = Math.round(
    interpolate(frame, [start, start + (text.length / cps) * fps], [0, text.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const done = shown >= text.length;
  const blinkOn = Math.floor((frame - start) / 15) % 2 === 0;

  return (
    <span style={{position: 'relative', whiteSpace: 'pre-wrap', ...style}}>
      {/* Reserves the final size so nothing reflows while typing. */}
      <span style={{visibility: 'hidden'}} aria-hidden>
        {text}
      </span>
      <span style={{position: 'absolute', inset: 0}}>
        {text.slice(0, shown)}
        {caret && frame >= start && (!done || blinkOn) ? (
          <span style={{color: t.palette.inkMuted, fontWeight: 300}}>|</span>
        ) : null}
      </span>
    </span>
  );
};
