# RunJuice — website

De klantensite van RunJuice, een mobiele sap- en herstelbar voor hardlopers.
Bedoeld om klanten te trekken en de zaak te runnen, niet om het businessplan
te presenteren.

## Waar de site op gebouwd is

Een hardloper die deze site opent heeft één vraag: **sta je er, en waar?**
Dat antwoord staat daarom bovenaan, op mobiel nog vóór de merknaam. De rest van
de pagina beantwoordt in volgorde: wat kost het, wanneer sta je er nog meer,
en kun je naar ons toe komen.

1. **Status** — "we staan er nu, nog tot 12:00" of "volgende stop: zaterdag
   08:00", met een knop naar Google Maps. Wordt live berekend.
2. **Waar we staan** — de eerstvolgende zes momenten, inclusief clubavonden
   en evenementen.
3. **De kaart** — acht producten met prijs, ingrediënten en waar ze goed voor zijn.
4. **Spaarkaart** — tien stempels, de tiende gratis.
5. **Voor clubs** — het tweede verdienmodel: een aanvraagformulier dat het
   bericht klaarzet in WhatsApp of e-mail.
6. **Praktisch** — pinnen, allergenen, wachttijd, slecht weer.

Onderaan het scherm zit op mobiel een vaste balk met de volgende stop, zodat
die nooit meer dan één tik weg is.

## Voordat je live gaat

Alles wat je moet invullen staat in **`assets/data.js`**. De standplaatsen die
er nu in staan zijn voorbeelden — "Het Stadspark", "Loopgroep De Kilometervreters" —
en moeten weg voordat je de site deelt.

- [ ] `contact.whatsapp` — je eigen nummer, internationaal en zonder spaties (`316…`)
- [ ] `contact.email` en `contact.instagram`
- [ ] `vast` — je echte standplaatsen: dag, tijden, plek en de deel-link uit Google Maps
- [ ] `extra` — evenementen waar je staat
- [ ] Prijzen en producten in `index.html`, onder `<!-- ▸ prijzen aanpassen? -->`
- [ ] De teksten bij **Praktisch**: kloppen pinnen, allergenen en wachttijd?

Daarna, in de loop van het jaar: verhuis je een weekend, dan pas je `vast` aan.
Val je een dag uit door storm of vakantie, zet dan die datum in `afgelast` —
de site slaat hem over en toont vanzelf de eerstvolgende stop.

## Draaien

Geen build-stap, geen dependencies. Dubbelklikken op `index.html` werkt.

```bash
cd runjuice
python3 -m http.server 8080
# open http://localhost:8080
```

## Publiceren op Vercel

Deze map is een op zichzelf staand, statisch project. Er staat bewust géén
`package.json` in, zodat Vercel niets probeert te bouwen.

**Via de repository** (elke push gaat automatisch live)
1. Vercel → *Add New… → Project* → importeer de repository.
2. Zet **Root Directory** op `runjuice`. Zonder deze stap bouwt Vercel de
   verkeerde app uit de repo-root.
3. Framework Preset op *Other*, build- en outputvelden leeg. → *Deploy*.

**Via de CLI**

```bash
cd runjuice
vercel --prod
```

Een eigen domein koppel je onder *Project → Settings → Domains*.

## Het formulier

Het aanvraagformulier voor clubs heeft geen server nodig: het zet je bericht
klaar in WhatsApp of in je mailprogramma, de afzender drukt zelf op verzenden.
Dat werkt en het kost niets. Wil je later wél binnenkomende aanvragen in je
mailbox zonder tussenstap, dan is de kleinste stap een gratis formulierdienst
(Formspree, Basin): je zet dan `action="https://…"` en `method="post"` op het
`<form id="bookForm">` en haalt de twee knop-handlers uit `assets/app.js`.

## Het businessplan

De vorige versie van de site — het volledige businessplan met investering,
marges en prognose — staat nog in `plan/` en is bereikbaar op `/plan`. Handig om
naar een bank of verhuurder te sturen. **Let op:** die pagina is voor iedereen
zichtbaar die het adres kent, inclusief je marges. Wil je dat niet, verwijder
dan de map `plan/` voordat je publiceert; hij blijft in de git-geschiedenis staan.

## Bestanden

```
runjuice/
  index.html          de site — teksten en prijzen staan er gewoon in
  assets/data.js      ▸ standplaatsen, contactgegevens: dit houd jij bij
  assets/app.js       rekent de eerstvolgende stop uit, zet de aanvraag klaar
  assets/site.css     vormgeving
  assets/fonts/       Fraunces en Instrument Sans, lokaal gehost
  plan/               het businessplan als aparte pagina
  vercel.json         cache- en beveiligingsheaders
```
