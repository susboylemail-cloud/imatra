# Esimerkki / Example: LEPPÄRINNE 5

## Ennen / Before (Original CSV)

Tilaukset ovat hajallaan eri sivuilla ja aakkosjärjestyksessä:

Orders are scattered across different pages and in alphabetical order:

```
"Sivu 7-8","LEPPÄRINNE","LEPPÄRINNE 5 F 44","livonen Tiina","ES"
"Sivu 7-8","LEPPÄRINNE","LEPPÄRINNE 5 E 40","Rasimus Virpi","ES"
"Sivu 7-8","LEPPÄRINNE","LEPPÄRINNE 5 D 31","Hakulinen Reino","ES, STF"
"Sivu 7-8","LEPPÄRINNE","LEPPÄRINNE 5 D 33","Mikkilä Mirja","HSTS, UV"
"Sivu 7-8","LEPPÄRINNE","LEPPÄRINNE 5 D 34","Ismo Jaatinen","STF"
"Sivu 7-8","LEPPÄRINNE","LEPPÄRINNE 5 C 26","Leppänen Seppo","STF"
"Sivu 9","LEPPÄRINNE","LEPPÄRINNE 5 B 15","Solakuja Hilkka","STF"
"Sivu 9","LEPPÄRINNE","LEPPÄRINNE 5 B 18","Lippojoki Heli","UV"
"Sivu 9","LEPPÄRINNE","LEPPÄRINNE 5 B 21","Ilkka Tiili","STF"
"Sivu 9","LEPPÄRINNE","LEPPÄRINNE 5 B 24","Auvinen Timo","STF"
"Sivu 9","LEPPÄRINNE","LEPPÄRINNE 5 A 4","Virta Matti","UV, STF"
"Sivu 9","LEPPÄRINNE","LEPPÄRINNE 5 A 5","Sihvonen Aura","STF"
"Sivu 9","LEPPÄRINNE","LEPPÄRINNE 5 A 6","Niiranen Hilkka","STF"
"Sivu 9","LEPPÄRINNE","LEPPÄRINNE 5 A 8","Jaakkola Matti","STF"
"Sivu 9","LEPPÄRINNE","LEPPÄRINNE 5 A 9","Kontro Pentti","STF"
"Sivu 9","LEPPÄRINNE","LEPPÄRINNE 5 A 10","Loisa Marja-liisa","STF"
"Sivu 9","LEPPÄRINNE","LEPPÄRINNE 5 A 12","Hallikas Matti","UV, ES, HS"
```

❌ Vaikea nähdä nopeasti mitä rappuja on
❌ Tilaukset ovat sekaisin eri rapuista
❌ Jakaja joutuu etsimään oikeat tilaukset

## Jälkeen / After (Grouped Output)

Tilaukset on ryhmitelty selkeästi rapuittain:

Orders are clearly grouped by stairway:

```
────────────────────────────────────────────────────────────────────────────────
RAKENNUS: LEPPÄRINNE 5
────────────────────────────────────────────────────────────────────────────────

  RAPPU A:
  ----------------------------------------------------------------------------
    LEPPÄRINNE 5 A 4               | Virta Matti               | UV, STF
    LEPPÄRINNE 5 A 5               | Sihvonen Aura             | STF
    LEPPÄRINNE 5 A 6               | Niiranen Hilkka           | STF
    LEPPÄRINNE 5 A 8               | Jaakkola Matti            | STF
    LEPPÄRINNE 5 A 9               | Kontro Pentti             | STF
    LEPPÄRINNE 5 A 10              | Loisa Marja-liisa         | STF
    LEPPÄRINNE 5 A 12              | Hallikas Matti            | UV, ES, HS

  RAPPU B:
  ----------------------------------------------------------------------------
    LEPPÄRINNE 5 B 15              | Solakuja Hilkka           | STF
    LEPPÄRINNE 5 B 18              | Lippojoki Heli            | UV
    LEPPÄRINNE 5 B 21              | Ilkka Tiili               | STF
    LEPPÄRINNE 5 B 24              | Auvinen Timo              | STF

  RAPPU C:
  ----------------------------------------------------------------------------
    LEPPÄRINNE 5 C 26              | Leppänen Seppo            | STF

  RAPPU D:
  ----------------------------------------------------------------------------
    LEPPÄRINNE 5 D 31              | Hakulinen Reino           | ES, STF
    LEPPÄRINNE 5 D 33              | Mikkilä Mirja             | HSTS, UV
    LEPPÄRINNE 5 D 34              | Ismo Jaatinen             | STF

  RAPPU E:
  ----------------------------------------------------------------------------
    LEPPÄRINNE 5 E 40              | Rasimus Virpi             | ES

  RAPPU F:
  ----------------------------------------------------------------------------
    LEPPÄRINNE 5 F 44              | livonen Tiina             | ES
```

✅ Selkeästi näkyy että rakennuksessa on 6 rappua (A-F)
✅ Kaikki saman rapun tilaukset ovat yhdessä
✅ Jakaja näkee heti kuinka monta tilausta kullakin rapulla
✅ Helppo käydä rappu kerrallaan läpi

## Hyödyt / Benefits

1. **Aikasäästö**: Jakaja voi käydä yhden rapun kerrallaan läpi
2. **Vähemmän virheitä**: Pienempi riski unohtaa tilauksia
3. **Parempi organisointi**: Helppo lajitella tilaukset ennen lähtöä
4. **Selkeämpi näkymä**: Näkee heti rakennuksen rakenteen
