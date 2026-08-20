import React from 'react';
import {z} from 'zod';
import {useCanvas} from '../../core/canvas';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {Column, FadeRise, Placeholder, Stage, SpringIn, Surface} from '../../primitives';
import {BrowserFrame} from './BrowserFrame';

/**
 * Archetype: product UI showcase with a pointed claim.
 * Evidence: app-feature-callout — 1 keep (brutalist), 2 maybe, 4 reject. The
 * only kept variant is the hard-edged one, which fits: a callout pill needs a
 * definite edge to read as an annotation rather than as part of the UI.
 *
 * Choreography (measured): window at frames 2-11, inner content fills, then
 * the callout pill slides out from behind the window's right edge at frames
 * 17-24. It emerges from the UI rather than appearing over it — that is what
 * makes it point at something.
 */
export const UiCalloutSchema = z.object({
  ...stageShape,
  callout: z.string(),
  appTitle: z.string().optional(),
  screen: z.string().optional(),
});

export type UiCalloutProps = z.infer<typeof UiCalloutSchema>;

export const uiCalloutDuration = (p: UiCalloutProps) => durationFor(17 + 10, p.rhythm);

export const UiCallout: React.FC<UiCalloutProps> = ({palette, skin, rhythm, ...rest}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Body {...rest} />
  </Stage>
);

const Body: React.FC<Omit<UiCalloutProps, 'palette' | 'skin' | 'rhythm'>> = ({
  callout,
  appTitle,
  screen,
}) => {
  const t = useTheme();
  const {u, isLandscape} = useCanvas();

  return (
    <Column maxWidth={1240} align="center">
      <div style={{position: 'relative', width: isLandscape ? '76%' : '100%'}}>
        <SpringIn delay={2} from={0.92} config="surface">
          <BrowserFrame width="100%">
            {screen ? (
              <Placeholder src={screen} width="100%" height="100%" />
            ) : (
              <>
                {appTitle ? (
                  <span style={textStyle(t, u, 'dataTick', {fontWeight: 650, marginBottom: 16 * u})}>
                    {appTitle}
                  </span>
                ) : null}
                {[0.62, 0.44, 0.52].map((w, i) => (
                  <FadeRise key={i} delay={12 + i * 5} distance={8}>
                    <div
                      style={{
                        width: `${w * 100}%`,
                        height: 14 * u,
                        borderRadius: 7 * u,
                        background: t.palette.surfaceAlt,
                        marginBottom: 12 * u,
                      }}
                    />
                  </FadeRise>
                ))}
                <div
                  style={{
                    marginTop: 'auto',
                    height: 44 * u,
                    borderRadius: t.skin.radiusSmall * u,
                    background: t.palette.surfaceAlt,
                  }}
                />
              </>
            )}
          </BrowserFrame>
        </SpringIn>

        {/* Slides out from behind the right edge, so it reads as attached.
            In 9:16 there is no room to the side, so it drops out of the
            bottom edge instead — same idea, different escape route. */}
        <div
          style={{
            position: 'absolute',
            top: isLandscape ? '38%' : '96%',
            left: isLandscape ? '70%' : '50%',
            transform: isLandscape ? undefined : 'translateX(-50%)',
            zIndex: 2,
          }}
        >
          <FadeRise delay={17} from={isLandscape ? 'left' : 'top'} distance={64}>
            <Surface
              shape="pill"
              tone="accent"
              style={{
                padding: `${12 * u}px ${22 * u}px`,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={textStyle(t, u, 'caption', {fontWeight: 650})}>{callout}</span>
            </Surface>
          </FadeRise>
        </div>
      </div>
    </Column>
  );
};
