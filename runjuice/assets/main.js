/* ============================================================
   RunJuice — interactie
   De pagina is een ronde: route tekenen, kilometers tellen,
   zon laten opkomen, en de cijfers laten meebewegen.
   ============================================================ */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const euro = (n) => '€ ' + Math.round(n).toLocaleString('nl-NL');

/* ── 1. onthullen bij binnenkomst ──────────────────────────── */
const revealIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('is-in');
    revealIO.unobserve(e.target);
  }
}, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach((el) => {
  el.style.setProperty('--d', el.dataset.delay || 0);
  revealIO.observe(el);
});

/* koppen woord voor woord omhoog laten komen */
document.querySelectorAll('[data-splitwords]').forEach((el) => {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  words.forEach((w, i) => {
    const outer = document.createElement('span');
    outer.className = 'word';
    outer.style.setProperty('--w', i);
    const inner = document.createElement('span');
    inner.textContent = w;
    outer.append(inner);
    el.append(outer, document.createTextNode(' '));
  });
  revealIO.observe(el);
});

/* ── 2. tellers ────────────────────────────────────────────── */
const countIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const el = e.target;
    countIO.unobserve(el);
    const target = Number(el.dataset.count);
    const fmt = (v) => el.dataset.format === 'thousand'
      ? Math.round(v).toLocaleString('nl-NL')
      : String(Math.round(v));
    if (reduced) { el.textContent = fmt(target); continue; }
    const dur = 1400, t0 = performance.now();
    const tick = (now) => {
      const p = clamp((now - t0) / dur);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach((el) => countIO.observe(el));

/* ── 3. glazen die zich vullen tot de brutomarge ───────────── */
const GLASS = 'M20 8 H70 L63 116 a8 8 0 0 1 -8 7 H35 a8 8 0 0 1 -8 -7 Z';
document.querySelectorAll('[data-glass]').forEach((host, i) => {
  const card = host.closest('.drink');
  const fill = clamp(Number(card.dataset.fill) / 100, 0, 1);
  const topY = 118 - fill * 104;            // vulniveau binnen het glas
  const id = `glass-clip-${i}`;
  host.innerHTML = `
    <svg viewBox="0 0 90 132" role="img" aria-label="Vulniveau toont de geschatte brutomarge">
      <defs><clipPath id="${id}"><path d="${GLASS}"/></clipPath></defs>
      <g clip-path="url(#${id})">
        <g class="glass__fill">
          <g transform="translate(0 ${topY})">
            <rect class="glass__liquid" x="-10" y="4" width="110" height="140"/>
            <path class="glass__wave" d="M-90 6 q22.5 -9 45 0 t45 0 t45 0 t45 0 t45 0 t45 0 V60 H-90 Z"/>
          </g>
        </g>
      </g>
      <path class="glass__outline" d="${GLASS}"/>
    </svg>`;
});

/* ── 4. de aanhanger: zelftekenend + hotspots ──────────────── */
const rig = document.querySelector('.rig');
if (rig) {
  rig.querySelectorAll('.rig__draw path, .rig__draw circle').forEach((el, i) => {
    if (el.classList.contains('rig__ground') || el.classList.contains('rig__dash')) return;
    const len = Math.ceil(el.getTotalLength());
    el.style.setProperty('--len', len);
    el.style.setProperty('--i', i);
  });
  new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      obs.unobserve(e.target);
    }
  }, { threshold: 0.25 }).observe(rig);

  const nameEl = document.getElementById('rigName');
  const noteEl = document.getElementById('rigNote');
  const readout = document.getElementById('rigReadout');
  const spots = [...rig.querySelectorAll('.spot')];

  const show = (spot) => {
    spots.forEach((s) => s.classList.toggle('is-active', s === spot));
    readout.dataset.empty = 'false';
    nameEl.innerHTML = spot.dataset.spot;
    noteEl.textContent = spot.dataset.note;
  };

  spots.forEach((spot, i) => {
    spot.setAttribute('tabindex', '0');
    spot.setAttribute('role', 'button');
    spot.setAttribute('aria-label', `Uitrusting ${i + 1}: ${spot.dataset.spot.replace('&amp;', 'en')}`);
    spot.addEventListener('pointerenter', () => show(spot));
    spot.addEventListener('focus', () => show(spot));
    spot.addEventListener('click', () => show(spot));
    spot.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); show(spot); }
    });
  });
}

