import React from 'react';
import {z} from 'zod';
import {useCanvas} from '../../core/canvas';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {Column, FadeRise, Stage, Surface, useStagger} from '../../primitives';
import {TIMING} from '../../core/timing';

/**
 * Archetype: before / after.
 * Evidence: before-after — 3 keeps (dark, glass, minimal), 2 maybe, 2 reject.
 *
 * Choreography (measured): the BEFORE panel appears at frame 6 as an empty
 * box, its rows fill at frames 11, 17, 24; the connector arrow appears around
 * frame 24; the AFTER panel starts at frame 24 and fills at frames 33, 45.
 * The two sides are one phase apart — 18 frames — which is what makes it read
 * as a transformation rather than a two-column table.
 *
 * The AFTER panel carries the emphasis (full-contrast border), BEFORE is
 * de-emphasized. That asymmetry is in the source and it is the whole point.
 */
export const BeforeAfterSchema = z.object({
  ...stageShape,
  beforeLabel: z.string().default('BEFORE'),
  afterLabel: z.string().default('AFTER'),
  before: z.array(z.string()).min(1).max(5),
  after: z.array(z.string()).min(1).max(5),
});

export type BeforeAfterProps = z.infer<typeof BeforeAfterSchema>;

const PHASE = TIMING.phase;

export const beforeAfterDuration = (p: BeforeAfterProps) =>
  durationFor(6 + PHASE + 5 + (p.after.length - 1) * 8, p.rhythm);

export const BeforeAfter: React.FC<BeforeAfterProps> = ({palette, skin, rhythm, ...rest}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Body {...rest} />
  </Stage>
);

const Body: React.FC<Omit<BeforeAfterProps, 'palette' | 'skin' | 'rhythm'>> = ({
  beforeLabel,
  afterLabel,
  before,
  after,
}) => {
  const t = useTheme();
  const {u, isLandscape} = useCanvas();
  const beforeDelays = useStagger(before.length, {delay: 11, step: 7});
  const afterDelays = useStagger(after.length, {delay: 11 + PHASE, step: 7});

  return (
    <Column maxWidth={1440}>
      <div
        style={{
          display: 'flex',
          flexDirection: isLandscape ? 'row' : 'column',
          alignItems: 'stretch',
          gap: isLandscape ? 40 * u : 26 * u,
        }}
      >
        <Panel
          delay={6}
          label={beforeLabel}
          items={before}
          delays={beforeDelays}
          mark="✗"
          markColor={t.palette.negative}
          dimmed
        />

        <FadeRise
          delay={6 + PHASE}
          distance={0}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: t.palette.inkFaint,
            fontSize: 46 * u,
            lineHeight: 1,
          }}
        >
          {isLandscape ? '→' : '↓'}
        </FadeRise>

        <Panel
          delay={6 + PHASE}
          label={afterLabel}
          items={after}
          delays={afterDelays}
          mark="✓"
          markColor={t.palette.positive}
        />
      </div>
    </Column>
  );
};

const Panel: React.FC<{
  delay: number;
  label: string;
  items: string[];
  delays: number[];
  mark: string;
  markColor: string;
  dimmed?: boolean;
}> = ({delay, label, items, delays, mark, markColor, dimmed = false}) => {
  const t = useTheme();
  const {u} = useCanvas();

  return (
    <FadeRise delay={delay} distance={16} style={{flex: 1}}>
      <Surface
        emphasized={!dimmed}
        style={{
          padding: 34 * u,
          height: '100%',
          opacity: dimmed ? 0.72 : 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 18 * u,
        }}
      >
        <span
          style={textStyle(t, u, 'label', {
            color: dimmed ? t.palette.negative : t.palette.ink,
            textTransform: 'uppercase',
          })}
        >
          {label}
        </span>
        <div style={{display: 'flex', flexDirection: 'column', gap: 14 * u}}>
          {items.map((item, i) => (
            <FadeRise key={item} delay={delays[i]} distance={10}>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 14 * u}}>
                <span style={{color: markColor, fontSize: 30 * u, lineHeight: 1}}>{mark}</span>
                <span
                  style={textStyle(t, u, 'body', {
                    color: dimmed ? t.palette.inkMuted : t.palette.ink,
                  })}
                >
                  {item}
                </span>
              </div>
            </FadeRise>
          ))}
        </div>
      </Surface>
    </FadeRise>
  );
};
