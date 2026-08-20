import React from 'react';
import {z} from 'zod';
import {useCanvas} from '../../core/canvas';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {Column, DrawLine, FadeRise, Stage, useStagger} from '../../primitives';

/**
 * Archetype: step explainer, vertical list.
 * Evidence: step-explainer — 1 keep (glass), 1 maybe (minimal), 5 reject, and
 * notably the default variant was rejected while glass was kept. One of only
 * three families in the whole set where a non-default variant rescued a
 * rejected default, so the skin genuinely matters here.
 *
 * Choreography (measured): rows at frames 17, 33, 45 (a 14-frame step — the
 * slowest in the kept set), and each row's underline sweeps left to right over
 * ~10 frames just after its label lands.
 */
export const StepListSchema = z.object({
  ...stageShape,
  title: z.string(),
  steps: z.array(z.string()).min(2).max(5),
  underline: z.boolean().default(true),
});

export type StepListProps = z.infer<typeof StepListSchema>;

const STEP = 14;

export const stepListDuration = (p: StepListProps) =>
  durationFor(17 + (p.steps.length - 1) * STEP + 10, p.rhythm);

export const StepList: React.FC<StepListProps> = ({palette, skin, rhythm, ...rest}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Body {...rest} />
  </Stage>
);

const Body: React.FC<Omit<StepListProps, 'palette' | 'skin' | 'rhythm'>> = ({
  title,
  steps,
  underline,
}) => {
  const t = useTheme();
  const {u} = useCanvas();
  const delays = useStagger(steps.length, {delay: 17, step: STEP});

  return (
    <Column maxWidth={1180} gap={44}>
      <FadeRise delay={0}>
        <h1 style={textStyle(t, u, 'title')}>{title}</h1>
      </FadeRise>

      <div style={{display: 'flex', flexDirection: 'column', gap: 26 * u}}>
        {steps.map((step, i) => (
          <FadeRise key={step} delay={delays[i]} distance={14}>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 22 * u}}>
              <span
                style={textStyle(t, u, 'caption', {
                  color: t.palette.inkMuted,
                  fontVariantNumeric: 'tabular-nums',
                })}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div style={{display: 'inline-flex', flexDirection: 'column'}}>
                <span style={textStyle(t, u, 'body', {fontWeight: 500})}>{step}</span>
                {underline ? (
                  <DrawLine
                    delay={delays[i] + 4}
                    thickness={2}
                    color={t.palette.ink}
                    style={{marginTop: 6 * u}}
                  />
                ) : null}
              </div>
            </div>
          </FadeRise>
        ))}
      </div>
    </Column>
  );
};
