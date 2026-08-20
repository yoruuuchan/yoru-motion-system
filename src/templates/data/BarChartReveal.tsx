import React from 'react';
import {z} from 'zod';
import {useCanvas} from '../../core/canvas';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {Column, FadeRise, GrowBar, Stage, useStagger} from '../../primitives';

/**
 * Archetype: data / number reveal.
 * Evidence: bar-chart-reveal — 4 keeps out of 7 variants (default, brutalist,
 * dark, glass), 2 maybe, 1 reject. One of the three strongest families.
 *
 * Choreography (measured): title fades in over frames 0-8; bar 1 starts at
 * frame 11 and each following bar 8 frames later; each bar springs up with 11%
 * overshoot and carries its value label on its growing edge; the category
 * labels sit below a fixed baseline and never move.
 *
 * 9:16 is a genuine re-layout, not a squeeze: the bars turn horizontal and the
 * category label moves above each row, because four vertical bars in a
 * 1080-wide frame would be thin enough to disappear on a phone.
 */
export const BarChartRevealSchema = z.object({
  ...stageShape,
  title: z.string(),
  bars: z
    .array(
      z.object({
        label: z.string(),
        value: z.number(),
        /** Shown on the bar's growing edge. Falls back to the raw value. */
        display: z.string().optional(),
      }),
    )
    .min(2)
    .max(6),
  /** Scale ceiling. Defaults to the largest value, which is what the source did. */
  max: z.number().optional(),
});

export type BarChartRevealProps = z.infer<typeof BarChartRevealSchema>;

export const barChartRevealDuration = (p: BarChartRevealProps) =>
  durationFor(11 + (p.bars.length - 1) * 8, p.rhythm);

export const BarChartReveal: React.FC<BarChartRevealProps> = ({
  palette,
  skin,
  rhythm,
  title,
  bars,
  max,
}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Chart title={title} bars={bars} max={max} />
  </Stage>
);

const Chart: React.FC<Pick<BarChartRevealProps, 'title' | 'bars' | 'max'>> = ({
  title,
  bars,
  max,
}) => {
  const t = useTheme();
  const {u, isLandscape, contentW, contentH} = useCanvas();
  const delays = useStagger(bars.length, {delay: 11, step: 8});
  const ceiling = max ?? Math.max(...bars.map((b) => b.value));

  // The ramp is a lightness scale, not a hue scale — the strongest reading from
  // the kept clips. Series longer than the ramp reuse its top step.
  const shade = (i: number) => t.palette.ramp[Math.min(i, t.palette.ramp.length - 1)];

  const gap = 28 * u;
  const chartH = Math.min(contentH * 0.52, 460 * u);
  // Bars keep a chunky fixed width instead of dividing the column, so a
  // four-bar chart and a two-bar chart read at the same weight.
  const barW = Math.min(
    150 * u,
    (Math.min(contentW, 1240 * u) - gap * (bars.length - 1)) / bars.length,
  );
  const rowLen = contentW - 120 * u;

  if (!isLandscape) {
    return (
      <Column gap={40}>
        <FadeRise delay={0}>
          <h1 style={textStyle(t, u, 'title')}>{title}</h1>
        </FadeRise>
        <div style={{display: 'flex', flexDirection: 'column', gap: 26 * u}}>
          {bars.map((bar, i) => (
            <div key={bar.label} style={{display: 'flex', flexDirection: 'column', gap: 10 * u}}>
              <span style={textStyle(t, u, 'dataTick', {color: t.palette.inkMuted})}>
                {bar.label}
              </span>
              <GrowBar
                delay={delays[i]}
                direction="right"
                size={(bar.value / ceiling) * rowLen}
                thickness={56 * u}
                color={shade(i)}
                radius={t.skin.radius * 0.35 * u}
                capGap={16 * u}
                cap={
                  <span style={textStyle(t, u, 'dataTick', {color: t.palette.ink, fontWeight: 600})}>
                    {bar.display ?? bar.value}
                  </span>
                }
              />
            </div>
          ))}
        </div>
      </Column>
    );
  }

  return (
    <Column style={{alignItems: 'center'}}>
      <div style={{display: 'inline-flex', flexDirection: 'column', gap: 40 * u}}>
        <FadeRise delay={0}>
          <h1 style={textStyle(t, u, 'title')}>{title}</h1>
        </FadeRise>

        <div style={{display: 'flex', alignItems: 'flex-end', gap, height: chartH}}>
          {bars.map((bar, i) => (
            <div
              key={bar.label}
              style={{
                width: barW,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <GrowBar
                delay={delays[i]}
                size={(bar.value / ceiling) * (chartH - 64 * u)}
                thickness="100%"
                color={shade(i)}
                radius={t.skin.radius * 0.35 * u}
                capGap={12 * u}
                cap={
                  <span style={textStyle(t, u, 'dataTick', {color: t.palette.ink, fontWeight: 600})}>
                    {bar.display ?? bar.value}
                  </span>
                }
              />
            </div>
          ))}
        </div>

        <div style={{display: 'flex', gap}}>
          {bars.map((bar, i) => (
            <div key={bar.label} style={{width: barW, textAlign: 'center'}}>
              <FadeRise delay={delays[i]} distance={0}>
                <span style={textStyle(t, u, 'dataTick', {color: t.palette.inkMuted})}>
                  {bar.label}
                </span>
              </FadeRise>
            </div>
          ))}
        </div>
      </div>
    </Column>
  );
};
