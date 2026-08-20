import React, {type CSSProperties} from 'react';
import {useCanvas} from '../core/canvas';
import {borderColor, surfaceShadow, useTheme} from '../core/theme';

/**
 * A themed card. The only thing that differs between Locomotion's 7 style
 * variants was this component's border, radius and shadow — so this is where a
 * skin actually lands.
 */
export const Surface: React.FC<{
  /** 'card' uses the full radius, 'chip' the small one, 'pill' a full round. */
  shape?: 'card' | 'chip' | 'pill';
  /** 'raised' gets the skin shadow, 'inset' is a flat well inside a card. */
  tone?: 'raised' | 'inset' | 'accent';
  /** Draw the border at full contrast even on hairline skins (selected state). */
  emphasized?: boolean;
  style?: CSSProperties;
  children?: React.ReactNode;
}> = ({shape = 'card', tone = 'raised', emphasized = false, style, children}) => {
  const t = useTheme();
  const {u} = useCanvas();

  const radius =
    shape === 'pill' ? 9999 : shape === 'chip' ? t.skin.radiusSmall * u : t.skin.radius * u;

  const background =
    tone === 'accent' ? t.palette.accent : tone === 'inset' ? t.palette.surfaceAlt : t.palette.surface;

  // An emphasized surface always shows a visible edge, even on borderless
  // skins — that is how the reference material marks a selected row.
  const bw = emphasized ? Math.max(t.skin.borderWidth, 2) : t.skin.borderWidth;

  return (
    <div
      style={{
        background,
        borderRadius: radius,
        borderStyle: 'solid',
        borderWidth: bw * u,
        borderColor: emphasized ? t.palette.accent : borderColor(t),
        boxShadow: tone === 'inset' ? 'none' : surfaceShadow(t, u),
        color: tone === 'accent' ? t.palette.accentInk : t.palette.ink,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
