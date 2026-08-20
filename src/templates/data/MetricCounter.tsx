import React from 'react';
import {z} from 'zod';
import {interpolate, useCurrentFrame} from 'remotion';
import {useCanvas} from '../../core/canvas';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {Column, Counter, FadeRise, Stage, Surface, useStagger} from '../../primitives';
import {useBeat} from '../../core/rhythm';

/**
 * Archetype: data / summary card with a headline number and a checklist.
 * Evidence: day-summary — 2 keeps (default, rounded), 3 maybe, 2 reject.
 *
 * Choreography (measured): card springs in over frames 0-6; the metric ramps
 * 0 -> final between frames 6 and 24 on an ease-out; checklist rows reach full
 * opacity at frames 31, 37, 44, 51 (a 7-frame step) and each row's box fills
 * 3-4 frames later, i.e. ~11 frames after that row began fading in. That second
 * beat per row is what makes the card feel used rather than merely assembled.
 */
export const MetricCounterSchema = z.object({
  ...stageShape,
  title: z.string(),
  /** Rendered before the title. Any short string — emoji, a glyph, a number. */
  badge: z.string().optional(),
  metricLabel: z.string(),
  metricValue: z.number(),
  metricSuffix: z.string().optional(),
  items: z.array(z.string()).min(1).max(5),
});

export type MetricCounterProps = z.infer<typeof MetricCounterSchema>;

const ROW_STEP = 7;
const CHECK_OFFSET = 11;

export const metricCounterDuration = (p: MetricCounterProps) =>
  durationFor(24 + (p.items.length - 1) * ROW_STEP + CHECK_OFFSET, p.rhythm);

export const MetricCounter: React.FC<MetricCounterProps> = ({
  palette,
  skin,
  rhythm,
  ...rest
}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Card {...rest} />
  </Stage>
);

const Card: React.FC<Omit<MetricCounterProps, 'palette' | 'skin' | 'rhythm'>> = ({
  title,
  badge,
  metricLabel,
  metricValue,
  metricSuffix,
  items,
}) => {
  const t = useTheme();
  const {u, isLandscape} = useCanvas();
  const delays = useStagger(items.length, {delay: 24, step: ROW_STEP});

  return (
    <Column maxWidth={860} align="start">
      <FadeRise delay={0} distance={16}>
        <Surface style={{padding: 44 * u, width: '100%'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14 * u}}>
            {badge ? <span style={{fontSize: 40 * u, lineHeight: 1}}>{badge}</span> : null}
            <h1 style={textStyle(t, u, isLandscape ? 'subtitle' : 'title', {fontWeight: 650})}>
              {title}
            </h1>
          </div>

          <Surface
            tone="inset"
            shape="chip"
            style={{
              marginTop: 28 * u,
              padding: `${22 * u}px ${26 * u}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24 * u,
            }}
          >
            <span style={textStyle(t, u, 'body', {color: t.palette.inkMuted})}>{metricLabel}</span>
            <span style={textStyle(t, u, 'title', {fontWeight: 700})}>
              <Counter to={metricValue} delay={6} duration={18} />
              {metricSuffix ?? ''}
            </span>
          </Surface>

          <div style={{marginTop: 28 * u, display: 'flex', flexDirection: 'column'}}>
            {items.map((item, i) => (
              <ChecklistRow key={item} label={item} delay={delays[i]} last={i === items.length - 1} />
            ))}
          </div>
        </Surface>
      </FadeRise>
    </Column>
  );
};

const ChecklistRow: React.FC<{label: string; delay: number; last: boolean}> = ({
  label,
  delay,
  last,
}) => {
  const t = useTheme();
  const {u} = useCanvas();
  const frame = useCurrentFrame();
  const b = useBeat();
  const checkAt = b(delay + CHECK_OFFSET);

  // The second beat: the box fills and the label is struck through.
  const checked = interpolate(frame, [checkAt, checkAt + b(6)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <FadeRise delay={delay} distance={14}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16 * u,
          paddingTop: 16 * u,
          paddingBottom: 16 * u,
          borderBottomStyle: 'solid',
          borderBottomWidth: last ? 0 : 1 * u,
          borderBottomColor: t.palette.line,
        }}
      >
        <span
          style={{
            width: 30 * u,
            height: 30 * u,
            borderRadius: t.skin.radiusSmall * 0.6 * u,
            borderStyle: 'solid',
            borderWidth: 2 * u,
            borderColor: checked > 0.5 ? t.palette.ink : t.palette.line,
            background: checked > 0.5 ? t.palette.ink : 'transparent',
            color: t.palette.mode === 'dark' ? '#000' : '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18 * u,
            flexShrink: 0,
          }}
        >
          {checked > 0.5 ? '✓' : ''}
        </span>
        <span
          style={textStyle(t, u, 'body', {
            color: checked > 0.5 ? t.palette.inkMuted : t.palette.ink,
            textDecorationLine: checked > 0.5 ? 'line-through' : 'none',
          })}
        >
          {label}
        </span>
      </div>
    </FadeRise>
  );
};
