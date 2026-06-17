const MODULES = [
  ["introduction", "第一段 / Introduction"],
  ["argument1", "第二段 / Argument 1"],
  ["argument2", "第三段 / Argument 2"],
  ["conclusion", "第四段 / Conclusion"]
];

const STORAGE_KEY = "pte-we-v2-state";
const SIDEBAR_STATE_KEY = "pte-we-sidebar-collapsed";
const MODE_LIMITS = {
  template: 300,
  article: 300,
  exam: 1200
};

const ARTICLE_SLOT_PATTERNS = {
  introduction: [
    {
      regex: /^The issue of (.+) has triggered a heated debate in contemporary society\.$/,
      labels: ["议题"],
      suffixes: [""]
    },
    {
      regex: /^Many people claim that (.+)\.$/,
      labels: ["反方观点"],
      suffixes: ["."]
    },
    null,
    {
      regex: /^In this essay, I will (?:(?:describe (.+) and )?elaborate) on my point of view that (.+)\.$/,
      labels: ["描述对象", "我的观点"],
      suffixes: ["", "."]
    }
  ],
  argument1: [
    {
      regex: /^To begin with, one of the most compelling reasons for the significance of (.+) is that (.+)\.$/,
      labels: ["关键词", "分论点"],
      suffixes: ["", "."]
    },
    {
      regex: /^This plays a vital role because (.+)\.$/,
      labels: ["原因"],
      suffixes: ["."]
    },
    {
      regex: /^To illustrate, studies have shown that (.+)\.$/,
      labels: ["例子"],
      suffixes: ["."]
    },
    {
      regex: /^Consequently, (.+)\.$/,
      labels: ["结果"],
      suffixes: ["."]
    }
  ],
  argument2: [
    {
      regex: /^(?:In addition|However), a crucial factor that cannot be ignored is that (.+)\.$/,
      labels: ["分论点"],
      suffixes: ["."]
    },
    {
      regex: /^This point matters greatly because (.+)\.$/,
      labels: ["原因"],
      suffixes: ["."]
    },
    {
      regex: /^Based on my experience, (.+)\.$/,
      labels: ["个人例子"],
      suffixes: ["."]
    },
    null,
    {
      regex: /^As a result, (.+)\.$/,
      labels: ["结果"],
      suffixes: ["."]
    }
  ],
  conclusion: [
    {
      regex: /^To sum up, all the evidence suggests that (.+), mainly due to (.+) and (.+)\.$/,
      labels: ["总结观点", "理由一", "理由二"],
      suffixes: ["", "", "."]
    },
    {
      regex: /^Therefore, I strongly recommend that (.+?) should (.+)\.$/,
      labels: ["推荐对象", "推荐动作"],
      suffixes: ["", "."]
    },
    {
      regex: /^Therefore, I strongly recommend that (.+)\.$/,
      labels: ["推荐句"],
      suffixes: ["."]
    }
  ]
};

const MASTERY_STEPS = [
  { key: "new", label: "未熟悉", minCorrect: 0 },
  { key: "familiar", label: "熟悉", minCorrect: 1 },
  { key: "mastered", label: "掌握", minCorrect: 3 },
  { key: "skilled", label: "熟练", minCorrect: 5 }
];

const data = window.WE_DATA;
const articles = data?.articles || [];
const template = data?.template;

const persisted = readJson(STORAGE_KEY, {
  progress: {},
  drafts: {},
  examDrafts: {}
});

const state = {
  mode: "template",
  examType: "single",
  activeArticleId: articles[0]?.id || null,
  sidebarCollapsed: readJson(SIDEBAR_STATE_KEY, false),
  filter: "all",
  search: "",
  answersVisible: false,
  compositeExam: {
    active: false,
    articleIds: [],
    currentIndex: 0,
    results: []
  },
  timer: {
    mode: null,
    endsAt: null,
    remaining: MODE_LIMITS.template,
    interval: null
  }
};

