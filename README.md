# Ókori Küldi – Lili Témázáró Játék (v15)

## Mit tud ez a verzió?
- Stabil, újraírt motor: a kategóriák mindig megjelennek, a gombok működnek.
- Mobil/iPhone optimalizálás.
- Külön **Évszámok** témakör.
- 3 mód: Gyakorlás, Tanulókártyák, Villámkör (60s).

## Telepítés
1) Töltsd fel a repo gyökerébe (root) az `index.html`-t (felülírva a régit)
2) Commit
3) GitHub Pages → Ctrl+F5

Build: 20260111211556


## v16
- Olvashatóbb szövegek (nagyobb betűméretek, jobb kontraszt).
- Zöld/piros visszajelzés helyes/rossz válasznál.
- Build: 2026-01-11 21:35


## v17 (WOW UI)
- Modern, csillogó glassmorphism stílus, élénk színátmenetek.
- Kifejezetten gyerek-barát (Nunito font), nagy kontraszt, olvasható.
- Helyes válasznál mini „csillagszóró” animáció.


## v20
- v17 stabil alap (témacsempék biztosan megjelennek).
- Több kérdés + Évszámok blokk.
- Kérdés-számláló: Kérdés X/Y (villámkörben X/∞).
- Keverés: kérdések és válaszopciók random sorrendben.
- Villámkör: pontosan 60s visszaszámlálás, cél: minél több helyes 1 perc alatt.
Build: 2026-01-11 22:29


## v21
- Fix: mód gombok biztosan működnek (inline onclick fallback + window.setMode).
- Hibakezelés: indítási hiba toastban.
Build: 2026-01-11 22:43


## v22
- Fix: updateProgress definíció hozzáadva (és védett hívás), így nem akad el indításkor.
Build: 2026-01-11 22:46
