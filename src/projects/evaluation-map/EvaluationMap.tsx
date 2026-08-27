import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';

const W = 1920;
const H = 1080;
const WORLD_W = 7600;

const C = {
  bg: '#06080d',
  panel: '#0d1320',
  panelActive: '#08131D',
  paper: '#F2F5F5',
  ink: '#E3EAF3',
  muted: '#95A3B4',
  faint: '#4D5A6E',
  line: '#233047',
  cyan: '#00B8FF',
  cyan2: '#5FD9FF',
};

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const enter = (frame: number, start: number, duration = 18) =>
  interpolate(frame, [start, start + duration], [0, 1], {...clamp, easing: ease});

const leave = (frame: number, start: number, duration = 18) =>
  interpolate(frame, [start, start + duration], [1, 0], {...clamp, easing: Easing.inOut(Easing.quad)});

const pct = (frame: number, start: number, endValue: number) =>
  Math.round(interpolate(frame, [start, start + 18], [0, endValue], {...clamp, easing: ease}));

type NodeProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  zh: string;
  en?: string;
  frame: number;
  start: number;
  end?: number;
  active?: boolean;
  large?: boolean;
  accentText?: string;
  muted?: boolean;
};

const Node: React.FC<NodeProps> = ({
  x,
  y,
  w,
  h,
  zh,
  en,
  frame,
  start,
  end,
  active = false,
  large = false,
  accentText,
  muted = false,
}) => {
  const aIn = enter(frame, start);
  const aOut = end === undefined ? 1 : leave(frame, end);
  const a = aIn * aOut;
  const lift = interpolate(frame, [start, start + 18], [24, 0], {...clamp, easing: ease});
  const border = active ? C.cyan : C.line;
  const fill = active ? C.panelActive : C.panel;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: a,
        translate: `0 ${lift}px`,
        background: fill,
        border: `2px solid ${border}`,
        clipPath: 'polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)',
        boxSizing: 'border-box',
        padding: large ? '42px 48px' : '32px 38px',
        overflow: 'hidden',
      }}
    >
      {active ? (
        <div style={{position: 'absolute', left: 38, top: 28, width: 62, height: 4, background: C.cyan}} />
      ) : null}
      <div
        style={{
          color: muted ? C.muted : C.paper,
          fontFamily: '"Noto Serif CJK SC", "Noto Serif CJK JP", serif',
          fontWeight: 800,
          fontSize: large ? 62 : 44,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginTop: active ? 22 : 0,
          whiteSpace: 'nowrap',
        }}
      >
        {zh}
      </div>
      {accentText ? (
        <div
          style={{
            position: 'absolute',
            right: 34,
            bottom: 28,
            color: active ? C.cyan2 : C.paper,
            fontFamily: '"JetBrains Mono", "Noto Sans Mono", monospace',
            fontWeight: 750,
            fontSize: large ? 52 : 42,
            letterSpacing: '-0.04em',
          }}
        >
          {accentText}
        </div>
      ) : null}
      {en ? (
        <div
          style={{
            position: 'absolute',
            left: large ? 48 : 38,
            bottom: large ? 34 : 26,
            color: active ? C.cyan2 : C.muted,
            fontFamily: '"JetBrains Mono", "Noto Sans Mono", monospace',
            fontWeight: 650,
            fontSize: large ? 18 : 15,
            letterSpacing: '0.08em',
          }}
        >
          {en}
        </div>
      ) : null}
    </div>
  );
};

type ChipProps = {
  x: number;
  y: number;
  label: string;
  frame: number;
  start: number;
  active?: boolean;
};

const Chip: React.FC<ChipProps> = ({x, y, label, frame, start, active = false}) => {
  const a = enter(frame, start, 14);
  const slide = interpolate(frame, [start, start + 14], [18, 0], {...clamp, easing: ease});
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        padding: '16px 24px 17px',
        minWidth: 170,
        opacity: a,
        translate: `${slide}px 0`,
        border: `1.5px solid ${active ? C.cyan : C.line}`,
        background: active ? '#08131D' : '#0A0F18',
        color: active ? C.paper : C.ink,
        fontFamily: '"Noto Serif CJK SC", "Noto Serif CJK JP", serif',
        fontWeight: 700,
        fontSize: 28,
        lineHeight: 1,
        textAlign: 'center',
        clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
      }}
    >
      {label}
    </div>
  );
};

type PathLineProps = {
  d: string;
  frame: number;
  start: number;
  duration?: number;
  active?: boolean;
  opacity?: number;
  width?: number;
};