const els = {
  appShell: document.getElementById("appShell"),
  sidebarToggle: document.getElementById("sidebarToggle"),
  progressSummary: document.getElementById("progressSummary"),
  searchInput: document.getElementById("searchInput"),
  levelList: document.getElementById("levelList"),
  levelNumber: document.getElementById("levelNumber"),
  levelTitle: document.getElementById("levelTitle"),
  timerDisplay: document.getElementById("timerDisplay"),
  markMasteredButton: document.getElementById("markMasteredButton"),
  nextLevelButton: document.getElementById("nextLevelButton"),
  promptPanel: document.getElementById("promptPanel"),
  topicText: document.getElementById("topicText"),
  positionText: document.getElementById("positionText"),
  imageSection: document.getElementById("imageSection"),
  levelImage: document.getElementById("levelImage"),
  imageFrame: document.getElementById("imageFrame"),
  toggleImageButton: document.getElementById("toggleImageButton"),
  practicePanel: document.getElementById("practicePanel"),
  practiceTitle: document.getElementById("practiceTitle"),
  levelScore: document.getElementById("levelScore"),
  startTimerButton: document.getElementById("startTimerButton"),
  resetInputsButton: document.getElementById("resetInputsButton"),
  revealAllButton: document.getElementById("revealAllButton"),
  checkButton: document.getElementById("checkButton"),
  moduleGrid: document.getElementById("moduleGrid"),
  examPanel: document.getElementById("examPanel"),
  examTitle: document.getElementById("examTitle"),
  examScore: document.getElementById("examScore"),
  singleExamModeButton: document.getElementById("singleExamModeButton"),
  compositeExamModeButton: document.getElementById("compositeExamModeButton"),
  startExamButton: document.getElementById("startExamButton"),
  nextCompositeExamButton: document.getElementById("nextCompositeExamButton"),
  clearExamButton: document.getElementById("clearExamButton"),
  submitExamButton: document.getElementById("submitExamButton"),
  examTopicCard: document.getElementById("examTopicCard"),
  examTopicLabel: document.getElementById("examTopicLabel"),
  examTopicText: document.getElementById("examTopicText"),
  examProgress: document.getElementById("examProgress"),
  examInput: document.getElementById("examInput"),
  examResult: document.getElementById("examResult")
};

bindEvents();
renderSidebarState();
render();

function bindEvents() {
  document.querySelectorAll(".mode-tab").forEach((button) => {
    button.addEventListener("click", () => {
      saveCurrentDrafts();
      setMode(button.dataset.mode);
    });
  });

  els.sidebarToggle.addEventListener("click", toggleSidebar);

  document.querySelectorAll(".segment").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      document.querySelectorAll(".segment").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      renderLevelList();
    });
  });

  els.searchInput.addEventListener("input", () => {
    state.search = els.searchInput.value.trim().toLowerCase();
    renderLevelList();
  });

  els.toggleImageButton.addEventListener("click", () => {
    const expanded = els.imageFrame.classList.toggle("is-expanded");
    els.toggleImageButton.textContent = expanded ? "收起" : "展开";
  });
  els.imageFrame.addEventListener("dblclick", openImageFullscreen);

  els.startTimerButton.addEventListener("click", () => {
    if (state.mode === "template") startTimer(state.mode);
  });
  els.checkButton.addEventListener("click", checkPractice);
  els.revealAllButton.addEventListener("click", toggleAnswers);
  els.resetInputsButton.addEventListener("click", resetPracticeInputs);
  els.markMasteredButton.addEventListener("click", toggleMastered);
  els.nextLevelButton.addEventListener("click", goToNextArticle);

  els.singleExamModeButton.addEventListener("click", () => setExamType("single"));
  els.compositeExamModeButton.addEventListener("click", () => setExamType("composite"));
  els.startExamButton.addEventListener("click", startCurrentExam);
  els.nextCompositeExamButton.addEventListener("click", goToNextCompositeArticle);
  els.submitExamButton.addEventListener("click", () => submitExam({ auto: false }));
  els.clearExamButton.addEventListener("click", clearExam);
  els.examInput.addEventListener("input", saveExamDraft);
}

function toggleSidebar() {
  state.sidebarCollapsed = !state.sidebarCollapsed;
  localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(state.sidebarCollapsed));
  renderSidebarState();
}

function renderSidebarState() {
  els.appShell.classList.toggle("is-sidebar-collapsed", state.sidebarCollapsed);
  els.appShell.style.gridTemplateColumns = state.sidebarCollapsed ? "0 12px 1fr" : "336px 12px 1fr";
  els.sidebarToggle.textContent = state.sidebarCollapsed ? "›" : "‹";
  els.sidebarToggle.setAttribute("aria-expanded", String(!state.sidebarCollapsed));
  els.sidebarToggle.setAttribute("aria-label", state.sidebarCollapsed ? "展开左侧栏" : "收起左侧栏");
}

function setMode(mode) {
  state.mode = mode;
  state.answersVisible = false;
  if (mode === "exam") {
    state.search = "";
    els.searchInput.value = "";
  }
  stopTimer(false);
  state.timer.remaining = MODE_LIMITS[mode];
  document.querySelectorAll(".mode-tab").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === mode);
  });
  els.revealAllButton.textContent = "显示答案";
  render();
}

function setExamType(type) {
  saveExamDraft();
  state.examType = type;
  stopTimer(false);
  if (type === "single") {
    state.compositeExam.active = false;
  }
  const article = currentExamArticle();
  els.examInput.value = article ? (persisted.examDrafts[article.id] || "") : "";
  els.examResult.hidden = true;
  render();
}

function render() {
  renderSummary();
  renderLevelList();
  renderMain();
  renderTimer();
}

function renderSummary() {
  const mastered = articles.filter((article) => masteryLevel(getArticleProgress(article.id)).key === "skilled").length;
  els.progressSummary.textContent = `${mastered} / ${articles.length} 已掌握`;
}

