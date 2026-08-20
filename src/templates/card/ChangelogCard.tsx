import React from 'react';
import {z} from 'zod';
import {useCanvas} from '../../core/canvas';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {Column, FadeRise, Stage, Surface, useStagger} from '../../primitives';

/**
 * Archetype: information card / list reveal.
 * Evidence: changelog — 4 keeps (brutalist, dark, glass, neo), 3 maybe,
 * 0 reject. The only family besides appointment-booking with zero rejections.
 *
 * Choreography (measured): card and title land together over frames 0-6, and
 * the divider rules are already drawn while the rows are still empty — the
 * skeleton exists before the content. Rows then fill in at frames 17, 24, 33,
 * 45 (the standard 8-frame step). Nothing reflows: the card is its final size
 * from the first frame it is visible.
 */
export const ChangelogCardSchema = z.object({
  ...stageShape,
  badge: z.string().optional(),
  title: z.string(),
  items: z.array(z.string()).min(1).max(6),
});

export type ChangelogCardProps = z.infer<typeof ChangelogCardSchema>;

export const changelogCardDuration = (p: ChangelogCardProps) =>
  durationFor(17 + (p.items.length - 1) * 8, p.rhythm);

export const ChangelogCard: React.FC<ChangelogCardProps> = ({palette, skin, rhythm, ...rest}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Card {...rest} />
  </Stage>
);

const Card: React.FC<Omit<ChangelogCardProps, 'palette' | 'skin' | 'rhythm'>> = ({
  badge,
  title,
  items,
}) => {
  const t = useTheme();
  const {u} = useCanvas();
  const delays = useStagger(items.length, {delay: 17, step: 8});

  return (
    <Column maxWidth={880}>
      <FadeRise delay={0} distance={18}>
        <Surface style={{padding: 48 * u, width: '100%'}}>
          {badge ? (
            <Surface
              shape="pill"
              tone="inset"
              style={{
                alignSelf: 'flex-start',
                display: 'inline-block',
                padding: `${8 * u}px ${18 * u}px`,
                marginBottom: 20 * u,
              }}
            >
              <span style={textStyle(t, u, 'label', {fontSize: 22 * u, color: t.palette.inkMuted})}>
                {badge}
              </span>
            </Surface>
          ) : null}

          <h1 style={textStyle(t, u, 'title')}>{title}</h1>

          <div style={{marginTop: 30 * u, display: 'flex', flexDirection: 'column'}}>
            {items.map((item, i) => (
              // The rule is on the row itself, so it is drawn from frame 0 —
              // the skeleton the reference material shows before content fills.
              <div
                key={item}
                style={{
                  paddingTop: 18 * u,
                  paddingBottom: 18 * u,
                  borderBottomStyle: 'solid',
                  borderBottomWidth: i === items.length - 1 ? 0 : 1 * u,
                  borderBottomColor: t.palette.line,
                }}
              >
                <FadeRise delay={delays[i]} distance={12}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 16 * u}}>
                    <span
                      style={{
                        width: 32 * u,
                        height: 32 * u,
                        borderRadius: '50%',
                        background: t.palette.ink,
                        color: t.palette.mode === 'dark' ? '#000' : '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18 * u,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    <span style={textStyle(t, u, 'body')}>{item}</span>
                  </div>
                </FadeRise>
              </div>
            ))}
          </div>
        </Surface>
      </FadeRise>
    </Column>
  );
};
