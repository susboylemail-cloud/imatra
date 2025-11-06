# Imatra - Sähköinen jakokirja

Sähköinen jakokirja lehtien jakeluun. Sovellus on suunniteltu käytettäväksi mobiililaitteilla.

## Ominaisuudet

- Pudotusvalikko piirin valintaan (KP1, KP2, KP3, ...)
- Kansilehti näyttää yhteenlasketut tuotemäärät valitulle piirille
- Tilaajatiedot näyttävät kadun nimen, numeron, tilaajan nimen ja tilatun tuotteen
- Mobiilioptimioitu käyttöliittymä

## Käyttö

1. Avaa `index.html` selaimessa
2. Valitse piiri pudotusvalikosta
3. Näet kansilehden yhteenlasketuilla tuotemäärillä
4. Alla näkyy yksityiskohtainen tilaajaluettelo

## Tiedostorakenne

- `index.html` - Pääsivu
- `style.css` - Tyylitiedosto (mobiilioptimioitu)
- `app.js` - Sovelluslogiikka
- `data/` - Piirikohtaiset tilaajatiedot tekstitiedostoina
  - `KP1.txt`
  - `KP2.txt`
  - `KP3.txt`

## Tiedostomuoto

Tilaajatiedot tallennetaan tekstitiedostoihin muodossa:
```
Tuote | Kadun nimi | Numero | Tilaajan nimi
```

Esimerkki:
```
Helsingin Sanomat | Mannerheimintie | 12 | Virtanen Matti
Aamulehti | Kaisaniemenkatu | 7 | Järvinen Pekka
```