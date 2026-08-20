import type {Palette} from '../core/theme';

/**
 * `neutral` is reverse-engineered from the kept clips: all 41 are monochrome,
 * and data marks are a lightness ramp rather than a hue scale. Light
 * backgrounds ramp dark; dark backgrounds ramp light.
 */
export const neutralLight: Palette = {
  id: 'neutral-light',
  mode: 'light',
  bg: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceAlt: '#F4F4F5',
  ink: '#0A0A0A',
  inkMuted: '#71717A',
  inkFaint: '#A1A1AA',
  line: '#E4E4E7',
  lineStrong: '#0A0A0A',
  accent: '#0A0A0A',
  accentInk: '#FFFFFF',
  accentSoft: '#F4F4F5',
  positive: '#166534',
  negative: '#B91C1C',
  ramp: ['#C4C4C9', '#8E8E96', '#52525B', '#18181B'],
};

export const neutralDark: Palette = {
  id: 'neutral-dark',
  mode: 'dark',
  bg: '#000000',
  surface: '#0B0B0C',
  surfaceAlt: '#161618',
  ink: '#FAFAFA',
  inkMuted: '#A1A1AA',
  inkFaint: '#52525B',
  line: '#26262A',
  lineStrong: '#FAFAFA',
  accent: '#FAFAFA',
  accentInk: '#0A0A0A',
  accentSoft: '#1C1C1F',
  positive: '#4ADE80',
  negative: '#F87171',
  ramp: ['#3F3F46', '#71717A', '#D4D4D8', '#FAFAFA'],
};

/**
 * `yoru` is the YORU Content Design System palette — cool navy ink ramp,
 * pale-blue paper, SIGNAL blue accent.
 *
 * The data ramp deliberately stays neutral instead of going blue: the design
 * system supplies the brand, the curation supplies the rule that data marks are
 * a lightness ramp. Accent is spent on emphasis (a selected row, the AFTER
 * side, a CTA), never on encoding a series.
 */
export const yoruLight: Palette = {
  id: 'yoru-light',
  mode: 'light',
  bg: '#F2F5F5',
  surface: '#FFFFFF',
  surfaceAlt: '#E9EFF0',
  ink: '#1B2127',
  inkMuted: '#7B8798',
  inkFaint: '#A9B4C4',
  line: '#DEE5E8',
  lineStrong: '#1B2127',
  accent: '#3186FF',
  accentInk: '#FFFFFF',
  accentSoft: '#D0E8FF',
  positive: '#1E8A66',
  negative: '#A62733',
  ramp: ['#B9C7CC', '#8695A6', '#4A5566', '#1B2127'],
};

export const yoruDark: Palette = {
  id: 'yoru-dark',
  mode: 'dark',
  bg: '#12171C',
  surface: '#1B2127',
  surfaceAlt: '#2C3440',
  ink: '#F7FAFA',
  inkMuted: '#A9B4C4',
  inkFaint: '#4A5566',
  line: '#2C3440',
  lineStrong: '#C1D7EF',
  accent: '#3186FF',
  accentInk: '#FFFFFF',
  accentSoft: '#23394F',
  positive: '#45C496',
  negative: '#C15A52',
  ramp: ['#2C3440', '#4A5566', '#A9B4C4', '#F7FAFA'],
};

/**
 * `warm-paper` was measured from a private real-material stress test. The
 * committed palette preserves the useful colour finding while the identifying
 * source material, site names and screenshots remain outside the repository.
 * Dominant warm-paper tones clustered around #EBE1D6 and the only vivid accent
 * around #C03C24, used sparingly.
 *
 * Two values are decisions, not measurements:
 * - `ink` was deepened so body copy keeps strong contrast on the paper ground.
 * - `negative` is deliberately desaturated because the accent itself is red.
 */
export const warmPaper: Palette = {
  id: 'warm-paper',
  mode: 'light',
  bg: '#EBE1D6',
  surface: '#FCF8F4',
  surfaceAlt: '#E2D5C8',
  ink: '#2E261D',
  inkMuted: '#7A6A58',
  inkFaint: '#A8998A',
  line: '#DCCEBF',
  lineStrong: '#2E261D',
  accent: '#C03C24',
  accentInk: '#FFFFFF',
  accentSoft: '#F2D9CF',
  positive: '#3F6B4A',
  negative: '#8A5F52',
  ramp: ['#D3C3B2', '#A8907A', '#6E5C4A', '#2E261D'],
};

export const PALETTES = {
  'neutral-light': neutralLight,
  'neutral-dark': neutralDark,
  'yoru-light': yoruLight,
  'yoru-dark': yoruDark,
  'warm-paper': warmPaper,
} as const;

export type PaletteId = keyof typeof PALETTES;
