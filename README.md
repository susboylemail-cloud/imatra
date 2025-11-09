# Imatra - Jakokirjan tilausten ryhmittely

Työkalu postinjakelun tilausten ryhmittelyyn rappukohtaisesti.

Tool for grouping postal distribution orders by stairway.

## Ominaisuudet / Features

- 📦 **Rappukohtainen ryhmittely** - Tilaukset ryhmitellään saman rakennuksen rappujen mukaan (A, B, C, jne.)
- 🏢 **Rakennuskohtainen näkymä** - Kaikki saman rakennuksen tilaukset näkyvät yhdessä
- ✨ **Selkeä erottelu** - Ei-rapulliset osoitteet erotetaan selvästi rapullisista
- 📊 **Yhteenveto** - Näyttää tilausten kokonaismäärän

## Käyttö / Usage

### Peruskomento / Basic Command

```bash
python3 group_by_stairway.py <csv-tiedosto>
```

### Tallenna tulostus tiedostoon / Save Output to File

```bash
python3 group_by_stairway.py kp10.txt > kp10_grouped.txt
```

### Esimerkkituloste / Example Output

```
================================================================================
JAKOKIRJA - RYHMITELTY RAPUITTAIN
(Distribution List - Grouped by Stairway)
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
```

## Testit / Tests

Suorita testit / Run tests:

```bash
python3 test_group_by_stairway.py -v
```

## Dokumentaatio / Documentation

Katso tarkempi dokumentaatio tiedostosta [IMPLEMENTATION.md](IMPLEMENTATION.md).

See detailed documentation in [IMPLEMENTATION.md](IMPLEMENTATION.md).

## Vaatimukset / Requirements

- Python 3.x
- Standardikirjasto / Standard library only (no external dependencies)