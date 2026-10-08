(function () {
  "use strict";

  const catalogue = (window.READING_COLLOCATIONS && window.READING_COLLOCATIONS.items) || [];
  const tierRules = window.READING_COLLOCATION_TIERS;
  const catalogueById = new Map(catalogue.map((item) => [item.id, item]));
  const SESSION_KEY = "pte-reading-collocation-session-v2";

  const el = {};
  [
    "readingShell", "readingModeSwitcher", "examGuide", "recognitionModule", "collocationModule", "collocationCount",
    "collocationSetup", "collocationTierPicker", "mustTierCount", "usefulTierCount", "referenceTierCount", "allTierCount",
    "rangeStart", "rangeEnd", "startCollocationSession", "rangeMessage",
    "collocationStudy", "studyRange", "rememberedCount", "studySeenCount", "cardId",
    "cardCategory", "cardPhrase", "cardMeaning", "notYetCollocation", "rememberCollocation",
    "collocationTest", "testRange", "testProgress", "testAnswered", "testCardId",
    "testPhrase", "testOptions", "collocationResult", "collocationResultTitle",
    "collocationScore", "collocationWrongList", "retryWrongCollocations"
  ].forEach((id) => { el[id] = document.getElementById(id); });

  if (!el.readingShell || !catalogue.length || !tierRules) return;

  const tierCounts = tierRules.summarize(catalogue);
  let selectedTier = "must";
  let session = loadSession();
  if (session) selectedTier = session.tier;

  init();

  function init() {
    el.collocationCount.textContent = catalogue.length;
    el.mustTierCount.textContent = `${tierCounts.must}条`;
    el.usefulTierCount.textContent = `${tierCounts.useful}条`;
    el.referenceTierCount.textContent = `${tierCounts.reference}条`;
    el.allTierCount.textContent = `${tierCounts.all}条`;
    el.rangeStart.max = String(catalogue.length);
    el.rangeEnd.max = String(catalogue.length);
    el.rangeEnd.value = String(Math.min(100, catalogue.length));
    bindEvents();
    renderTierPicker();
    if (!session) showRangeSummary();
    renderSession();
  }

  function bindEvents() {
    el.readingModeSwitcher.addEventListener("click", (event) => {
      const button = event.target.closest("[data-reading-mode]");
      if (button) setMode(button.dataset.readingMode);
    });
    el.startCollocationSession.addEventListener("click", startSession);
    [el.rangeStart, el.rangeEnd].forEach((input) => input.addEventListener("change", () => showRangeSummary()));
    el.collocationTierPicker.addEventListener("click", (event) => {
      const button = event.target.closest("[data-collocation-tier]");
      if (button) selectTier(button.dataset.collocationTier);
    });
    document.querySelectorAll("[data-range-size]").forEach((button) => {
      button.addEventListener("click", () => applyRangeSize(Number(button.dataset.rangeSize)));
    });
    document.querySelectorAll("[data-range-start][data-range-end]").forEach((button) => {
      button.addEventListener("click", () => applyExactRange(
        Number(button.dataset.rangeStart),
        Number(button.dataset.rangeEnd),
        button.textContent.trim()
      ));
    });
    document.querySelectorAll("[data-reset-collocations]").forEach((button) => {
      button.addEventListener("click", resetSession);
    });
    el.rememberCollocation.addEventListener("click", () => advanceStudy(true));
    el.notYetCollocation.addEventListener("click", () => advanceStudy(false));
    el.testOptions.addEventListener("click", answerTest);
    el.retryWrongCollocations.addEventListener("click", retryWrong);
  }

  function setMode(mode) {
    if (!["guide", "points", "recognition", "collocations"].includes(mode)) return;
    el.readingShell.dataset.mode = mode;
    el.examGuide.hidden = mode !== "guide";
    el.recognitionModule.hidden = mode !== "recognition";
    el.collocationModule.hidden = mode !== "collocations";
    el.readingModeSwitcher.querySelectorAll("[data-reading-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.readingMode === mode);
    });
    if (mode === "collocations") renderSession();
  }

  function applyRangeSize(size) {
    const start = clampNumber(el.rangeStart.value, 1, catalogue.length) || 1;
    el.rangeStart.value = String(start);
    el.rangeEnd.value = String(Math.min(catalogue.length, start + size - 1));
    showRangeSummary();
  }

  function applyExactRange(start, end, label) {
    el.rangeStart.value = String(clampNumber(start, 1, catalogue.length));
    el.rangeEnd.value = String(clampNumber(end, 1, catalogue.length));
    showRangeSummary(label);
  }

  function selectTier(tier) {
    if (!tierRules.LABELS[tier] || session) return;
    selectedTier = tier;
    if (tier === "reference") {
      el.rangeStart.value = "516";
      el.rangeEnd.value = String(Math.min(565, catalogue.length));
    } else {
      el.rangeStart.value = "1";
      el.rangeEnd.value = String(Math.min(100, catalogue.length));
    }
    renderTierPicker();
    showRangeSummary();
  }

  function renderTierPicker() {
    el.collocationTierPicker.querySelectorAll("[data-collocation-tier]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.collocationTier === selectedTier);
    });
  }

  function itemsInRange(start, end, tier = selectedTier) {
    return catalogue.filter((item) => {
      const number = Number(item.id.slice(1));
      return number >= start && number <= end && (tier === "all" || tierRules.classify(item) === tier);
    });
  }

  function showRangeSummary(prefix) {
    const start = clampNumber(el.rangeStart.value, 1, catalogue.length) || 1;
    const end = clampNumber(el.rangeEnd.value, 1, catalogue.length) || catalogue.length;
    const count = start <= end ? itemsInRange(start, end).length : 0;
    const lead = prefix ? `${prefix}：` : "";
    showRangeMessage(`${lead}${formatId(start)}—${formatId(end)} 中有 ${count} 条“${tierRules.LABELS[selectedTier]}”卡片。`, count === 0);
  }

  function startSession() {
    const start = Number(el.rangeStart.value);
    const end = Number(el.rangeEnd.value);
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end > catalogue.length || start > end) {
      showRangeMessage(`请输入 1—${catalogue.length} 内的有效范围，且起始编号不能大于结束编号。`, true);
      return;
    }

    const selectedIds = itemsInRange(start, end).map((item) => item.id);
    if (!selectedIds.length) {
      showRangeMessage(`这个编号范围内没有“${tierRules.LABELS[selectedTier]}”卡片，请扩大范围或更换层级。`, true);
      return;
    }
    session = {
      version: 2,
      tier: selectedTier,
      start,
      end,
      selectedIds,
      remainingIds: [...selectedIds],
      currentId: randomItem(selectedIds),
      seen: 1,
      phase: "study",
      testIds: [],
      testIndex: 0,
      answers: []
    };
    saveSession();
    renderSession();
  }

  function advanceStudy(remembered) {
    if (!session || session.phase !== "study") return;
    if (remembered) {
      session.remainingIds = session.remainingIds.filter((id) => id !== session.currentId);
    }
    if (!session.remainingIds.length) {
      beginTest(session.selectedIds);
      return;
    }

    const alternatives = session.remainingIds.filter((id) => id !== session.currentId);
    session.currentId = randomItem(alternatives.length ? alternatives : session.remainingIds);
    session.seen += 1;
    saveSession();
    renderStudy();
  }

  function beginTest(ids) {
    session.phase = "test";
    session.testIds = shuffle([...ids]);
    session.testIndex = 0;
    session.answers = [];
    saveSession();
    renderSession();
  }

  function answerTest(event) {
    const button = event.target.closest("[data-test-meaning]");
    if (!button || !session || session.phase !== "test") return;
    const item = catalogueById.get(session.testIds[session.testIndex]);
    if (!item) return;

    const selectedMeaning = button.dataset.testMeaning;
    session.answers.push({
      id: item.id,
      selectedMeaning,
      correct: selectedMeaning === item.meaning
    });
    session.testIndex += 1;
    if (session.testIndex >= session.testIds.length) session.phase = "result";
    saveSession();
    renderSession();
  }

  function retryWrong() {
    if (!session) return;
    const wrongIds = session.answers.filter((answer) => !answer.correct).map((answer) => answer.id);
    if (wrongIds.length) beginTest(wrongIds);
  }

  function resetSession() {
    session = null;
    sessionStorage.removeItem(SESSION_KEY);
    el.rangeStart.value = selectedTier === "reference" ? "516" : "1";
    el.rangeEnd.value = selectedTier === "reference" ? String(Math.min(565, catalogue.length)) : String(Math.min(100, catalogue.length));
    renderTierPicker();
    showRangeSummary();
    renderSession();
  }

  function renderSession() {
    el.collocationSetup.hidden = Boolean(session);
    el.collocationStudy.hidden = !session || session.phase !== "study";
    el.collocationTest.hidden = !session || session.phase !== "test";
    el.collocationResult.hidden = !session || session.phase !== "result";
    if (!session) return;
    if (session.phase === "study") renderStudy();
    if (session.phase === "test") renderTest();
    if (session.phase === "result") renderResult();
  }

  function renderStudy() {
    const item = catalogueById.get(session.currentId);
    if (!item) {
      resetSession();
      return;
    }
    const total = session.selectedIds.length;
    const remembered = total - session.remainingIds.length;
    el.studyRange.textContent = rangeLabel();
    el.rememberedCount.textContent = `${remembered} / ${total}`;
    el.studySeenCount.textContent = `${session.seen} 次`;
    el.cardId.textContent = item.id;
    el.cardCategory.textContent = item.category;
    el.cardPhrase.textContent = item.phrase;
    el.cardMeaning.textContent = item.meaning;
  }

  function renderTest() {
    const item = catalogueById.get(session.testIds[session.testIndex]);
    if (!item) {
      session.phase = "result";
      saveSession();
      renderSession();
      return;
    }
    el.testRange.textContent = rangeLabel();
    el.testProgress.textContent = `${session.testIndex + 1} / ${session.testIds.length}`;
    el.testAnswered.textContent = String(session.answers.length);
    el.testCardId.textContent = item.id;
    el.testPhrase.textContent = item.phrase;
    el.testOptions.replaceChildren(...buildChoices(item).map((meaning, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.testMeaning = meaning;
      button.innerHTML = `<span>${String.fromCharCode(65 + index)}</span><strong>${escapeHtml(meaning)}</strong>`;
      return button;
    }));
  }

  function renderResult() {
    const correct = session.answers.filter((answer) => answer.correct).length;
    const total = session.answers.length;
    const wrong = session.answers.filter((answer) => !answer.correct);
    el.collocationResultTitle.textContent = wrong.length ? `完成测试：${wrong.length} 条需要复习` : "本组全部掌握";
    el.collocationScore.innerHTML = [
      [total, "测试数量"],
      [correct, "答对"],
      [wrong.length, "答错"],
      [total ? `${Math.round(correct / total * 100)}%` : "0%", "正确率"]
    ].map(([value, label]) => `<div class="score-cell"><strong>${value}</strong><span>${label}</span></div>`).join("");
    el.retryWrongCollocations.hidden = !wrong.length;
    el.collocationWrongList.innerHTML = wrong.length
      ? wrong.map((answer) => {
        const item = catalogueById.get(answer.id);
        return `<article><span>${escapeHtml(item.id)}</span><strong>${escapeHtml(item.phrase)}</strong><p>正确：${escapeHtml(item.meaning)}</p><small>你选：${escapeHtml(answer.selectedMeaning)}</small></article>`;
      }).join("")
      : '<div class="perfect-result">所选范围已经完成学习和测试。</div>';
  }

  function buildChoices(correctItem) {
    const selectedPool = session.selectedIds
      .map((id) => catalogueById.get(id))
      .filter((item) => item && item.id !== correctItem.id && item.meaning !== correctItem.meaning);
    const fallbackPool = catalogue.filter((item) =>
      item.id !== correctItem.id
      && item.meaning !== correctItem.meaning
      && !selectedPool.some((candidate) => candidate.meaning === item.meaning)
    );
    const distractors = [];
    for (const item of shuffle(selectedPool)) {
      if (!distractors.includes(item.meaning)) distractors.push(item.meaning);
      if (distractors.length === 3) break;
    }
    for (const item of shuffle(fallbackPool)) {
      if (!distractors.includes(item.meaning)) distractors.push(item.meaning);
      if (distractors.length === 3) break;
    }
    return shuffle([correctItem.meaning, ...distractors]);
  }

  function rangeLabel() {
    return `${tierRules.LABELS[session.tier]} · ${formatId(session.start)}—${formatId(session.end)} · ${session.selectedIds.length} 条`;
  }

  function formatId(number) {
    return `K${String(number).padStart(3, "0")}`;
  }

  function showRangeMessage(message, isError) {
    el.rangeMessage.textContent = message;
    el.rangeMessage.classList.toggle("is-error", isError);
  }

  function clampNumber(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return null;
    return Math.min(max, Math.max(min, Math.floor(number)));
  }

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function shuffle(items) {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
    }
    return items;
  }

  function saveSession() {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function loadSession() {
    try {
      const parsed = JSON.parse(sessionStorage.getItem(SESSION_KEY));
      if (!parsed || parsed.version !== 2 || !tierRules.LABELS[parsed.tier] || !Array.isArray(parsed.selectedIds)) return null;
      if (!parsed.selectedIds.every((id) => catalogueById.has(id))) return null;
      return parsed;
    } catch (_) {
      return null;
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[character]);
  }

  window.ReadingStudy = { setMode, resetSession, classifyCollocation: tierRules.classify };
})();