/* ── 5. investeringsbalken ─────────────────────────────────── */
const budget = document.querySelector('[data-budget]');
if (budget) {
  const items = [...budget.children];
  const max = Math.max(...items.map((li) => Number(li.dataset.hi)));
  items.forEach((li) => {
    li.style.setProperty('--lo', (Number(li.dataset.lo) / max * 100) + '%');
    li.style.setProperty('--hi', (Number(li.dataset.hi) / max * 100) + '%');
  });
}

/* ── 6. rekenmodel + waterval ──────────────────────────────── */
const FIXED = { insurance: 1200, marketing: 800 };
const PITCH_BASE = 1500;        // standplaats-/evenementkosten bij 100 draaidagen
const INVEST = 20750;           // midden van € 19.500 – € 22.000
const COGS_RATE = 0.35;
const DEFAULTS = { days: 100, units: 80, spend: 4.5 };

const inDays = document.getElementById('inDays');
const inUnits = document.getElementById('inUnits');
const inSpend = document.getElementById('inSpend');

if (inDays && inUnits && inSpend) {
  const outDays = document.getElementById('outDays');
  const outUnits = document.getElementById('outUnits');
  const outSpend = document.getElementById('outSpend');
  const wf = document.getElementById('waterfall');

  const paintTrack = (input) => {
    const pct = (input.value - input.min) / (input.max - input.min) * 100;
    input.style.setProperty('--pct', pct + '%');
  };

  const buildWaterfall = (steps) => {
    wf.innerHTML = steps.map((s) => `
      <div class="wf wf--${s.type}">
        <div class="wf__col"><div class="wf__block" style="bottom:${s.bottom}%;height:${s.height}%"></div></div>
        <span class="wf__lab">${s.label}</span>
      </div>`).join('');
  };

  const render = () => {
    const days = Number(inDays.value);
    const units = Number(inUnits.value);
    const spend = Number(inSpend.value);

    const revenue = days * units * spend;
    const cogs = revenue * COGS_RATE;
    const pitch = PITCH_BASE * (days / DEFAULTS.days);
    const profit = revenue - cogs - pitch - FIXED.insurance - FIXED.marketing;

    outDays.textContent = days;
    outUnits.textContent = units;
    outSpend.textContent = '€ ' + spend.toFixed(2).replace('.', ',');
    [inDays, inUnits, inSpend].forEach(paintTrack);

    document.getElementById('plRevenue').textContent = euro(revenue);
    document.getElementById('plCogs').textContent = '− ' + euro(cogs);
    document.getElementById('plPitch').textContent = '− ' + euro(pitch);
    document.getElementById('plProfit').textContent = euro(profit);

    const months = profit > 0 ? Math.round(INVEST / (profit / 12)) : null;
    document.getElementById('plPayback').textContent = months === null
      ? 'niet terugverdiend'
      : `${months} ${months === 1 ? 'maand' : 'maanden'}`;

    // waterval: omzet, kosten die eraf gaan, en wat overblijft
    const scale = Math.max(revenue, 1);
    const h = (v) => clamp(v / scale) * 100;
    let running = revenue;
    const steps = [{ type: 'in', label: 'Omzet', bottom: 0, height: h(revenue) }];
    for (const [label, value] of [
      ['Inkoop', cogs], ['Standplaats', pitch],
      ['Verzek.', FIXED.insurance], ['Marketing', FIXED.marketing],
    ]) {
      running -= value;
      steps.push({ type: 'out', label, bottom: h(Math.max(running, 0)), height: h(value) });
    }
    steps.push({ type: 'sum', label: 'Brutowinst', bottom: 0, height: h(Math.max(profit, 0)) });
    buildWaterfall(steps);
  };

  [inDays, inUnits, inSpend].forEach((el) => el.addEventListener('input', render));
  document.getElementById('resetModel').addEventListener('click', () => {
    inDays.value = DEFAULTS.days;
    inUnits.value = DEFAULTS.units;
    inSpend.value = DEFAULTS.spend;
    render();
  });
  render();
}

/* ── 7. de route: pad langs de kilometerpalen ──────────────── */
const layer = document.getElementById('routeLayer');
const svg = document.getElementById('routeSvg');
const line = document.getElementById('routeLine');
const ghost = document.getElementById('routeGhost');
const dot = document.getElementById('routeDot');
const halo = document.getElementById('routeDotHalo');
const markers = [...document.querySelectorAll('[data-marker]')];
const sections = [...document.querySelectorAll('[data-split]')];

let pathLength = 0;
let docHeight = 1;
let routeOn = window.matchMedia('(min-width: 901px)').matches;

/* vloeiende curve door een reeks punten (Catmull-Rom → bezier) */
function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

