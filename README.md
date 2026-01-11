# Ókori Küldi – Lili Témázáró Játék (GitHub Pages) – v7

## Mi lett javítva (a te problémáidra)
- A módválasztás (pl. Ókori Róma → Gyakorlás) **azonnal betölti az első kérdést**. Nincs több „csak Kihagyom után indul”.
- Az **OK** gomb *mindig* működik: MCQ / beírás / sorrend.
- Cache-buster van minden fájlon: `?v=20260111200602`.

## Telepítés GitHub Pages-re
1) ZIP kicsomagolás  
2) GitHub repo → Add file → Upload files → **az összes fájlt a repo gyökerébe** (root)  
3) Commit  
4) Settings → Pages → Deploy from branch → main /(root)  
5) Nyisd meg a Pages oldalt → **Ctrl+F5**

## Debug
Ha valamiért mégsem futna, a jobb oldali panel alján megjelenik egy piros hibaüzenet (toast), ami segít megmondani, mi hiányzik.


## v8 javítás
- Javítva: `classList.add('')` hiba (üres CSS class). Most nem dob hibát a válasz kiértékelésénél.
- Cache-buster frissítve: 20260111201323


## v9 hotfix
- Globális védelem: DOMTokenList.add kiszűri az üres class tokeneket, így nem tud elszállni.
- Cache-buster: 20260111201645


## v10
- Javítva: iPhone-on jobb reszponzivitás (sticky gombsor, nagyobb tap-targetek).
- Javítva: `Cannot set properties of undefined (textContent)` hiba.
- Új kategória: **Évszámok** (külön kérdéssor csak dátumokból).
- Cache-buster frissítve: 20260111202610


## v12 (single-file, HTML-parser safe)
A v11-ben a JavaScript-ben volt egy olyan string, ami tartalmazta a `</script>` szöveget (nyomtatás funkció), ezért a böngésző **idő előtt lezárta** a script taget → `Unexpected end of input`.
A v12-ben a beágyazott kód **sanitized** (a `</script>` → `<\/script>`), így nem tud elhasalni.

Telepítéshez elég az `index.html` feltöltése a repo gyökerébe.
Build stamp: 20260111204544
