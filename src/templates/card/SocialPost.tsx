import React from 'react';
import {z} from 'zod';
import {useCanvas} from '../../core/canvas';
import {durationFor, stageShape} from '../../core/schema';
import {useTheme} from '../../core/theme';
import {textStyle} from '../../core/typography';
import {Column, Counter, FadeRise, Placeholder, Stage, Surface, useStagger} from '../../primitives';

/**
 * Archetype: social post / content card.
 * Evidence: social-post — 1 keep (default), 2 maybe, 4 reject. Structure kept,
 * variants mostly rejected, so this ships close to the default treatment.
 *
 * Choreography (measured): card springs in over frames 2-11; the body copy
 * fades in as one block at frame 11 (not word by word — a quoted paragraph is
 * read, not performed); the engagement row lands at frame 33 with its counts
 * ramping rather than popping.
 */
export const SocialPostSchema = z.object({
  ...stageShape,
  author: z.string(),
  handle: z.string().optional(),
  avatar: z.string().optional(),
  body: z.string(),
  stats: z
    .array(z.object({icon: z.string(), value: z.number()}))
    .max(4)
    .default([]),
});

export type SocialPostProps = z.infer<typeof SocialPostSchema>;

export const socialPostDuration = (p: SocialPostProps) => durationFor(33 + 18, p.rhythm);

export const SocialPost: React.FC<SocialPostProps> = ({palette, skin, rhythm, ...rest}) => (
  <Stage palette={palette} skin={skin} rhythm={rhythm}>
    <Card {...rest} />
  </Stage>
);

const Card: React.FC<Omit<SocialPostProps, 'palette' | 'skin' | 'rhythm'>> = ({
  author,
  handle,
  avatar,
  body,
  stats,
}) => {
  const t = useTheme();
  const {u} = useCanvas();
  const statDelays = useStagger(stats.length, {delay: 33, step: 4});

  return (
    <Column maxWidth={900}>
      <FadeRise delay={2} distance={18}>
        <Surface style={{padding: 44 * u, width: '100%'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18 * u}}>
            <Placeholder
              src={avatar}
              width={64 * u}
              height={64 * u}
              radius={9999}
              hint={author.slice(0, 1)}
            />
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <span style={textStyle(t, u, 'body', {fontWeight: 650})}>{author}</span>
              {handle ? (
                <span style={textStyle(t, u, 'caption', {color: t.palette.inkMuted})}>{handle}</span>
              ) : null}
            </div>
          </div>

          <FadeRise delay={11} distance={10}>
            <p style={textStyle(t, u, 'body', {marginTop: 28 * u})}>{body}</p>
          </FadeRise>

          {stats.length ? (
            <div
              style={{
                marginTop: 30 * u,
                paddingTop: 24 * u,
                borderTopStyle: 'solid',
                borderTopWidth: 1 * u,
                borderTopColor: t.palette.line,
                display: 'flex',
                gap: 34 * u,
              }}
            >
              {stats.map((stat, i) => (
                <FadeRise key={stat.icon} delay={statDelays[i]} distance={8}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10 * u}}>
                    <span style={{fontSize: 26 * u, lineHeight: 1}}>{stat.icon}</span>
                    <span style={textStyle(t, u, 'caption', {color: t.palette.inkMuted})}>
                      <Counter
                        to={stat.value}
                        delay={statDelays[i]}
                        duration={20}
                        format={(n) => Math.round(n).toLocaleString('en-US')}
                      />
                    </span>
                  </div>
                </FadeRise>
              ))}
            </div>
          ) : null}
        </Surface>
      </FadeRise>
    </Column>
  );
};
