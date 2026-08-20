// Renders one still per composition from a single bundle, so a full visual
// sweep costs one bundle instead of one per template.
//
//   node scripts/stills.mjs                 # all compositions, late frame
//   node scripts/stills.mjs BarChart Donut  # only ids containing these strings
import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const filters = process.argv.slice(2);
const outDir = path.resolve('out/stills');
fs.mkdirSync(outDir, {recursive: true});

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comps = await getCompositions(serveUrl);
const picked = filters.length
  ? comps.filter((c) => filters.some((f) => c.id.toLowerCase().includes(f.toLowerCase())))
  : comps;

for (const comp of picked) {
  // Late enough that every beat has landed, early enough to stay in the hold.
  const frame = Math.max(0, comp.durationInFrames - 20);
  const output = path.join(outDir, `${comp.id}.png`);
  await renderStill({composition: comp, serveUrl, output, frame, scale: 0.4});
  console.log(`${comp.id}  f${frame}  ${comp.width}x${comp.height}`);
}
console.log(`\n${picked.length} stills -> ${outDir}`);
