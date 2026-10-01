// All page interactions. No framework — plain DOM, small and fast.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Boot sequence ────────────────────────────────────────────
async function boot() {
  const root = document.documentElement;
  if (!root.classList.contains('booting')) return;

  const screen = $('#boot')!;
  const log = $('#boot-log')!;
  let skipped = false;
  const skip = () => (skipped = true);
  window.addEventListener('keydown', skip, { once: true });
  screen.addEventListener('click', skip, { once: true });

  const lines = [
    '<span class="hi">portfolio-os</span> v1.0.0 — kernel 6.8.0-backend',
    '[ <span class="ok"> OK </span> ] Mounting /dev/experience',
    '[ <span class="ok"> OK </span> ] Starting api-gateway.service',
    '[ <span class="ok"> OK </span> ] Connecting to mysql://skills ... connected',
    '[ <span class="ok"> OK </span> ] Deploying lambdas to aws ... 100%',
    '[ <span class="ok"> OK </span> ] Loading 4.5 years of experience ... done',
    '[ <span class="ok"> OK </span> ] Reached target <span class="hi">portfolio.target</span>',
    '',
    '<span class="ok">➜</span> welcome. rendering UI…',
  ];
  for (const line of lines) {
    if (skipped) break;
    log.innerHTML += line + '\n';
    await sleep(line ? 120 + Math.random() * 90 : 60);
  }
  if (!skipped) await sleep(350);

  screen.classList.add('is-done');
  try {
    sessionStorage.setItem('booted', '1');
  } catch {}
  await sleep(450);
  root.classList.remove('booting');
}

// ─── Typewriter for the name ─────────────────────────────────
async function typeName() {
  const el = $('[data-type]');
  const out = el && $('.name__text', el);
  if (!el || !out) return;
  const text = el.dataset.type ?? '';
  if (reduceMotion) {
    out.textContent = text;
    return;
  }
  for (let i = 1; i <= text.length; i++) {
    out.textContent = text.slice(0, i);
    await sleep(55 + Math.random() * 60);
  }
}

// ─── Rotating role (type / delete loop) ──────────────────────
async function rotateRoles() {
  const el = $('[data-roles]');
  if (!el || reduceMotion) return;
  const roles: string[] = JSON.parse(el.dataset.roles ?? '[]');
  let i = 0;
  await sleep(2600);
  for (;;) {
    const current = roles[i % roles.length];
    for (let n = current.length; n >= 0; n--) {
      el.textContent = current.slice(0, n);
      await sleep(30);
    }
    i++;
    const next = roles[i % roles.length];
    for (let n = 1; n <= next.length; n++) {
      el.textContent = next.slice(0, n);
      await sleep(65);
    }
    await sleep(2400);
  }
}

// ─── Scroll reveal ───────────────────────────────────────────
function reveal() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  // the sidebar is always on screen on desktop — reveal it straight away
  const sidebarFixed = window.matchMedia('(min-width: 1024px)').matches;
  $$('[data-reveal]').forEach((el) => {
    if (sidebarFixed && el.closest('.side')) el.classList.add('is-in');
    else io.observe(el);
  });
}

// ─── Count-up numbers ────────────────────────────────────────
function countUp() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        const el = e.target as HTMLElement;
        const target = Number(el.dataset.count);
        const decimals = String(target).split('.')[1]?.length ?? 0;
        if (reduceMotion) {
          el.textContent = target.toFixed(decimals);
          continue;
        }
        const start = performance.now();
        const dur = 1600;
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = (target * eased).toFixed(decimals);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    },
    { threshold: 0.6 },
  );
  $$('[data-count]').forEach((el) => io.observe(el));
}