function examHeaderLabel() {
  if (state.examType === "composite") {
    return state.compositeExam.active
      ? `综合考核 ${state.compositeExam.currentIndex + 1} / ${state.compositeExam.articleIds.length}`
      : "综合考核";
  }
  return "单篇考核";
}

function renderLevelList() {
  const visibleArticles = articles.filter((article) => {
    const progress = getArticleProgress(article.id);
    const haystack = `${article.title} ${article.topic} ${article.position}`.toLowerCase();
    const matchesSearch = !state.search || haystack.includes(state.search);
    const matchesFilter =
      state.mode === "exam" ||
      state.filter === "all" ||
      (state.filter === "mastered" && masteryLevel(progress).key === "skilled") ||
      (state.filter === "todo" && masteryLevel(progress).key !== "skilled");
    return matchesSearch && matchesFilter;
  });

  els.levelList.replaceChildren(
    ...visibleArticles.map((article) => {
      const progress = getArticleProgress(article.id);
      const level = masteryLevel(progress);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "level-item";
      button.classList.toggle("is-active", article.id === state.activeArticleId && state.mode !== "template");
      button.innerHTML = `
        <span>
          <span class="level-item-title">${escapeHtml(article.title)}</span>
          <span class="level-item-meta">${
            state.mode === "exam"
              ? "可选考核题目"
              : `${practiceFieldCount(article)} 空 · 近5次 ${windowCorrectCount(progress)}/5`
          }</span>
        </span>
        <span class="status-pill ${level.key}">
          ${level.label}
        </span>
      `;
      button.addEventListener("click", () => {
        if (state.mode === "exam" && state.examType === "composite" && state.compositeExam.active) {
          showToast("综合考核进行中，请先完成当前篇。", true);
          return;
        }
        saveCurrentDrafts();
        state.activeArticleId = article.id;
        if (state.mode === "exam") {
          state.examType = "single";
          state.compositeExam.active = false;
          els.examResult.hidden = true;
        }
        if (state.mode === "template") setMode("article");
        else render();
      });
      return button;
    })
  );
}

function renderMain() {
  const item = currentPracticeItem();
  if (!item) return;

  els.practicePanel.hidden = state.mode === "exam";
  els.examPanel.hidden = state.mode !== "exam";
  els.markMasteredButton.hidden = state.mode === "template" || state.mode === "exam";
  els.nextLevelButton.hidden = state.mode === "template" || state.mode === "exam";
  els.promptPanel.hidden = state.mode === "template" || state.mode === "exam";
  els.imageSection.hidden = state.mode === "template" || state.mode === "exam" || !item.image;
  if (state.mode === "exam") {
    els.levelImage.removeAttribute("src");
    els.topicText.textContent = "";
    els.positionText.textContent = "";
  }
  if (!els.imageSection.hidden) {
    els.imageFrame.classList.add("is-expanded");
    els.toggleImageButton.textContent = "收起";
  }

  if (state.mode === "template") {
    els.levelNumber.textContent = "模板练习";
    els.levelTitle.textContent = template.title;
    els.practiceTitle.textContent = "5 分钟模板默写";
    els.levelScore.textContent = scoreText(template.id);
  } else {
    const article = state.mode === "exam" ? currentExamArticle() : getActiveArticle();
    if (state.mode === "exam") {
      els.levelNumber.textContent = examHeaderLabel();
      els.levelTitle.textContent = state.examType === "composite" ? "综合考核" : article.title;
      els.examTopicText.textContent = article.topic;
    } else {
      els.levelNumber.textContent = article.number;
      els.levelTitle.textContent = article.name;
      els.topicText.textContent = article.topic;
      els.positionText.textContent = article.position;
      els.levelImage.src = assetUrl(article.image);
      els.levelImage.alt = article.title;
      els.practiceTitle.textContent = "文章论点默写";
      els.levelScore.textContent = scoreText(article.id);
      els.markMasteredButton.textContent = "重置进度";
    }
    renderExam(article);
  }

  if (state.mode !== "exam") renderPractice(item);
}

function renderPractice(item) {
  const modules = practiceModules(item);
  const countUnit = item.id === template.id ? "句" : "空";
  els.moduleGrid.replaceChildren(
    ...MODULES.map(([key, label]) => {
      const fields = modules[key] || [];
      const card = document.createElement("article");
      card.className = "module-card";
      const rows = fields.map((field, index) => {
        const draftKey = inputKey(item.id, key, index);
        const value = persisted.drafts[draftKey] || "";
        return `
          <div class="sentence-row">
            <span class="sentence-index">${index + 1}</span>
            <div class="input-stack">
              ${field.label ? `<div class="slot-cue">${escapeHtml(field.label)}</div>` : ""}
              <input class="sentence-input" type="text" autocomplete="off"
                data-module="${key}" data-index="${index}" value="${escapeAttr(value)}">
            </div>
            <div class="answer-line ${state.answersVisible ? "is-visible" : ""}">
              <div class="answer-row">
                <span class="answer-label">标准答案</span>
                <span class="answer-text">${escapeHtml(field.answer)}</span>
              </div>
            </div>
          </div>
        `;
      }).join("");
      card.innerHTML = `
        <div class="module-title">
          <h4>${label}</h4>
          <span class="module-count">${fields.length} ${countUnit}</span>
        </div>
        <div class="sentence-list">${rows}</div>
      `;
      return card;
    })
  );

  els.moduleGrid.querySelectorAll(".sentence-input").forEach((input) => {
    input.addEventListener("input", savePracticeDrafts);
  });
}

