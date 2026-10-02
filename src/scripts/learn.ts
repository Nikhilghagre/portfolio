// Learning Hub interactions: progress, code explorer, copy buttons, table of contents.

const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

// ─── Progress (per browser, localStorage) ────────────────────
const KEY = (track: string) => `learn:${track}:done`;

function readDone(track: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY(track)) ?? '[]');
  } catch {
    return [];
  }
}
function writeDone(track: string, ids: string[]) {
  try {
    localStorage.setItem(KEY(track), JSON.stringify(ids));
  } catch {}
}

function paintProgress() {
  const done = readDone('solid');

  $$('[data-step]').forEach((el) => el.classList.toggle('is-done', done.includes(el.dataset.step!)));

  $$('[data-progress]').forEach((el) => {
    const total = Number(el.dataset.total) || 1;
    const count = readDone(el.dataset.progress!).length;
    el.style.setProperty('--pct', `${Math.min(100, (count / total) * 100)}%`);
    const counter = el.querySelector('[data-progress-count]');
    if (counter) counter.textContent = String(Math.min(count, total));
  });

  $$<HTMLButtonElement>('[data-complete]').forEach((btn) => {
    const isDone = done.includes(btn.dataset.complete!);
    btn.closest('.done')?.classList.toggle('is-done', isDone);
    const label = btn.querySelector('.done__label');
    if (label) label.textContent = isDone ? '✓ completed — undo' : 'mark as complete';
    btn.setAttribute('aria-pressed', String(isDone));
  });

  // "start course" becomes "continue" once you've begun
  $$<HTMLAnchorElement>('[data-resume]').forEach((a) => {
    const steps = $$('[data-step]', document).map((el) => el.dataset.step!);
    const order = [...new Set(steps)].sort(); // ids start with the step number
    if (!done.length) return;
    const nextId = order.find((id) => !done.includes(id));
    const label = a.querySelector('[data-resume-label]');
    if (nextId) {
      a.href = `${a.dataset.resumeBase}${nextId}/`;
      if (label) label.textContent = 'continue course';
    } else if (label) label.textContent = 'review course';
  });
}

function completeButtons() {
  $$<HTMLButtonElement>('[data-complete]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const id = btn.dataset.complete!;
      const done = readDone('solid');
      const nowDone = !done.includes(id);
      writeDone('solid', nowDone ? [...done, id] : done.filter((d) => d !== id));
      paintProgress();
      if (nowDone) burst(btn);
    }),
  );
}

// tiny celebration when a step is completed
function burst(from: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const r = from.getBoundingClientRect();
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('span');
    const angle = (Math.PI * 2 * i) / 14;
    const dist = 40 + Math.random() * 40;
    Object.assign(p.style, {
      position: 'fixed',
      left: `${r.left + r.width / 2}px`,
      top: `${r.top + r.height / 2}px`,
      width: '6px',
      height: '6px',
      borderRadius: '2px',
      background: i % 2 ? 'var(--green)' : 'var(--cyan)',
      pointerEvents: 'none',
      zIndex: '90',
    });
    document.body.appendChild(p);
    p.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(0.4)`, opacity: 0 },
      ],
      { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    ).onfinish = () => p.remove();
  }
}

// ─── Code explorer ───────────────────────────────────────────
function openFile(explorer: HTMLElement, path: string) {
  $$<HTMLButtonElement>('[data-file]', explorer).forEach((b) => {
    const on = b.dataset.file === path;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-pressed', String(on));
    if (on) b.scrollIntoView({ block: 'nearest' });
  });
  $$('[data-pane]', explorer).forEach((p) => (p.hidden = p.dataset.pane !== path));
}

function explorers() {
  $$('[data-explorer]').forEach((ex) => {
    $$<HTMLButtonElement>('[data-file]', ex).forEach((b) => b.addEventListener('click', () => openFile(ex, b.dataset.file!)));
  });
}

// File names mentioned in the lesson (`simple/1-problem.js`) open in the explorer.
function linkFileMentions() {
  const ex = document.querySelector<HTMLElement>('[data-explorer]');
  const lesson = document.querySelector('[data-lesson]');
  if (!ex || !lesson) return;
  const paths = $$('[data-file]', ex).map((b) => b.dataset.file!);
  const byName = new Map<string, string[]>();
  paths.forEach((p) => {
    const name = p.split('/').at(-1)!;
    byName.set(name, [...(byName.get(name) ?? []), p]);
  });

  $$('code', lesson).forEach((code) => {
    if (code.closest('pre')) return;
    const text = code.textContent?.trim() ?? '';
    if (!/\.(js|mjs|json)$/.test(text)) return;
    // try exact, then without the leading step folder, then a unique file name
    const parts = text.split('/');
    const candidates = [text, parts.slice(1).join('/'), parts.slice(2).join('/')];
    let match = candidates.find((c) => c && paths.includes(c));
    if (!match) {
      const same = byName.get(parts.at(-1)!);
      if (same?.length === 1) match = same[0];
    }
    if (!match) return;
    code.classList.add('is-file');
    code.setAttribute('role', 'button');
    code.setAttribute('tabindex', '0');
    code.title = 'Open in the code explorer';
    const go = () => {
      openFile(ex, match!);
      ex.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    code.addEventListener('click', go);
    code.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), go()));
  });
}

// ─── Copy buttons ────────────────────────────────────────────
async function copy(text: string, btn: HTMLElement) {
  try {
    await navigator.clipboard.writeText(text);
    const old = btn.textContent;
    btn.textContent = 'copied ✓';
    btn.classList.add('is-done');
    setTimeout(() => {
      btn.textContent = old;
      btn.classList.remove('is-done');
    }, 1500);
  } catch {}
}

function copyButtons() {
  // code blocks inside lessons
  $$('[data-lesson] pre').forEach((pre) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = 'copy';
    btn.addEventListener('click', () => copy(pre.querySelector('code')?.innerText ?? pre.innerText, btn));
    pre.appendChild(btn);
  });
  // explorer panes
  $$<HTMLButtonElement>('[data-copy-code]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const code = btn.closest('[data-pane]')?.querySelector('pre code') as HTMLElement | null;
      if (code) copy(code.innerText, btn);
    }),
  );
  // arbitrary text
  $$<HTMLButtonElement>('[data-copy-text]').forEach((btn) => btn.addEventListener('click', () => copy(btn.dataset.copyText ?? '', btn)));
}

// ─── "On this page" highlight ────────────────────────────────
function tocSpy() {
  const links = $$<HTMLAnchorElement>('[data-toc]');
  if (!links.length) return;
  const heads = links.map((l) => document.getElementById(l.dataset.toc!)).filter(Boolean) as HTMLElement[];
  const update = () => {
    let current = heads[0]?.id;
    for (const h of heads) if (h.getBoundingClientRect().top < 140) current = h.id;
    links.forEach((l) => l.classList.toggle('is-active', l.dataset.toc === current));
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// progress can change in another tab
window.addEventListener('storage', (e) => e.key?.startsWith('learn:') && paintProgress());

paintProgress();
completeButtons();
explorers();
linkFileMentions();
copyButtons();
tocSpy();