function buildRoute() {
  docHeight = document.documentElement.scrollHeight;
  routeOn = window.matchMedia('(min-width: 901px)').matches;
  if (!layer || !routeOn) return;

  layer.style.height = docHeight + 'px';
  const w = document.documentElement.clientWidth;
  svg.setAttribute('width', w);
  svg.setAttribute('height', docHeight);
  svg.setAttribute('viewBox', `0 0 ${w} ${docHeight}`);

  const shell = document.querySelector('.sec, .hero');
  const baseX = shell.getBoundingClientRect().left + window.scrollY * 0 + 66;
  const amp = 30;

  const pts = [[baseX, 0]];
  markers.forEach((m, i) => {
    const r = m.getBoundingClientRect();
    const y = r.top + window.scrollY + r.height / 2;
    pts.push([baseX + (i % 2 ? amp : -amp), y]);
  });
  pts.push([baseX, docHeight]);

  const d = smoothPath(pts);
  line.setAttribute('d', d);
  ghost.setAttribute('d', d);
  pathLength = line.getTotalLength();
  line.style.strokeDasharray = pathLength;
}

/* ── 8. scroll: tekenen, tellen, licht ─────────────────────── */
const hud = document.getElementById('hud');
const hudKm = document.getElementById('hudKm');
const hudTime = document.getElementById('hudTime');
const hudSplit = document.getElementById('hudSplit');
const rail = document.getElementById('progressFill');
const TOTAL_KM = 10;

let currentSplit = '';

/* de rondelijst: elk hoofdstuk als split, zoals de laps op een horloge */
const splits = document.getElementById('splits');
const toggle = document.getElementById('splitsToggle');
if (splits && toggle) {
  splits.innerHTML = `<div class="splits__inner">${sections.map((s) => {
    const km = s.dataset.km;
    return `<a href="#${s.id}" data-for="${s.id}"><b>${km === '0' ? 'start' : km === '10' ? 'finish' : 'km ' + km}</b>${s.dataset.split}</a>`;
  }).join('')}</div>`;
  toggle.addEventListener('click', () => {
    const open = hud.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  splits.addEventListener('click', () => {
    hud.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  });
}

function onScroll() {
  const vh = window.innerHeight;
  const y = window.scrollY;
  const eye = y + vh * 0.55;                        // "waar de loper is"
  const progress = clamp((eye - vh * 0.55) / Math.max(docHeight - vh, 1));

  document.documentElement.style.setProperty('--dawn', progress.toFixed(3));
  if (rail) rail.style.width = (progress * 100).toFixed(2) + '%';

  if (routeOn && pathLength) {
    line.style.strokeDashoffset = pathLength * (1 - progress);
    const p = line.getPointAtLength(pathLength * progress);
    dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y);
    halo.setAttribute('cx', p.x); halo.setAttribute('cy', p.y);
    dot.setAttribute('r', 5); halo.setAttribute('r', 6);
  }

  markers.forEach((m) => {
    const r = m.getBoundingClientRect();
    m.classList.toggle('is-passed', r.top + window.scrollY <= eye);
  });

  // sporthorloge
  const km = (progress * TOTAL_KM).toFixed(1);
  if (hudKm.textContent !== km) hudKm.textContent = km;
  const mins = Math.round(progress * 240);          // 08:00 → 12:00
  const hh = String(8 + Math.floor(mins / 60)).padStart(2, '0');
  const mm = String(mins % 60).padStart(2, '0');
  hudTime.textContent = `${hh}:${mm}`;

  let split = sections[0]?.dataset.split || '';
  for (const s of sections) {
    if (s.getBoundingClientRect().top <= vh * 0.4) split = s.dataset.split;
  }
  if (split !== currentSplit) {
    currentSplit = split;
    hudSplit.textContent = split.replace('&amp;', '&');
    splits?.querySelectorAll('a').forEach((a) => {
      a.classList.toggle('is-here', document.getElementById(a.dataset.for)?.dataset.split === split);
    });
  }

  hud.classList.toggle('is-on', y > vh * 0.5);
}

let ticking = false;
const requestTick = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { onScroll(); ticking = false; });
};

window.addEventListener('scroll', requestTick, { passive: true });
window.addEventListener('resize', () => { buildRoute(); requestTick(); });
window.addEventListener('load', () => { buildRoute(); requestTick(); });

/* de layout verschuift nog terwijl fonts en onthullingen binnenkomen */
if (document.fonts?.ready) document.fonts.ready.then(() => { buildRoute(); requestTick(); });
new ResizeObserver(() => { buildRoute(); requestTick(); }).observe(document.body);

buildRoute();
onScroll();
