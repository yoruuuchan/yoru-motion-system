import React from 'react';
import {z} from 'zod';
import {useCanvas} from '../../core/canvas';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {Column, DrawLine, FadeRise, Stage, SpringIn, useStagger} from '../../primitives';

/**
 * Archetype: timeline / step explainer, numbered nodes on a track.
 * Evidence: patient-journey — 3 keeps (default, dark, glass), 2 maybe,
 * 2 reject; payment-flow — 1 keep (default), 2 maybe, 4 reject.
 *
 * Choreography (measured): node 1 lands at frame 11, then a node every ~9
 * frames, with the connector drawing into the gap between them. The whole
 * track is laid out at frame 0 — the first node sits at its final x on every
 * frame, so the row never re-centers as it fills.
 */
export const StepTimelineSchema = z.object({
  ...stageShape,
  title: z.string().optional(),
  steps: z.array(z.object({label: z.string(), caption: z.string().optional()})).min(2).max(5),
  /** 'node' is the circle-on-a-track look; 'chip' is the boxed-step look. */
  style: z.enum(['node', 'chip']).default('node'),
});

export type StepTimelineProps = z.infer<typeof StepTimelineSchema>;

const STEP = 9;

export const stepTimelineDuration = (p: StepTimelineProps) =>
  durationFor(11 + (p.steps.length - 1) * STEP, p.rhythm);

export const StepTimeline: React.FC<StepTimelineProps> = ({palette, skin, rhythm, ...rest}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Body {...rest} />
  </Stage>
);

const Body: React.FC<Omit<StepTimelineProps, 'palette' | 'skin' | 'rhythm'>> = ({
  title,
  steps,
  style,
}) => {
  const t = useTheme();
  const {u, isLandscape} = useCanvas();
  const delays = useStagger(steps.length, {delay: 11, step: STEP});
  const node = 88 * u;

  const Node: React.FC<{index: number}> = ({index}) => (
    <SpringIn delay={delays[index]} from={0.7}>
      <div
        style={{
          width: node,
          height: node,
          borderRadius: style === 'chip' ? t.skin.radiusSmall * u : '50%',
          background: t.palette.surface,
          borderStyle: 'solid',
          borderWidth: Math.max(t.skin.borderWidth, 1.5) * u,
          borderColor: t.palette.inkMuted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        <span style={textStyle(t, u, 'dataTick', {fontWeight: 650})}>{index + 1}</span>
      </div>
    </SpringIn>
  );

  const Label: React.FC<{index: number; centered: boolean}> = ({index, centered}) => (
    <FadeRise delay={delays[index] + 2} distance={10}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: centered ? 'center' : 'flex-start',
          gap: 4 * u,
        }}
      >
        <span style={textStyle(t, u, 'dataTick', {fontWeight: 600})}>{steps[index].label}</span>
        {steps[index].caption ? (
          <span style={textStyle(t, u, 'caption', {color: t.palette.inkMuted})}>
            {steps[index].caption}
          </span>
        ) : null}
      </div>
    </FadeRise>
  );

  if (!isLandscape) {
    return (
      <Column gap={44}>
        {title ? (
          <FadeRise delay={0}>
            <h1 style={textStyle(t, u, 'title')}>{title}</h1>
          </FadeRise>
        ) : null}
        <div style={{display: 'flex', flexDirection: 'column'}}>
          {steps.map((step, i) => (
            <React.Fragment key={step.label}>
              <div style={{display: 'flex', alignItems: 'center', gap: 26 * u}}>
                <Node index={i} />
                <Label index={i} centered={false} />
              </div>
              {i < steps.length - 1 ? (
                <div
                  style={{
                    height: 52 * u,
                    paddingLeft: node / 2,
                    display: 'flex',
                    alignItems: 'stretch',
                  }}
                >
                  <DrawLine
                    delay={delays[i] + 4}
                    duration={STEP}
                    direction="down"
                    dashed
                    thickness={3}
                    color={t.palette.inkFaint}
                  />
                </div>
              ) : null}
            </React.Fragment>
          ))}
        </div>
      </Column>
    );
  }

  return (
    <Column maxWidth={1400} gap={64} align="center">
      {title ? (
        <FadeRise delay={0}>
          <h1 style={textStyle(t, u, 'title', {textAlign: 'center'})}>{title}</h1>
        </FadeRise>
      ) : null}

      <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
        {steps.map((step, i) => (
          <React.Fragment key={step.label}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 18 * u,
                flexShrink: 0,
                width: 200 * u,
              }}
            >
              <Node index={i} />
              <Label index={i} centered />
            </div>
            {i < steps.length - 1 ? (
              <div
                style={{
                  flex: 1,
                  minWidth: 40 * u,
                  // Sit on the node's centre line, not on the label block.
                  marginBottom: 74 * u,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <DrawLine
                  delay={delays[i] + 4}
                  duration={STEP}
                  dashed
                  thickness={3}
                  color={t.palette.inkFaint}
                />
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </Column>
  );
};
