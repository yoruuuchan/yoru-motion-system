import type {Skin, SkinId} from '../core/theme';

/**
 * Only the skins that survived curation are shipped.
 *
 * From the 427-record snapshot: default 16.4% keep rate, dark 14.8%,
 * brutalist 13.1%, glass 11.5% — against minimal 4.9%, neo 3.3%, rounded 3.3%.
 * `hairline` is the "default" treatment. `flat` is a cleaned-up `minimal`, kept
 * only because two templates (screen-showcase, before-after) scored on it.
 * `neo` and `rounded` are not shipped: 2 keeps each out of 61 is noise, not
 * evidence.
 */
export const hairline: Skin = {
  id: 'hairline',
  radius: 14,
  radiusSmall: 8,
  borderWidth: 1,
  borderTone: 'line',
  shadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
  offsetShadow: 0,
  upperLabels: false,
  monoBody: false,
};

export const brutalist: Skin = {
  id: 'brutalist',
  radius: 0,
  radiusSmall: 0,
  borderWidth: 2,
  borderTone: 'strong',
  shadow: null,
  offsetShadow: 6,
  upperLabels: true,
  monoBody: true,
};

export const glass: Skin = {
  id: 'glass',
  radius: 18,
  radiusSmall: 10,
  borderWidth: 0,
  borderTone: 'none',
  shadow: '0 24px 64px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
  offsetShadow: 0,
  upperLabels: false,
  monoBody: false,
};

export const flat: Skin = {
  id: 'flat',
  radius: 8,
  radiusSmall: 6,
  borderWidth: 0,
  borderTone: 'none',
  shadow: null,
  offsetShadow: 0,
  upperLabels: false,
  monoBody: false,
};

export const SKINS: Record<SkinId, Skin> = {hairline, brutalist, glass, flat};
