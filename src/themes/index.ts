import {makeTheme, type SkinId, type Theme} from '../core/theme';
import {PALETTES, type PaletteId} from './palettes';
import {SKINS} from './skins';

export * from './palettes';
export * from './skins';

export const resolveTheme = (palette: PaletteId, skin: SkinId): Theme =>
  makeTheme(PALETTES[palette], SKINS[skin]);
