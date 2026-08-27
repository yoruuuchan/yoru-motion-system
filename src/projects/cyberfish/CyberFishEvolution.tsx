import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, useCurrentFrame} from 'remotion';
import SWARM from './asset-swarm';
import TRIO from './asset-trio';
import HERO from './asset-hero';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const FullImage: React.FC<{
  src: string;
  opacity?: number;
  scale?: number;
  x?: number;
  y?: number;
  origin?: string;
  filter?: string;
}> = ({src, opacity = 1, scale = 1, x = 0, y = 0, origin = '50% 50%', filter}) => (
  <AbsoluteFill style={{overflow: 'hidden', opacity}}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformOrigin: origin,
        scale,
        translate: `${x}px ${y}px`,
        filter,
      }}
    >
      <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </div>
  </AbsoluteFill>
);

const SwarmBands: React.FC<{frame: number; opacity: number}> = ({frame, opacity}) => {
  const bands = 6;
  return (
    <AbsoluteFill style={{opacity}}>
      {Array.from({length: bands}).map((_, i) => {
        // ASSUMPTION: restrained row offsets create a living-field effect without faking new imagery.
        const bandHeight = 100 / bands;
        const phase = frame / 38 + i * 0.73;
        const drift = Math.sin(phase) * (5 + i * 1.15) * (i % 2 === 0 ? 1 : -1);
        const lift = Math.sin(phase * 0.67) * 2.5;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top: `${i * bandHeight}%`,
              width: '100%',
              height: `${bandHeight + 0.4}%`,
              overflow: 'hidden',
              translate: `${drift}px ${lift}px`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '-1%',
                top: `${-i * 100}%`,
                width: '102%',
                height: `${bands * 100}%`,
                filter: i % 2 === 0 ? 'brightness(1.02)' : 'brightness(0.94)',
              }}
            >
              <Img src={SWARM} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const TrioPanels: React.FC<{frame: number; opacity: number}> = ({frame, opacity}) => {
  const columns = 3;
  return (
    <AbsoluteFill style={{opacity, backgroundColor: '#020407'}}>
      {Array.from({length: columns}).map((_, i) => {
        // ASSUMPTION: 7-frame panel stagger, used only to bridge the swarm into the three selected identities.
        const start = 274 + i * 7;
        const p = interpolate(frame, [start, start + 30], [0, 1], {...clamp, easing: ease});
        const width = 100 / columns;
        const direction = i === 1 ? 0 : i === 0 ? -1 : 1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${i * width}%`,
              top: 0,
              width: `${width + 0.15}%`,
              height: '100%',
              overflow: 'hidden',
              opacity: p,
              translate: `${direction * (1 - p) * 36}px ${(1 - p) * (i === 1 ? 18 : 32)}px`,
              scale: 0.985 + p * 0.015,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: `${-i * 100}%`,
                top: 0,
                width: `${columns * 100}%`,
                height: '100%',
              }}
            >
              <Img src={TRIO} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const CyberFishEvolution: React.FC = () => {
  const frame = useCurrentFrame();

  // ASSUMPTION: 28s / 840f. One B-roll shot only.
  // Energy curve: swarm field (build) → three identities (selection) → single hero (rest).
  // All timing below is a production proposal and has not yet been approved as gold.

  // 0–10s: the generated population behaves as a single visual field.
  const swarmScale = interpolate(frame, [0, 265], [1.04, 1.13], {...clamp, easing: Easing.inOut(Easing.quad)});
  const swarmX = interpolate(frame, [0, 265], [-10, 22], clamp);
  const swarmY = interpolate(frame, [0, 265], [6, -12], clamp);
  const bandsOpacity = interpolate(frame, [18, 52, 218, 262], [0, 1, 1, 0], clamp);

  // 7–11s: darken the periphery and visually choose a subset from the population.
  const focusP = interpolate(frame, [205, 300], [0, 1], {...clamp, easing: ease});
  const vignetteOpacity = interpolate(frame, [205, 292], [0, 0.72], clamp);
  const swarmExit = interpolate(frame, [262, 322], [1, 0], clamp);

  // 9–17s: the supplied three-fish image becomes a triptych, then the center identity takes over.
  const trioOpacity = interpolate(frame, [268, 305, 485, 520], [0, 1, 1, 0], clamp);
  const sideFade = interpolate(frame, [390, 468], [1, 0.18], {...clamp, easing: ease});
  const centerScale = interpolate(frame, [390, 525], [1, 1.62], {...clamp, easing: Easing.inOut(Easing.cubic)});

  // 15–22s: dive into the center fish and match it into the clean hero frame.
  const trioDive = interpolate(frame, [445, 585], [1.0, 2.45], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const heroOpacity = interpolate(frame, [535, 610, 839], [0, 1, 1], clamp);
  const heroScale = interpolate(frame, [535, 665, 839], [1.18, 1.035, 1.0], {...clamp, easing: ease});
  const heroX = interpolate(frame, [535, 665], [-96, 0], {...clamp, easing: ease});
  const heroGlow = interpolate(frame, [610, 700, 839], [0.07, 0.17, 0.1], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: '#020407'}}>
      <div style={{position: 'absolute', inset: 0, opacity: swarmExit}}>
        <FullImage src={SWARM} scale={swarmScale} x={swarmX} y={swarmY} filter="brightness(0.95) saturate(1.04)" />
        <SwarmBands frame={frame} opacity={bandsOpacity} />
        <AbsoluteFill
          style={{
            opacity: vignetteOpacity,
            background: `radial-gradient(circle at 50% 49%, transparent ${13 + focusP * 5}%, rgba(2,4,7,0.15) 28%, rgba(2,4,7,0.92) 78%)`,
          }}
        />
      </div>

      <TrioPanels frame={frame} opacity={trioOpacity} />

      {/* Center-image reinforcement: side fish recede while the middle fish becomes the visual anchor. */}
      <div style={{position: 'absolute', inset: 0, opacity: interpolate(frame, [360, 405, 525], [0, 1, 1], clamp)}}>
        <FullImage src={TRIO} scale={centerScale * trioDive} origin="50% 50%" />
        <AbsoluteFill
          style={{
            background: `linear-gradient(90deg, rgba(2,4,7,${1 - sideFade}) 0%, transparent 32%, transparent 68%, rgba(2,4,7,${1 - sideFade}) 100%)`,
          }}
        />
      </div>

      <AbsoluteFill style={{backgroundColor: '#020407', opacity: interpolate(frame, [515, 570], [0, 0.55], clamp)}} />

      <div style={{position: 'absolute', inset: 0, opacity: heroOpacity}}>
        <FullImage src={HERO} scale={heroScale} x={heroX} origin="34% 52%" />
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 29% 50%, rgba(44,174,255,${heroGlow}) 0%, rgba(16,73,116,${heroGlow * 0.22}) 27%, transparent 51%)`,
            mixBlendMode: 'screen',
          }}
        />
      </div>

      {/* ASSUMPTION: neutral start/end fades only. No frame furniture, no logo, no added caption layer. */}
      <AbsoluteFill style={{backgroundColor: '#020407', opacity: interpolate(frame, [0, 14, 815, 839], [1, 0, 0, 1], clamp)}} />
    </AbsoluteFill>
  );
};
