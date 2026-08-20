import React from 'react';
import {useCanvas} from '../../core/canvas';
import {borderColor, surfaceShadow, useTheme} from '../../core/theme';

/**
 * The window chrome the UI-showcase archetype is built on: three dots, a
 * neutral address bar, then the app surface. Deliberately not a replica of any
 * one browser — a recognisable frame is the job, brand accuracy is not.
 */
export const BrowserFrame: React.FC<{
  width: number | string;
  aspect?: number;
  children?: React.ReactNode;
}> = ({width, aspect = 16 / 10, children}) => {
  const t = useTheme();
  const {u} = useCanvas();
  const barH = 46 * u;

  return (
    <div
      style={{
        width,
        aspectRatio: String(aspect),
        background: t.palette.surface,
        borderRadius: t.skin.radius * u,
        borderStyle: 'solid',
        borderWidth: t.skin.borderWidth * u,
        borderColor: borderColor(t),
        boxShadow: surfaceShadow(t, u),
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          height: barH,
          flexShrink: 0,
          background: t.palette.surfaceAlt,
          borderBottomStyle: 'solid',
          borderBottomWidth: t.skin.borderWidth * u,
          borderBottomColor: borderColor(t),
          display: 'flex',
          alignItems: 'center',
          gap: 8 * u,
          paddingLeft: 16 * u,
          paddingRight: 16 * u,
        }}
      >
        {['#FF5F57', '#FEBC2E', '#28C840'].map((dot) => (
          <span
            key={dot}
            style={{
              width: 11 * u,
              height: 11 * u,
              borderRadius: '50%',
              background: t.skin.id === 'brutalist' ? t.palette.inkFaint : dot,
              flexShrink: 0,
            }}
          />
        ))}
        <span
          style={{
            marginLeft: 12 * u,
            flex: 1,
            height: 16 * u,
            borderRadius: 8 * u,
            background: t.palette.line,
          }}
        />
      </div>
      <div style={{flex: 1, padding: 26 * u, display: 'flex', flexDirection: 'column'}}>
        {children}
      </div>
    </div>
  );
};
