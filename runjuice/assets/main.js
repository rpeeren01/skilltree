/* ═══════════════════════════════════════════════════════════════
   RunJuice — interactie
   Alles is opt-in per onderdeel: valt er iets uit, dan blijft de
   rest van de pagina gewoon leesbaar.
   ═══════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const nl = (n) => Math.round(n).toLocaleString('nl-NL');
  const euro = (n) => '€ ' + nl(n);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const svgEl = (tag, attrs) => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  };

  /* ── 1 · onthullen ─────────────────────────────────────────── */
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  const watch = (el, delay) => {
    if (delay !== undefined) el.style.setProperty('--d', delay);
    io.observe(el);
  };

  $$('[data-reveal]').forEach((el) => watch(el, el.dataset.delay || 0));

  // koppen: regel voor regel (vooraf gezet) of woord voor woord
  $$('[data-line]').forEach((el, i) => {
    el.innerHTML = `<i>${el.innerHTML}</i>`;
    el.style.setProperty('--d', i);
    watch(el);
  });

  $$('[data-splitwords]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => {
      const outer = document.createElement('span');
      outer.className = 'word';
      outer.style.setProperty('--w', i);
      outer.innerHTML = `<i>${w}</i>`;
      el.append(outer, document.createTextNode(' '));
    });
    watch(el);
  });

  /* ── 2 · tellers ───────────────────────────────────────────── */
  const counters = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      counters.unobserve(e.target);
      const el = e.target;
      const to = Number(el.dataset.count);
      const fmt = (v) => (el.dataset.fmt === 'k' ? nl(v) : String(Math.round(v)));
      if (reduced) { el.textContent = fmt(to); continue; }
      const t0 = performance.now(), dur = 1200;
      const step = (now) => {
        const p = clamp((now - t0) / dur);
        el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, { threshold: 0.8 });
  $$('[data-count]').forEach((el) => counters.observe(el));

  /* ── 3 · wijzerplaat in de opening ─────────────────────────── */
  const dialTicks = $('#dialTicks');
  if (dialTicks) {
    for (let i = 0; i < 60; i++) {
      const major = i % 5 === 0;
      const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
      const r1 = major ? 158 : 168, r2 = 176;
      dialTicks.append(svgEl('line', {
        class: 'dial__tick' + (major ? ' dial__tick--major' : ''),
        x1: Math.cos(a) * r1, y1: Math.sin(a) * r1,
        x2: Math.cos(a) * r2, y2: Math.sin(a) * r2,
      }));
    }
    [12, 3, 6, 9].forEach((h) => {
      const a = (h / 12) * Math.PI * 2 - Math.PI / 2;
      dialTicks.append(Object.assign(
        svgEl('text', { class: 'dial__num', x: Math.cos(a) * 112, y: Math.sin(a) * 112 + 5 }),
        { textContent: h }
      ));
    });
    // het venster 08:00 – 12:00, een kwart van de wijzerplaat
    const pt = (h, r) => {
      const a = (h / 12) * Math.PI * 2 - Math.PI / 2;
      return [Math.cos(a) * r, Math.sin(a) * r];
    };
    const [x1, y1] = pt(8, 150), [x2, y2] = pt(12, 150);
    $('#dialWindow').setAttribute('d', `M${x1} ${y1} A150 150 0 0 1 ${x2} ${y2}`);
  }

  /* ── 4 · merktekens op de kaart ────────────────────────────── */
  const MARKS = {
    // biet: knol met loof
    biet: `<path d="M26 15c2-5.5 6.5-8.5 12-8.5-.5 5-4 8.5-8.5 10" fill="none" stroke="var(--tone)" stroke-width="1.8" stroke-linejoin="round"/>
           <path d="M26 15c-2-4.5-6-7-11-6.5 1 4.5 4 7.5 8 8.7" fill="none" stroke="var(--tone)" stroke-width="1.8" stroke-linejoin="round"/>
           <path d="M26 17c9.5 0 15.5 6.5 15.5 14.5 0 8.5-8.5 16.5-15.5 20.5-7-4-15.5-12-15.5-20.5C10.5 23.5 16.5 17 26 17Z" fill="var(--tone)"/>`,
    // kokosnoot in doorsnede
    kokos: `<circle cx="26" cy="28" r="20" fill="var(--tone)"/>
            <circle cx="26" cy="28" r="13" fill="var(--paper)"/>
            <circle cx="26" cy="28" r="13" fill="none" stroke="var(--tone)" stroke-width="1.4"/>
            <path d="M18.5 22a9 9 0 0 1 6-3.5" fill="none" stroke="var(--tone)" stroke-width="1.6" stroke-linecap="round"/>`,
    // shotglas met citroenschijf
    shot: `<path d="M14 15h22l-3 30a4 4 0 0 1-4 3.6h-8A4 4 0 0 1 17 45Z" fill="none" stroke="var(--tone)" stroke-width="1.8" stroke-linejoin="round"/>
           <path d="M15.6 27h18.8l-2 18a4 4 0 0 1-4 3.6h-6.8a4 4 0 0 1-4-3.6Z" fill="var(--tone)"/>
           <circle cx="37" cy="14" r="8" fill="var(--paper)" stroke="var(--tone)" stroke-width="1.5"/>
           <path d="M37 6v16M29 14h16" stroke="var(--tone)" stroke-width="1.2"/>`,
    // reep met breuklijnen
    reep: `<rect x="6" y="16" width="40" height="22" rx="3" fill="var(--tone)"/>
           <path d="M19.3 16v22M32.6 16v22" stroke="var(--paper)" stroke-width="1.6" stroke-opacity=".75"/>
           <path d="M6 27h40" stroke="var(--paper)" stroke-width="1.6" stroke-opacity=".5"/>`,
  };
  $$('[data-mark]').forEach((el) => {
    el.innerHTML = `<svg viewBox="0 0 52 52" aria-hidden="true">${MARKS[el.dataset.mark] || ''}</svg>`;
  });

  /* ── 5 · weekschema ────────────────────────────────────────── */
  const weekGrid = $('#weekGrid');
  if (weekGrid) {
    const DAYS = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];
    const FROM = 6, TO = 22;                        // zichtbare uren
    const y = (h) => ((h - FROM) / (TO - FROM)) * 100;
    const blocks = {
      di: [[19, 21, 'open', 'club']],
      do: [[19, 21, 'open', 'club']],
      za: [[8, 12, 'solid', '08–12']],
      zo: [[8, 12, 'solid', '08–12']],
    };

    let head = '<div class="wk-h wk-h--corner">uur</div>';
    DAYS.forEach((d) => { head += `<div class="wk-h">${d}</div>`; });

    let axis = '<div class="wk-axis">';
    for (let h = FROM; h <= TO; h += 2) {
      const shift = h === FROM ? '0' : h === TO ? '-100%' : '-50%';
      axis += `<span style="top:${y(h)}%;transform:translateY(${shift})">${String(h).padStart(2, '0')}:00</span>`;
    }
    axis += '</div>';

    let i = 0, cols = '';
    DAYS.forEach((d) => {
      cols += '<div class="wk-col">';
      (blocks[d] || []).forEach(([a, b, kind, lab]) => {
        cols += `<div class="wk-block wk-block--${kind}" style="--i:${i++};top:${y(a)}%;height:${y(b) - y(a)}%"><b>${lab}</b></div>`;
      });
      cols += '</div>';
    });

    let rules = '<div class="wk-rules">';
    for (let h = FROM + 2; h < TO; h += 2) rules += `<span style="top:${y(h)}%"></span>`;
    rules += '</div>';

    weekGrid.innerHTML = `<div class="wk-row wk-row--head">${head}</div>`
      + `<div class="wk-row wk-row--body">${axis}${cols}${rules}</div>`;
    watch(weekGrid.closest('.week'));
  }

  /* ── 6 · de aanhanger ──────────────────────────────────────── */
  const rig = $('.rig');
  if (rig) {
    $$('.rig__draw .ln', rig).forEach((el, i) => {
      const len = Math.ceil(el.getTotalLength());
      el.style.setProperty('--len', len);
      el.style.setProperty('--i', i);
    });
    watch(rig);

    const pins = $('#rigPins');
    const items = $$('#rigLegend li');
    items.forEach((li, i) => {
      const g = svgEl('g', { class: 'pin', tabindex: '0', role: 'button',
        'aria-label': `${i + 1}. ${li.querySelector('b').textContent}` });
      g.append(svgEl('circle', { class: 'pin__hit', cx: li.dataset.x, cy: li.dataset.y, r: 22, fill: 'transparent' }));
      g.append(svgEl('circle', { class: 'pin__dot', cx: li.dataset.x, cy: li.dataset.y, r: 13 }));
      const t = svgEl('text', { x: li.dataset.x, y: Number(li.dataset.y) + 4.5 });
      t.textContent = i + 1;
      g.append(t);
      pins.append(g);

      const on = (state) => { g.classList.toggle('on', state); li.classList.toggle('on', state); };
      const pair = [g, li];
      pair.forEach((node) => {
        node.addEventListener('pointerenter', () => on(true));
        node.addEventListener('pointerleave', () => on(false));
        node.addEventListener('focus', () => on(true));
        node.addEventListener('blur', () => on(false));
      });
    });
  }

  /* ── 7 · investeringsbalken ────────────────────────────────── */
  const budget = $('#budget');
  if (budget) {
    const items = [...budget.children];
    const max = Math.max(...items.map((li) => Number(li.dataset.hi)));
    items.forEach((li) => {
      li.style.setProperty('--lo', (Number(li.dataset.lo) / max) * 100 + '%');
      li.style.setProperty('--hi', (Number(li.dataset.hi) / max) * 100 + '%');
    });
  }

  /* ── 8 · rekenmodel ────────────────────────────────────────── */
  const FIXED = { insurance: 1200, marketing: 800 };
  const PITCH_AT_100 = 1500;      // standplaats- en evenementkosten bij 100 draaidagen
  const INVEST = 20750;           // midden van € 19.500 – € 22.000
  const COGS = 0.35;
  const BASE = { days: 100, units: 80, spend: 4.5 };
  const PB_MAX = 24;              // schaal van de terugverdien-wijzerplaat, in maanden

  const inDays = $('#inDays'), inUnits = $('#inUnits'), inSpend = $('#inSpend');
  if (inDays && inUnits && inSpend) {
    const wf = $('#waterfall'), arc = $('#pbArc');

    const ticks = $('#pbTicks');
    if (ticks) {
      for (let m = 0; m <= PB_MAX; m += 3) {
        const a = (m / PB_MAX) * Math.PI * 2 - Math.PI / 2;
        ticks.append(svgEl('line', {
          class: 'pb__tick',
          x1: Math.cos(a) * 39, y1: Math.sin(a) * 39,
          x2: Math.cos(a) * 34, y2: Math.sin(a) * 34,
        }));
      }
    }

    const track = (el) => el.style.setProperty('--pct',
      ((el.value - el.min) / (el.max - el.min)) * 100 + '%');

    const render = () => {
      const days = +inDays.value, units = +inUnits.value, spend = +inSpend.value;
      const revenue = days * units * spend;
      const cogs = revenue * COGS;
      const pitch = PITCH_AT_100 * (days / BASE.days);
      const profit = revenue - cogs - pitch - FIXED.insurance - FIXED.marketing;

      $('#outDays').textContent = days;
      $('#outUnits').textContent = units;
      $('#outSpend').textContent = '€ ' + spend.toFixed(2).replace('.', ',');
      [inDays, inUnits, inSpend].forEach(track);

      $('#plRevenue').textContent = euro(revenue);
      $('#plCogs').textContent = '− ' + euro(cogs);
      $('#plPitch').textContent = '− ' + euro(pitch);
      $('#plProfit').textContent = euro(profit);

      const months = profit > 0 ? Math.round(INVEST / (profit / 12)) : null;
      $('#plPayback').textContent = months === null
        ? 'niet terugverdiend'
        : `${months} ${months === 1 ? 'maand' : 'maanden'}`;
      if (arc) {
        const p = months === null ? 100 : clamp(months / PB_MAX) * 100;
        arc.setAttribute('stroke-dasharray', `${p} ${100 - p}`);
      }

      // waterval: van omzet naar wat er overblijft
      const scale = Math.max(revenue, 1);
      const h = (v) => clamp(v / scale) * 100;
      let run = revenue;
      const steps = [{ t: 'in', l: 'Omzet', v: revenue, b: 0, h: h(revenue) }];
      [['Inkoop', cogs], ['Standplaats', pitch], ['Verzekering', FIXED.insurance], ['Marketing', FIXED.marketing]]
        .forEach(([l, v]) => {
          run -= v;
          steps.push({ t: 'out', l, v: -v, b: h(Math.max(run, 0)), h: h(v) });
        });
      steps.push({ t: 'sum', l: 'Brutowinst', v: profit, b: 0, h: h(Math.max(profit, 0)) });

      wf.innerHTML = steps.map((s) => `
        <div class="wf__c wf__c--${s.t}">
          <span class="wf__v">${s.v < 0 ? '−' : ''}${nl(Math.abs(s.v))}</span>
          <div class="wf__b" style="bottom:${s.b}%;height:${Math.max(s.h, 0.6)}%"></div>
          <span class="wf__l">${s.l}</span>
        </div>`).join('');
    };

    [inDays, inUnits, inSpend].forEach((el) => el.addEventListener('input', render));
    $('#modelReset').addEventListener('click', () => {
      inDays.value = BASE.days; inUnits.value = BASE.units; inSpend.value = BASE.spend;
      render();
    });
    render();
  }

  /* ── 9 · inhoudsopgave, kopregel en voortgang ──────────────── */
  const chapters = $$('[data-chapter]');
  const topbar = $('#topbar');
  const toc = $('#toc');
  const tocToggle = $('#tocToggle');
  const tocLabel = $('#tocLabel');
  const miniArc = $('#miniArc');
  const hand = $('#dialHand');

  if (toc && tocToggle) {
    $('#tocList').innerHTML = chapters.map((c, i) => `
      <li><a href="#${c.id}" data-for="${c.id}">
        <span>${i === 0 ? '—' : String(i).padStart(2, '0')}</span>
        <span>${c.dataset.chapter}</span>
      </a></li>`).join('');

    const close = () => { toc.classList.remove('open'); tocToggle.setAttribute('aria-expanded', 'false'); };
    tocToggle.addEventListener('click', () => {
      const open = toc.classList.toggle('open');
      tocToggle.setAttribute('aria-expanded', String(open));
    });
    toc.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  let current = '';
  const onScroll = () => {
    const vh = innerHeight;
    const max = Math.max(document.documentElement.scrollHeight - vh, 1);
    const p = clamp(scrollY / max);

    if (miniArc) miniArc.setAttribute('stroke-dasharray', `${p * 100} ${100 - p * 100}`);
    if (hand) hand.setAttribute('transform', `rotate(${p * 360})`);
    topbar.classList.toggle('on', scrollY > vh * 0.65);
    const dark = document.querySelector('.finish')?.getBoundingClientRect();
    topbar.classList.toggle('inv', !!dark && dark.top <= 58 && dark.bottom > 58);

    let active = chapters[0];
    for (const c of chapters) if (c.getBoundingClientRect().top <= vh * 0.35) active = c;
    if (active && active.id !== current) {
      current = active.id;
      if (tocLabel) tocLabel.textContent = active === chapters[0] ? 'Inhoud' : active.dataset.chapter;
      $$('#tocList a').forEach((a) => a.classList.toggle('here', a.dataset.for === current));
    }
  };

  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
})();