function renderExam(article) {
  const current = currentExamArticle() || article;
  const draft = persisted.examDrafts[current.id] || "";
  if (els.examInput.value !== draft) els.examInput.value = draft;
  els.examTitle.textContent = state.examType === "composite" ? "综合考核" : "单篇考核";
  els.examTopicLabel.textContent = state.examType === "composite"
    ? `Topic · 第 ${state.compositeExam.currentIndex + 1 || 1} / ${state.compositeExam.articleIds.length || 4} 篇`
    : "Topic";
  els.examTopicText.textContent = current.topic;
  els.singleExamModeButton.classList.toggle("is-active", state.examType === "single");
  els.compositeExamModeButton.classList.toggle("is-active", state.examType === "composite");
  els.nextCompositeExamButton.hidden = state.examType !== "composite" || !state.compositeExam.active || state.compositeExam.currentIndex >= 3;
  els.startExamButton.hidden = false;
  els.clearExamButton.hidden = false;
  els.submitExamButton.textContent = state.examType === "composite" ? "提交考核" : "提交考核";
  els.examProgress.hidden = state.examType !== "composite";
  els.examProgress.innerHTML = state.examType === "composite" ? compositeProgressHtml() : "";

  if (state.examType === "single") {
    const progress = getArticleProgress(current.id);
    els.examScore.textContent = progress.examPassed
      ? "上次考核：满分通过"
      : progress.examChecked
        ? "上次考核：不及格"
        : "开考后限时 20 分钟，到时自动提交。";
  } else {
    els.examScore.textContent = state.compositeExam.active
      ? "下一篇只保存当前内容；提交考核后统一评分。"
      : "从题库随机抽取 4 篇，每篇限时 20 分钟。";
  }
}

function startCurrentExam() {
  if (state.examType === "composite") {
    startCompositeExam();
  } else {
    startSingleExam();
  }
}

function startSingleExam() {
  state.examType = "single";
  state.compositeExam.active = false;
  els.examResult.hidden = true;
  startTimer("exam");
}

function startCompositeExam() {
  if (state.compositeExam.active) {
    state.compositeExam.articleIds.forEach((id) => {
      delete persisted.examDrafts[id];
    });
  }
  state.examType = "composite";
  state.compositeExam = {
    active: true,
    articleIds: shuffledArticles().slice(0, 4).map((article) => article.id),
    currentIndex: 0,
    results: []
  };
  const first = currentExamArticle();
  if (first) state.activeArticleId = first.id;
  els.examInput.value = "";
  els.examResult.hidden = true;
  startTimer("exam");
  render();
}

function goToNextCompositeArticle() {
  if (state.examType !== "composite" || !state.compositeExam.active) return;
  saveExamDraft();
  if (state.compositeExam.currentIndex >= state.compositeExam.articleIds.length - 1) {
    showToast("已经是最后一篇，请提交考核。", true);
    return;
  }
  state.compositeExam.currentIndex += 1;
  const next = currentExamArticle();
  if (next) state.activeArticleId = next.id;
  els.examInput.value = persisted.examDrafts[next.id] || "";
  els.examResult.hidden = true;
  startTimer("exam");
  render();
}

function checkPractice() {
  const item = currentPracticeItem();
  const modules = practiceModules(item);
  let correct = 0;
  let total = 0;

  els.moduleGrid.querySelectorAll(".sentence-input").forEach((input) => {
    const expected = modules[input.dataset.module][Number(input.dataset.index)].answer;
    const actual = normalizeForPractice(input.value);
    const normalizedExpected = normalizeForPractice(expected);
    const ok = actual === normalizedExpected;
    const answerLine = input.closest(".sentence-row").querySelector(".answer-line");
    total += 1;
    correct += ok ? 1 : 0;
    input.classList.toggle("correct", ok);
    input.classList.toggle("wrong", !ok);
    answerLine.classList.toggle("is-visible", !ok || state.answersVisible);
    answerLine.innerHTML = ok
      ? answerHtml(normalizedExpected)
      : diffAnswerHtml(normalizedExpected, actual);
  });

  const id = item.id;
  const progress = updateProgressWithResult(id, correct === total, { correct, total });
  writeState();
  els.levelScore.textContent = scoreText(id);
  renderSummary();
  renderLevelList();
  showToast(
    correct === total
      ? `全部正确，近5次 ${windowCorrectCount(progress)}/5，当前：${masteryLevel(progress).label}。`
      : `正确 ${correct} / ${total}，近5次 ${windowCorrectCount(progress)}/5，当前：${masteryLevel(progress).label}。`,
    correct !== total
  );
}

