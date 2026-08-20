import React from 'react';
import {z} from 'zod';
import {useCanvas} from '../../core/canvas';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {Column, FadeRise, Stage, useStagger} from '../../primitives';

/**
 * Archetype: title / text entrance.
 * Evidence: staggered-words — 2 keeps (brutalist, dark), 2 maybe, 3 reject.
 *
 * Choreography (measured): words land at frames 0, 6, 12 — a 6-frame step, the
 * fastest stagger in the kept set. All motion is finished by frame 25 and the
 * rest of the clip is a still frame.
 *
 * The critical detail: the finished line is measured and laid out at frame 0,
 * and words fade into their final positions. Nothing re-centers as words
 * arrive. Verified by tracking the first word's x across the clip.
 */
export const StaggeredWordsSchema = z.object({
  ...stageShape,
  text: z.string(),
  kicker: z.string().optional(),
  align: z.enum(['left', 'center']).default('center'),
  /** Frames between words. 6 is measured; raise it for long lines. */
  step: z.number().default(6),
});

export type StaggeredWordsProps = z.infer<typeof StaggeredWordsSchema>;

export const staggeredWordsDuration = (p: StaggeredWordsProps) =>
  durationFor(p.text.trim().split(/\s+/).length * p.step, p.rhythm, {settle: 8, hold: 30});

export const StaggeredWords: React.FC<StaggeredWordsProps> = ({
  palette,
  skin,
  rhythm,
  ...rest
}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Body {...rest} />
  </Stage>
);

const Body: React.FC<Omit<StaggeredWordsProps, 'palette' | 'skin' | 'rhythm'>> = ({
  text,
  kicker,
  align,
  step,
}) => {
  const t = useTheme();
  const {u} = useCanvas();
  const words = text.trim().split(/\s+/);
  const delays = useStagger(words.length, {delay: 0, step});

  return (
    <Column maxWidth={1500} align={align === 'center' ? 'center' : 'start'} gap={24}>
      {kicker ? (
        <FadeRise delay={0} distance={10}>
          <span style={textStyle(t, u, 'label', {color: t.palette.inkMuted})}>{kicker}</span>
        </FadeRise>
      ) : null}

      <h1
        style={textStyle(t, u, 'display', {
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: '0.28em',
          rowGap: '0.06em',
          justifyContent: align === 'center' ? 'center' : 'flex-start',
        })}
      >
        {words.map((word, i) => (
          <FadeRise key={`${word}-${i}`} delay={delays[i]} distance={18}>
            {word}
          </FadeRise>
        ))}
      </h1>
    </Column>
  );
};
