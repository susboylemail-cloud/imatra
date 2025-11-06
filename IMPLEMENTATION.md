# Jakokirjan tilausten ryhmittely rappukohtaisesti

## Toteutus / Implementation

Tämä dokumentti kuvaa, miten jakokirjan tilausten rappukohtainen ryhmittely on toteutettu.

This document describes the implementation of stairway-based grouping for distribution lists.

## Ominaisuus / Feature

Jakokirjassa näkyvät samaan rappuun (esim. A, B, C) menevät tilaukset selvästi omissa ryhmissään. Kukin rappu (esim. Mannerheimintie 10 A, Mannerheimintie 10 B jne.) tulee omaksi selkeäksi ryhmäksi jakokirjassa, jotta samaan rappuun menevät tilaukset ovat helposti tarkasteltavissa.

Distribution lists now show orders going to the same stairway (e.g., A, B, C) clearly grouped together. Each stairway (e.g., Mannerheimintie 10 A, Mannerheimintie 10 B, etc.) becomes its own clear group in the distribution list, making orders going to the same stairway easy to review.

## Käyttö / Usage

```bash
python3 group_by_stairway.py <csv-tiedosto>
```

Esimerkki / Example:
```bash
python3 group_by_stairway.py kp10.txt > kp10_grouped.txt
```

## Tekninen toteutus / Technical Implementation

### 1. Osoitteiden jäsentäminen / Address Parsing

Ohjelma tunnistaa osoitteista rappukohtaiset merkinnät seuraavilla säännöillä:

The program identifies stairway markers in addresses using these rules:

- **Rappu-osoite / Stairway address**: `KATU NUMERO KIRJAIN [HUONEISTO]`
  - Esimerkki / Example: "LEPPÄRINNE 5 A 10" → Rakennus "LEPPÄRINNE 5", Rappu "A"
  - Esimerkki / Example: "KUUSIRINNE 4 B" → Rakennus "KUUSIRINNE 4", Rappu "B"

- **Ei-rappu-osoite / Non-stairway address**: `KATU NUMERO [as NUMERO]`
  - Esimerkki / Example: "LEPPÄRINNE 10" → Ei rappua / No stairway
  - Esimerkki / Example: "LEPPÄRINNE 4 as 4" → Ei rappua / No stairway

### 2. Ryhmittely / Grouping

Tilaukset ryhmitellään kahdessa tasossa:

Orders are grouped at two levels:

1. **Rakennustaso / Building level**: Osoitteet, joilla on sama katu ja numero
   - Same street and number
   
2. **Rapputaso / Stairway level**: Saman rakennuksen sisällä rappukirjaimen mukaan
   - Within same building, by stairway letter

### 3. Tulosteen rakenne / Output Structure

```
================================================================================
JAKOKIRJA - RYHMITELTY RAPUITTAIN
================================================================================

────────────────────────────────────────────────────────────────────────────────
RAKENNUS: LEPPÄRINNE 5
────────────────────────────────────────────────────────────────────────────────

  RAPPU A:
  ----------------------------------------------------------------------------
    LEPPÄRINNE 5 A 4               | Virta Matti               | UV, STF
    LEPPÄRINNE 5 A 5               | Sihvonen Aura             | STF
    ...

  RAPPU B:
  ----------------------------------------------------------------------------
    LEPPÄRINNE 5 B 15              | Solakuja Hilkka           | STF
    ...

────────────────────────────────────────────────────────────────────────────────
OSOITE (ei rappuja): LEPPÄRINNE 10
────────────────────────────────────────────────────────────────────────────────
  LEPPÄRINNE 10                  | Tapani Tammela            | ES, STF
```

## Kriteerit täytetty / Criteria Met

✅ **Jakokirjassa tilaukset ryhmitellään rapuittain (A, B, C, jne.)**
   - Tilaukset ryhmitellään ensin rakennuksen ja sitten rapun mukaan
   - Orders are grouped first by building, then by stairway

✅ **Kullekin rapulle oma otsikkoryhmä jakokirjassa**
   - Jokaisella rapulla on selkeä otsikko ("RAPPU A:", "RAPPU B:", jne.)
   - Each stairway has a clear header ("RAPPU A:", "RAPPU B:", etc.)

✅ **Ei-rapulliset osoitteet erotellaan selvästi näistä ryhmistä**
   - Osoitteet ilman rappua näytetään omana kategorianaan "OSOITE (ei rappuja)"
   - Addresses without stairways are shown in their own category "OSOITE (ei rappuja)"

✅ **Dokumentoi toteutustapa lyhyesti**
   - Tämä dokumentti kuvaa toteutuksen
   - This document describes the implementation

## Hyödyt / Benefits

- **Selkeys jakelun aikana / Clarity during delivery**: Samaan rakennukseen ja rappuun menevät tilaukset ovat helposti löydettävissä
- **Tehokkuus / Efficiency**: Jakaja näkee heti kaikki samaan rappuun menevät tilaukset
- **Vähemmän virheitä / Fewer errors**: Vähentää mahdollisuutta unohtaa tilauksia samasta rapusta

## Esimerkkitapaus / Example Case

**Ennen / Before**: Tilaukset listattuna satunnaisessa järjestyksessä
- Orders listed in random order

**Jälkeen / After**: Tilaukset ryhmiteltynä
- Orders grouped

```
RAKENNUS: LEPPÄRINNE 5
  RAPPU A: 7 tilausta
  RAPPU B: 4 tilausta
  RAPPU C: 1 tilaus
  RAPPU D: 3 tilausta
  RAPPU E: 1 tilaus
  RAPPU F: 1 tilaus
```

Jakaja näkee selvästi, että LEPPÄRINNE 5:ssä on 6 eri rappua ja kuinka monta tilausta kullakin rapulla on.

The distributor clearly sees that LEPPÄRINNE 5 has 6 different stairways and how many orders are in each stairway.

## Tekniset yksityiskohdat / Technical Details

- **Kieli / Language**: Python 3
- **Riippuvuudet / Dependencies**: Standardikirjasto (csv, re, sys, collections, typing)
- **Input**: CSV-tiedosto sarakkeineen: Sivu, Katu, Osoite, Nimi, Merkinnät
- **Output**: Muotoiltu tekstitiedosto ryhmiteltynä rapuittain

## Jatkokehitys / Future Development

Mahdollisia parannuksia:

Possible improvements:

1. **PDF-tuki**: Luo suoraan PDF-jakokirja ryhmiteltynä
   - Direct PDF generation
   
2. **Tilausmäärät**: Näytä yhteenveto tilausmääristä per rappu
   - Order count summary per stairway
   
3. **Reittioptimointi**: Ehdota optimaalista järjestystä rapuille
   - Route optimization suggestions

4. **Web-käyttöliittymä**: Helpompi käyttö selaimessa
   - Web interface for easier use
