/* ═══════════════════════════════════════════════════════════════
   RunJuice — alles wat je zelf bijhoudt staat in dit ene bestand.

   ▸ VOOR JE LIVE GAAT: vervang alles onder `contact` en alle
     standplaatsen hieronder door je eigen gegevens. De plekken die
     er nu in staan zijn voorbeelden, geen echte standplaatsen.

   ▸ Verhuis je een weekend? Pas `vast` aan of zet een datum in
     `afgelast`. De site rekent zelf uit wat de volgende stop is.
   ═══════════════════════════════════════════════════════════════ */

window.RUNJUICE = {

  /* ── contact ─────────────────────────────────────────────────
     whatsapp: internationaal, alleen cijfers (31 = Nederland).     */
  contact: {
    whatsapp: '31600000000',
    telefoon: '06 00 00 00 00',
    email: 'hallo@runjuice.nl',
    instagram: 'runjuice',
  },

  /* ── vaste standplaatsen ─────────────────────────────────────
     dag: 0 = zondag, 1 = maandag … 6 = zaterdag
     maps: plak hier de deel-link van Google Maps van je plek.      */
  vast: [
    {
      dag: 6, van: '08:00', tot: '12:00',
      plek: 'Het Stadspark',
      detail: 'Hoofdingang bij de kiosk, aan het begin van het rondje',
      maps: 'https://www.google.com/maps/search/?api=1&query=stadspark',
    },
    {
      dag: 0, van: '08:00', tot: '12:00',
      plek: 'Het Stadspark',
      detail: 'Hoofdingang bij de kiosk',
      maps: 'https://www.google.com/maps/search/?api=1&query=stadspark',
    },
    {
      dag: 2, van: '19:30', tot: '21:00',
      plek: 'Loopgroep De Kilometervreters',
      detail: 'Na de clubtraining, bij het clubhuis',
      soort: 'club',
      maps: '',
    },
  ],

  /* ── eenmalig: evenementen en extra dagen ────────────────────
     datum in JJJJ-MM-DD. Verlopen datums verdwijnen vanzelf.       */
  extra: [
    {
      datum: '2026-09-12', van: '09:00', tot: '14:00',
      plek: 'Halve marathon — finishgebied',
      detail: 'Naast de bagage-afgifte',
      soort: 'evenement',
      maps: '',
    },
  ],

  /* ── dagen waarop we er níét staan ───────────────────────────
     Vakantie, storm, ziekte. Zet de datum erin en de site slaat
     die dag over.                                                  */
  afgelast: [],
};
