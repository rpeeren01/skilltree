# RunJuice — businessplan-website

Eén-pagina website voor het businessplan van **RunJuice**, een mobiele sap- en
herstelbar voor hardlopers (werktitel, versie 0.1 · augustus 2026).

## Het ontwerp

Redactioneel opgezet, als een katern: warm papier, een kantlijn met
hoofdstuknummers die meeloopt tijdens het lezen, en haarlijnen in plaats van
kaders en schaduwen. De beweging is terughoudend — koppen komen regel voor
regel omhoog, balken en lijnen tekenen zichzelf, verder niets.

**Typografie.** Fraunces voor koppen, cijfers en accenten; Instrument Sans voor
lopende tekst en labels. Beide zijn variabele fonts en worden lokaal geladen uit
`assets/fonts/` — geen externe verzoeken, dus ook offline en achter een firewall
identiek.

**Kleur.** Papier `#F7F2E9`, inkt `#191510`, en vier sapkleuren die alleen als
accent worden ingezet: biet `#A81B4A`, citrus `#C96A12`, blad `#2F6B47` en
water `#2C6B86`.

### De onderdelen die iets doen

- **De wijzerplaat** in de opening toont het venster 08:00 – 12:00, de vaste
  standplaatsuren. De wijzer erlangs is tegelijk de leesvoortgang van de pagina;
  in de kopregel staat dezelfde plaat in het klein.
- **De kaart** zet elk product als menuregel neer, met een balk die de geschatte
  brutomarge toont in de eigen kleur van het product.
- **Het weekschema** is een echt rooster: uren verticaal, dagen horizontaal, met
  de vaste blokken en de periodieke clubavonden erin.
- **De aanhanger** is een technische plaat op ruitjespapier die zichzelf tekent.
  De legenda en de genummerde punten lichten elkaar op.
- **Het rekenmodel** bij hoofdstuk 7 stuurt de winst-en-verliesopstelling, de
  waterval en de terugverdien-wijzerplaat live aan.

Alles respecteert `prefers-reduced-motion`, en er is een print-stylesheet: een
businessplan wordt nu eenmaal ook uitgeprint.

## Draaien

Geen build-stap, geen dependencies — platte HTML, CSS en JavaScript. Dubbelklikken
op `index.html` werkt ook; alle bestanden worden relatief geladen.

```bash
cd runjuice
python3 -m http.server 8080
# open http://localhost:8080
```

## Publiceren op Vercel

Deze map is een op zichzelf staand, statisch project. Er staat bewust géén
`package.json` in, zodat Vercel niets probeert te bouwen en de bestanden
rechtstreeks serveert. `vercel.json` regelt alleen de cache- en beveiligingsheaders.

**Via de repository (aanbevolen, want elke push wordt gepubliceerd)**

1. Vercel → *Add New… → Project* → importeer `rpeeren01/skilltree`.
2. Zet **Root Directory** op `runjuice`. Dit is de enige instelling die telt —
   zonder deze stap bouwt Vercel de SkillTree-app uit de repo-root.
3. Framework Preset op *Other*; build- en outputvelden leeg laten. → *Deploy*.

**Via de CLI**

```bash
cd runjuice
vercel            # eerste keer: nieuw project aanmaken
vercel --prod     # publiceren
```

**Via slepen en neerzetten**

Zip de inhoud van deze map (dus `index.html` in de wortel van het zipbestand,
niet een map `runjuice/` eromheen) en sleep het naar
[vercel.com/new](https://vercel.com/new).

Een eigen domein koppel je daarna onder *Project → Settings → Domains*.

## Bestanden

```
runjuice/
  index.html            alle inhoud uit het businessplan
  assets/styles.css     ontwerpsysteem, componenten, print en mobiel
  assets/main.js        wijzerplaat, weekschema, plaat, rekenmodel, inhoudsopgave
  assets/fonts/         Fraunces en Instrument Sans (woff2, lokaal gehost)
  assets/favicon.svg
```

## Cijfers

Alle bedragen komen uit het businessplan (startinvestering € 19.500 – € 22.000,
omzetprognose ≈ € 36.000, brutowinst ≈ € 19.900, terugverdientijd 12 – 18
maanden). Het rekenmodel voegt daar twee expliciete aannames aan toe: de
inkoopkosten blijven 35% van de omzet, en de standplaats- en evenementkosten
schalen mee met het aantal draaidagen (€ 1.500 bij 100 dagen). Verzekering,
onderhoud en marketing staan vast. De terugverdientijd rekent met het midden van
de investeringsrange, € 20.750. Die aannames staan ook op de pagina zelf vermeld.
