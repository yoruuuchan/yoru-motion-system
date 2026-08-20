import React from 'react';
import {z} from 'zod';
import {useCanvas} from '../../core/canvas';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {Column, FadeRise, Placeholder, Stage, SpringIn, Surface} from '../../primitives';

/**
 * Archetype: product UI showcase — the object itself.
 * Evidence: product-reveal — 1 keep (rounded), 2 maybe, 4 reject.
 *
 * Choreography (measured): three beats and nothing else. The media card springs
 * in over frames 2-11, the name fades in at 17, the price row at 33. This is
 * the shortest kept template and it earns its place by not doing more.
 */
export const ProductRevealSchema = z.object({
  ...stageShape,
  image: z.string().optional(),
  name: z.string(),
  price: z.string().optional(),
  comparePrice: z.string().optional(),
});

export type ProductRevealProps = z.infer<typeof ProductRevealSchema>;

export const productRevealDuration = (p: ProductRevealProps) => durationFor(33 + 8, p.rhythm);

export const ProductReveal: React.FC<ProductRevealProps> = ({palette, skin, rhythm, ...rest}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Body {...rest} />
  </Stage>
);

const Body: React.FC<Omit<ProductRevealProps, 'palette' | 'skin' | 'rhythm'>> = ({
  image,
  name,
  price,
  comparePrice,
}) => {
  const t = useTheme();
  const {u, isLandscape, contentH} = useCanvas();
  const mediaH = isLandscape ? Math.min(contentH * 0.58, 520 * u) : 620 * u;

  return (
    <Column maxWidth={900} align="center" gap={30}>
      <SpringIn delay={2} from={0.9} config="surface">
        <Surface style={{padding: 0, overflow: 'hidden', width: mediaH * 1.4, maxWidth: '100%'}}>
          <Placeholder src={image} height={mediaH} radius={0} />
        </Surface>
      </SpringIn>

      <FadeRise delay={17}>
        <span style={textStyle(t, u, 'subtitle', {fontWeight: 650})}>{name}</span>
      </FadeRise>

      {price ? (
        <FadeRise delay={33} distance={12}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 14 * u}}>
            <span style={textStyle(t, u, 'subtitle', {fontWeight: 700})}>{price}</span>
            {comparePrice ? (
              <span
                style={textStyle(t, u, 'caption', {
                  color: t.palette.inkFaint,
                  textDecorationLine: 'line-through',
                })}
              >
                {comparePrice}
              </span>
            ) : null}
          </div>
        </FadeRise>
      ) : null}
    </Column>
  );
};
