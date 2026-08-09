/* ═══════════════════════════════════════════════════════════════
   RunJuice — klantensite
   Rekent uit waar we nu of straks staan, en zet de aanvraag voor
   clubs klaar in WhatsApp of e-mail. Verder houdt hij zich stil.
   ═══════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const D = window.RUNJUICE || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const DAGEN = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];

  /* ── merktekens op de kaart ────────────────────────────────── */
  const MARKS = {
    biet: `<path d="M26 15c2-5.5 6.5-8.5 12-8.5-.5 5-4 8.5-8.5 10" fill="none" stroke="var(--tone)" stroke-width="1.8" stroke-linejoin="round"/>
           <path d="M26 15c-2-4.5-6-7-11-6.5 1 4.5 4 7.5 8 8.7" fill="none" stroke="var(--tone)" stroke-width="1.8" stroke-linejoin="round"/>
           <path d="M26 17c9.5 0 15.5 6.5 15.5 14.5 0 8.5-8.5 16.5-15.5 20.5-7-4-15.5-12-15.5-20.5C10.5 23.5 16.5 17 26 17Z" fill="var(--tone)"/>`,
    kokos: `<circle cx="26" cy="28" r="20" fill="var(--tone)"/>
            <circle cx="26" cy="28" r="13" fill="var(--paper)"/>
            <circle cx="26" cy="28" r="13" fill="none" stroke="var(--tone)" stroke-width="1.4"/>
            <path d="M18.5 22a9 9 0 0 1 6-3.5" fill="none" stroke="var(--tone)" stroke-width="1.6" stroke-linecap="round"/>`,
    shot: `<path d="M14 15h22l-3 30a4 4 0 0 1-4 3.6h-8A4 4 0 0 1 17 45Z" fill="none" stroke="var(--tone)" stroke-width="1.8" stroke-linejoin="round"/>
           <path d="M15.6 27h18.8l-2 18a4 4 0 0 1-4 3.6h-6.8a4 4 0 0 1-4-3.6Z" fill="var(--tone)"/>
           <circle cx="37" cy="14" r="8" fill="var(--paper)" stroke="var(--tone)" stroke-width="1.5"/>
           <path d="M37 6v16M29 14h16" stroke="var(--tone)" stroke-width="1.2"/>`,
    reep: `<rect x="6" y="16" width="40" height="22" rx="3" fill="var(--tone)"/>
           <path d="M19.3 16v22M32.6 16v22" stroke="var(--paper)" stroke-width="1.6" stroke-opacity=".75"/>
           <path d="M6 27h40" stroke="var(--paper)" stroke-width="1.6" stroke-opacity=".5"/>`,
  };
  $$('[data-mark]').forEach((el) => {
    el.innerHTML = `<svg viewBox="0 0 52 52" aria-hidden="true">${MARKS[el.dataset.mark] || ''}</svg>`;
  });

  /* ── contactgegevens overal doorzetten ─────────────────────── */
  const c = D.contact || {};
  const waLink = (tekst) =>
    `https://wa.me/${(c.whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent(tekst)}`;

  const setLink = (el, href, label) => {
    if (!el || !href) return;
    el.href = href;
    if (label) el.textContent = label;
  };
  setLink($('#navWhats'), waLink('Hoi RunJuice! '));
  setLink($('#footWhats'), waLink('Hoi RunJuice! '));
  setLink($('#footMail'), c.email ? `mailto:${c.email}` : '', c.email);
  setLink($('#footInsta'), c.instagram ? `https://instagram.com/${c.instagram}` : '', '@' + (c.instagram || ''));
  const yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── standplaatsen uitrekenen ──────────────────────────────── */
  const tijd = (datum, hhmm) => {
    const [h, m] = String(hhmm).split(':').map(Number);
    const d = new Date(datum);
    d.setHours(h, m || 0, 0, 0);
    return d;
  };
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const afgelast = new Set(D.afgelast || []);

  function komende(dagenVooruit = 28) {
    const nu = new Date();
    const uit = [];

    // vaste, wekelijkse plekken
    for (let i = 0; i <= dagenVooruit; i++) {
      const dag = new Date(nu);
      dag.setDate(nu.getDate() + i);
      if (afgelast.has(iso(dag))) continue;
      (D.vast || []).forEach((s) => {
        if (s.dag !== dag.getDay()) return;
        const start = tijd(dag, s.van), eind = tijd(dag, s.tot);
        if (eind < nu) return;                      // vandaag al voorbij
        uit.push({ ...s, start, eind });
      });
    }

    // eenmalige dagen en evenementen
    (D.extra || []).forEach((e) => {
      if (!e.datum || afgelast.has(e.datum)) return;
      const dag = new Date(e.datum + 'T00:00:00');
      if (Number.isNaN(dag.getTime())) return;
      const start = tijd(dag, e.van), eind = tijd(dag, e.tot);
      if (eind < nu) return;
      uit.push({ ...e, start, eind });
    });

    return uit.sort((a, b) => a.start - b.start);
  }

  const dagLabel = (d) => {
    const nu = new Date();
    const dagen = Math.round((new Date(d).setHours(0, 0, 0, 0) - nu.setHours(0, 0, 0, 0)) / 864e5);
    if (dagen === 0) return 'Vandaag';
    if (dagen === 1) return 'Morgen';
    const naam = DAGEN[d.getDay()];
    return naam.charAt(0).toUpperCase() + naam.slice(1);
  };
  const datumKort = (d) => d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
  const klok = (d) => d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

  function aftellen(tot) {
    const ms = tot - new Date();
    if (ms <= 0) return '';
    const min = Math.floor(ms / 6e4), uur = Math.floor(min / 60), dag = Math.floor(uur / 24);
    if (dag >= 1) return `over ${dag} ${dag === 1 ? 'dag' : 'dagen'} en ${uur % 24} uur`;
    if (uur >= 1) return `over ${uur} uur en ${min % 60} min`;
    return `over ${min} ${min === 1 ? 'minuut' : 'minuten'}`;
  }

  /* ── de statuskaart en de mobiele balk ─────────────────────── */
  const statusEl = $('#status');
  const bar = $('#bar');

  function toonStatus() {
    const lijst = komende();
    if (!statusEl) return lijst;
    const eerst = lijst[0];

    if (!eerst) {
      $('#statusLabel').textContent = 'Even geen vaste stop';
      $('#statusWhen').textContent = 'Volg ons op Instagram';
      $('#statusWhere').textContent = 'Daar staat als eerste waar we weer staan.';
      $('#statusCount').textContent = '';
      const btn = $('#statusMaps');
      btn.textContent = 'Naar Instagram';
      btn.href = c.instagram ? `https://instagram.com/${c.instagram}` : '#staan';
      return lijst;
    }

    const nu = new Date();
    const open = eerst.start <= nu && nu < eerst.eind;

    statusEl.classList.toggle('open', open);
    $('#statusLabel').textContent = open ? 'We staan er nu' : 'Volgende stop';
    $('#statusWhen').textContent = open
      ? `Nog tot ${klok(eerst.eind)}`
      : `${dagLabel(eerst.start)} ${klok(eerst.start)}–${klok(eerst.eind)}`;
    $('#statusWhere').textContent = `${eerst.plek}${eerst.detail ? ' — ' + eerst.detail : ''}`;
    $('#statusCount').textContent = open ? 'Kom langs zolang we er staan.' : aftellen(eerst.start);

    const maps = $('#statusMaps');
    if (eerst.maps) { maps.href = eerst.maps; maps.textContent = 'Route in Maps'; maps.target = '_blank'; maps.rel = 'noopener'; }
    else { maps.href = '#staan'; maps.textContent = 'Alle standplaatsen'; maps.removeAttribute('target'); }

    if (bar) {
      $('#barWhen').textContent = open ? `Nu open tot ${klok(eerst.eind)}` : `${dagLabel(eerst.start)} ${klok(eerst.start)}`;
      $('#barWhere').textContent = eerst.plek;
      const bm = $('#barMaps');
      if (eerst.maps) { bm.href = eerst.maps; bm.textContent = 'Route'; bm.target = '_blank'; bm.rel = 'noopener'; }
      else { bm.href = '#staan'; bm.textContent = 'Bekijk'; bm.removeAttribute('target'); }
    }
    return lijst;
  }

  /* ── de lijst met komende standplaatsen ────────────────────── */
  function toonLijst(lijst) {
    const el = $('#stops');
    if (!el) return;
    const nu = new Date();
    const rijen = lijst.slice(0, 6);

    if (!rijen.length) {
      el.innerHTML = '<li><span class="stop__place">Nog geen standplaatsen ingepland.</span></li>';
      return;
    }

    el.innerHTML = rijen.map((s) => {
      const open = s.start <= nu && nu < s.eind;
      const soort = s.soort && s.soort !== 'vast'
        ? `<span class="badge badge--${s.soort}">${s.soort}</span>` : '';
      const nuBadge = open ? '<span class="badge badge--nu">nu open</span>' : '';
      const route = s.maps
        ? `<a href="${s.maps}" target="_blank" rel="noopener">Route →</a>` : '';
      return `<li class="${open ? 'now' : ''}">
        <span class="stop__day">${dagLabel(s.start)}<small>${datumKort(s.start)}</small></span>
        <span class="stop__place">${s.plek}${soort}${nuBadge}<span class="detail">${s.detail || ''}</span></span>
        <span class="stop__time">${klok(s.start)}–${klok(s.eind)}${route}</span>
      </li>`;
    }).join('');
  }

  let lijst = toonStatus();
  toonLijst(lijst);
  setInterval(() => { lijst = toonStatus(); toonLijst(lijst); }, 60000);

  /* ── aanvraag voor clubs en evenementen ────────────────────── */
  const form = $('#bookForm');
  if (form) {
    const leesUit = () => {
      const v = (id) => $('#' + id).value.trim();
      const naam = v('fName'), org = v('fOrg');
      $('#fName').closest('.field').classList.toggle('err', !naam);
      $('#fOrg').closest('.field').classList.toggle('err', !org);
      if (!naam || !org) { $(naam ? '#fOrg' : '#fName').focus(); return null; }

      const datum = v('fDate')
        ? new Date(v('fDate') + 'T00:00:00').toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })
        : 'nog niet vast';
      const regels = [
        'Aanvraag via de site',
        `Naam: ${naam}`,
        `Club of evenement: ${org}`,
        `Datum: ${datum}`,
        `Aantal lopers: ${v('fCount') || 'nog niet bekend'}`,
      ];
      if (v('fMsg')) regels.push(`Waar en hoe laat: ${v('fMsg')}`);
      return regels.join('\n');
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const tekst = leesUit();
      if (tekst) window.open(waLink(tekst), '_blank', 'noopener');
    });

    $('#mailBtn').addEventListener('click', () => {
      const tekst = leesUit();
      if (!tekst) return;
      window.location.href = `mailto:${c.email || ''}`
        + `?subject=${encodeURIComponent('Aanvraag RunJuice')}`
        + `&body=${encodeURIComponent(tekst)}`;
    });
  }

  /* ── kleine dingen bij het scrollen ────────────────────────── */
  const nav = $('#nav');
  const hero = $('.hero');
  let ticking = false;
  const onScroll = () => {
    nav?.classList.toggle('on', scrollY > 8);
    if (bar && hero) bar.classList.toggle('on', scrollY > hero.offsetHeight * 0.6);
  };
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();
})();
