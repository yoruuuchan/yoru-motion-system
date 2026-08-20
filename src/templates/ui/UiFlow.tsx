import React from 'react';
import {z} from 'zod';
import {useCanvas} from '../../core/canvas';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {Column, FadeRise, Stage, Surface, useStagger} from '../../primitives';
import {interpolate, useCurrentFrame} from 'remotion';
import {useBeat} from '../../core/rhythm';

/**
 * Archetype: product UI demo — a short interaction, shown as state changes.
 * Evidence: appointment-booking — 5 keeps out of 7 (brutalist, dark, glass,
 * minimal, neo), 2 maybe, 0 reject. The single strongest family in the entire
 * 427-record set, and the one that most clearly rewards structure over styling:
 * it kept on five different skins.
 *
 * Choreography (measured): card at frames 2-11, header at 6, option rows at
 * 24, 33, 45, the selection state lands at 45, and the CTA appears at 62 —
 * after everything else has settled. The button arriving last is what makes
 * the sequence read as a decision instead of a form.
 */
export const UiFlowSchema = z.object({
  ...stageShape,
  title: z.string(),
  subtitle: z.string().optional(),
  options: z.array(z.string()).min(2).max(5),
  /** Which option lights up. -1 selects none. */
  selected: z.number().default(1),
  cta: z.string().optional(),
});

export type UiFlowProps = z.infer<typeof UiFlowSchema>;

const ROW_STEP = 11;

export const uiFlowDuration = (p: UiFlowProps) =>
  durationFor(24 + (p.options.length - 1) * ROW_STEP + (p.cta ? 18 : 0), p.rhythm);

export const UiFlow: React.FC<UiFlowProps> = ({palette, skin, rhythm, ...rest}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Card {...rest} />
  </Stage>
);

const Card: React.FC<Omit<UiFlowProps, 'palette' | 'skin' | 'rhythm'>> = ({
  title,
  subtitle,
  options,
  selected,
  cta,
}) => {
  const t = useTheme();
  const {u} = useCanvas();
  const frame = useCurrentFrame();
  const b = useBeat();
  const delays = useStagger(options.length, {delay: 24, step: ROW_STEP});
  const selectAt = b(delays[Math.max(0, Math.min(selected, options.length - 1))] + 6);
  const ctaDelay = 24 + (options.length - 1) * ROW_STEP + 8;

  // The selection is its own beat: the row is already on screen when it lights.
  const selectedNow = interpolate(frame, [selectAt, selectAt + b(5)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Column maxWidth={720}>
      <FadeRise delay={2} distance={18}>
        <Surface style={{padding: 42 * u, width: '100%'}}>
          <h1 style={textStyle(t, u, 'subtitle', {fontWeight: 650})}>{title}</h1>
          {subtitle ? (
            <span
              style={textStyle(t, u, 'caption', {color: t.palette.inkMuted, display: 'block', marginTop: 6 * u})}
            >
              {subtitle}
            </span>
          ) : null}

          <div style={{marginTop: 28 * u, display: 'flex', flexDirection: 'column', gap: 12 * u}}>
            {options.map((option, i) => (
              <FadeRise key={option} delay={delays[i]} distance={12}>
                <Surface
                  shape="chip"
                  tone="inset"
                  emphasized={i === selected && selectedNow > 0.5}
                  style={{
                    padding: `${16 * u}px ${20 * u}px`,
                    background: t.palette.surface,
                  }}
                >
                  <span
                    style={textStyle(t, u, 'caption', {
                      fontWeight: i === selected && selectedNow > 0.5 ? 650 : 400,
                    })}
                  >
                    {option}
                  </span>
                </Surface>
              </FadeRise>
            ))}
          </div>

          {cta ? (
            <FadeRise delay={ctaDelay} distance={12}>
              <Surface
                shape="pill"
                tone="accent"
                style={{
                  marginTop: 24 * u,
                  padding: `${18 * u}px ${20 * u}px`,
                  textAlign: 'center',
                }}
              >
                <span style={textStyle(t, u, 'caption', {fontWeight: 650})}>{cta}</span>
              </Surface>
            </FadeRise>
          ) : null}
        </Surface>
      </FadeRise>
    </Column>
  );
};
