import React from 'react';
import {z} from 'zod';
import {useCanvas} from '../../core/canvas';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {Column, Counter, FadeRise, Stage, Surface, useStagger} from '../../primitives';

/**
 * Archetype: data / running clock.
 * Evidence: countdown-timer — 3 keeps (default, dark, glass), 1 maybe, 3 reject.
 *
 * Choreography (measured): title fades in first, tiles enter at frames 6, 11,
 * 17 (a tighter 5-6 frame step than the standard 8 — small tiles read faster),
 * and then every digit counts continuously for the rest of the clip. This is
 * the one kept template whose motion does *not* stop early: the running number
 * is the content.
 */
export const CountdownSchema = z.object({
  ...stageShape,
  title: z.string(),
  units: z
    .array(z.object({label: z.string(), from: z.number(), to: z.number()}))
    .min(2)
    .max(4),
  /** How long the digits take to run down, in frames at 30fps. */
  runFrames: z.number().default(60),
});

export type CountdownProps = z.infer<typeof CountdownSchema>;

export const countdownDuration = (p: CountdownProps) =>
  durationFor(17 + p.runFrames, p.rhythm, {settle: 0, hold: 20});

export const Countdown: React.FC<CountdownProps> = ({palette, skin, rhythm, ...rest}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Body {...rest} />
  </Stage>
);

const Body: React.FC<Omit<CountdownProps, 'palette' | 'skin' | 'rhythm'>> = ({
  title,
  units,
  runFrames,
}) => {
  const t = useTheme();
  const {u} = useCanvas();
  const delays = useStagger(units.length, {delay: 6, step: 6});

  return (
    <Column gap={40} align="center">
      <FadeRise delay={0}>
        <h1 style={textStyle(t, u, 'title')}>{title}</h1>
      </FadeRise>

      <div style={{display: 'flex', gap: 20 * u, justifyContent: 'center'}}>
        {units.map((unit, i) => (
          <FadeRise key={unit.label} delay={delays[i]} distance={14}>
            <Surface
              shape="chip"
              style={{
                width: 168 * u,
                paddingTop: 22 * u,
                paddingBottom: 18 * u,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4 * u,
              }}
            >
              <span style={textStyle(t, u, 'title', {fontWeight: 700})}>
                <Counter
                  to={unit.to}
                  from={unit.from}
                  delay={delays[i]}
                  duration={runFrames}
                  format={(n) => String(Math.round(n)).padStart(2, '0')}
                />
              </span>
              <span style={textStyle(t, u, 'label', {color: t.palette.inkFaint, fontSize: 20 * u})}>
                {unit.label}
              </span>
            </Surface>
          </FadeRise>
        ))}
      </div>
    </Column>
  );
};
