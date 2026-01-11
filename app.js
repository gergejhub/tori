(function(){
  const $ = (id) => document.getElementById(id);

  const els = {
    chapterTiles: $("chapterTiles"),
    npcFace: $("npcFace"),
    npcName: $("npcName"),
    npcText: $("npcText"),
    btnPractice: $("btnPractice"),
    btnCards: $("btnCards"),
    btnSprint: $("btnSprint"),
    btnExport: $("btnExport"),
    btnBoss: $("btnBoss"),
    btnReset: $("btnReset"),
    modeTag: $("modeTag"),
    chapterTag: $("chapterTag"),
    qtitle: $("qtitle"),
    qmeta: $("qmeta"),
    qprompt: $("qprompt"),
    answers: $("answers"),
    feedback: $("feedback"),
    btnHint: $("btnHint"),
    btnSkip: $("btnSkip"),
    btnNext: document.getElementById("btnNext"),
    inputArea: $("inputArea"),
    textAnswer: $("textAnswer"),
    btnSubmitText: $("btnSubmitText"),
    orderArea: $("orderArea"),
    orderPool: $("orderPool"),
    orderPick: $("orderPick"),
    btnOrderUndo: $("btnOrderUndo"),
    btnOrderCheck: $("btnOrderCheck"),
    progressBar: $("progressBar"),
    progressText: $("progressText"),
    scorePill: $("scorePill"),
    streakPill: $("streakPill"),
    heartsPill: $("heartsPill"),
    summaryBox: $("summaryBox"),
    summaryText: $("summaryText"),
    btnPlayAgain: $("btnPlayAgain"),
    btnBack: $("btnBack"),
    exportBox: $("exportBox"),
    exportText: $("exportText"),
    btnCopyTSV: $("btnCopyTSV"),
    btnPrint: $("btnPrint"),
    btnCloseExport: $("btnCloseExport"),
  };
  // v5 safety: if the HTML was cached and missing the OK/TOVÁBB button, inject it.
  (function ensureNextButton(){
    let btn = document.getElementById("btnNext");
    if(btn) return;
    const footer = document.querySelector(".footerRow");
    if(!footer) return;
    btn = document.createElement("button");
    btn.id = "btnNext";
    btn.className = "btn primary";
    btn.textContent = "OK";
    btn.title = "OK / TOVÁBB";
    footer.appendChild(btn);
  })();

  // v5 refresh reference after potential injection
  els.btnNext = document.getElementById('btnNext');


  const DATA = window.OKOR_DATA;
  if(!DATA){ alert("Hiányzik a data.js"); return; }

  const LS_KEY = "okor_kuldi_state_v2";
  const defaultPersist = { score:0, streak:0, hearts:3, chapterId:"mix", wrongCounts:{}, seenCounts:{} };

  function loadPersist(){
    try{
      const raw = localStorage.getItem(LS_KEY);
      if(!raw) return {...defaultPersist};
      const obj = JSON.parse(raw);
      return {...defaultPersist, ...obj};
    }catch(e){ return {...defaultPersist}; }
  }
  function savePersist(){ localStorage.setItem(LS_KEY, JSON.stringify(persist)); }

  let persist = loadPersist();

  const MODES = { idle:"várakozás", practice:"Gyakorlás", cards:"Tanulókártyák", sprint:"Villámkör", boss:"Főellenség" };

  // phase:
  // - "answer": user is choosing / typing
  // - "review": answer evaluated, show explanation, next button advances
  let session = {
    mode:"idle",
    chapterId:persist.chapterId,
    queue:[],
    index:0,
    correct:0,
    wrong:0,
    startTs:0,
    timeLimitSec:0,
    current:null,
    hintUsed:false,
    phase:"answer",
    selectedIdx:null,     // for mcq
    orderPicked:[],
    orderPickedIdx:[]
  };

  function randInt(n){ return Math.floor(Math.random()*n); }

  function pickNpc(chapterId){
    const map = { egyiptom:[1,0], hellasz:[2,0], roma:[3,0], had:[3,0], nepvand:[4,0], mix:[0,3] };
    const cand = map[chapterId] || [0];
    const npc = DATA.npcs[cand[randInt(cand.length)]];
    const line = npc.lines[randInt(npc.lines.length)];
    els.npcFace.textContent = npc.face;
    els.npcName.textContent = npc.name;
    els.npcText.textContent = line;
  }

  function setTags(){
    els.modeTag.textContent = "Mód: " + MODES[session.mode];
    const ch = DATA.chapters.find(c => c.id === session.chapterId);
    els.chapterTag.textContent = "Téma: " + (ch ? ch.title : "—");
  }

  function normalizeText(s){
    return (s||"").toString().trim().toLowerCase()
      .replaceAll("á","a").replaceAll("é","e").replaceAll("í","i")
      .replaceAll("ó","o").replaceAll("ö","o").replaceAll("ő","o")
      .replaceAll("ú","u").replaceAll("ü","u").replaceAll("ű","u");
  }

  function getQuestionsForChapter(chId){
    if(chId === "mix") return DATA.questions.slice();
    return DATA.questions.filter(q => q.chapter === chId);
  }

  function difficultyWeight(q){
    const wrong = persist.wrongCounts[q.id] || 0;
    const seen = persist.seenCounts[q.id] || 0;
    return 2 + (wrong*2.2) + (seen===0 ? 2.5 : 0) - Math.min(seen,6)*0.15;
  }

  function weightedShuffle(arr){
    const pool = arr.map(q => ({q, w: Math.max(0.6, difficultyWeight(q))}));
    const out = [];
    while(pool.length){
      const total = pool.reduce((s,x)=>s+x.w,0);
      let r = Math.random()*total;
      let idx=0;
      for(; idx<pool.length; idx++){
        r -= pool[idx].w;
        if(r<=0) break;
      }
      if(idx>=pool.length) idx=pool.length-1;
      out.push(pool[idx].q);
      pool.splice(idx,1);
    }
    return out;
  }

  function renderChapterTiles(){
    els.chapterTiles.innerHTML = "";
    DATA.chapters.forEach(ch => {
      const div = document.createElement("div");
      div.className = "tile" + (ch.id === persist.chapterId ? " active" : "");
      div.innerHTML = `<div class="t"><span>${ch.icon}</span> ${ch.title}</div><div class="s">${ch.short}</div>`;
      div.onclick = () => setChapter(ch.id);
      els.chapterTiles.appendChild(div);
    });
    session.chapterId = persist.chapterId;
  }

  function setChapter(chId){
    session.chapterId = chId;
    persist.chapterId = chId;
    savePersist();
    renderChapterTiles();
    pickNpc(chId);
    idleScreen();
  }

  function updatePills(){
    els.scorePill.textContent = persist.score;
    els.streakPill.textContent = persist.streak;
    els.heartsPill.textContent = persist.hearts;
  }

  function updateProgress(){
    if(session.mode === "idle"){
      els.progressBar.style.width = "0%";
      els.progressText.textContent = "Válassz küldetést a bal oldalon.";
      return;
    }
    const total = session.queue.length || 1;
    const done = Math.min(session.index, total);
    const pct = Math.round((done/total)*100);
    els.progressBar.style.width = pct + "%";
    let extra = "";
    if(session.timeLimitSec){
      const elapsed = Math.floor((Date.now()-session.startTs)/1000);
      const left = Math.max(0, session.timeLimitSec - elapsed);
      extra = " | Idő: " + left + "s";
      if(left === 0){ finishRun(true); return; }
    }
    els.progressText.textContent = `Haladás: ${done}/${total}${extra}`;
  }

  function finishRun(timeOut=false){
    session.mode = "idle";
    setTags();
    els.qbox.style.display = "none";
    els.exportBox.style.display = "none";
    els.summaryBox.style.display = "block";

    const total = session.queue.length || 0;
    const elapsed = Math.max(1, Math.floor((Date.now()-session.startTs)/1000));
    const acc = total ? Math.round((session.correct/total)*100) : 0;

    let rank = "Tanonc Írnok";
    if(acc >= 90) rank = "Időgép Kapitány";
    else if(acc >= 75) rank = "Római Stratéga";
    else if(acc >= 60) rank = "Spártai Túlélő";
    else rank = "Kezdő Múmia-Kibontó";

    const msg = [];
    msg.push(`<b>Eredmény:</b> ${session.correct}/${total} jó válasz (${acc}%).`);
    msg.push(`Idő: ${elapsed} mp.`);
    if(timeOut) msg.push(`<b>Lejárt az idő</b> — mint egy légiós menetelés: megállni nem lehet.`);
    msg.push(`<b>Rang:</b> ${rank}.`);
    msg.push(acc < 75
      ? "Tipp: menj még egy kört. Ami egyszer rossz volt, másodszor gyakran jó lesz."
      : "Szép! Ezt a formát hozd a dolgozaton is."
    );
    els.summaryText.innerHTML = msg.join("<br/>");
  }

  function setNextButton(label, enabled){
    els.btnNext.textContent = label;
    els.btnNext.disabled = !enabled;
  }

  function idleScreen(){
    session.mode = "idle";
    session.phase = "answer";
    setTags();
    els.summaryBox.style.display = "none";
    els.exportBox.style.display = "none";
    els.qbox.style.display = "block";

    els.qtitle.textContent = "Készen állsz?";
    els.qmeta.textContent = "—";
    els.qprompt.textContent = "Válassz témát és módot bal oldalon. A Professzor már beélesítette a krétát.";
    els.answers.innerHTML = "";
    els.feedback.style.display = "none";
    els.inputArea.style.display = "none";
    els.orderArea.style.display = "none";
    setNextButton("OK", false);
    updateProgress();
  }

  function showFeedback(ok, extra){
    els.feedback.style.display = "block";
    els.feedback.innerHTML =
      (ok ? `<b style="color: var(--good)">Helyes!</b> ` : `<b style="color: var(--bad)">Nem most… de mindjárt.</b> `)
      + (extra || "");
  }

  function applyOutcome(ok){
    if(ok){
      session.correct++;
      persist.score += session.hintUsed ? 1 : 2;
      persist.streak += 1;
    }else{
      session.wrong++;
      persist.wrongCounts[session.current.id] = (persist.wrongCounts[session.current.id] || 0) + 1;
      persist.streak = 0;
      persist.hearts = Math.max(0, persist.hearts - 1);
    }
    savePersist();
    updatePills();
    if(persist.hearts === 0){
      persist.hearts = 3;
      savePersist();
      updatePills();
      pickNpc(session.chapterId);
    }
  }

  function renderQuestion(q){
    const ch = DATA.chapters.find(c => c.id === q.chapter) || {title:"—"};
    const typeLabel = (q.type==="mcq") ? "Feleletválasztós" : (q.type==="input") ? "Beírás" : "Sorrend";
    els.qtitle.textContent = q.prompt;
    els.qmeta.textContent = `${typeLabel} • ${ch.title}`;
    els.qprompt.textContent = q.joke || "";
    els.feedback.style.display = "none";

    session.phase = "answer";
    session.hintUsed = false;
    session.selectedIdx = null;
    session.orderPicked = [];
    session.orderPickedIdx = [];

    els.answers.innerHTML = "";
    els.inputArea.style.display = "none";
    els.orderArea.style.display = "none";

    // Default: Next acts as OK (submit) but disabled until ready
    if(q.type === "mcq"){
      setNextButton("OK", false);
    }else{
      // For input/order, OK buttons exist inside areas; Next becomes TOVÁBB after evaluation
      setNextButton("TOVÁBB", false);
    }

    if(q.type==="mcq") renderMCQ(q);
    else if(q.type==="input") renderInput(q);
    else if(q.type==="order") renderOrder(q);
  }

  function nextQuestion(){
    const q = session.queue[session.index];
    if(!q){ finishRun(false); return; }
    session.current = q;
    persist.seenCounts[q.id] = (persist.seenCounts[q.id] || 0) + 1;
    savePersist();
    renderQuestion(q);
    updateProgress();
  }

  function startMode(mode){
    session.mode = mode;
    session.index = 0;
    session.correct = 0;
    session.wrong = 0;
    session.startTs = Date.now();
    session.timeLimitSec = (mode==="sprint") ? 120 : (mode==="boss") ? 160 : 0;

    let qs = getQuestionsForChapter(session.chapterId);
    if(mode==="cards") qs = weightedShuffle(qs).slice(0, Math.min(14, qs.length));
    else if(mode==="practice") qs = weightedShuffle(qs).slice(0, Math.min(18, qs.length));
    else if(mode==="sprint") qs = weightedShuffle(qs).slice(0, Math.min(12, qs.length));
    else if(mode==="boss"){
      qs = weightedShuffle(DATA.questions.slice()).slice(0, 10);
      session.chapterId = "mix";
      persist.chapterId = "mix";
      savePersist();
      renderChapterTiles();
    }
    session.queue = qs;
    setTags();
    els.summaryBox.style.display = "none";
    els.exportBox.style.display = "none";
    els.qbox.style.display = "block";
    nextQuestion();
  }

  function lockMCQ(){
    [...els.answers.children].forEach(btn => btn.disabled = true);
  }

  function renderMCQ(q){
    q.options.forEach((opt, idx) => {
      const b = document.createElement("button");
      b.className = "ans";
      b.innerHTML = `<span class="kbd">${String.fromCharCode(65+idx)}</span> ${opt}`;
      b.onclick = () => {
        if(session.phase !== "answer") return;
        session.selectedIdx = idx;
        // highlight selection
        [...els.answers.children].forEach((node, i) => {
          node.classList.toggle("selected", i === idx);
        });
        setNextButton("OK", true);
      };
      els.answers.appendChild(b);
    });
  }

  function renderInput(q){
    els.inputArea.style.display = "flex";
    els.textAnswer.value = "";
    els.textAnswer.focus();
    els.btnSubmitText.disabled = false;

    const submit = () => {
      if(session.phase !== "answer") return;
      const val = normalizeText(els.textAnswer.value);
      const ok = q.answers.map(normalizeText).includes(val);
      showFeedback(ok, q.explain || "");
      applyOutcome(ok);
      session.phase = "review";
      els.btnSubmitText.disabled = true;
      setNextButton("TOVÁBB", true);
    };

    els.btnSubmitText.onclick = submit;
    els.textAnswer.onkeydown = (e) => { if(e.key==="Enter") submit(); };
  }

  function renderOrder(q){
    els.orderArea.style.display = "block";
    els.orderPool.innerHTML = "";
    els.orderPick.textContent = "Választási sorrend: —";

    const items = q.items.map((t, idx) => ({t, idx}));
    for(let i=items.length-1;i>0;i--){
      const j = randInt(i+1);
      [items[i], items[j]] = [items[j], items[i]];
    }

    function updatePick(){
      els.orderPick.textContent = session.orderPicked.length
        ? "Választási sorrend: " + session.orderPicked.join(" → ")
        : "Választási sorrend: —";
    }

    items.forEach(it => {
      const c = document.createElement("button");
      c.className = "chip";
      c.textContent = it.t;
      c.onclick = () => {
        if(session.phase !== "answer") return;
        if(session.orderPickedIdx.includes(it.idx)) return;
        session.orderPickedIdx.push(it.idx);
        session.orderPicked.push(it.t);
        c.classList.add("picked");
        updatePick();
        // enable OK if at least one picked
        els.btnOrderCheck.disabled = (session.orderPickedIdx.length === 0);
      };
      els.orderPool.appendChild(c);
    });

    els.btnOrderUndo.onclick = () => {
      if(session.phase !== "answer") return;
      const lastIdx = session.orderPickedIdx.pop();
      const lastText = session.orderPicked.pop();
      if(lastIdx === undefined) return;
      [...els.orderPool.children].forEach(btn => {
        if(btn.textContent === lastText && btn.classList.contains("picked")) btn.classList.remove("picked");
      });
      updatePick();
      els.btnOrderCheck.disabled = (session.orderPickedIdx.length === 0);
    };

    els.btnOrderCheck.disabled = true;
    els.btnOrderCheck.onclick = () => {
      if(session.phase !== "answer") return;
      const picked = session.orderPickedIdx.slice();
      const ok = picked.length === q.correctOrder.length && picked.every((v,i)=>v===q.correctOrder[i]);
      [...els.orderPool.querySelectorAll("button")].forEach(b => b.disabled = true);
      showFeedback(ok, q.explain || "");
      applyOutcome(ok);
      session.phase = "review";
      els.btnOrderCheck.disabled = true;
      setNextButton("TOVÁBB", true);
    };

    updatePick();
  }

  // Main OK/TOVÁBB button behavior
  els.btnNext.onclick = () => {
    if(session.mode === "idle") return;

    const q = session.current;
    if(!q) return;

    // If reviewing: TOVÁBB
    if(session.phase === "review"){
      session.index++;
      updateProgress();
      nextQuestion();
      return;
    }

    // If answering: for MCQ we evaluate here
    if(q.type === "mcq"){
      if(session.selectedIdx === null) return;
      const ok = session.selectedIdx === q.correct;

      // lock + show correct/wrong coloring
      [...els.answers.children].forEach((node, i) => {
        node.classList.remove("selected");
        node.classList.add(i===q.correct ? "good" : (i===session.selectedIdx ? "bad" : ""));
      });
      lockMCQ();

      showFeedback(ok, q.explain || "");
      applyOutcome(ok);

      session.phase = "review";
      setNextButton("TOVÁBB", true);
      return;
    }

    // For input/order, OK is handled by their own OK buttons; Next should be disabled until review.
  };

  // Buttons
  els.btnPractice.onclick = () => startMode("practice");
  els.btnCards.onclick = () => startMode("cards");
  els.btnSprint.onclick = () => startMode("sprint");
  els.btnBoss.onclick = () => startMode("boss");

  function escapeHtml(s){ return (s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }

  function buildTSV(chapterId){
    const qs = (chapterId==="mix") ? DATA.questions.slice() : DATA.questions.filter(q=>q.chapter===chapterId);
    return qs.map(q => {
      let a = "";
      if(q.type==="mcq") a = q.options[q.correct];
      else if(q.type==="input") a = q.answers[0];
      else if(q.type==="order") a = q.correctOrder.map(i => q.items[i]).join(" → ");
      return q.prompt.replace(/\t|\n/g," ").trim() + "\t" + String(a).replace(/\t|\n/g," ").trim();
    }).join("\n");
  }

  function openExport(){
    els.exportBox.style.display = "block";
    els.summaryBox.style.display = "none";
    els.qbox.style.display = "none";
    els.exportText.value = buildTSV(persist.chapterId);
  }

  els.btnExport.onclick = () => openExport();

  els.btnCopyTSV.onclick = async () => {
    try{
      await navigator.clipboard.writeText(els.exportText.value);
      alert("TSV kimásolva! Anki Import: elválasztó TAB, mezők 2.");
    }catch(e){
      alert("Nem sikerült a vágólap. Jelöld ki és Ctrl+C.");
    }
  };

  els.btnPrint.onclick = () => {
    const rows = els.exportText.value.split(/\n/).map(line => line.split(/\t/));
    const html = `
      <html><head><meta charset="utf-8"/><title>Tanulókártyák</title>
      <style>
        body{font-family:Arial,sans-serif;padding:16px}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .card{border:1px solid #ddd;border-radius:10px;padding:10px;page-break-inside:avoid}
        .q{font-weight:700}.a{margin-top:6px;color:#111}
        .muted{color:#666;font-size:12px;margin:8px 0}
        @media print{.muted{display:none}}
      </style></head><body>
      <h1>Ókori Küldi – Tanulókártyák</h1>
      <div class="muted">Kérdés / válasz – nyomtatás után kivágható.</div>
      <div class="grid">
        ${rows.map(r => `<div class="card"><div class="q">${escapeHtml(r[0]||"")}</div><div class="a">${escapeHtml(r[1]||"")}</div></div>`).join("")}
      </div>
      <script>window.onload=()=>window.print();</script>
      </body></html>`;
    const w = window.open("", "_blank");
    w.document.open(); w.document.write(html); w.document.close();
  };

  els.btnCloseExport.onclick = () => { els.exportBox.style.display = "none"; els.qbox.style.display = "block"; idleScreen(); };

  els.btnReset.onclick = () => {
    if(!confirm("Biztosan nullázod a pontokat és a statisztikát?")) return;
    persist = {...defaultPersist};
    savePersist();
    updatePills();
    renderChapterTiles();
    pickNpc(persist.chapterId);
    idleScreen();
  };

  els.btnPlayAgain.onclick = () => startMode("practice");
  els.btnBack.onclick = () => idleScreen();

  els.btnHint.onclick = () => {
    if(session.mode==="idle" || !session.current || session.phase!=="answer") return;
    session.hintUsed = true;
    const q = session.current;
    let hint = "";
    if(q.type==="mcq"){
      const wrong = q.options.map((_,i)=>i).filter(i=>i!==q.correct);
      const remove = wrong[randInt(wrong.length)];
      hint = `Súgás: a <b>${String.fromCharCode(65+remove)}</b> biztosan nem jó.`;
    }else if(q.type==="input"){
      const ans = (q.answers && q.answers[0]) ? q.answers[0].trim() : "";
      hint = `Súgás: első betű: <b>${ans.charAt(0).toUpperCase()}</b>`;
    }else{
      hint = `Súgás: az első elem: <b>${q.items[q.correctOrder[0]]}</b>`;
    }
    showFeedback(true, hint + "<br/><span class='muted'>Súgással is jár pont, csak kevesebb.</span>");
  };

  els.btnSkip.onclick = () => {
    if(session.mode==="idle") return;
    // skip always advances without scoring
    session.index++;
    updateProgress();
    nextQuestion();
  };

  // Timer tick for sprint/boss
  setInterval(() => { if(session.mode==="sprint" || session.mode==="boss") updateProgress(); }, 250);

  // Init
  renderChapterTiles();
  updatePills();
  pickNpc(persist.chapterId);
  idleScreen();

})();