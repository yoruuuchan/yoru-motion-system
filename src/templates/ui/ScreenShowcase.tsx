import React from 'react';
import {z} from 'zod';
import {useCanvas} from '../../core/canvas';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {Column, FadeRise, Placeholder, Stage, SpringIn, useStagger} from '../../primitives';
import {BrowserFrame} from './BrowserFrame';

/**
 * Archetype: product UI showcase.
 * Evidence: screen-showcase — 2 keeps (default, minimal), 1 maybe, 4 reject.
 *
 * Choreography (measured): the window springs in over frames 2-10 with a soft
 * lift, its inner blocks fill at frames 17, 24, 33, and the numbered feature
 * list on the right staggers at frames 24, 33, 45. Window and list are
 * separate runs, not one long chain — the product appears first and the claims
 * are made about it afterwards.
 *
 * `screen` swaps the skeleton for a real screenshot or screen recording
 * without changing a single position: the media slot keeps the same box.
 */
export const ScreenShowcaseSchema = z.object({
  ...stageShape,
  appTitle: z.string().optional(),
  /** Image or video path in public/, or an absolute URL. */
  screen: z.string().optional(),
  features: z.array(z.string()).min(1).max(4),
});

export type ScreenShowcaseProps = z.infer<typeof ScreenShowcaseSchema>;

export const screenShowcaseDuration = (p: ScreenShowcaseProps) =>
  durationFor(24 + (p.features.length - 1) * 9, p.rhythm);

export const ScreenShowcase: React.FC<ScreenShowcaseProps> = ({
  palette,
  skin,
  rhythm,
  ...rest
}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Body {...rest} />
  </Stage>
);

const Body: React.FC<Omit<ScreenShowcaseProps, 'palette' | 'skin' | 'rhythm'>> = ({
  appTitle,
  screen,
  features,
}) => {
  const t = useTheme();
  const {u, isLandscape} = useCanvas();
  const blockDelays = useStagger(4, {delay: 17, step: 7});
  const featureDelays = useStagger(features.length, {delay: 24, step: 9});

  return (
    <Column maxWidth={1560}>
      <div
        style={{
          display: 'flex',
          flexDirection: isLandscape ? 'row' : 'column',
          alignItems: 'center',
          gap: isLandscape ? 60 * u : 40 * u,
        }}
      >
        <SpringIn delay={2} from={0.92} config="surface" style={{flex: isLandscape ? 1.6 : undefined, width: '100%'}}>
          <BrowserFrame width="100%">
            {screen ? (
              <Placeholder src={screen} width="100%" height="100%" />
            ) : (
              <>
                {appTitle ? (
                  <span style={textStyle(t, u, 'dataTick', {fontWeight: 650, marginBottom: 18 * u})}>
                    {appTitle}
                  </span>
                ) : null}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 14 * u,
                    flex: 1,
                  }}
                >
                  {blockDelays.map((delay, i) => (
                    <FadeRise key={i} delay={delay} distance={10}>
                      <div
                        style={{
                          height: '100%',
                          minHeight: 64 * u,
                          borderRadius: t.skin.radiusSmall * u,
                          background: t.palette.surfaceAlt,
                        }}
                      />
                    </FadeRise>
                  ))}
                </div>
              </>
            )}
          </BrowserFrame>
        </SpringIn>

        <div
          style={{
            flex: isLandscape ? 1 : undefined,
            display: 'flex',
            flexDirection: 'column',
            gap: 22 * u,
            width: '100%',
          }}
        >
          {features.map((feature, i) => (
            <FadeRise key={feature} delay={featureDelays[i]} distance={14}>
              <div style={{display: 'flex', alignItems: 'center', gap: 18 * u}}>
                <span
                  style={{
                    width: 44 * u,
                    height: 44 * u,
                    borderRadius: t.skin.radius === 0 ? 0 : '50%',
                    background: t.palette.surfaceAlt,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={textStyle(t, u, 'caption', {fontWeight: 650})}>{i + 1}</span>
                </span>
                <span style={textStyle(t, u, 'body')}>{feature}</span>
              </div>
            </FadeRise>
          ))}
        </div>
      </div>
    </Column>
  );
};