// ─── Active nav link ─────────────────────────────────────────
function activeNav() {
  const links = $$<HTMLAnchorElement>('[data-nav]');
  const sections = links.map((l) => document.getElementById(l.dataset.nav!)).filter(Boolean) as HTMLElement[];
  const update = () => {
    const y = window.innerHeight * 0.35;
    let current = sections[0]?.id;
    for (const s of sections) if (s.getBoundingClientRect().top <= y) current = s.id;
    // at the very bottom, highlight the last section
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = sections.at(-1)?.id;
    links.forEach((l) => l.classList.toggle('is-active', l.dataset.nav === current));
  };
  return update;
}

// ─── Scroll-driven: progress bar + timeline fill ─────────────
function scrollEffects() {
  const bar = $('#progress');
  const timeline = $('[data-timeline]');
  const navUpdate = activeNav();
  let ticking = false;

  const run = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;

    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const p = (window.innerHeight * 0.6 - r.top) / r.height;
      timeline.style.setProperty('--p', String(Math.max(0, Math.min(1, p))));
    }
    navUpdate();
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(run);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  run();
}

// ─── Cursor spotlight + card glow / tilt ─────────────────────
function pointerEffects() {
  if (!finePointer) return;
  const spot = $('#spotlight');
  window.addEventListener(
    'pointermove',
    (e) => {
      spot?.style.setProperty('--mx', `${e.clientX}px`);
      spot?.style.setProperty('--my', `${e.clientY}px`);
    },
    { passive: true },
  );

  $$('[data-glow]').forEach((card) => {
    const tilt = card.hasAttribute('data-tilt') && !reduceMotion;
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty('--gx', `${x}px`);
      card.style.setProperty('--gy', `${y}px`);
      if (tilt) {
        card.style.setProperty('--ry', `${(x / r.width - 0.5) * 6}deg`);
        card.style.setProperty('--rx', `${(0.5 - y / r.height) * 6}deg`);
      }
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

// ─── Mobile menu ─────────────────────────────────────────────
function mobileMenu() {
  const btn = $('#menu-btn');
  if (!btn) return;
  const root = document.documentElement;
  const set = (open: boolean) => {
    root.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', () => set(!root.classList.contains('menu-open')));
  $$('#mobile-nav a').forEach((a) => a.addEventListener('click', () => set(false)));
  window.addEventListener('keydown', (e) => e.key === 'Escape' && set(false));
}

// ─── Toast + copy-to-clipboard ───────────────────────────────
let toastTimer: number | undefined;
function toast(msg: string) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('is-show'), 2000);
}

function copyButtons() {
  $$('[data-copy]').forEach((btn) =>
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy ?? '');
        toast('✓ copied to clipboard');
      } catch {
        window.location.href = `mailto:${btn.dataset.copy}`;
      }
    }),
  );
}

// ─── Contact form (no backend → opens the mail client) ───────
function contactForm() {
  const form = $<HTMLFormElement>('#contact-form');
  const log = $('#contact-log');
  if (!form || !log) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    $$('.field', form).forEach((f) => f.classList.remove('is-invalid'));
    const errors: string[] = [];
    if (!name) errors.push('name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('email');
    if (!message) errors.push('message');

    if (errors.length) {
      errors.forEach((n) => form.elements.namedItem(n) && (form.elements.namedItem(n) as HTMLElement).closest('.field')?.classList.add('is-invalid'));
      log.innerHTML = `<span class="err">✗ error:</span> missing or invalid: ${errors.join(', ')}`;
      return;
    }

    const steps = ['validating input… <span class="ok">ok</span>', 'composing message… <span class="ok">ok</span>', '<span class="ok">✓</span> opening your mail client'];
    log.innerHTML = '';
    for (const s of steps) {
      log.innerHTML += `<span class="ok">$</span> ${s}\n`;
      await sleep(reduceMotion ? 0 : 320);
    }

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${form.dataset.email}?subject=${subject}&body=${body}`;
  });
}

// ─── Init ────────────────────────────────────────────────────
mobileMenu();
copyButtons();
contactForm();
pointerEffects();
scrollEffects();

boot().then(() => {
  reveal();
  countUp();
  typeName();
  rotateRoles();
});
