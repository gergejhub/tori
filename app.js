(function(){
  "use strict";
  // v9 guard: prevent DOMTokenList.add('') runtime crash (some browsers throw on empty tokens)
  try{
    const _add = DOMTokenList.prototype.add;
    DOMTokenList.prototype.add = function(...tokens){
      const safe = tokens.filter(t => typeof t === "string" && t.trim().length > 0);
      if(safe.length === 0) return;
      return _add.apply(this, safe);
    };
  }catch(e){ /* ignore */ }
const $ = (id) => document.getElementById(id);

  const toast = $("toast");
  function showToast(msg){
    if(!toast) return;
    toast.style.display="block";
    toast.textContent = msg;
  }
  window.addEventListener("error", (e) => {
    showToast("Hiba a kódban: " + (e && e.message ? e.message : "ismeretlen") + " (nyomj Ctrl+F5-öt).");
  });

  const DATA = window.OKOR_DATA;
  if(!DATA || !Array.isArray(DATA.questions)){
    showToast("Hiányzik vagy hibás a data.js.");
    return;
  }

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
    btnNext: $("btnNext"),
    inputArea: $("inputArea"),
    textAnswer: $("textAnswer"),
    orderArea: $("orderArea"),
    orderPool: $("orderPool"),
    orderPick: $("orderPick"),
    btnOrderUndo: $("btnOrderUndo"),
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
    qbox: $("qbox"),
  };
  function safeText(el, value){
    if(!el) return;
    el.textContent = value;
  }


  // hard guard for missing critical nodes
  const critical = ["chapterTiles","btnPractice","btnCards","btnSprint","btnNext","btnSkip","answers","qtitle","qmeta","qprompt"];
  for(const k of critical){
    if(!els[k]){
      showToast("Hiányzó UI elem: " + k + ". Töltsd fel újra a fájlokat a repo gyökerébe.");
      return;
    }
  }

  const LS_KEY = "okor_kuldi_state_v7";
  const defaultPersist = { score:0, streak:0, hearts:3, chapterId:"mix", wrongCounts:{}, seenCounts:{} };

  let persist = loadPersist();

  function loadPersist(){
    try{
      const raw = localStorage.getItem(LS_KEY);
      if(!raw) return {...defaultPersist};
      const obj = JSON.parse(raw);
      return {...defaultPersist, ...obj};
    }catch(e){ return {...defaultPersist}; }
  }
  function savePersist(){ localStorage.setItem(LS_KEY, JSON.stringify(persist)); }

  const MODES = { idle:"várakozás", practice:"Gyakorlás", cards:"Tanulókártyák", sprint:"Villámkör", boss:"Főellenség" };

  const session = {
    mode:"idle",
    phase:"idle", // "answer" | "review"
    chapterId: persist.chapterId,
    queue: [],
    index: 0,
    correct: 0,
    wrong: 0,
    timeLimitSec: 0,
    startTs: 0,
    current: null,
    hintUsed: false,
    selectedIdx: null,
    orderPickedIdx: [],
    orderPickedText: []
  };

  function randInt(n){ return Math.floor(Math.random()*n); }

  function pickNpc(chapterId){
    const map = { egyiptom:[1,0], hellasz:[2,0], roma:[3,0], had:[3,0], nepvand:[4,0], mix:[0,3] };
    const cand = map[chapterId] || [0];
    const npc = DATA.npcs && DATA.npcs.length ? DATA.npcs[cand[randInt(cand.length)] % DATA.npcs.length] : null;
    if(!npc) return;
    const line = npc.lines[randInt(npc.lines.length)];
    if(els.npcFace) els.npcFace.textContent = npc.face;
    if(els.npcName) els.npcName.textContent = npc.name;
    if(els.npcText) els.npcText.textContent = line;
  }

  function setTags(){
    els.modeTag.textContent = "Mód: " + MODES[session.mode];
    const ch = (DATA.chapters || []).find(c => c.id === session.chapterId);
    els.chapterTag.textContent = "Téma: " + (ch ? ch.title : "—");
  }

  function updatePills(){
    if(els.scorePill) els.scorePill.textContent = persist.score;
    if(els.streakPill) els.streakPill.textContent = persist.streak;
    if(els.heartsPill) els.heartsPill.textContent = persist.hearts;
  }

  function normalizeText(s){
    return (s||"").toString().trim().toLowerCase()
      .replaceAll("á","a").replaceAll("é","e").replaceAll("í","i")
      .replaceAll("ó","o").replaceAll("ö","o").replaceAll("ő","o")
      .replaceAll("ú","u").replaceAll("ü","u").replaceAll("ű","u");
  }

  function difficultyWeight(q){
    const wrong = persist.wrongCounts[q.id] || 0;
    const seen = persist.seenCounts[q.id] || 0;
    return 2 + wrong*2.2 + (seen===0 ? 2.5 : 0) - Math.min(seen,6)*0.15;
  }

  function weightedPick(arr){
    const pool = arr.map(q => ({q, w: Math.max(0.6, difficultyWeight(q))}));
    const total = pool.reduce((s,x)=>s+x.w,0);
    let r = Math.random()*total;
    for(const it of pool){
      r -= it.w;
      if(r<=0) return it.q;
    }
    return pool.length ? pool[pool.length-1].q : null;
  }

  function buildQueue(mode, chapterId){
    let qs = (chapterId === "mix") ? DATA.questions.slice() : DATA.questions.filter(q => q.chapter === chapterId);
    if(mode === "boss"){
      qs = DATA.questions.slice();
    }
    const take = (mode==="cards") ? 14 : (mode==="practice") ? 18 : (mode==="sprint") ? 12 : (mode==="boss") ? 10 : 12;
    const out = [];
    const used = new Set();
    while(out.length < Math.min(take, qs.length)){
      const q = weightedPick(qs.filter(x => !used.has(x.id)));
      if(!q) break;
      out.push(q);
      used.add(q.id);
    }
    // if not enough unique, fill randomly
    while(out.length < Math.min(take, qs.length)){
      out.push(qs[randInt(qs.length)]);
    }
    return out;
  }

  function updateProgress(){
    if(session.mode === "idle"){
      els.progressBar.style.width = "0%";
      els.progressText.textContent = "Válassz témát és módot.";
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
      if(left === 0){
        finishRun(true);
        return;
      }
    }
    els.progressText.textContent = `Haladás: ${done}/${total}${extra}`;
  }

  function setNext(label, enabled){
    els.btnNext.textContent = label;
    els.btnNext.disabled = !enabled;
  }

  function showFeedback(ok, text){
    els.feedback.style.display="block";
    els.feedback.innerHTML = (ok
      ? `<b style="color: var(--good)">Helyes!</b> `
      : `<b style="color: var(--bad)">Nem most…</b> `) + (text || "");
  }

  function applyOutcome(ok){
    if(ok){
      session.correct++;
      persist.score += session.hintUsed ? 1 : 2;
      persist.streak += 1;
    }else{
      session.wrong++;
      persist.streak = 0;
      persist.hearts = Math.max(0, persist.hearts - 1);
      persist.wrongCounts[session.current.id] = (persist.wrongCounts[session.current.id] || 0) + 1;
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

  function renderMCQ(q){
    els.answers.innerHTML="";
    q.options.forEach((opt, idx) => {
      const b = document.createElement("button");
      b.className="ans";
      b.innerHTML = `<span class="kbd">${String.fromCharCode(65+idx)}</span> ${opt}`;
      b.addEventListener("click", () => {
        if(session.phase !== "answer") return;
        session.selectedIdx = idx;
        [...els.answers.children].forEach((node, i) => node.classList.toggle("selected", i===idx));
        setNext("OK", true);
      });
      els.answers.appendChild(b);
    });
  }

  function renderInput(q){
    els.inputArea.style.display="flex";
    els.textAnswer.value="";
    els.textAnswer.focus();
    els.textAnswer.oninput = () => {
      if(session.phase !== "answer") return;
      setNext("OK", normalizeText(els.textAnswer.value).length > 0);
    };
    els.textAnswer.onkeydown = (e) => {
      if(e.key === "Enter" && !els.btnNext.disabled){
        els.btnNext.click();
      }
    };
    setNext("OK", false);
  }

  function renderOrder(q){
    els.orderArea.style.display="block";
    els.orderPool.innerHTML="";
    els.orderPick.textContent="Választási sorrend: —";
    session.orderPickedIdx=[];
    session.orderPickedText=[];

    // shuffle items
    const items = q.items.map((t, idx) => ({t, idx}));
    for(let i=items.length-1;i>0;i--){
      const j = randInt(i+1);
      [items[i], items[j]] = [items[j], items[i]];
    }

    function updatePick(){
      els.orderPick.textContent = session.orderPickedText.length
        ? "Választási sorrend: " + session.orderPickedText.join(" → ")
        : "Választási sorrend: —";
      setNext("OK", session.orderPickedIdx.length === q.correctOrder.length);
    }

    items.forEach(it => {
      const c = document.createElement("button");
      c.className="chip";
      c.textContent = it.t;
      c.addEventListener("click", () => {
        if(session.phase !== "answer") return;
        if(session.orderPickedIdx.includes(it.idx)) return;
        session.orderPickedIdx.push(it.idx);
        session.orderPickedText.push(it.t);
        c.classList.add("picked");
        updatePick();
      });
      els.orderPool.appendChild(c);
    });

    els.btnOrderUndo.onclick = () => {
      if(session.phase !== "answer") return;
      const lastIdx = session.orderPickedIdx.pop();
      const lastText = session.orderPickedText.pop();
      if(lastIdx === undefined) return;
      [...els.orderPool.children].forEach(btn => {
        if(btn.textContent === lastText && btn.classList.contains("picked")){
          btn.classList.remove("picked");
          // allow re-pick
        }
      });
      updatePick();
    };

    updatePick();
  }

  function renderQuestion(q){
    session.current = q;
    session.phase = "answer";
    session.hintUsed = false;
    session.selectedIdx = null;
    session.orderPickedIdx = [];
    session.orderPickedText = [];

    const ch = (DATA.chapters || []).find(c => c.id === q.chapter) || {title:"—"};
    const typeLabel = (q.type==="mcq") ? "Feleletválasztós" : (q.type==="input") ? "Beírás" : "Sorrend";
    els.qtitle.textContent = q.prompt;
    els.qmeta.textContent = `${typeLabel} • ${ch.title}`;
    els.qprompt.textContent = q.joke || "";
    els.feedback.style.display="none";
    els.inputArea.style.display="none";
    els.orderArea.style.display="none";

    // default next state
    setNext("OK", false);

    if(q.type==="mcq") renderMCQ(q);
    else if(q.type==="input") renderInput(q);
    else if(q.type==="order") renderOrder(q);
    else showToast("Ismeretlen kérdéstípus: " + q.type);

    updateProgress();
  }

  function nextQuestion(){
    if(session.index >= session.queue.length){
      finishRun(false);
      return;
    }
    const q = session.queue[session.index];
    persist.seenCounts[q.id] = (persist.seenCounts[q.id] || 0) + 1;
    savePersist();
    renderQuestion(q);
  }

  function finishRun(timeOut){
    session.mode="idle";
    session.phase="idle";
    setTags();
    updateProgress();

    els.qbox.style.display="none";
    els.exportBox.style.display="none";
    els.summaryBox.style.display="block";

    const total = session.queue.length || 0;
    const acc = total ? Math.round((session.correct/total)*100) : 0;
    const elapsed = Math.max(1, Math.floor((Date.now()-session.startTs)/1000));
    let rank="Tanonc Írnok";
    if(acc>=90) rank="Időgép Kapitány";
    else if(acc>=75) rank="Római Stratéga";
    else if(acc>=60) rank="Spártai Túlélő";
    else rank="Kezdő Múmia-Kibontó";

    const parts = [];
    parts.push(`<b>Eredmény:</b> ${session.correct}/${total} jó (${acc}%).`);
    parts.push(`Idő: ${elapsed} mp.`);
    if(timeOut) parts.push(`<b>Lejárt az idő.</b>`);
    parts.push(`<b>Rang:</b> ${rank}.`);
    els.summaryText.innerHTML = parts.join("<br/>");
  }

  function startMode(mode){
    // ensure we are not in export/summary
    els.summaryBox.style.display="none";
    els.exportBox.style.display="none";
    els.qbox.style.display="block";

    session.mode = mode;
    session.phase="answer";
    session.index = 0;
    session.correct = 0;
    session.wrong = 0;
    session.startTs = Date.now();
    session.timeLimitSec = (mode==="sprint") ? 120 : (mode==="boss") ? 160 : 0;

    const chapterId = (mode==="boss") ? "mix" : session.chapterId;
    if(mode==="boss"){
      session.chapterId="mix";
      persist.chapterId="mix";
      savePersist();
      renderChapterTiles();
    }
    session.queue = buildQueue(mode, chapterId);
    setTags();
    updateProgress();
    nextQuestion();

    // scroll game into view
    try{ els.qbox.scrollIntoView({behavior:"smooth", block:"start"}); }catch(e){}
  }

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
    els.exportBox.style.display="block";
    els.summaryBox.style.display="none";
    els.qbox.style.display="none";
    els.exportText.value = buildTSV(persist.chapterId);
  }

  function renderChapterTiles(){
    els.chapterTiles.innerHTML="";
    (DATA.chapters || []).forEach(ch => {
      const div = document.createElement("div");
      div.className = "tile" + (ch.id === persist.chapterId ? " active" : "");
      div.innerHTML = `<div class="t"><span>${ch.icon}</span> ${ch.title}</div><div class="s">${ch.short}</div>`;
      div.addEventListener("click", () => {
        persist.chapterId = ch.id;
        session.chapterId = ch.id;
        savePersist();
        renderChapterTiles();
        pickNpc(ch.id);
        setTags();
        // Important: do NOT wait for "Kihagyom" - keep the board consistent
        safeText(els.qtitle, "Téma kiválasztva");
        safeText(els.qmeta, "—");
        safeText(els.qprompt, `Kiválasztva: ${ch.title}. Most válassz módot (Gyakorlás / Tanulókártyák / Villámkör).`);
        els.answers.innerHTML="";
        els.feedback.style.display="none";
        els.inputArea.style.display="none";
        els.orderArea.style.display="none";
        setNext("OK", false);
        updateProgress();
      });
      els.chapterTiles.appendChild(div);
    });
  }

  // Main button behaviors
  els.btnPractice.addEventListener("click", () => startMode("practice"));
  els.btnCards.addEventListener("click", () => startMode("cards"));
  els.btnSprint.addEventListener("click", () => startMode("sprint"));
  els.btnBoss.addEventListener("click", () => startMode("boss"));
  els.btnExport.addEventListener("click", () => openExport());

  els.btnSkip.addEventListener("click", () => {
    if(session.mode==="idle") return;
    session.index++;
    nextQuestion();
  });

  els.btnHint.addEventListener("click", () => {
    if(session.mode==="idle" || session.phase!=="answer" || !session.current) return;
    session.hintUsed = true;
    const q = session.current;
    let hint="";
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
  });

  els.btnNext.addEventListener("click", () => {
    if(session.mode==="idle" || !session.current) return;

    const q = session.current;

    if(session.phase === "review"){
      session.index++;
      nextQuestion();
      return;
    }

    // SUBMIT phase
    let ok=false;
    if(q.type==="mcq"){
      if(session.selectedIdx === null) return;
      ok = session.selectedIdx === q.correct;
      // paint
      [...els.answers.children].forEach((node, i) => {
        node.classList.remove("selected");
        node.classList.add((() => { const cls = i===q.correct ? "good" : (i===session.selectedIdx ? "bad" : ""); return (cls && cls.length) ? cls : null; })());
        node.disabled = true;
      });
    }else if(q.type==="input"){
      const val = normalizeText(els.textAnswer.value);
      ok = q.answers.map(normalizeText).includes(val);
      els.textAnswer.disabled = true;
    }else if(q.type==="order"){
      ok = session.orderPickedIdx.length === q.correctOrder.length &&
           session.orderPickedIdx.every((v,i)=>v===q.correctOrder[i]);
      [...els.orderPool.querySelectorAll("button")].forEach(b => b.disabled = true);
      els.btnOrderUndo.disabled = true;
    }

    showFeedback(ok, q.explain || "");
    applyOutcome(ok);

    session.phase="review";
    setNext("TOVÁBB", true);
  });

  // Export buttons
  if(els.btnCopyTSV){
    els.btnCopyTSV.addEventListener("click", async () => {
      try{
        await navigator.clipboard.writeText(els.exportText.value);
        alert("TSV kimásolva! Anki Import: elválasztó TAB, mezők 2.");
      }catch(e){ alert("Nem sikerült a vágólap. Jelöld ki és Ctrl+C."); }
    });
  }

  function escapeHtml(s){ return (s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }

  if(els.btnPrint){
    els.btnPrint.addEventListener("click", () => {
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
    });
  }

  if(els.btnCloseExport){
    els.btnCloseExport.addEventListener("click", () => {
      els.exportBox.style.display="none";
      els.qbox.style.display="block";
      updateProgress();
    });
  }

  els.btnReset.addEventListener("click", () => {
    if(!confirm("Biztosan nullázod?")) return;
    persist = {...defaultPersist};
    savePersist();
    updatePills();
    session.chapterId = persist.chapterId;
    session.mode="idle";
    session.phase="idle";
    renderChapterTiles();
    pickNpc(persist.chapterId);
    setTags();
    els.summaryBox.style.display="none";
    els.exportBox.style.display="none";
    els.qbox.style.display="block";
    els.qtitle.textContent="Készen állsz?";
    safeText(els.qmeta, "—");
    els.qprompt.textContent="Bal oldalon válassz témát és módot.";
    els.answers.innerHTML="";
    els.feedback.style.display="none";
    els.inputArea.style.display="none";
    els.orderArea.style.display="none";
    setNext("OK", false);
    updateProgress();
  });

  if(els.btnPlayAgain){
    els.btnPlayAgain.addEventListener("click", () => startMode("practice"));
  }
  if(els.btnBack){
    els.btnBack.addEventListener("click", () => {
      els.summaryBox.style.display="none";
      els.qbox.style.display="block";
      session.mode="idle";
      session.phase="idle";
      setTags();
      updateProgress();
    });
  }

  // Timer tick
  setInterval(() => {
    if(session.mode==="sprint" || session.mode==="boss"){
      updateProgress();
    }
  }, 250);

  // INIT
  renderChapterTiles();
  updatePills();
  pickNpc(persist.chapterId);
  setTags();
  updateProgress();
  setNext("OK", false);
})();