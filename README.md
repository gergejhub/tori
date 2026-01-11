# Ókori Küldi – Lili Témázáró Játék (GitHub Pages) – v3

## Mi változott?
- Feleletválasztósnál most már **két lépés van**:
  1) kiválasztod a választ
  2) megnyomod az **OK**-t
  3) elolvasod a magyarázatot
  4) megnyomod a **TOVÁBB**-ot

A „KIHAGYOM” maradt külön gomb.

## Telepítés GitHub Pages-re
1) GitHub → New repository  
2) Add file → Upload files (a ZIP kicsomagolt tartalma)  
3) Settings → Pages → Deploy from branch → main /(root) → Save  
4) Megnyitod a kapott Pages URL-t.

## Fájlok
- index.html
- style.css
- data.js
- app.js
- README.md


## Cache / frissítés (fontos!)
Ha GitHub Pages-en nem látod az új gombokat:
- Nyisd meg a Pages oldalt és nyomj **Ctrl+F5** (hard refresh)
- Vagy a URL végére tegyél egy kérdőjelet pl.: `?v=20260111193629`
- A fájlok most cache-busterrel vannak betöltve: `app.js?v=...`


## v5 javítás – ha eltűnik az OK/TOVÁBB
- A kód most **automatikusan beinjektálja** az OK/TOVÁBB gombot, ha a böngésző régi index.html-t cache-elt.
- A betöltés cache-busterrel történik: `app.js?v=20260111194211`.


## v6
- Az OK/TOVÁBB gomb most *minden kérdéstípusnál* működik (MCQ/Input/Order), és biztonsági event-delegation is van.
