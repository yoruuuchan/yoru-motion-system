import React from 'react';
import {z} from 'zod';
import {useCanvas} from '../../core/canvas';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {Column, FadeRise, Stage, Surface, useStagger} from '../../primitives';

/**
 * Archetype: product UI showcase — a short claim set.
 * Evidence: feature-showcase — 1 keep (brutalist), 0 maybe, 6 reject, and the
 * default was rejected. One of only three families where a non-default variant
 * rescued a rejected default, so the skin is doing real work here.
 *
 * Choreography (measured): centred title over frames 0-8, then cards at frames
 * 17, 33, 45 — a 14-frame step. Slow, because each card is a separate claim.
 */
export const FeatureTrioSchema = z.object({
  ...stageShape,
  title: z.string(),
  features: z
    .array(z.object({icon: z.string().optional(), label: z.string(), caption: z.string().optional()}))
    .min(2)
    .max(4),
});

export type FeatureTrioProps = z.infer<typeof FeatureTrioSchema>;

const STEP = 14;

export const featureTrioDuration = (p: FeatureTrioProps) =>
  durationFor(17 + (p.features.length - 1) * STEP, p.rhythm);

export const FeatureTrio: React.FC<FeatureTrioProps> = ({palette, skin, rhythm, ...rest}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Body {...rest} />
  </Stage>
);

const Body: React.FC<Omit<FeatureTrioProps, 'palette' | 'skin' | 'rhythm'>> = ({
  title,
  features,
}) => {
  const t = useTheme();
  const {u, isLandscape} = useCanvas();
  const delays = useStagger(features.length, {delay: 17, step: STEP});

  return (
    <Column maxWidth={1440} align="center" gap={52}>
      <FadeRise delay={0}>
        <h1 style={textStyle(t, u, 'title')}>{title}</h1>
      </FadeRise>

      <div
        style={{
          display: 'flex',
          flexDirection: isLandscape ? 'row' : 'column',
          gap: 22 * u,
          width: '100%',
        }}
      >
        {features.map((feature, i) => (
          <FadeRise key={feature.label} delay={delays[i]} distance={16} style={{flex: 1}}>
            <Surface
              style={{
                padding: 30 * u,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 12 * u,
                textAlign: 'left',
              }}
            >
              <span style={{fontSize: 38 * u, lineHeight: 1}}>{feature.icon ?? ''}</span>
              <span style={textStyle(t, u, 'label', {fontWeight: 650, color: t.palette.ink})}>
                {feature.label}
              </span>
              {feature.caption ? (
                <span style={textStyle(t, u, 'caption', {color: t.palette.inkMuted})}>
                  {feature.caption}
                </span>
              ) : null}
            </Surface>
          </FadeRise>
        ))}
      </div>
    </Column>
  );
};
