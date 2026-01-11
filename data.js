// Ókori Küldi – kérdésbank (bővíthető)
window.OKOR_DATA = {
  chapters: [
    { id: "egyiptom", title: "Ókori Egyiptom", short: "Nílus + fáraó + piramis", icon: "🧱" },
    { id: "hellasz", title: "Ókori Hellász", short: "polisz + Athén/Spárta", icon: "🏛️" },
    { id: "roma", title: "Ókori Róma", short: "köztársaság + provincia", icon: "🛡️" },
    { id: "had", title: "Hadviselés", short: "falanx + légió + Hannibál", icon: "⚔️" },
    { id: "nepvand", title: "Népvándorlás", short: "395 / 451 / 476", icon: "🐎" },    { id: "evszamok", title: "Évszámok", short: "csak dátumok, gyorsan", icon: "📅" },
    { id: "mix", title: "Összefoglaló MIX", short: "mindenből egy kicsi", icon: "🎛️" }
  ],

  npcs: [
    { name:"Professzor Pörkölő", face:"🧠", lines:[
      "Üdv az Időgépben! Ma tanulunk… de úgy, hogy közben nem vesszük észre.",
      "A történelem nem unalmas. Csak néha álruhában van.",
      "Ha jól válaszolsz, a kréta tapsol. (Képzeletben.)"
    ]},
    { name:"Kőműves Kheopsz", face:"🧱", lines:[
      "Ha 2 300 000 kőtömb ment, akkor 10 kérdés is menni fog.",
      "Piramis: hegyes. Kérdés: néha az is.",
      "Az áradás jön, az iszap marad. A tudás is."
    ]},
    { name:"Spártai Szigor", face:"🥊", lines:[
      "Spártában nincs 'ma nincs kedvem'. Itt van, de csak 5 percig.",
      "Edzés: kérdés → válasz → dicséret. Néha.",
      "A fegyelem erő. A jó válasz még jobb."
    ]},
    { name:"Légiós Laci", face:"🛡️", lines:[
      "A légiós viszi a málháját. Te csak a jó választ vidd el.",
      "Provincia = tartomány. Ennyi. Menetelünk tovább.",
      "Fegyelem + szervezettség = római életérzés."
    ]},
    { name:"Hun Huba", face:"🐎", lines:[
      "395, 451, 476 – ha ezt tudod, nyeregbe!",
      "Ha eltévedsz az idővonalon, visszafordítom az Időgépet.",
      "Attila nem kérdezett. Mi kérdezünk – viccesen."
    ]}
  ],

  // type: mcq | input | order
  questions: [
    // Egyiptom
    { id:"E1", chapter:"egyiptom", type:"mcq",
      prompt:"Miért volt életmentő a Nílus áradása?",
      options:["Havat hozott","Vizet és termékeny iszapot hozott","Elvitte a piramisokat","Kékre festette az eget"],
      correct:1,
      explain:"Az áradás vízzel és iszappal tette termékennyé a földeket.",
      joke:"A sivatagban az eső ritka, mint a 'ma még gyorsan mindent megtanulok' mondat."
    },
    { id:"E2", chapter:"egyiptom", type:"input",
      prompt:"Hogy hívjuk, amikor a földeket szervezetten vízzel látják el (eső helyett)?",
      answers:["öntözéses földművelés","ontozeses foldmuveles","öntözés","ontozes"],
      explain:"Öntözéses földművelés: csatornákkal, tárolókkal juttatnak vizet a földekre.",
      joke:"Nílus: a világ legrégebbi 'öntöző-alkalmazása'."
    },
    { id:"E3", chapter:"egyiptom", type:"mcq",
      prompt:"Ki volt a legfőbb uralkodó Egyiptomban?",
      options:["Szenátor","Fáraó","Polisz-bíró","Gladiátor főnök"],
      correct:1,
      explain:"A fáraó volt az uralkodó; halála után istenként is tisztelték.",
      joke:"A fáraó: HR-ben 'isteni juttatások'."
    },
    { id:"E4", chapter:"egyiptom", type:"mcq",
      prompt:"Mire szolgált a piramis?",
      options:["Edzőterem","Fáraók sírja","Tornádó-elhárító","Óriási homokozó"],
      correct:1,
      explain:"A piramisok hatalmas sírépítmények voltak.",
      joke:"Edzőteremnek is jó lenne, de a belépő meredek."
    },
    { id:"E5", chapter:"egyiptom", type:"mcq",
      prompt:"Mi a hieroglifa?",
      options:["Képszerű írásjel","Egyiptomi süti","Római kard","Spártai edzésterv"],
      correct:0,
      explain:"Képszerű írásjelek.",
      joke:"Hieroglifa: 'rajzolt betű', néha olyan, mint a matek."
    },
    { id:"E6", chapter:"egyiptom", type:"order",
      prompt:"Rendezd sorba: Nílus → termés (egyszerűsítve)!",
      items:["Áradás jön","Iszap a földeken","Öntözés/csatornák","Vetnek és aratnak"],
      correctOrder:[0,1,2,3],
      explain:"Áradás → iszap → öntözés → termés.",
      joke:"Nílus futár: 'csomag kézbesítve: víz + iszap'."
    },
    { id:"E7", chapter:"egyiptom", type:"mcq",
      prompt:"Kr. e. 3000 körül mi történt (nagyságrendileg)?",
      options:["Róma bukott","Egyiptom egyesítése","Marathón","Konstantinápoly alapítása"],
      correct:1,
      explain:"Kr. e. 3000 körül: Egyiptom egyesítése.",
      joke:"Kr. e. 3000: amikor a wifi helyett a Nílus jelzett."
    },

    // Hellász
    { id:"H1", chapter:"hellasz", type:"input",
      prompt:"Mi a görög városállam neve? (1 szó)",
      answers:["polisz","polis"],
      explain:"Polisz = görög városállam.",
      joke:"Polisz: nem rendőr, hanem városállam."
    },
    { id:"H2", chapter:"hellasz", type:"mcq",
      prompt:"Miért alakult ki sok polisz Hellászban?",
      options:["Mert mindenki utálta a várost","Tagolt földrajz (hegyek, szigetek) miatt","A piramisok költöztek","A hunok kérték"],
      correct:1,
      explain:"A hegyek és szigetek miatt elkülönültek a közösségek.",
      joke:"A hegy: természetes 'ne szomszédolj túl sokat' kerítés."
    },
    { id:"H3", chapter:"hellasz", type:"mcq",
      prompt:"Melyik igaz Spártára?",
      options:["Népgyűlés és vita","Katonás fegyelem és nevelés","Piramisépítés","Hun lovasság"],
      correct:1,
      explain:"Spárta katonás rend és fegyelmezett nevelés.",
      joke:"Spárta: reggeli jóga helyett harci alakzat."
    },
    { id:"H4", chapter:"hellasz", type:"mcq",
      prompt:"Mi a demokrácia lényege (athéni példa)?",
      options:["A polgárok részt vesznek a döntésekben","Csak király dönt","Mindenki hallgat","A fáraó dönt"],
      correct:0,
      explain:"A polgárok részt vehettek a döntéshozatalban.",
      joke:"Athén: a vita néha hosszabb volt, mint egy nagybevásárlás."
    },

    // Róma
    { id:"R1", chapter:"roma", type:"mcq",
      prompt:"Mit jelent: köztársaság?",
      options:["Király uralkodik","Választott vezetők irányítanak","Fáraó irányít","Polisz irányít"],
      correct:1,
      explain:"Köztársaságban nincs király; választott vezetők irányítanak.",
      joke:"Köztársaság: a főnök is lecserélhető (elvileg)."
    },
    { id:"R2", chapter:"roma", type:"input",
      prompt:"Hogy hívták a római köztársaság vezetőit? (többes)",
      answers:["konzulok","konzul"],
      explain:"Konzulok = vezető tisztségviselők.",
      joke:"Konzul: nem konzol, de mindkettőhöz kell fegyelem."
    },
    { id:"R3", chapter:"roma", type:"input",
      prompt:"Mi a provincia? (1 szó is elég)",
      answers:["tartomány","tartomany","provincia"],
      explain:"Provincia = római tartomány.",
      joke:"Provincia: a római 'kihelyezett telephely'."
    },
    { id:"R4", chapter:"roma", type:"mcq",
      prompt:"Miért voltak fontosak a római utak?",
      options:["Puhák voltak","Gyors mozgás (hadsereg, kereskedelem, hírek)","A hunok építették","Ott voltak a piramisok"],
      correct:1,
      explain:"Az utak összekötötték a birodalmat.",
      joke:"Római út: Google Maps ókori verzió, hangosabb szandálban."
    },

    // Hadviselés
    { id:"HV1", chapter:"had", type:"mcq",
      prompt:"Kr. e. 490 – melyik csata?",
      options:["Catalaunum","Marathón","476","Kr. e. 3000"],
      correct:1,
      explain:"Kr. e. 490: marathóni csata.",
      joke:"Marathón: amikor a 'futás' történelmi lett."
    },
    { id:"HV2", chapter:"had", type:"mcq",
      prompt:"Mi a falanx?",
      options:["Zárt gyalogos alakzat pajzsokkal","Római adó","Egyiptomi írás","Hun nyereg"],
      correct:0,
      explain:"Falanx: zárt gyalogos harci rend pajzsfallal.",
      joke:"Falanx: 'ne lógj ki a sorból' – eredetiben."
    },
    { id:"HV3", chapter:"had", type:"input",
      prompt:"Mi a római hadsereg alapegysége?",
      answers:["légió","legio","legió "],
      explain:"Légió = a római hadsereg alapegysége.",
      joke:"Légió: a csapatmunka nem csak csoportmunkán létezik."
    },
    { id:"HV4", chapter:"had", type:"mcq",
      prompt:"Ki volt Hannibál?",
      options:["Római konzul","Karthágói hadvezér","Görög isten","Egyiptomi fáraó"],
      correct:1,
      explain:"Hannibál karthágói hadvezér; híres az Alpokon való átkelésről.",
      joke:"Hannibál: 'térkép? minek!'"
    },

    // Népvándorlás
    { id:"NV1", chapter:"nepvand", type:"mcq",
      prompt:"Kr. u. 395 – mi történt?",
      options:["Róma kettéosztása","Marathón","Egyiptom egyesítése","Attila halála"],
      correct:0,
      explain:"395: a Római Birodalom kettéosztása.",
      joke:"395: kettéosztották – mint a csokit, csak kevésbé finoman."
    },
    { id:"NV2", chapter:"nepvand", type:"mcq",
      prompt:"Kr. u. 476 – mihez kötjük?",
      options:["Nyugatrómai Birodalom bukása","Hunok érkezése","Olümpia","Kheopsz piramisa"],
      correct:0,
      explain:"476: a Nyugatrómai Birodalom bukása.",
      joke:"476: a nyugati rész kilépett a chatből."
    },
    { id:"NV3", chapter:"nepvand", type:"order",
      prompt:"Rendezd időrendbe: 395, 451, 453, 476!",
      items:["395","451","453","476"],
      correctOrder:[0,1,2,3],
      explain:"395 → 451 → 453 → 476.",
      joke:"Ha ezt tudod, az Időgép felvesz pilótának is. Majdnem."
    },

    // Mix
    { id:"M1", chapter:"mix", type:"mcq",
      prompt:"Melyik páros illik össze?",
      options:["Polisz – görög városállam","Fáraó – légió","Hieroglifa – római út","Provincia – spártai edzés"],
      correct:0,
      explain:"Polisz = görög városállam.",
      joke:"A Professzor szerint ez 'alap beállítás'."
    }

  // Évszámok – külön kérdéssor
    { id: "evsz_395", chapter: "evszamok", type: "mcq", prompt: "Mit jelent a 395-ös év a Római Birodalomban?",
      options: ["A piramisok befejezése", "A birodalom kettéosztása (kelet–nyugat)", "Hannibál átkelt az Alpokon", "Athén megalapítása"], correct: 1,
      explain: "395-ben a Római Birodalom végleg két részre szakadt: Kelet- és Nyugatrómai Birodalomra.", joke: "395: két rész, mint a csoki, csak kevésbé finom." },
    { id: "evsz_451", chapter: "evszamok", type: "mcq", prompt: "Mi történt 451-ben?",
      options: ["A Nyugatrómai Birodalom bukása", "A hunok megállítása a catalaunumi csatában", "Róma alapítása", "Az első olimpia"], correct: 1,
      explain: "451-ben a catalaunumi csatában Attila hunjai megállításra kerültek.", joke: "451: Attila megáll… legalább egyszer." },
    { id: "evsz_476", chapter: "evszamok", type: "mcq", prompt: "Mit jelöl a 476-os év?",
      options: ["A Nyugatrómai Birodalom bukása", "A Nílus első áradása", "Spárta győzelme Athén felett", "Julius Caesar születése"], correct: 0,
      explain: "476-ban bukott meg a Nyugatrómai Birodalom (hagyományos dátum).", joke: "476: a 'nyugati rész' lekapcsolva." },
    { id: "evsz_753", chapter: "evszamok", type: "mcq", prompt: "A hagyomány szerint mikor alapították Rómát?",
      options: ["776", "753", "395", "476"], correct: 1,
      explain: "A hagyomány szerint Róma alapítása Kr. e. 753.", joke: "753: Róma születésnapja. Tortát nem ígérünk." },
    { id: "evsz_44bc", chapter: "evszamok", type: "mcq", prompt: "Mihez kapcsolódik Kr. e. 44?",
      options: ["Julius Caesar meggyilkolása", "Augustus császár halála", "A piramisok építésének kezdete", "A trójai háború"], correct: 0,
      explain: "Kr. e. 44-ben meggyilkolták Julius Caesart.", joke: "Kr. e. 44: Caesar – nagy ötlet volt? Hát…" },
    { id: "evsz_27bc", chapter: "evszamok", type: "mcq", prompt: "Mihez köthető Kr. e. 27?",
      options: ["A köztársaság kezdete", "Augustus egyeduralmának kezdete (császárkor)", "A spártai nevelés vége", "A Nílus kiszáradása"], correct: 1,
      explain: "Kr. e. 27-től számítjuk Augustus egyeduralmát, a császárkor kezdetét.", joke: "Kr. e. 27: Augustus beül a főnöki székbe." },
    { id: "evsz_490", chapter: "evszamok", type: "mcq", prompt: "Kr. e. 490 – melyik csata?",
      options: ["Thermopülai", "Marathón", "Cannae", "Záma"], correct: 1,
      explain: "Kr. e. 490: a marathóni csata (perzsák ellen).", joke: "490: Marathón – innen a maraton szó is ismerős." },
    { id: "evsz_480", chapter: "evszamok", type: "mcq", prompt: "Kr. e. 480 – mi jut róla eszedbe?",
      options: ["Thermopülai csata", "Róma alapítása", "Nyugat-Róma bukása", "Alexandrosz halála"], correct: 0,
      explain: "Kr. e. 480: Thermopülai csata (spártai hősies ellenállás).", joke: "480: 'This is Sparta!' – kb. innen." },
    { id: "evsz_776", chapter: "evszamok", type: "mcq", prompt: "Kr. e. 776 – miért fontos?",
      options: ["Az első olimpiai játékok", "A Nílus szabályozása", "Carthago alapítása", "A hunok Európába érkezése"], correct: 0,
      explain: "Kr. e. 776: az első olimpiai játékok hagyományos dátuma.", joke: "776: olimpia. Akkor még nem volt VAR." },
    { id: "evsz_323bc", chapter: "evszamok", type: "mcq", prompt: "Kr. e. 323 – mi történt?",
      options: ["Alexandrosz (Nagy Sándor) halála", "Julius Caesar születése", "A római utak építése", "A piramisok befejezése"], correct: 0,
      explain: "Kr. e. 323-ban meghalt Alexandrosz, birodalma feldarabolódott.", joke: "323: a birodalom 'szétszedős' módba kapcsol." },
    { id: "evsz_146bc", chapter: "evszamok", type: "mcq", prompt: "Kr. e. 146 – melyik nagy esemény?",
      options: ["Carthago elpusztítása", "Róma alapítása", "A birodalom kettéosztása", "Attila halála"], correct: 0,
      explain: "Kr. e. 146: Carthago elpusztítása (és a római hatalom erősödése).", joke: "146: Carthago… nem nyerte meg." },
    { id: "evsz_313", chapter: "evszamok", type: "mcq", prompt: "313 – mit jelent a kereszténység szempontjából?",
      options: ["A császárváltás éve", "A milánói ediktum (vallásszabadság)", "A hunok megjelenése", "A piramisok építése"], correct: 1,
      explain: "313: a milánói ediktum vallásszabadságot adott a keresztényeknek.", joke: "313: 'Oké, lehet így is hinni.'" },
    { id: "evsz_330", chapter: "evszamok", type: "mcq", prompt: "330 – mi történt?",
      options: ["Konstantinápoly felavatása", "A Nyugatrómai Birodalom bukása", "A trójai faló", "A marathóni csata"], correct: 0,
      explain: "330: Konstantinápoly felavatása, a Kelet központja.", joke: "330: új főváros – új wifi… ja nem." },

  ]
};