const PathLine: React.FC<PathLineProps> = ({
  d,
  frame,
  start,
  duration = 28,
  active = false,
  opacity = 1,
  width = 2,
}) => {
  const progress = enter(frame, start, duration);
  return (
    <path
      d={d}
      fill="none"
      stroke={active ? C.cyan : C.line}
      strokeWidth={width}
      opacity={opacity}
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
      vectorEffect="non-scaling-stroke"
    />
  );
};

const Label: React.FC<{
  x: number;
  y: number;
  zh: string;
  en: string;
  frame: number;
  start: number;
  accent?: boolean;
  size?: number;
}> = ({x, y, zh, en, frame, start, accent = false, size = 32}) => {
  const a = enter(frame, start);
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: a}}>
      <div
        style={{
          color: accent ? C.cyan2 : C.paper,
          fontFamily: '"Noto Serif CJK SC", "Noto Serif CJK JP", serif',
          fontWeight: 800,
          fontSize: size,
          letterSpacing: '-0.025em',
        }}
      >
        {zh}
      </div>
      <div
        style={{
          color: accent ? C.cyan : C.muted,
          fontFamily: '"JetBrains Mono", "Noto Sans Mono", monospace',
          fontWeight: 650,
          fontSize: 14,
          letterSpacing: '0.09em',
          marginTop: 8,
        }}
      >
        {en}
      </div>
    </div>
  );
};

