// Copies teaching material from the workspace into the site so it can be built and deployed.
// Edit the originals (../solid, ...), then run:  npm run sync:learn
import { cpSync, rmSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const tracks = [{ from: '../solid', to: 'learning/solid' }];
const skip = new Set(['node_modules', '.git']);

for (const { from, to } of tracks) {
  const src = resolve(root, from);
  const dest = resolve(root, to);
  if (!existsSync(src)) {
    console.warn(`skip: ${src} not found`);
    continue;
  }
  rmSync(dest, { recursive: true, force: true });
  cpSync(src, dest, {
    recursive: true,
    filter: (p) => !skip.has(basename(p)) && !p.endsWith('.log'),
  });
  console.log(`synced ${from} -> ${to}`);
}
