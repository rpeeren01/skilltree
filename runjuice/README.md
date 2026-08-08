# RunJuice — businessplan-website

Eén-pagina website voor het businessplan van **RunJuice**, een mobiele sap- en
herstelbar voor hardlopers (werktitel, versie 0.1 · augustus 2026).

## Het idee achter het ontwerp

De pagina is opgezet als een **hardloopronde**, niet als een brochure:

- **De route** — een GPS-achtig pad wordt links naast de tekst getekend terwijl je
  scrollt. Elk hoofdstuk uit het plan is een kilometerpaal die oplicht zodra je hem passeert.
- **Het sporthorloge** — een HUD rechtsboven houdt afstand (0 – 10 km) en tijd bij.
  De klok loopt van 08:00 naar 12:00: precies de uren van de vaste weekendstandplaats.
  Klik op de onderste regel voor de rondelijst met alle hoofdstukken.
- **De zonsopgang** — het licht op de achtergrond komt op naarmate je vordert; het
  slothoofdstuk staat in vol daglicht.
- **De cadans** — pulserende elementen lopen op 180 ms × 2, de standaard-cadans van
  180 stappen per minuut.
- **De glazen** op de menukaart vullen zich tot het niveau van de geschatte brutomarge.
- **De aanhanger** tekent zichzelf als technische zijaanzicht; de zes punten tonen de
  uitrusting aan boord.
- **Het rekenmodel** bij hoofdstuk 7 is interactief: draaidagen, producten per dag en
  gemiddelde besteding sturen de winst-en-verliesopstelling, de waterval en de
  terugverdientijd live aan.

Alles respecteert `prefers-reduced-motion`, en er is een print-stylesheet zodat het
plan ook op papier leesbaar blijft.

## Draaien

Geen build-stap, geen dependencies — het is platte HTML, CSS en JavaScript.

```bash
cd runjuice
python3 -m http.server 8080
# open http://localhost:8080
```

Direct `index.html` openen werkt ook, al laadt `main.js` als module dan niet in
alle browsers; een lokale server is de veiligste route.

## Bestanden

```
runjuice/
  index.html            alle inhoud uit het businessplan
  assets/styles.css     ontwerp, animaties, print- en mobiele varianten
  assets/main.js        route, HUD, tellers, glazen, aanhanger, rekenmodel
  assets/favicon.svg
```

## Cijfers

Alle bedragen komen rechtstreeks uit het businessplan (startinvestering
€ 19.500 – € 22.000, omzetprognose ≈ € 36.000, brutowinst ≈ € 19.900). Het
rekenmodel gebruikt daarnaast twee expliciete aannames: inkoopkosten blijven 35%
van de omzet, en de standplaats-/evenementkosten schalen mee met het aantal
draaidagen (€ 1.500 bij 100 dagen). Verzekering, onderhoud en marketing staan vast.
De terugverdientijd rekent met het midden van de investeringsrange (€ 20.750).