const ScoreNode: React.FC<{
  x: number;
  y: number;
  zh: string;
  en: string;
  value: number;
  frame: number;
  start: number;
  active?: boolean;
}> = ({x, y, zh, en, value, frame, start, active = false}) => {
  const a = enter(frame, start);
  const displayed = pct(frame, start + 2, value);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 500,
        height: 245,
        opacity: a,
        background: active ? C.panelActive : C.panel,
        border: `2px solid ${active ? C.cyan : C.line}`,
        clipPath: 'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)',
        boxSizing: 'border-box',
        padding: '30px 34px',
      }}
    >
      <div
        style={{
          color: C.paper,
          fontFamily: '"Noto Serif CJK SC", "Noto Serif CJK JP", serif',
          fontWeight: 800,
          fontSize: 42,
        }}
      >
        {zh}
      </div>
      <div
        style={{
          color: active ? C.cyan2 : C.paper,
          fontFamily: '"JetBrains Mono", "Noto Sans Mono", monospace',
          fontWeight: 800,
          fontSize: 82,
          letterSpacing: '-0.06em',
          lineHeight: 1,
          position: 'absolute',
          right: 34,
          top: 28,
        }}
      >
        {displayed}%
      </div>
      <div
        style={{
          position: 'absolute',
          left: 34,
          right: 34,
          bottom: 50,
          height: 5,
          background: C.line,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${interpolate(frame, [start + 2, start + 20], [0, value], {...clamp, easing: ease})}%`,
            height: '100%',
            background: active ? C.cyan : C.faint,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 34,
          bottom: 22,
          color: active ? C.cyan2 : C.muted,
          fontFamily: '"JetBrains Mono", "Noto Sans Mono", monospace',
          fontWeight: 650,
          fontSize: 14,
          letterSpacing: '0.08em',
        }}
      >
        {en}
      </div>
    </div>
  );
};

const cameraX = (frame: number) => {
  if (frame < 110) return 0;
  if (frame < 180) return interpolate(frame, [110, 180], [0, -1500], {...clamp, easing: Easing.inOut(Easing.cubic)});
  if (frame < 330) return -1500;
  if (frame < 410) return interpolate(frame, [330, 410], [-1500, -3400], {...clamp, easing: Easing.inOut(Easing.cubic)});
  if (frame < 480) return -3400;
  if (frame < 560) return interpolate(frame, [480, 560], [-3400, -5100], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return -5100;
};

export const EvaluationMap: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = cameraX(frame);

  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: WORLD_W,
          height: H,
          translate: `${cam}px 0`,
        }}
      >
        <svg
          width={WORLD_W}
          height={H}
          viewBox={`0 0 ${WORLD_W} ${H}`}
          style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}
        >
          {/* 综合元素 -> 综合评审 */}
          <PathLine d="M 405 258 L 640 258 L 640 430 L 920 430" frame={frame} start={28} />
          <PathLine d="M 405 408 L 700 408 L 700 470 L 920 470" frame={frame} start={36} />
          <PathLine d="M 405 558 L 730 558 L 730 510 L 920 510" frame={frame} start={44} />
          <PathLine d="M 1560 258 L 1470 258 L 1470 430 L 1480 430" frame={frame} start={52} />
          <PathLine d="M 1560 408 L 1430 408 L 1430 470 L 1480 470" frame={frame} start={60} />
          <PathLine d="M 1560 558 L 1390 558 L 1390 510 L 1480 510" frame={frame} start={68} />

          {/* 公共标准 */}
          <PathLine d="M 2490 500 L 2490 625 L 1900 625 L 1900 690" frame={frame} start={146} active />
          <PathLine d="M 2490 500 L 2490 690" frame={frame} start={152} active />
          <PathLine d="M 2490 625 L 3080 625 L 3080 690" frame={frame} start={158} active />

          {/* 过去：技术最容易拉开差距 */}
          <PathLine d="M 4240 365 L 4240 500" frame={frame} start={372} active width={2.5} />
          <PathLine d="M 4240 615 L 4240 748" frame={frame} start={398} active width={3} />
          <PathLine d="M 4240 615 L 3790 615 L 3790 695" frame={frame} start={390} opacity={0.75} />
          <PathLine d="M 4240 615 L 4690 615 L 4690 695" frame={frame} start={394} opacity={0.75} />

          {/* 现在：总分差距 -> 两个重心 */}
          <PathLine d="M 5780 470 L 6010 470" frame={frame} start={525} active />
          <PathLine d="M 6520 590 L 6520 665 L 5860 665 L 5860 730" frame={frame} start={568} active width={2.5} />
          <PathLine d="M 6520 665 L 6760 665 L 6760 730" frame={frame} start={580} active width={2.5} />
        </svg>

        {/* Stage A: 画面、视觉、美术风格、剧本、镜头、剪辑综合来看 */}
        <Label x={185} y={120} zh="一部片子，要综合地看" en="LOOK AT THE WHOLE FILM" frame={frame} start={8} size={42} />
        <Chip x={185} y={225} label="画面" frame={frame} start={16} />
        <Chip x={185} y={375} label="视觉" frame={frame} start={24} />
        <Chip x={185} y={525} label="美术风格" frame={frame} start={32} />
        <Chip x={1560} y={225} label="剧本" frame={frame} start={40} />
        <Chip x={1560} y={375} label="镜头" frame={frame} start={48} />
        <Chip x={1560} y={525} label="剪辑" frame={frame} start={56} />
        <Node x={920} y={345} w={560} h={250} zh="综合评审" en="COMPREHENSIVE REVIEW" frame={frame} start={62} active large />

        {/* Stage B: 公共标准和 30/30/40 */}
        <Label x={1700} y={140} zh="评审的一个公共标准" en="A COMMON EVALUATION STANDARD" frame={frame} start={124} size={40} />
        <Node x={2200} y={270} w={580} h={230} zh="公共标准" en="EVALUATION STANDARD" frame={frame} start={132} active large />
        <ScoreNode x={1650} y={690} zh="技术" en="TECHNOLOGY" value={30} frame={frame} start={162} />
        <ScoreNode x={2240} y={690} zh="美学" en="AESTHETICS" value={30} frame={frame} start={174} active />
        <ScoreNode x={2830} y={690} zh="叙事" en="STORY / WRITING" value={40} frame={frame} start={186} active />

        {/* Stage C: 以前技术环节更容易拉开差距 */}
        <Label x={3640} y={138} zh="以前" en="PREVIOUSLY" frame={frame} start={346} accent size={44} />
        <Node x={3930} y={245} w={620} h={270} zh="技术环节" en="TECHNICAL EXECUTION" frame={frame} start={360} active large accentText="30%" />
        <Node x={3540} y={695} w={500} h={190} zh="美学" en="AESTHETICS" frame={frame} start={382} muted accentText="30%" />
        <Node x={4440} y={695} w={500} h={190} zh="叙事" en="STORY / WRITING" frame={frame} start={388} muted accentText="40%" />
        <Label x={4010} y={795} zh="更容易拉开差距" en="EASIER TO CREATE SEPARATION" frame={frame} start={410} accent size={38} />

        {/* Stage D: 现在总分高低更多集中于创意审美与电影功底 */}
        <Label x={5380} y={135} zh="对于创作者来说" en="FOR THE CREATOR" frame={frame} start={500} size={40} />
        <Node x={5480} y={345} w={600} h={250} zh="一部片子的总分" en="OVERALL RESULT" frame={frame} start={514} />
        <Node x={6160} y={330} w={720} h={270} zh="差距的重心" en="WHERE DIFFERENCE NOW SHOWS" frame={frame} start={538} active large />
        <Node x={5480} y={730} w={760} h={230} zh="创意审美" en="CREATIVE AESTHETICS" frame={frame} start={584} active large />
        <Node x={6400} y={730} w={760} h={230} zh="电影功底" en="CINEMATIC CRAFT" frame={frame} start={598} active large />
        <Label x={6115} y={650} zh="更多集中在" en="THE FOCUS SHIFTS TO" frame={frame} start={570} accent size={34} />
      </div>

      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 48%, rgba(0,184,255,0.035) 0%, rgba(6,8,13,0) 36%, rgba(0,0,0,0.18) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
