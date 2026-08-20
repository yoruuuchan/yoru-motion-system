import React from 'react';
import {z} from 'zod';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {useCanvas} from '../../core/canvas';
import {useBeat} from '../../core/rhythm';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {EASE} from '../../core/timing';
import {Column, FadeRise, Stage, SpringIn, Surface} from '../../primitives';

/**
 * Archetype: product UI demo — a dialog that walks through itself.
 * Evidence: modal-explainer — 1 keep (default), 0 maybe, 6 reject. Weak
 * evidence, but it is the only kept structure that pages its own content, so
 * dropping it would lose a capability rather than a variant.
 *
 * Choreography (measured): the scrim darkens over frames 0-16 while the card
 * scales up underneath it and settles by frame 24; the first step lands around
 * frame 26; the card then swaps to step 2 around frame 64 without moving —
 * only the content cross-fades and the progress advances.
 */
export const ModalExplainerSchema = z.object({
  ...stageShape,
  title: z.string(),
  subtitle: z.string().optional(),
  steps: z.array(z.object({label: z.string(), caption: z.string().optional()})).min(1).max(4),
  /** Frames each step stays on screen. 38 is measured. */
  pageFrames: z.number().default(38),
});

export type ModalExplainerProps = z.infer<typeof ModalExplainerSchema>;

export const modalExplainerDuration = (p: ModalExplainerProps) =>
  durationFor(26 + p.steps.length * p.pageFrames, p.rhythm, {settle: 0, hold: 14});

export const ModalExplainer: React.FC<ModalExplainerProps> = ({
  palette,
  skin,
  rhythm,
  ...rest
}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Body {...rest} />
  </Stage>
);

const Body: React.FC<Omit<ModalExplainerProps, 'palette' | 'skin' | 'rhythm'>> = ({
  title,
  subtitle,
  steps,
  pageFrames,
}) => {
  const t = useTheme();
  const {u} = useCanvas();
  const frame = useCurrentFrame();
  const b = useBeat();

  const scrim = interpolate(frame, [0, b(16)], [0, t.palette.mode === 'dark' ? 0.55 : 0.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.out,
  });

  const firstPage = b(26);
  const page = b(pageFrames);
  const index = Math.min(steps.length - 1, Math.max(0, Math.floor((frame - firstPage) / page)));
  const localFrame = frame - firstPage - index * page;
  // Content cross-fades in place; the card itself never moves between steps.
  const swap = interpolate(localFrame, [0, b(7)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.out,
  });
  const progress = interpolate(
    frame,
    [firstPage, firstPage + steps.length * page],
    [1 / steps.length, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <>
      <AbsoluteFill style={{background: t.palette.ink, opacity: scrim}} />
      <Column maxWidth={860} style={{position: 'relative', zIndex: 1}}>
        <SpringIn delay={6} from={0.9} config="surface" style={{width: '100%'}}>
          <Surface style={{padding: 44 * u, width: '100%'}}>
            <h1 style={textStyle(t, u, 'subtitle', {fontWeight: 650})}>{title}</h1>
            {subtitle ? (
              <span
                style={textStyle(t, u, 'caption', {
                  color: t.palette.inkMuted,
                  display: 'block',
                  marginTop: 6 * u,
                })}
              >
                {subtitle}
              </span>
            ) : null}

            <div
              style={{
                marginTop: 32 * u,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 18 * u,
                opacity: swap,
                translate: `0px ${(1 - swap) * 10 * u}px`,
              }}
            >
              <span
                style={{
                  width: 48 * u,
                  height: 48 * u,
                  borderRadius: t.skin.radiusSmall * u,
                  background: t.palette.ink,
                  color: t.palette.mode === 'dark' ? t.palette.bg : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={textStyle(t, u, 'caption', {fontWeight: 650})}>{index + 1}</span>
              </span>
              <div style={{display: 'flex', flexDirection: 'column', gap: 6 * u}}>
                <span style={textStyle(t, u, 'body', {fontWeight: 650})}>{steps[index].label}</span>
                {steps[index].caption ? (
                  <span style={textStyle(t, u, 'caption', {color: t.palette.inkMuted})}>
                    {steps[index].caption}
                  </span>
                ) : null}
              </div>
            </div>

            <FadeRise delay={20} distance={0}>
              <div style={{display: 'flex', alignItems: 'center', gap: 10 * u, marginTop: 34 * u}}>
                {steps.map((step, i) => (
                  <span
                    key={step.label}
                    style={{
                      width: 10 * u,
                      height: 10 * u,
                      borderRadius: '50%',
                      background: i === index ? t.palette.ink : t.palette.line,
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  marginTop: 16 * u,
                  height: 4 * u,
                  borderRadius: 2 * u,
                  background: t.palette.line,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${progress * 100}%`,
                    height: '100%',
                    background: t.palette.ink,
                  }}
                />
              </div>
            </FadeRise>
          </Surface>
        </SpringIn>
      </Column>
    </>
  );
};
