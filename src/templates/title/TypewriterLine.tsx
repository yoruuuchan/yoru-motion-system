import React from 'react';
import {z} from 'zod';
import {useCanvas} from '../../core/canvas';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {Column, FadeRise, Stage, Typewriter} from '../../primitives';

/**
 * Archetype: title / text entrance, typed.
 * Evidence: typewriter-reveal — 2 keeps (default, dark), 0 maybe, 5 reject.
 * A clean "structure survives, variant matters" case: the idea works, but only
 * on plain light and plain dark.
 *
 * Choreography (measured): 1 character at frame 6 and 20 characters at frame
 * 88 — 4.3 frames per character, i.e. 7 characters per second, with a caret
 * that keeps blinking after the line finishes.
 *
 * Note the source is monospace. That is not decoration: a proportional face
 * makes the caret jitter horizontally as glyph widths change. The template
 * forces mono regardless of skin for that reason.
 */
export const TypewriterLineSchema = z.object({
  ...stageShape,
  text: z.string(),
  kicker: z.string().optional(),
  /** Characters per second. 7 is measured. */
  cps: z.number().default(7),
  caret: z.boolean().default(true),
});

export type TypewriterLineProps = z.infer<typeof TypewriterLineSchema>;

export const typewriterLineDuration = (p: TypewriterLineProps) =>
  durationFor(6 + Math.ceil((p.text.length / p.cps) * 30), p.rhythm, {settle: 0, hold: 30});

export const TypewriterLine: React.FC<TypewriterLineProps> = ({
  palette,
  skin,
  rhythm,
  ...rest
}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Body {...rest} />
  </Stage>
);

const Body: React.FC<Omit<TypewriterLineProps, 'palette' | 'skin' | 'rhythm'>> = ({
  text,
  kicker,
  cps,
  caret,
}) => {
  const t = useTheme();
  const {u} = useCanvas();

  return (
    <Column maxWidth={1500} align="center" gap={26}>
      {kicker ? (
        <FadeRise delay={0} distance={10}>
          <span style={textStyle(t, u, 'label', {color: t.palette.inkMuted})}>{kicker}</span>
        </FadeRise>
      ) : null}

      <h1
        style={textStyle(t, u, 'title', {
          fontFamily: t.font.mono,
          fontWeight: 500,
          letterSpacing: '-0.01em',
        })}
      >
        <Typewriter text={text} delay={6} cps={cps} caret={caret} />
      </h1>
    </Column>
  );
};
