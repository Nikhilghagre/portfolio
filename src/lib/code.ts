// Raw source of every code file in the SOLID course, keyed by path relative to learning/solid.
const raw = import.meta.glob('/learning/solid/**/*.{js,mjs,json}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export type CodeFile = { path: string; name: string; dir: string; lang: string; code: string };

const all: CodeFile[] = Object.entries(raw).map(([key, code]) => {
  const path = key.replace('/learning/solid/', '');
  const parts = path.split('/');
  return {
    path,
    name: parts.at(-1)!,
    dir: parts.slice(0, -1).join('/'),
    lang: path.endsWith('.json') ? 'json' : 'js',
    code,
  };
});

// files that make the best first impression open first
const priority = (f: CodeFile) =>
  /^(run|demo|demo-broken|1-problem)\.js$/.test(f.name) ? 0 : f.name.endsWith('.json') ? 3 : /test/.test(f.name) ? 2 : 1;

/** Code files inside a folder (recursively), root files first, then sub-folders. */
export function filesIn(folder: string): CodeFile[] {
  return all
    .filter((f) => f.path.startsWith(folder + '/'))
    .sort((a, b) => {
      const da = a.dir.length - folder.length;
      const db = b.dir.length - folder.length;
      if ((da === 0) !== (db === 0)) return da === 0 ? -1 : 1;
      if (a.dir !== b.dir) return a.dir.localeCompare(b.dir);
      return priority(a) - priority(b) || a.name.localeCompare(b.name);
    });
}

export const totalLines = all.reduce((n, f) => n + f.code.split('\n').length, 0);
export const totalFiles = all.length;
