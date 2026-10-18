(() => {
  const items = window.SST_DATA?.items || [];
  const categories = window.SST_DATA?.categories || [];
  const orderedItems = [...items].sort((a, b) => a.category_order - b.category_order || a.category_position - b.category_position);
  const key = "pte-sst-v1";
  const saved = JSON.parse(localStorage.getItem(key) || "{}");
  const state = { mode: "template", currentId: saved.currentId || orderedItems[0]?.id, category: "all", filter: "all", query: "", mastered: new Set(saved.mastered || []), attempts: saved.attempts || {}, seconds: 600, timer: null };
  const $ = (id) => document.getElementById(id);
  const panels = { template: $("templatePanel"), learn: $("learnPanel"), vocab: $("vocabPanel"), drill: $("drillPanel"), exam: $("examPanel"), dictation: $("dictationPanel") };
  const current = () => items.find((item) => item.id === state.currentId) || orderedItems[0];
  const escapeHtml = (value) => String(value || "").replace(/[&<>\"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function save() { localStorage.setItem(key, JSON.stringify({ currentId: state.currentId, mastered: [...state.mastered], attempts: state.attempts })); }
  function toast(text) { const el = $("toast"); el.textContent = text; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => { el.hidden = true; }, 1600); }
  function visibleItems() {
    const q = state.query.trim().toLowerCase();
    return orderedItems.filter((item) => {
      const inCategory = state.category === "all" || item.category_id === state.category;
      const status = state.filter === "all" || (state.filter === "mastered") === state.mastered.has(item.id);
      const haystack = [item.id, item.number, item.title_en, item.title_zh, item.category_name, ...(item.keywords || [])].join(" ").toLowerCase();
      return inCategory && status && (!q || haystack.includes(q));
    });
  }
  const vocabUI = window.createSstVocabularyUI ? window.createSstVocabularyUI() : null;
  function renderCategoryControls() {
    $("categoryFilter").innerHTML = `<option value="all">全部 ${categories.length} 类 · ${items.length} 篇</option>` + categories.map((category) => `<option value="${category.id}">${escapeHtml(category.name)} · ${category.count} 篇</option>`).join("");
    $("categoryFilter").value = state.category;
    $("categoryOverview").innerHTML = categories.map((category, index) => `<button class="category-card" data-category="${category.id}" type="button"><b>${String(index + 1).padStart(2, "0")} · ${escapeHtml(category.name)}</b><span>${category.count} 篇 · 点击进入</span></button>`).join("");
    $("categoryOverview").querySelectorAll("[data-category]").forEach((button) => button.addEventListener("click", () => selectCategory(button.dataset.category, true)));
  }
  function renderList() {
    $("progressSummary").textContent = `${state.mastered.size} / ${items.length} 已掌握`;
    const list = visibleItems();
    let lastCategory = "";
    $("levelList").innerHTML = list.length ? list.map((item) => {
      const heading = item.category_id !== lastCategory ? `<div class="category-heading">${escapeHtml(item.category_name)} · ${categories.find((category) => category.id === item.category_id)?.count || ""} 篇</div>` : "";
      lastCategory = item.category_id;
      return heading + `<button class="level-item ${item.id === state.currentId ? "is-active" : ""}" data-id="${item.id}" type="button"><span class="level-item-number">${String(item.number).padStart(2, "0")}</span><span><b>${escapeHtml(item.title_en)}</b><small>${escapeHtml(item.title_zh)} · ${escapeHtml(item.status || item.logic_type)}</small></span><span class="status-pill ${state.mastered.has(item.id) ? "is-mastered" : ""}">${state.mastered.has(item.id) ? "已会" : "未过"}</span></button>`;
    }).join("") : `<p class="empty-state">没有匹配的题目</p>`;
    $("levelList").querySelectorAll("[data-id]").forEach((button) => button.addEventListener("click", () => selectItem(button.dataset.id)));
  }
  function selectCategory(categoryId, openFirst = false) {
    state.category = categoryId;
    $("categoryFilter").value = categoryId;
    const first = visibleItems()[0];
    if (first && (openFirst || !visibleItems().some((item) => item.id === state.currentId))) state.currentId = first.id;
    if (openFirst) state.mode = "learn";
    save();
    render();
  }
  function setHeader(item) {
    const isTemplate = state.mode === "template";
    $("levelNumber").textContent = isTemplate ? "SST 方法" : `${item.id} · ${item.category_name}`;
    $("levelTitle").textContent = isTemplate ? "听记与成文方法" : `${item.title_en} · ${item.title_zh}`;
    $("markMasteredButton").hidden = isTemplate;
    $("previousButton").hidden = isTemplate;
    $("nextButton").hidden = isTemplate;
    $("timerDisplay").hidden = state.mode !== "exam";
    $("markMasteredButton").textContent = state.mastered.has(item.id) ? "取消已会" : "标记已会";
  }
  function loadTranscript(item) {
    const status = $("audioStatus");
    const container = $("transcriptContents");
    const doc = window.SST_UNIFIED_DATA?.[item.id];
    if (!doc) {
      status.textContent = "原音校对数据暂不可用";
      container.textContent = "";
      return;
    }
    status.textContent = doc.note;
    // A paragraph is one EN block + one ZH block; never render a separate row per ASR sentence.
    container.innerHTML = doc.paragraphs.map(p =>
      `<article class="sst-reading-paragraph"><p class="sst-reading-en">${escapeHtml(p.en)}</p><p class="sst-reading-zh">${escapeHtml(p.zh || "中文译文待校对")}</p></article>`
    ).join("");
  }
  function renderLearn(item) {
    $("itemCode").textContent = `编号 ${item.id}`;
    $("itemType").textContent = item.category_name;
    $("itemDifficulty").textContent = item.difficulty;
    $("sourceWordCount").textContent = `参考答案 ${item.word_count} 词`;
    $("logicText").textContent = item.logic;
    const audio = $("sstAudio");
    audio.pause(); audio.src = item.audio_mp3 || item.audio || ""; audio.load();
    audio.playbackRate = Number($("audioSpeed").value);
    audio.loop = $("audioLoop").checked;
    loadTranscript(item);
    if (vocabUI) vocabUI.renderArticle(item.id);
    $("keywordList").innerHTML = (item.keywords || []).map((x) => `<span>${escapeHtml(x)}</span>`).join("");
    $("mnemonicImage").src = `./images/sst/${item.id}.webp`;
    $("mnemonicImage").alt = `${item.title_zh}助记图`;
    $("answerSentences").innerHTML = (item.sentences || [item.answer]).map((x, i) => `<p><b>${i + 1}</b>　${escapeHtml(x)}</p>`).join("");
  }
  function renderDrill(item) {
    $("drillTitle").textContent = `${item.id} · ${item.title_en}`;
    $("drillProgress").textContent = `${item.number} / ${items.length}`;
    $("drillLogic").textContent = item.logic;
    $("drillKeywords").innerHTML = (item.keywords || []).map((x) => `<span>${escapeHtml(x)}</span>`).join("");
    $("drillMnemonicImage").src = `./images/sst/${item.id}.webp`;
    $("drillMnemonicImage").alt = `${item.title_zh}助记图`;
    $("drillAnswer").innerHTML = `<p>${escapeHtml(item.answer)}</p>`;
    $("drillAnswer").hidden = true; $("drillActions").hidden = true; $("revealButton").hidden = false;
  }
  function renderDictation(item) {
    $("dictationTitle").textContent = `${item.id} · ${item.title_en}`;
    const player = $("dictationAudio");
    player.pause(); player.src = item.audio_mp3 || item.audio || ""; player.load();
    document.querySelectorAll(".dictation-line").forEach(el => { el.value = ""; });
    $("dictationWordCount").textContent = "0 words";
    $("dictationResult").hidden = true;
  }
  function renderExam(item) {
    $("examTitle").textContent = `${item.id} · ${item.title_en}`;
    const examAudio = $("examAudio");
    examAudio.pause(); examAudio.src = item.audio_mp3 || item.audio || ""; examAudio.load();
    $("examAudioStatus").textContent = "请先听音频；播放完成后开始 10 分钟倒计时。";
    $("examInput").value = ""; $("examInput").disabled = false;
    $("beginWritingButton").disabled = false;
    $("examResult").hidden = true; updateWordCount(); resetTimer(false);
  }
  function render() {
    const item = current(); if (!item) return;
    Object.entries(panels).forEach(([mode, panel]) => { panel.hidden = mode !== state.mode; });
    document.querySelectorAll(".mode-tab").forEach((button) => button.classList.toggle("is-active", button.dataset.mode === state.mode));
    setHeader(item); renderList();
    if (state.mode === "learn") renderLearn(item);
    if (state.mode === "vocab" && vocabUI) vocabUI.renderStudy(item.id);
    if (state.mode === "drill") renderDrill(item);
    if (state.mode === "exam") renderExam(item);
    if (state.mode === "dictation") renderDictation(item);
  }
  function selectItem(id) { state.currentId = id; if (state.mode === "template") state.mode = "learn"; save(); render(); }
  function move(delta) { const pool = state.category === "all" ? orderedItems : orderedItems.filter((item) => item.category_id === state.category); const i = Math.max(0, pool.findIndex((item) => item.id === state.currentId)); state.currentId = pool[(i + delta + pool.length) % pool.length].id; save(); render(); }
  function setMode(mode) { $("dictationAudio").pause(); $("examAudio").pause(); $("sstAudio").pause(); state.mode = mode; clearInterval(state.timer); render(); }
  function words(text) { return text.trim() ? text.trim().split(/\s+/).length : 0; }
  function updateWordCount() { $("wordCount").textContent = `${words($("examInput").value)} words`; }
  function formatTime(total) { return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`; }
  function resetTimer(start = true) {
    clearInterval(state.timer); state.seconds = 600; $("timerDisplay").textContent = "10:00";
    if (state.mode !== "exam" || !start) return;
    state.timer = setInterval(() => { state.seconds = Math.max(0, state.seconds - 1); $("timerDisplay").textContent = formatTime(state.seconds); if (!state.seconds) { clearInterval(state.timer); toast("时间到，可以提交检查"); } }, 1000);
  }
  function normalizeToken(s) { return s.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim(); }
  function submitExam() {
    const item = current(); const text = $("examInput").value.trim(); const count = words(text);
    if (!text) { toast("先写完再提交"); return; }
    clearInterval(state.timer);
    const normalized = normalizeToken(text);
    const keys = item.keywords || [];
    const hits = keys.filter((x) => normalized.includes(normalizeToken(x)));
    const coverage = keys.length ? Math.round(hits.length / keys.length * 100) : 0;
    const checks = [
      [count >= 50 && count <= 70, `字数 ${count} / 50–70`],
      [!/[\r\n]{2,}/.test(text), "单段格式"],
      [/[.!?]$/.test(text), "句末标点"]
    ];
    state.attempts[item.id] = { count, coverage, at: Date.now() }; save();
    $("examResult").innerHTML = `<div class="check-grid">${checks.map(([ok, label]) => `<div class="check-item ${ok ? "is-pass" : "is-fail"}">${ok ? "✓" : "×"} ${label}</div>`).join("")}</div><p><b>原词覆盖 ${coverage}%</b>（${hits.length} / ${keys.length} 个关键词；只用于复盘，不是官方分数）</p><div class="coverage-meter"><span style="width:${coverage}%"></span></div><div class="reference-answer"><b>参考答案 · ${item.word_count} 词</b>${escapeHtml(item.answer)}</div>`;
    $("examResult").hidden = false; $("examResult").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  document.querySelectorAll(".mode-tab").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
  document.querySelectorAll(".segment").forEach((button) => button.addEventListener("click", () => { state.filter = button.dataset.filter; document.querySelectorAll(".segment").forEach((x) => x.classList.toggle("is-active", x === button)); renderList(); }));
  $("audioSpeed").addEventListener("change", (e) => { $("sstAudio").playbackRate = Number(e.target.value); });
  $("audioLoop").addEventListener("change", (e) => { $("sstAudio").loop = e.target.checked; });
  $("searchInput").addEventListener("input", (e) => { state.query = e.target.value; renderList(); });
  $("categoryFilter").addEventListener("change", (e) => selectCategory(e.target.value));
  $("previousButton").addEventListener("click", () => move(-1)); $("nextButton").addEventListener("click", () => move(1));
  $("markMasteredButton").addEventListener("click", () => { const id = current().id; state.mastered.has(id) ? state.mastered.delete(id) : state.mastered.add(id); save(); render(); });
  $("revealButton").addEventListener("click", () => { $("revealButton").hidden = true; $("drillAnswer").hidden = false; $("drillActions").hidden = false; });
  $("drillActions").addEventListener("click", (e) => { const grade = e.target.dataset.grade; if (!grade) return; if (grade === "known") state.mastered.add(current().id); else if (grade === "forgot") state.mastered.delete(current().id); save(); toast(grade === "known" ? "已记住，进入下一篇" : grade === "vague" ? "已标记模糊，稍后再练" : "已加入复习"); move(1); });
  function startExamWriting() {
    if (state.mode !== "exam" || $("beginWritingButton").disabled) return;
    $("examAudio").pause();
    $("examInput").disabled = false;
    $("beginWritingButton").disabled = true;
    $("examAudioStatus").textContent = "正在作答：请在 10 分钟内提交总结。";
    resetTimer(true);
    $("examInput").focus();
  }
  const dictationText = () => [...document.querySelectorAll(".dictation-line")].map(el => el.value.trim()).filter(Boolean).join(" ");
  document.querySelectorAll(".dictation-line").forEach(el => el.addEventListener("input", () => { $("dictationWordCount").textContent = `${words(dictationText())} words`; }));
  $("dictationClear").addEventListener("click", () => { document.querySelectorAll(".dictation-line").forEach(el => { el.value = ""; }); $("dictationWordCount").textContent = "0 words"; $("dictationResult").hidden = true; });
  $("dictationSubmit").addEventListener("click", () => {
    const input = dictationText();
    if (!input) { toast("请先输入听到的英文关键句"); return; }
    const item = current();
    const expected = (item.keywords || []).map(k => k.trim()).filter(Boolean);
    const lower = normalizeToken(input);
    const hit = expected.filter(k => lower.includes(normalizeToken(k)));
    const missing = expected.filter(k => !hit.includes(k));
    const coverage = expected.length ? Math.round(hit.length / expected.length * 100) : 0;
    $("dictationResult").innerHTML = `<p><b>关键短语覆盖：${coverage}%（${hit.length}/${expected.length}）</b> · 仅用于自检，不是官方评分</p><p>已覆盖：${escapeHtml(hit.join(" · ") || "暂无")}</p><p>可补充：${escapeHtml(missing.join(" · ") || "全部已覆盖")}</p><div class="reference-answer"><b>参考总结</b>${escapeHtml(item.answer)}</div>`;
    $("dictationResult").hidden = false;
  });
  $("examAudio").addEventListener("ended", startExamWriting);
  $("beginWritingButton").addEventListener("click", startExamWriting);
  $("examInput").addEventListener("input", updateWordCount); $("restartButton").addEventListener("click", render); $("submitButton").addEventListener("click", submitExam);
  $("sidebarToggle").addEventListener("click", () => { const collapsed = $("appShell").classList.toggle("is-sidebar-collapsed"); $("sidebarToggle").textContent = collapsed ? "›" : "‹"; $("sidebarToggle").setAttribute("aria-expanded", String(!collapsed)); });
  renderCategoryControls();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js");
  render();
})();
