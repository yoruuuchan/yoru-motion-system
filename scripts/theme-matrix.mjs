// Renders one template across every palette x skin, so the theme layer can be
// checked in one look. Usage: node scripts/theme-matrix.mjs [compositionId]
import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const id = process.argv[2] ?? 'ChangelogCard';
const PALETTES = ['neutral-light', 'neutral-dark', 'yoru-light', 'yoru-dark', 'warm-paper'];
const SKINS = ['hairline', 'brutalist', 'glass', 'flat'];

const outDir = path.resolve('out/matrix');
fs.mkdirSync(outDir, {recursive: true});

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comps = await getCompositions(serveUrl);
const base = comps.find((c) => c.id === id);
if (!base) throw new Error(`No composition ${id}. Have: ${comps.map((c) => c.id).join(', ')}`);

for (const palette of PALETTES) {
  for (const skin of SKINS) {
    const inputProps = {...base.defaultProps, palette, skin};
    const composition = await selectComposition({serveUrl, id, inputProps});
    await renderStill({
      composition,
      serveUrl,
      inputProps,
      output: path.join(outDir, `${id}--${palette}--${skin}.png`),
      frame: Math.max(0, composition.durationInFrames - 20),
      scale: 0.4,
    });
    console.log(`${palette} / ${skin}`);
  }
}
console.log(`\n-> ${outDir}`);
