import React, {type CSSProperties} from 'react';
import {AbsoluteFill} from 'remotion';
import {useCanvas} from '../core/canvas';
import {RhythmProvider} from '../core/rhythm';
import {ThemeProvider, type SkinId} from '../core/theme';
import type {Rhythm} from '../core/timing';
import {resolveTheme} from '../themes';
import type {PaletteId} from '../themes/palettes';

/**
 * The root of every template. Owns the background, the base type, the safe
 * area, the theme and the rhythm. Templates render into the safe box and never
 * position against the raw frame edge.
 */
export const Stage: React.FC<{
  palette: PaletteId;
  skin: SkinId;
  rhythm?: Rhythm;
  /** 'center' vertically centers the content box (the reference default). */
  align?: 'center' | 'start';
  children: React.ReactNode;
}> = ({palette, skin, rhythm = 'medium', align = 'center', children}) => {
  const theme = resolveTheme(palette, skin);
  const {safeX, safeY} = useCanvas();

  return (
    <ThemeProvider theme={theme}>
      <RhythmProvider rhythm={rhythm}>
        <AbsoluteFill
          style={{
            backgroundColor: theme.palette.bg,
            color: theme.palette.ink,
            fontFamily: theme.skin.monoBody ? theme.font.mono : theme.font.sans,
            fontKerning: 'normal',
            textRendering: 'geometricPrecision',
          }}
        >
          <AbsoluteFill
            style={{
              paddingLeft: safeX,
              paddingRight: safeX,
              paddingTop: safeY,
              paddingBottom: safeY,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: align === 'center' ? 'center' : 'flex-start',
            }}
          >
            {children}
          </AbsoluteFill>
        </AbsoluteFill>
      </RhythmProvider>
    </ThemeProvider>
  );
};

/**
 * The content column inside the stage. Capping the measure matters more in
 * 16:9 than in 9:16 — a 1920px-wide line of text is unreadable, while in
 * portrait the safe area already caps it.
 */
export const Column: React.FC<{
  /** Design-px cap. Ignored in portrait and square, where width is the limit. */
  maxWidth?: number;
  gap?: number;
  align?: 'start' | 'center';
  style?: CSSProperties;
  children: React.ReactNode;
}> = ({maxWidth = 1240, gap = 0, align = 'start', style, children}) => {
  const {u, isLandscape} = useCanvas();
  return (
    <div
      style={{
        width: '100%',
        maxWidth: isLandscape ? maxWidth * u : undefined,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'stretch',
        textAlign: align === 'center' ? 'center' : 'left',
        gap: gap * u,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
