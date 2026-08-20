import React, {type CSSProperties} from 'react';
import {Img, OffthreadVideo, staticFile} from 'remotion';
import {useCanvas} from '../core/canvas';
import {borderColor, useTheme} from '../core/theme';

const isVideo = (src: string) => /\.(mp4|mov|webm|mkv)(\?|$)/i.test(src);
const resolve = (src: string) => (/^(https?:|data:|blob:)/.test(src) ? src : staticFile(src));

/**
 * Every media slot in the system goes through here.
 *
 * With no `src` it renders the themed skeleton block the reference material
 * uses throughout (screen-showcase, product-reveal, changelog): a soft inset
 * rectangle, no icon, no "image missing" chrome. That means a template is
 * presentable before any asset exists — which is how you storyboard.
 *
 * The slot always keeps its own box, so swapping a skeleton for a real photo
 * never moves anything else on screen.
 */
export const Placeholder: React.FC<{
  src?: string;
  /** Filled by the caller's flex/grid box unless width/height are given. */
  width?: number | string;
  height?: number | string;
  radius?: number;
  fit?: 'cover' | 'contain';
  /** Optional label shown inside the skeleton, e.g. "16:9 product shot". */
  hint?: string;
  style?: CSSProperties;
}> = ({src, width = '100%', height = '100%', radius, fit = 'cover', hint, style}) => {
  const t = useTheme();
  const {u} = useCanvas();
  const r = radius ?? t.skin.radiusSmall * u;

  const box: CSSProperties = {
    width,
    height,
    borderRadius: r,
    overflow: 'hidden',
    flexShrink: 0,
    ...style,
  };

  if (src) {
    const url = resolve(src);
    return (
      <div style={box}>
        {isVideo(src) ? (
          <OffthreadVideo src={url} style={{width: '100%', height: '100%', objectFit: fit}} />
        ) : (
          <Img src={url} style={{width: '100%', height: '100%', objectFit: fit}} />
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        ...box,
        background: t.palette.surfaceAlt,
        borderStyle: 'solid',
        borderWidth: t.skin.borderTone === 'strong' ? t.skin.borderWidth * u : 0,
        borderColor: borderColor(t),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: t.palette.inkFaint,
        fontSize: 22 * u,
        letterSpacing: '0.08em',
        textTransform: t.skin.upperLabels ? 'uppercase' : 'none',
        boxSizing: 'border-box',
      }}
    >
      {hint ?? null}
    </div>
  );
};
