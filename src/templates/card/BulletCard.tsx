import React from 'react';
import {z} from 'zod';
import {useCanvas} from '../../core/canvas';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {Column, FadeRise, Stage, useStagger} from '../../primitives';

/**
 * Archetype: information card / explainer without a card.
 * Evidence: concept-breakdown — 2 keeps (brutalist, dark), 4 maybe, 1 reject.
 *
 * Choreography (measured): eyebrow and title enter together over frames 0-8,
 * then bullets at roughly frames 28, 39, 50 — an 11-frame step, slower than
 * the 8-frame default. Reading copy needs more air between beats than reading
 * a chart does.
 *
 * This is the most format-portable structure in the kept set: no card, no
 * fixed aspect, nothing that breaks when the frame turns vertical.
 */
export const BulletCardSchema = z.object({
  ...stageShape,
  eyebrow: z.string().optional(),
  title: z.string(),
  bullets: z.array(z.string()).min(1).max(5),
});

export type BulletCardProps = z.infer<typeof BulletCardSchema>;

export const bulletCardDuration = (p: BulletCardProps) =>
  durationFor(28 + (p.bullets.length - 1) * 11, p.rhythm, {settle: 10});

export const BulletCard: React.FC<BulletCardProps> = ({palette, skin, rhythm, ...rest}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Body {...rest} />
  </Stage>
);

const Body: React.FC<Omit<BulletCardProps, 'palette' | 'skin' | 'rhythm'>> = ({
  eyebrow,
  title,
  bullets,
}) => {
  const t = useTheme();
  const {u} = useCanvas();
  const delays = useStagger(bullets.length, {delay: 28, step: 11});

  return (
    <Column maxWidth={1180} gap={0}>
      {eyebrow ? (
        <FadeRise delay={0} distance={14}>
          <span style={textStyle(t, u, 'label', {color: t.palette.inkMuted})}>{eyebrow}</span>
        </FadeRise>
      ) : null}

      <FadeRise delay={2}>
        <h1 style={textStyle(t, u, 'title', {marginTop: 18 * u})}>{title}</h1>
      </FadeRise>

      <div style={{marginTop: 40 * u, display: 'flex', flexDirection: 'column', gap: 22 * u}}>
        {bullets.map((bullet, i) => (
          <FadeRise key={bullet} delay={delays[i]} distance={16}>
            <div style={{display: 'flex', alignItems: 'flex-start', gap: 18 * u}}>
              <span
                style={{
                  width: 12 * u,
                  height: 12 * u,
                  borderRadius: t.skin.radius === 0 ? 0 : '50%',
                  background: t.palette.inkMuted,
                  marginTop: 16 * u,
                  flexShrink: 0,
                }}
              />
              <span style={textStyle(t, u, 'body')}>{bullet}</span>
            </div>
          </FadeRise>
        ))}
      </div>
    </Column>
  );
};