function submitExam(options = {}) {
  const article = currentExamArticle();
  if (!article) return;
  if (!options.auto) {
    stopTimer(false);
    renderTimer();
  }
  saveExamDraft();
  if (state.examType === "composite") {
    submitCompositeExam();
    return;
  }
  const { passed, diffs } = gradeEssay(article, els.examInput.value);
  const progress = updateProgressWithResult(article.id, passed, {
    examChecked: true,
    examPassed: passed,
    total: sentenceCount(article),
    correct: passed ? sentenceCount(article) : 0
  });
  writeState();
  renderSummary();
  renderLevelList();
  renderExamResult(passed, diffs);
  showToast(
    passed
      ? `考核满分通过，近5次 ${windowCorrectCount(progress)}/5，当前：${masteryLevel(progress).label}。`
      : `考核不及格，近5次 ${windowCorrectCount(progress)}/5，当前：${masteryLevel(progress).label}。`,
    !passed
  );
}

function submitCompositeExam() {
  if (!state.compositeExam.active) {
    showToast("请先开始综合考核。", true);
    return;
  }
  stopTimer(false);
  renderTimer();
  saveExamDraft();
  const results = state.compositeExam.articleIds.map((id) => {
    const article = articles.find((item) => item.id === id);
    const value = persisted.examDrafts[id] || "";
    const { passed, diffs } = gradeEssay(article, value);
    updateProgressWithResult(article.id, passed, {
      examChecked: true,
      examPassed: passed,
      total: sentenceCount(article),
      correct: passed ? sentenceCount(article) : 0
    });
    return {
      id: article.id,
      title: article.title,
      topic: article.topic,
      passed,
      diffs
    };
  });
  state.compositeExam.results = results;
  writeState();
  renderSummary();
  renderLevelList();
  renderCompositeResult();
  const passedCount = results.filter((result) => result.passed).length;
  showToast(`综合考核已提交：${passedCount}/4 篇通过，${compositeScore(passedCount)} 分。`, passedCount < 4);
}

function gradeEssay(article, value) {
  const expectedParagraphs = article.paragraphs.map(normalizeForExact);
  const actualParagraphs = splitEssayInput(value);
  const diffs = [];
  const max = Math.max(expectedParagraphs.length, actualParagraphs.length);

  for (let index = 0; index < max; index += 1) {
    const expected = expectedParagraphs[index] || "";
    const actual = actualParagraphs[index] || "";
    if (actual !== expected) {
      diffs.push({
        index,
        expected,
        actual
      });
    }
  }

  return {
    passed: diffs.length === 0,
    diffs
  };
}

function renderExamResult(passed, diffs) {
  els.examResult.hidden = false;
  if (passed) {
    els.examResult.innerHTML = `
      <div class="exam-result-header pass">满分通过：整篇文章与标准答案完全匹配。</div>
    `;
    return;
  }

  els.examResult.innerHTML = `
    <div class="exam-result-header fail">不及格：${diffs.length} 个段落不匹配。</div>
    <div class="diff-list">
      ${diffs.map((diff) => `
        <div class="diff-item">
          <div class="diff-title">第 ${diff.index + 1} 段</div>
          ${examDiffHtml(diff)}
        </div>
      `).join("")}
    </div>
  `;
}

function renderCompositeResult() {
  els.examResult.hidden = false;
  const results = state.compositeExam.results;
  const passedCount = results.filter((result) => result.passed).length;
  const score = compositeScore(passedCount);
  const complete = results.length >= state.compositeExam.articleIds.length;
  els.examResult.innerHTML = `
    <div class="exam-result-header ${score === 100 ? "pass" : "fail"}">
      综合评分：${score} 分 · ${passedCount} / ${state.compositeExam.articleIds.length || 4} 篇通过${complete ? "" : " · 未完成"}
    </div>
    <div class="diff-list">
      ${results.map((result, index) => compositeResultHtml(result, index)).join("")}
    </div>
  `;
}

