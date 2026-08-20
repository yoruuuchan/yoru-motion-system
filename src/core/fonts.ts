import {loadFont} from '@remotion/fonts';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

/**
 * Self-hosted OFL faces lifted from the YORU Content Design System.
 * Source Han Sans SC carries the CJK coverage — the reference material was
 * English-only, so Chinese copy is our own requirement, not an inherited one.
 *
 * The render is held until the faces are ready. Without the hold, the first
 * frames render in a fallback face and the text metrics shift mid-clip, which
 * is exactly the kind of nondeterminism the validation matrix rejects.
 */
const handle = delayRender('Loading YORU type');

Promise.all([
  loadFont({family: 'Inter', url: staticFile('fonts/inter/InterVariable.woff2'), weight: '100 900'}),
  loadFont({
    family: 'JetBrains Mono',
    url: staticFile('fonts/jetbrains-mono/JetBrainsMono-Regular.woff2'),
    weight: '400',
  }),
  loadFont({
    family: 'JetBrains Mono',
    url: staticFile('fonts/jetbrains-mono/JetBrainsMono-Medium.woff2'),
    weight: '500',
  }),
  loadFont({
    family: 'JetBrains Mono',
    url: staticFile('fonts/jetbrains-mono/JetBrainsMono-Bold.woff2'),
    weight: '700',
  }),
  loadFont({
    family: 'Source Han Sans SC',
    url: staticFile('fonts/source-han/SourceHanSansSC-Regular.woff2'),
    weight: '400',
  }),
  loadFont({
    family: 'Source Han Sans SC',
    url: staticFile('fonts/source-han/SourceHanSansSC-Medium.woff2'),
    weight: '500',
  }),
  loadFont({
    family: 'Source Han Sans SC',
    url: staticFile('fonts/source-han/SourceHanSansSC-Bold.woff2'),
    weight: '700',
  }),
])
  .then(() => continueRender(handle))
  .catch((err) => cancelRender(err));

export const SANS = "'Inter', 'Source Han Sans SC', system-ui, sans-serif";
export const MONO = "'JetBrains Mono', 'Source Han Sans SC', ui-monospace, monospace";
