import React, {createContext, useContext} from 'react';
import {MONO, SANS} from './fonts';

/**
 * A palette is what changes between "neutral" and "yoru".
 * A skin is what changed between Locomotion's 7 style variants — and the
 * curation proved skin is *only* surface treatment: layout and timing were
 * identical across all 7. So the two are separate axes here.
 */
export type Palette = {
  id: string;
  mode: 'light' | 'dark';
  bg: string;
  surface: string;
  surfaceAlt: string;
  ink: string;
  inkMuted: string;
  inkFaint: string;
  line: string;
  lineStrong: string;
  accent: string;
  accentInk: string;
  accentSoft: string;
  positive: string;
  negative: string;
  /** 4-step lightness ramp for data marks, low to high emphasis. */
  ramp: [string, string, string, string];
};

export type SkinId = 'hairline' | 'brutalist' | 'glass' | 'flat';

export type Skin = {
  id: SkinId;
  /** Design-px, multiplied by the canvas unit. */
  radius: number;
  radiusSmall: number;
  borderWidth: number;
  /** 'line' = hairline color, 'strong' = full-contrast ink, 'none' = borderless. */
  borderTone: 'line' | 'strong' | 'none';
  /** CSS box-shadow, or null for none. */
  shadow: string | null;
  /** Hard offset shadow in design-px (brutalist), or 0. */
  offsetShadow: number;
  /** Labels in this skin are uppercase and tracked out. */
  upperLabels: boolean;
  /** This skin sets body copy in mono. */
  monoBody: boolean;
};

export type Theme = {
  palette: Palette;
  skin: Skin;
  font: {sans: string; mono: string};
};

const ThemeContext = createContext<Theme | null>(null);

export const ThemeProvider: React.FC<{theme: Theme; children: React.ReactNode}> = ({
  theme,
  children,
}) => React.createElement(ThemeContext.Provider, {value: theme}, children);

export const useTheme = (): Theme => {
  const t = useContext(ThemeContext);
  if (!t) {
    throw new Error('useTheme() called outside a ThemeProvider. Wrap the template in <Stage>.');
  }
  return t;
};

/** Border color for the current skin. */
export const borderColor = (t: Theme) =>
  t.skin.borderTone === 'none'
    ? 'transparent'
    : t.skin.borderTone === 'strong'
      ? t.palette.lineStrong
      : t.palette.line;

/** Full box-shadow string for a surface, including the brutalist hard offset. */
export const surfaceShadow = (t: Theme, u: number) => {
  const parts: string[] = [];
  if (t.skin.offsetShadow) {
    parts.push(
      `${t.skin.offsetShadow * u}px ${t.skin.offsetShadow * u}px 0 0 ${t.palette.lineStrong}`,
    );
  }
  if (t.skin.shadow) parts.push(t.skin.shadow);
  return parts.length ? parts.join(', ') : 'none';
};

/** The font body copy is set in for this theme. */
export const bodyFont = (t: Theme) => (t.skin.monoBody ? t.font.mono : t.font.sans);

export const makeTheme = (palette: Palette, skin: Skin): Theme => ({
  palette,
  skin,
  font: {sans: SANS, mono: MONO},
});
