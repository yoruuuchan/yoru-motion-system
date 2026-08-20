import React from 'react';
import {z} from 'zod';
import {useCanvas} from '../../core/canvas';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {Arc, Column, FadeRise, Stage, useStagger} from '../../primitives';

/**
 * Archetype: data / composition breakdown.
 * Evidence: portfolio-breakdown — 1 keep (default), 5 maybe, 1 reject. Kept for
 * its structure; the variant field is unresolved, so this ships on the two
 * skins that scored across the whole set rather than on its own evidence.
 *
 * Choreography (measured): the ring sweeps clockwise from 12 o'clock as one
 * continuous ~28-frame draw starting at frame 5 — not one spring per segment.
 * Legend rows stagger on top of it at the standard 8-frame step.
 */
export const DonutBreakdownSchema = z.object({
  ...stageShape,
  title: z.string().optional(),
  segments: z
    .array(z.object({label: z.string(), value: z.number(), display: z.string().optional()}))
    .min(2)
    .max(5),
});

export type DonutBreakdownProps = z.infer<typeof DonutBreakdownSchema>;

export const donutBreakdownDuration = (p: DonutBreakdownProps) =>
  durationFor(Math.max(5 + 28, 11 + (p.segments.length - 1) * 8), p.rhythm, {settle: 8});

export const DonutBreakdown: React.FC<DonutBreakdownProps> = ({
  palette,
  skin,
  rhythm,
  title,
  segments,
}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Body title={title} segments={segments} />
  </Stage>
);

const Body: React.FC<Pick<DonutBreakdownProps, 'title' | 'segments'>> = ({title, segments}) => {
  const t = useTheme();
  const {u, isLandscape, contentH} = useCanvas();
  const delays = useStagger(segments.length, {delay: 11, step: 8});
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const shade = (i: number) => t.palette.ramp[Math.min(i, t.palette.ramp.length - 1)];

  const size = Math.min(isLandscape ? contentH * 0.72 : 560 * u, 560 * u);

  return (
    <Column gap={40}>
      {title ? (
        <FadeRise delay={0}>
          <h1 style={textStyle(t, u, 'title')}>{title}</h1>
        </FadeRise>
      ) : null}

      <div
        style={{
          display: 'flex',
          flexDirection: isLandscape ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: isLandscape ? 'flex-start' : 'center',
          gap: isLandscape ? 90 * u : 48 * u,
        }}
      >
        <Arc
          delay={5}
          duration={28}
          size={size}
          thickness={size * 0.17}
          segments={segments.map((s, i) => ({value: s.value, color: shade(i)}))}
        />

        <div style={{display: 'flex', flexDirection: 'column', gap: 20 * u}}>
          {segments.map((seg, i) => (
            <FadeRise key={seg.label} delay={delays[i]} distance={12}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16 * u}}>
                <span
                  style={{
                    width: 20 * u,
                    height: 20 * u,
                    borderRadius: t.skin.radius === 0 ? 0 : 4 * u,
                    background: shade(i),
                    flexShrink: 0,
                  }}
                />
                <span style={textStyle(t, u, 'body', {color: t.palette.inkMuted})}>{seg.label}</span>
                <span style={textStyle(t, u, 'body', {fontWeight: 650})}>
                  {seg.display ?? `${Math.round((seg.value / total) * 100)}%`}
                </span>
              </div>
            </FadeRise>
          ))}
        </div>
      </div>
    </Column>
  );
};
