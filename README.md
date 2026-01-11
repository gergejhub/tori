# Ókori Küldi – Lili Témázáró Játék (GitHub Pages)

Ez a csomag egy **backend nélküli** (csak HTML/CSS/JS) webapp, amit fel tudsz tölteni GitHub-ra, és **GitHub Pages**-en futtatni.

## Tartalom
- `index.html` – főoldal
- `style.css` – dizájn
- `data.js` – kérdésbank
- `app.js` – játéklogika
- `README.md` – leírás

## Telepítés GitHub Pages-re (lépésről lépésre)
1. GitHub → **New repository**
   - Név pl.: `okor-kuldi`
2. Repo → **Add file → Upload files**
   - A ZIP-et csomagold ki, és az **összes fájlt** töltsd fel (index.html, style.css, data.js, app.js, README.md)
   - Commit
3. Repo → **Settings → Pages**
   - Source: **Deploy from a branch**
   - Branch: **main** / **(root)**
   - Save
4. A Pages oldalon megjelenik a link (pl. `https://<user>.github.io/okor-kuldi/`)

## Offline futtatás
Nyisd meg az `index.html`-t dupla kattintással.

## Kérdések bővítése
A `data.js` fájlban, a `questions` tömbbe tudsz új kérdéseket felvenni.
Típusok: `mcq`, `input`, `order`.