function compositeResultHtml(result, index) {
  if (result.passed) {
    return `
      <div class="diff-item">
        <div class="diff-title">第 ${index + 1} 篇 · ${escapeHtml(result.title)} · 通过</div>
        <div class="diff-cell expected">整篇文章与标准答案完全匹配。</div>
      </div>
    `;
  }
  return `
    <div class="diff-item">
      <div class="diff-title">第 ${index + 1} 篇 · ${escapeHtml(result.title)} · 不及格 · ${result.diffs.length} 个段落不匹配</div>
      <div class="diff-list">
        ${result.diffs.map((diff) => `
          <div class="diff-item">
            <div class="diff-title">第 ${diff.index + 1} 段</div>
            ${examDiffHtml(diff)}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function toggleAnswers() {
  state.answersVisible = !state.answersVisible;
  els.revealAllButton.textContent = state.answersVisible ? "隐藏答案" : "显示答案";
  document.querySelectorAll(".answer-line").forEach((line) => {
    line.classList.toggle("is-visible", state.answersVisible);
  });
}

function resetPracticeInputs() {
  const item = currentPracticeItem();
  if (!item) return;
  els.moduleGrid.querySelectorAll(".sentence-input").forEach((input) => {
    input.value = "";
    input.classList.remove("correct", "wrong");
  });
  Object.keys(persisted.drafts).forEach((key) => {
    if (key.startsWith(`${item.id}::`)) delete persisted.drafts[key];
  });
  writeState();
  showToast("已清空当前默写。");
}

function toggleMastered() {
  const article = getActiveArticle();
  if (!article) return;
  delete persisted.progress[article.id];
  writeState();
  render();
  showToast("已重置当前关卡进度。");
}

function clearExam() {
  const article = currentExamArticle();
  if (!article) return;
  els.examInput.value = "";
  delete persisted.examDrafts[article.id];
  els.examResult.hidden = true;
  writeState();
}

function goToNextArticle() {
  const index = articles.findIndex((article) => article.id === state.activeArticleId);
  const next = articles[(index + 1) % articles.length];
  if (!next) return;
  saveCurrentDrafts();
  state.activeArticleId = next.id;
  state.answersVisible = false;
  els.revealAllButton.textContent = "显示答案";
  render();
}

function startTimer(mode) {
  if (mode === "article") return;
  stopTimer(false);
  const seconds = MODE_LIMITS[mode] || 300;
  state.timer = {
    mode,
    endsAt: Date.now() + seconds * 1000,
    remaining: seconds,
    interval: window.setInterval(tickTimer, 250)
  };
  tickTimer();
  if (mode === "template") {
    els.moduleGrid.querySelector(".sentence-input")?.focus();
  } else if (mode === "exam") {
    els.examInput.focus();
  }
}

function tickTimer() {
  const remaining = Math.max(0, Math.ceil((state.timer.endsAt - Date.now()) / 1000));
  state.timer.remaining = remaining;
  renderTimer();
  if (remaining === 0) {
    stopTimer(true);
    if (state.mode === "exam") {
      if (state.examType === "composite") {
        advanceCompositeAfterTimeout();
      } else {
        submitExam({ auto: true });
      }
    } else if (state.mode === "template") {
      checkPractice();
    }
  }
}

function advanceCompositeAfterTimeout() {
  saveExamDraft();
  if (state.compositeExam.currentIndex >= state.compositeExam.articleIds.length - 1) {
    showToast("最后一篇时间到，请提交考核统一评分。", true);
    render();
    return;
  }
  state.compositeExam.currentIndex += 1;
  const next = currentExamArticle();
  if (next) state.activeArticleId = next.id;
  els.examInput.value = persisted.examDrafts[next.id] || "";
  els.examResult.hidden = true;
  startTimer("exam");
  render();
}

function stopTimer(ended) {
  if (state.timer.interval) window.clearInterval(state.timer.interval);
  state.timer.interval = null;
  if (ended) {
    showToast("时间到。", true);
  }
}

function renderTimer() {
  const seconds = state.timer.interval ? state.timer.remaining : MODE_LIMITS[state.mode];
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const showPracticeTimer = state.mode === "template";
  els.timerDisplay.hidden = state.mode === "article";
  els.startTimerButton.hidden = !showPracticeTimer;
  els.timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  els.timerDisplay.classList.toggle("is-warning", seconds <= 60 && seconds > 0);
  els.timerDisplay.classList.toggle("is-ended", seconds === 0);
  els.startTimerButton.textContent = state.timer.interval
    ? "计时中"
    : state.mode === "template"
      ? "开始 5 分钟"
      : "开始计时";
  els.startExamButton.textContent = state.timer.interval && state.mode === "exam" ? "计时中" : "开始";
}

function saveCurrentDrafts() {
  if (state.mode === "exam") saveExamDraft();
  else savePracticeDrafts();
}

function savePracticeDrafts() {
  const item = currentPracticeItem();
  if (!item) return;
  els.moduleGrid.querySelectorAll(".sentence-input").forEach((input) => {
    persisted.drafts[inputKey(item.id, input.dataset.module, input.dataset.index)] = input.value;
  });
  writeState();
}

function saveExamDraft() {
  const article = currentExamArticle();
  if (!article) return;
  persisted.examDrafts[article.id] = els.examInput.value;
  writeState();
}

function currentPracticeItem() {
  if (state.mode === "template") return template;
  return getActiveArticle();
}

function practiceModules(item) {
  if (item.id === template.id) return templatePracticeModules(item);
  return articlePracticeModules(item);
}

function templatePracticeModules(item) {
  return MODULES.reduce((modules, [key]) => {
    modules[key] = (item.modules[key] || []).map((sentence, index) => ({
      answer: sentence,
      label: `句子 ${index + 1}`
    }));
    return modules;
  }, {});
}

function articlePracticeModules(article) {
  return MODULES.reduce((modules, [key]) => {
    modules[key] = (article.modules[key] || []).flatMap((sentence, index) => {
      return extractArticleFields(key, sentence, index);
    });
    return modules;
  }, {});
}

function extractArticleFields(moduleKey, sentence, sentenceIndex) {
  if (sentence === "Nevertheless, others hold different opinions.") return [];

  const specs = (ARTICLE_SLOT_PATTERNS[moduleKey] || []).filter(Boolean);
  for (const spec of specs) {
    const match = sentence.match(spec.regex);
    if (!match) continue;

    const fields = [];
    match.slice(1).forEach((answer, captureIndex) => {
      if (!answer) return;
      fields.push({
        answer: `${answer.trim()}${spec.suffixes?.[captureIndex] || ""}`,
        label: spec.labels?.[captureIndex] || `空 ${fields.length + 1}`
      });
    });
    if (fields.length) return fields;
  }

  return [{
    answer: sentence.trim(),
    label: `额外句 ${sentenceIndex + 1}`
  }];
}

function answerHtml(expected) {
  return `
    <div class="answer-row">
      <span class="answer-label">标准答案</span>
      <span class="answer-text">${escapeHtml(expected)}</span>
    </div>
  `;
}

function diffAnswerHtml(expected, actual) {
  const expectedTokens = diffTokens(expected);
  const actualTokens = diffTokens(actual);
  const diff = tokenDiff(expectedTokens, actualTokens);
  return `
    <div class="answer-row">
      <span class="answer-label">你的答案</span>
      <span class="answer-text">${renderDiffTokens(diff.actual, "actual") || '<span class="muted-token">[空]</span>'}</span>
    </div>
    <div class="answer-row">
      <span class="answer-label">标准答案</span>
      <span class="answer-text">${renderDiffTokens(diff.expected, "expected") || '<span class="muted-token">[空]</span>'}</span>
    </div>
  `;
}

function examDiffHtml(diff) {
  const expected = diff.expected || "";
  const actual = diff.actual || "";
  const tokenDiffResult = tokenDiff(diffTokens(expected), diffTokens(actual));
  return `
    <div class="diff-columns">
      <div class="diff-cell expected">
        <strong>标准答案</strong>
        <div class="exam-diff-text">${renderDiffTokens(tokenDiffResult.expected, "expected") || '<span class="muted-token">[缺少标准段落]</span>'}</div>
      </div>
      <div class="diff-cell actual">
        <strong>你的答案</strong>
        <div class="exam-diff-text">${renderDiffTokens(tokenDiffResult.actual, "actual") || '<span class="muted-token">[未填写]</span>'}</div>
      </div>
    </div>
  `;
}

function diffTokens(value) {
  return String(value || "").match(/[A-Za-z0-9']+|[^\sA-Za-z0-9']/g) || [];
}

function tokenDiff(expectedTokens, actualTokens) {
  const rows = Array.from({ length: expectedTokens.length + 1 }, () => (
    Array(actualTokens.length + 1).fill(0)
  ));

  for (let i = expectedTokens.length - 1; i >= 0; i -= 1) {
    for (let j = actualTokens.length - 1; j >= 0; j -= 1) {
      rows[i][j] = expectedTokens[i] === actualTokens[j]
        ? rows[i + 1][j + 1] + 1
        : Math.max(rows[i + 1][j], rows[i][j + 1]);
    }
  }

  const expected = [];
  const actual = [];
  let i = 0;
  let j = 0;

  while (i < expectedTokens.length || j < actualTokens.length) {
    if (i < expectedTokens.length && j < actualTokens.length && expectedTokens[i] === actualTokens[j]) {
      expected.push({ value: expectedTokens[i], status: "same" });
      actual.push({ value: actualTokens[j], status: "same" });
      i += 1;
      j += 1;
    } else if (j < actualTokens.length && (i >= expectedTokens.length || rows[i][j + 1] >= rows[i + 1][j])) {
      actual.push({ value: actualTokens[j], status: "extra" });
      j += 1;
    } else {
      expected.push({ value: expectedTokens[i], status: "missing" });
      i += 1;
    }
  }

  return { expected, actual };
}

function renderDiffTokens(tokens, type) {
  return tokens.map((token, index) => {
    const prefix = index > 0 && shouldSeparate(tokens[index - 1].value, token.value) ? " " : "";
    const className = token.status === "same"
      ? "diff-token"
      : `diff-token ${type === "actual" ? "extra" : "missing"}`;
    return `${prefix}<mark class="${className}">${escapeHtml(token.value)}</mark>`;
  }).join("");
}

function shouldSeparate(previous, current) {
  return isWordToken(previous) && isWordToken(current);
}

function isWordToken(token) {
  return /^[A-Za-z0-9']+$/.test(token);
}

function getActiveArticle() {
  return articles.find((article) => article.id === state.activeArticleId) || articles[0];
}

function currentExamArticle() {
  if (state.examType === "composite" && state.compositeExam.active) {
    const id = state.compositeExam.articleIds[state.compositeExam.currentIndex];
    return articles.find((article) => article.id === id) || getActiveArticle();
  }
  return getActiveArticle();
}

function getArticleProgress(id) {
  return persisted.progress[id] || { recentResults: [] };
}

function getProgress(id) {
  return persisted.progress[id] || {};
}

function scoreText(id) {
  const progress = getProgress(id);
  const level = masteryLevel(progress);
  const results = recentResults(progress);
  const windowText = `近5次 ${windowCorrectCount(progress)} / 5`;
  if (!progress.total) return `未检查 · ${level.label} · ${windowText}`;
  return `${progress.correct || 0} / ${progress.total} 正确 · ${level.label} · ${windowText}`;
}

function updateProgressWithResult(id, allCorrect, extra = {}) {
  const previous = getProgress(id);
  const results = [...recentResults(previous), Boolean(allCorrect)].slice(-5);
  const correctInWindow = results.filter(Boolean).length;
  const next = {
    ...previous,
    ...extra,
    recentResults: results,
    correctInWindow,
    mastery: masteryLevel({ recentResults: results }).key,
    mastered: correctInWindow >= 5,
    checkedAt: new Date().toISOString()
  };
  persisted.progress[id] = next;
  return next;
}

function masteryLevel(progress) {
  const correctInWindow = windowCorrectCount(progress);
  return MASTERY_STEPS.reduce((current, step) => {
    return correctInWindow >= step.minCorrect ? step : current;
  }, MASTERY_STEPS[0]);
}

function recentResults(progress) {
  if (Array.isArray(progress?.recentResults)) {
    return progress.recentResults.slice(-5).map(Boolean);
  }
  const streak = Math.min(progress?.correctStreak || 0, 5);
  return Array.from({ length: streak }, () => true);
}

function windowCorrectCount(progress) {
  return recentResults(progress).filter(Boolean).length;
}

function shuffledArticles() {
  return [...articles]
    .map((article) => ({ article, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ article }) => article);
}

function compositeScore(passedCount) {
  if (passedCount >= 4) return 100;
  if (passedCount === 3) return 75;
  if (passedCount === 2) return 50;
  return 0;
}

function compositeProgressHtml() {
  if (!state.compositeExam.active) {
    return "尚未开始综合考核。";
  }
  const ids = state.compositeExam.articleIds;
  return ids.map((id, index) => {
    const article = articles.find((item) => item.id === id);
    const result = state.compositeExam.results.find((item) => item.id === id);
    const hasDraft = Boolean((persisted.examDrafts[id] || "").trim());
    const stateText = result
      ? (result.passed ? "通过" : "不及格")
      : index === state.compositeExam.currentIndex
        ? "进行中"
        : hasDraft
          ? "已写"
          : "待写";
    return `<span class="exam-progress-item ${result?.passed ? "pass" : result ? "fail" : ""}">${index + 1}. ${escapeHtml(article?.title || id)} · ${stateText}</span>`;
  }).join("");
}

function sentenceCount(item) {
  return MODULES.reduce((sum, [key]) => sum + (item.modules[key] || []).length, 0);
}

function practiceFieldCount(item) {
  const modules = practiceModules(item);
  return MODULES.reduce((sum, [key]) => sum + (modules[key] || []).length, 0);
}

function inputKey(itemId, moduleKey, index) {
  const scope = itemId === template.id ? "template-full" : "article-slots";
  return `${itemId}::${scope}::${moduleKey}::${index}`;
}

function splitEssayInput(value) {
  return value
    .split(/\n\s*\n/)
    .map(normalizeForExact)
    .filter(Boolean);
}

function normalizeForExact(value) {
  return String(value || "").trim();
}

function normalizeForPractice(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1");
}

function assetUrl(rawPath) {
  return String(rawPath || "").split("/").map((segment) => {
    if (segment === "." || segment === "..") return segment;
    return encodeURIComponent(decodeURIComponent(segment));
  }).join("/");
}

function openImageFullscreen() {
  if (!els.levelImage.src) return;
  els.imageFrame.classList.add("is-expanded");
  els.toggleImageButton.textContent = "收起";
  if (document.fullscreenElement) {
    document.exitFullscreen();
    return;
  }
  if (els.imageFrame.requestFullscreen) {
    els.imageFrame.requestFullscreen().catch(() => {
      window.open(els.levelImage.src, "_blank", "noopener");
    });
  } else {
    window.open(els.levelImage.src, "_blank", "noopener");
  }
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
}

function showToast(message, warn = false) {
  document.querySelector(".toast")?.remove();
  const toast = document.createElement("div");
  toast.className = `toast ${warn ? "warn" : ""}`;
  toast.textContent = message;
  document.body.append(toast);
  window.setTimeout(() => toast.remove(), 2600);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("\n", " ");
}
