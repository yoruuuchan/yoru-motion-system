// One-off: renders specific frames of specific compositions from one bundle,
// for checking motion-time behaviour that the late-frame sweep in stills.mjs
// cannot see (a block that drifts while typing, a counter mid-run).
//
//   node scripts/frames.mjs TypewriterLine:20,45,80 Countdown:20
import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const specs = process.argv.slice(2).map((a) => {
  const [id, frames] = a.split(':');
  return {id, frames: frames.split(',').map(Number)};
});
const outDir = path.resolve('out/frames');
fs.mkdirSync(outDir, {recursive: true});

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comps = await getCompositions(serveUrl);

for (const {id, frames} of specs) {
  const composition = comps.find((c) => c.id === id);
  if (!composition) throw new Error(`no composition ${id}`);
  for (const frame of frames) {
    const output = path.join(outDir, `${id}-f${frame}.png`);
    await renderStill({composition, serveUrl, output, frame, scale: 0.4});
    console.log(output);
  }
}
