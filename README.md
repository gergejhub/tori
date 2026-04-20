# 🏰 Töri Kvíz – 5. osztályos Történelem

> **Interaktív tanulási alkalmazás 5. osztályos történelem témazáróra**  
> Témakörök: **A Kereszténység** (8–9. lecke) és **A Középkor Világai** (10–13. lecke)

---

## 🎮 Az alkalmazás funkciói

| Funkció | Leírás |
|---|---|
| 🃏 **Kártya mód** | 20 flip-kártya témakörönként – tanuld meg az anyagot! |
| 🎯 **Kvíz mód** | 15 kérdés, 4 válaszlehetőség, 25 másodperces visszaszámláló |
| 🤔 **Igaz/Hamis mód** | 15 állítás – el kell dönteni, hogy igaz-e |
| ⭐ **Pontozás** | Csillagok és pontszámok minden módhoz |
| 📱 **Mobil optimalizált** | Tökéletesen működik telefonon és tableten |

---

## 🖥️ Helyi futtatás (legegyszerűbb!)

**Semmi telepítés nem kell!** Csak kövessed ezeket a lépéseket:

1. Töltsd le a ZIP fájlt
2. Csomagold ki valahova (pl. `Asztal/tortenelem-kviz/`)
3. Nyisd meg az `index.html` fájlt **dupla kattintással**
4. A böngészőben megnyílik az alkalmazás – kész! 🎉

> ✅ **Működik internet nélkül is** (kivéve a betűtípus betöltése, de az opcionális)

---

## 📤 Feltöltés GitHub-ra – lépésről lépésre

### 1. lépés – GitHub fiók létrehozása (ha még nincs)

1. Menj ide: [https://github.com](https://github.com)
2. Kattints a **„Sign up"** gombra
3. Add meg az e-mail címed, hozz létre jelszót
4. Erősítsd meg az e-mail címedet

---

### 2. lépés – Új repository (tároló) létrehozása

1. Bejelentkezés után kattints a jobb felső sarokban lévő **„+"** gombra
2. Válaszd: **„New repository"**
3. Töltsd ki az adatokat:
   - **Repository name:** `tortenelem-kviz`
   - **Description:** `5. osztályos történelem kvíz alkalmazás`
   - Jelöld be: **✅ Public** (hogy bárki megnézhesse)
   - Jelöld be: **✅ Add a README file**
4. Kattints: **„Create repository"**

---

### 3. lépés – Fájlok feltöltése

1. Az újonnan létrehozott repository oldalán kattints az **„Add file"** gombra
2. Válaszd: **„Upload files"**
3. Húzd be az `index.html` fájlt a böngésző ablakba (vagy kattints: „choose your files")
4. Az oldal alján írj egy rövid megjegyzést a **„Commit changes"** mezőbe:
   - Pl.: `Töri kvíz alkalmazás hozzáadva`
5. Kattints: **„Commit changes"** (zöld gomb)

---

### 4. lépés – GitHub Pages bekapcsolása (hogy telefonról is elérhető legyen!)

Ez a legfontosabb lépés – így bárki elérheti a linken keresztül!

1. A repository oldalán kattints a **„Settings"** fülre (fogaskerék ikon)
2. Bal oldali menüben kattints: **„Pages"**
3. A **„Branch"** legördülőmenüből válaszd: **`main`**
4. A mappa mezőben hagyd: **`/ (root)`**
5. Kattints: **„Save"**
6. Várj **1-2 percet**, majd frissítsd az oldalt
7. Az oldal tetején megjelenik a link:  
   `Your site is live at https://FELHASZNÁLÓNÉV.github.io/tortenelem-kviz/`

---

### 5. lépés – Megnyitás telefonon

1. Küldd el a linket SMS-ben vagy e-mailben a lányodnak:  
   `https://FELHASZNÁLÓNÉV.github.io/tortenelem-kviz/`
2. Telefonon megnyitva: a böngésző „Kezdőképernyőhöz adás" gombra koppintva  
   az alkalmazás **ikon formájában** jelenik meg a telefon főképernyőjén! 📱

---

## 📚 Tananyag összefoglalója

### ✝️ A Kereszténység (III. fejezet)

**Lecke 8–9 főbb témái:**
- Jézus Krisztus élete: Betlehem (születés) → Názáret (nevelkedés) → Jeruzsálem (halál)
- Az apostolok (12 tanítvány), az evangéliumok, a Biblia felépítése
- Pál apostol (Saul) megtérése a damaszkuszi úton
- Keresztényüldözések (Néró) – mártírok/vértanúk
- Milánói ediktum (313) – Nagy Konstantin – szabad vallásgyakorlat
- Theodosius: kereszténység = államvallás
- Az egyházszakadás (1054): **Katolikus** (Róma, pápa) vs **Ortodox** (Konstantinápoly, pátriárka)
- Szerzetesség – Benedek-rend – **„Ora et labora"** = Imádkozz és dolgozz!

### 🏰 A Középkor Világai (IV. fejezet)

**Lecke 10–13 főbb témái:**
- Hűbéri rend (feudalizmus): hűbérúr ↔ hűbéres (föld ↔ katonai szolgálat)
- Uradalom, jobbágy, robot (ingyenmunka), dézsma (termés 1/10-e az egyháznak)
- Három nyomásos gazdálkodás: őszi gabona / tavaszi gabona / ugar (pihenő)
- Lovagok: páncél, ló, lovagi erények (bátorság, hűség, becsület, vallásosság)
- Kolostorok – szerzetesek (imádkozás, tanítás, betegápolás, könyvmásolás)
- Egyházi hierarchia: Pápa → érsek → püspök → plébános
- Román stílus (vastag falak, kis ablakok) vs Gótikus stílus (csúcsos ívek, nagy ablakok)
- Középkori városok, céhek (mester → legény → inas), kiváltságlevelek
- Nagy Károly (frank király, császárrá koronázva 800-ban)
- Bizánci Birodalom (Keletrómai örökös, fővárosa Konstantinápoly)

---

## 🛠️ Technikai részletek

```
tortenelem-kviz/
└── index.html    ← Egyetlen fájl, minden benne van!
```

- **Technológia:** HTML5, CSS3, Vanilla JavaScript (keretrendszer nélkül!)
- **Függőségek:** Csak Google Fonts (internet szükséges a betűtípushoz, de nélküle is működik)
- **Kompatibilitás:** Chrome, Firefox, Safari, Edge – mobil és asztali
- **Méret:** ~60 KB (rendkívül gyors betöltés)

---

## ✏️ Testreszabás

Ha módosítani szeretnéd a kérdéseket, nyisd meg az `index.html`-t egy szövegszerkesztővel (pl. Notepad++, VS Code), és keresd meg a `const DATA = {` részt. Ott szerkesztheted a kártyákat és kérdéseket.

---

## 📝 Licenc

Szabad felhasználású oktatási célokra. Készítette: Claude (Anthropic) — 2026.

---

*„Repetitio est mater studiorum" – Ismétlés a tudás anyja!* 📚
