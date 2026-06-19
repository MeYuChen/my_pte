const MODULES = [
  ["introduction", "第一段 / Introduction"],
  ["argument1", "第二段 / Argument 1"],
  ["argument2", "第三段 / Argument 2"],
  ["conclusion", "第四段 / Conclusion"]
];

const STORAGE_KEY = "pte-we-v2-state";
const SIDEBAR_STATE_KEY = "pte-we-sidebar-collapsed";
const USER_ARTICLES_KEY = "pte-we-user-articles-v1";
const USER_TEMPLATE_KEY = "pte-we-user-template-v1";
const MODE_LIMITS = {
  template: 300,
  memory: 0,
  article: 300,
  exam: 1200,
  import: 0
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
const demoArticles = data?.articles || [];
const userArticles = loadUserArticles();
const articles = [...demoArticles, ...userArticles];
const template = data?.template;
const userTemplate = loadUserTemplate();
const preloadedImages = new Map();
const articleImageUrls = new Set(articles.map((article) => assetUrl(article.image)).filter(Boolean));
const IMAGE_PRELOAD_CONCURRENCY = 3;
const IMAGE_CACHE_NAME = "pte-we-images-v1";
const imagePreload = {
  active: 0,
  queue: [],
  queued: new Set(),
  loading: new Set(),
  loaded: new Set(),
  failed: new Set(),
  allQueued: false
};

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
  },
  pendingImport: null,
  templateConflictChoice: null,
  imageViewer: {
    scale: 1,
    x: 0,
    y: 0,
    dragging: false,
    lastX: 0,
    lastY: 0
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
  importArticleButton: document.getElementById("importArticleButton"),
  promptPanel: document.getElementById("promptPanel"),
  topicText: document.getElementById("topicText"),
  positionText: document.getElementById("positionText"),
  imageSection: document.getElementById("imageSection"),
  levelImage: document.getElementById("levelImage"),
  imageFrame: document.getElementById("imageFrame"),
  imagePreviousButton: document.getElementById("imagePreviousButton"),
  imageNextButton: document.getElementById("imageNextButton"),
  imageViewerStatus: document.getElementById("imageViewerStatus"),
  toggleImageButton: document.getElementById("toggleImageButton"),
  practicePanel: document.getElementById("practicePanel"),
  practiceTitle: document.getElementById("practiceTitle"),
  levelScore: document.getElementById("levelScore"),
  startTimerButton: document.getElementById("startTimerButton"),
  resetInputsButton: document.getElementById("resetInputsButton"),
  revealAllButton: document.getElementById("revealAllButton"),
  checkButton: document.getElementById("checkButton"),
  moduleGrid: document.getElementById("moduleGrid"),
  memoryCardPanel: document.getElementById("memoryCardPanel"),
  memoryCardMeta: document.getElementById("memoryCardMeta"),
  memoryCardPreview: document.getElementById("memoryCardPreview"),
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

Object.assign(els, {
  importPanel: document.getElementById("importPanel"),
  importMeta: document.getElementById("importMeta"),
  importTemplateInput: document.getElementById("importTemplateInput"),
  templateConflict: document.getElementById("templateConflict"),
  useArticleTemplateButton: document.getElementById("useArticleTemplateButton"),
  useGlobalTemplateButton: document.getElementById("useGlobalTemplateButton"),
  restoreTemplateButton: document.getElementById("restoreTemplateButton"),
  importEssayInput: document.getElementById("importEssayInput"),
  importResult: document.getElementById("importResult"),
  importIssues: document.getElementById("importIssues"),
  importReview: document.getElementById("importReview"),
  importReviewSummary: document.getElementById("importReviewSummary"),
  importPositionOptions: document.getElementById("importPositionOptions"),
  importManualPositionInput: document.getElementById("importManualPositionInput"),
  clearImportButton: document.getElementById("clearImportButton"),
  saveTemplateButton: document.getElementById("saveTemplateButton"),
  saveImportButton: document.getElementById("saveImportButton"),
  confirmImportButton: document.getElementById("confirmImportButton")
});

els.importTemplateInput.value = userTemplate.raw;
bindEvents();
renderSidebarState();
render();
registerImageCacheWorker().finally(scheduleImageCacheWarmup);

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
  els.imageFrame.addEventListener("wheel", handleImageWheel, { passive: false });
  els.imageFrame.addEventListener("pointerdown", startImagePan);
  els.imageFrame.addEventListener("pointermove", moveImagePan);
  els.imageFrame.addEventListener("pointerup", endImagePan);
  els.imageFrame.addEventListener("pointercancel", endImagePan);
  els.imageFrame.addEventListener("lostpointercapture", endImagePan);
  document.addEventListener("fullscreenchange", handleImageFullscreenChange);
  document.addEventListener("keydown", handleImageViewerKeydown);
  els.imagePreviousButton.addEventListener("click", (event) => {
    event.stopPropagation();
    showAdjacentImage(-1);
  });
  els.imagePreviousButton.addEventListener("dblclick", (event) => {
    event.stopPropagation();
  });
  els.imageNextButton.addEventListener("click", (event) => {
    event.stopPropagation();
    showAdjacentImage(1);
  });
  els.imageNextButton.addEventListener("dblclick", (event) => {
    event.stopPropagation();
  });
  els.levelImage.addEventListener("load", handleLevelImageLoad);
  els.levelImage.addEventListener("error", handleLevelImageError);
  els.levelImage.draggable = false;

  els.startTimerButton.addEventListener("click", () => {
    if (state.mode === "template") startTimer(state.mode);
  });
  els.checkButton.addEventListener("click", checkPractice);
  els.revealAllButton.addEventListener("click", toggleAnswers);
  els.resetInputsButton.addEventListener("click", resetPracticeInputs);
  els.markMasteredButton.addEventListener("click", toggleMastered);
  els.nextLevelButton.addEventListener("click", goToNextArticle);
  els.memoryCardPreview.addEventListener("click", (event) => {
    if (event.target.closest(".memory-card-next-button")) goToNextArticle();
  });
  els.importArticleButton.addEventListener("click", () => {
    saveCurrentDrafts();
    setMode("import");
  });

  els.singleExamModeButton.addEventListener("click", () => setExamType("single"));
  els.compositeExamModeButton.addEventListener("click", () => setExamType("composite"));
  els.startExamButton.addEventListener("click", startCurrentExam);
  els.nextCompositeExamButton.addEventListener("click", goToNextCompositeArticle);
  els.submitExamButton.addEventListener("click", () => submitExam({ auto: false }));
  els.clearExamButton.addEventListener("click", clearExam);
  els.examInput.addEventListener("input", saveExamDraft);
  els.clearImportButton.addEventListener("click", clearImportForm);
  els.saveTemplateButton.addEventListener("click", saveUserTemplate);
  els.saveImportButton.addEventListener("click", saveImportedArticle);
  els.confirmImportButton.addEventListener("click", confirmImportedArticle);
  els.importTemplateInput.addEventListener("input", handleImportTemplateChange);
  els.useArticleTemplateButton.addEventListener("click", () => resolveTemplateConflict("article"));
  els.useGlobalTemplateButton.addEventListener("click", () => resolveTemplateConflict("global"));
  els.restoreTemplateButton.addEventListener("click", () => resolveTemplateConflict("restore"));
  els.importIssues.addEventListener("click", handleImportIssueClick);
}

function toggleSidebar() {
  state.sidebarCollapsed = !state.sidebarCollapsed;
  localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(state.sidebarCollapsed));
  renderSidebarState();
}

function renderSidebarState() {
  els.appShell.classList.toggle("is-sidebar-collapsed", state.sidebarCollapsed);
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
  const customCount = userArticles.length ? ` · 自定义 ${userArticles.length}` : "";
  els.progressSummary.textContent = `${mastered} / ${articles.length} 已掌握${customCount}`;
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
    const haystack = `${article.number} ${article.title} ${article.name} ${article.topic} ${article.position} ${article.baseTitle || ""}`.toLowerCase();
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
              : `${article.source === "user" ? "自定义 · " : ""}${practiceFieldCount(article)} 空 · 近5次 ${windowCorrectCount(progress)}/5`
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
        if (state.mode === "template" || state.mode === "import") setMode("memory");
        else render();
      });
      return button;
    })
  );
}

function renderMain() {
  const item = currentPracticeItem();
  if (!item) return;
  const activeArticle = getActiveArticle();
  const shouldShowArticleImage = state.mode === "article" && Boolean(activeArticle?.image);
  const showMemoryCard = state.mode === "memory";

  els.practicePanel.hidden = state.mode === "exam" || state.mode === "import" || showMemoryCard;
  els.memoryCardPanel.hidden = !showMemoryCard;
  els.examPanel.hidden = state.mode !== "exam";
  els.importPanel.hidden = state.mode !== "import";
  els.markMasteredButton.hidden = state.mode === "template" || state.mode === "exam" || state.mode === "import";
  els.nextLevelButton.hidden = state.mode === "template" || state.mode === "memory" || state.mode === "exam" || state.mode === "import";
  els.importArticleButton.hidden = state.mode === "template" || state.mode === "exam" || state.mode === "import";
  els.promptPanel.hidden = state.mode === "template" || state.mode === "exam" || state.mode === "import";
  els.imageSection.hidden = !shouldShowArticleImage;
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
  } else if (state.mode === "import") {
    const article = resolveBaseArticle(getActiveArticle());
    els.levelNumber.textContent = "自定义导入";
    els.levelTitle.textContent = "导入我的版本";
    els.timerDisplay.hidden = true;
    els.importMeta.textContent = `当前题目：${article?.title || "未选择"}。已保存模板：${userTemplate.raw ? "有" : "无"}。自定义作文：${userArticles.length} 篇。`;
    renderTemplateConflict();
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
      if (state.mode === "article" && article.image) {
        const imageUrl = assetUrl(article.image);
        if (els.levelImage.getAttribute("src") !== imageUrl) {
          showImageLoading(article);
          els.levelImage.src = imageUrl;
        } else {
          updateImageViewerStatus(article, "");
        }
        els.levelImage.alt = article.title;
        preloadNeighborImages(article.id);
      } else {
        els.levelImage.removeAttribute("src");
        els.levelImage.alt = "";
        updateImageViewerStatus(article, "");
      }
      els.practiceTitle.textContent = "文章论点默写";
      els.levelScore.textContent = scoreText(article.id);
      els.markMasteredButton.textContent = "重置进度";
    }
    renderExam(article);
  }

  if (showMemoryCard) renderMemoryCard(getActiveArticle());
  if (state.mode === "template" || state.mode === "article") renderPractice(item);
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

function renderMemoryCard(article) {
  if (!article) return;
  const card = getMemoryCard(article);
  els.memoryCardMeta.textContent = card.status === "confirmed"
    ? "只读速记浏览，点“下一篇”快速切换。"
    : "自动生成的速记草稿，建议先检查后再用于背诵。";

  const sectionHtml = card.sections.map((section) => `
    <article class="memory-section">
      <h4>${escapeHtml(section.title)}</h4>
      <div class="memory-section-list">
        ${section.items.length ? section.items.map((item) => `
          <div class="memory-item">
            <span>${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(item.answer)}</strong>
          </div>
        `).join("") : '<p class="memory-empty">暂无核心内容</p>'}
      </div>
    </article>
  `).join("");

  const flowMap = Object.fromEntries(card.flow.map((item) => [item.key || item.label, item]));
  const topicNode = flowMap.topic || card.flow[0];
  const thesisNode = flowMap.thesis || card.flow[1];
  const argument1Node = flowMap.argument1 || card.flow[2];
  const argument2Node = flowMap.argument2 || card.flow[3];
  const conclusionNode = flowMap.conclusion || card.flow[4];

  els.memoryCardPreview.innerHTML = `
    <article class="memory-card">
      <header class="memory-card-header">
        <p>PTE WE Mind Map</p>
        <h3>${escapeHtml(card.title)}</h3>
      </header>
      <section class="memory-flow">
        ${renderMemoryFlowNode(topicNode, "topic")}
        ${renderMemoryFlowNode(thesisNode, "thesis")}
        <div class="memory-branch-group">
          ${renderMemoryFlowNode(argument1Node, "argument")}
          ${renderMemoryFlowNode(argument2Node, "argument")}
        </div>
        ${renderMemoryFlowNode(conclusionNode, "conclusion")}
        <button class="memory-card-next-button" type="button" aria-label="下一篇">下一篇 ›</button>
      </section>
        <section class="memory-sections">
          <div class="memory-sections-heading">原文核心句子 / Core Sentences</div>
          <div class="memory-section-grid">
          ${sectionHtml}
          </div>
        </section>
      <section class="memory-mnemonic">
        <span>记忆口诀 / Memory Hook</span>
        <p id="memoryMnemonicText">${escapeHtml(card.mnemonic || "暂无口诀")}</p>
      </section>
    </article>
  `;
}

function renderMemoryFlowNode(item, type) {
  if (!item) return "";
  return `
    <div class="memory-flow-node ${type}">
      <span>${escapeHtml(item.label)}</span>
      <strong class="memory-cn-text" data-card-key="${escapeAttr(item.key || "")}">${escapeHtml(item.cn || "暂无中文速记")}</strong>
    </div>
  `;
}

function getMemoryCard(article) {
  if (article.memoryCard) return normalizeMemoryCard(article.memoryCard) || article.memoryCard;
  const card = buildMemoryCardDraft({
    title: article.name || article.title,
    topic: article.topic,
    position: article.position,
    practiceFields: practiceModulesToFields(articlePracticeModules(article))
  });
  article.memoryCard = card;
  return card;
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

function clearImportForm() {
  els.importEssayInput.value = "";
  els.importManualPositionInput.value = "";
  els.importResult.hidden = true;
  els.importResult.textContent = "";
  els.importIssues.hidden = true;
  els.importIssues.replaceChildren();
  els.importReview.hidden = true;
  els.importPositionOptions.replaceChildren();
  els.importReviewSummary.textContent = "";
  state.pendingImport = null;
  state.templateConflictChoice = null;
  renderTemplateConflict();
}

function handleImportTemplateChange() {
  state.templateConflictChoice = null;
  state.pendingImport = null;
  els.importReview.hidden = true;
  els.importIssues.hidden = true;
  els.importIssues.replaceChildren();
  renderTemplateConflict();
}

function resolveTemplateConflict(choice) {
  if (choice === "restore") {
    els.importTemplateInput.value = userTemplate.raw;
    state.templateConflictChoice = null;
    renderTemplateConflict();
    renderImportResult("已恢复为已保存的通用模板。");
    return;
  }

  state.templateConflictChoice = choice;
  renderTemplateConflict();
  if (choice === "article") {
    renderImportResult("本次将仅用当前模板适配这篇文章，不会修改通用模板。");
  } else {
    renderImportResult("本次将把当前模板保存为新的通用模板，用于后续文章。");
  }
}

function hasTemplateConflict() {
  const current = normalizeForExact(els.importTemplateInput.value);
  return Boolean(userTemplate.raw && current && current !== userTemplate.raw);
}

function resolveImportTemplateForMatch() {
  if (hasTemplateConflict() && state.templateConflictChoice === "restore") return userTemplate.raw;
  return normalizeForExact(els.importTemplateInput.value) || userTemplate.raw;
}

function renderTemplateConflict(force = false) {
  const show = force || (hasTemplateConflict() && !state.templateConflictChoice);
  els.templateConflict.hidden = !show;
}

function saveUserTemplate() {
  const raw = normalizeForExact(els.importTemplateInput.value);
  const parsed = parseTemplateInput(raw);
  if (!raw) {
    renderImportResult("请先粘贴你的作文模板。", true);
    return;
  }
  if (parsed.errors.length) {
    renderImportResult(parsed.errors.join("\n"), true);
    return;
  }
  userTemplate.raw = raw;
  userTemplate.parsed = parsed.modules;
  state.templateConflictChoice = null;
  writeUserTemplate();
  renderTemplateConflict();
  renderImportResult(`模板已保存：${parsed.slotCount} 个核心空位，${parsed.sentenceCount} 个模板句。`);
  render();
}

function saveImportedArticle() {
  const activeArticle = resolveBaseArticle(getActiveArticle());
  const rawTemplate = resolveImportTemplateForMatch();
  const paragraphs = splitEssayInput(els.importEssayInput.value);
  const parsedTemplate = parseTemplateInput(rawTemplate);

  if (!activeArticle) {
    renderImportResult("请先在左侧选择要导入的高频题目。", true);
    return;
  }
  if (!rawTemplate) {
    renderImportResult("还没有作文模板。请先粘贴你的模板并点击“保存模板”。", true);
    return;
  }
  if (hasTemplateConflict() && !state.templateConflictChoice) {
    renderTemplateConflict(true);
    renderImportResult("检测到当前模板和已保存的通用模板不一致，请先选择模板适配方式。", true);
    return;
  }
  if (parsedTemplate.errors.length) {
    renderImportResult(parsedTemplate.errors.join("\n"), true);
    renderImportIssues(parsedTemplate.errors.map((message) => ({
      severity: "error",
      title: "模板格式问题",
      message
    })));
    return;
  }
  if (paragraphs.length !== MODULES.length) {
    const issue = {
      severity: "error",
      title: "作文段落数量不正确",
      message: `作文需要 ${MODULES.length} 段，当前识别到 ${paragraphs.length} 段。请用空行分隔段落。`
    };
    renderImportResult("强审核未通过，请先修改作文格式。", true);
    renderImportIssues([issue]);
    return;
  }
  if (state.templateConflictChoice === "global" && rawTemplate !== userTemplate.raw) {
    userTemplate.raw = rawTemplate;
    userTemplate.parsed = parsedTemplate.modules;
    writeUserTemplate();
    renderTemplateConflict();
  }

  const auditIssues = auditImportText(rawTemplate, els.importEssayInput.value, parsedTemplate.modules);
  if (auditIssues.length) {
    renderImportResult("强审核未通过，请先修改模板或作文原文。", true);
    renderImportIssues(auditIssues);
    els.importReview.hidden = true;
    state.pendingImport = null;
    return;
  }

  const match = matchEssayWithTemplate(parsedTemplate.modules, paragraphs);
  if (!match.ok) {
    renderImportResult(matchReportText(match), true);
    renderImportIssues(match.failures);
    els.importReview.hidden = true;
    state.pendingImport = null;
    return;
  }

  state.pendingImport = {
    baseArticleId: activeArticle.id,
    paragraphs,
    match,
    templateSnapshot: rawTemplate,
    templateScope: state.templateConflictChoice === "article" ? "article" : "global",
    extractedFields: flattenPracticeFields(match.practiceFields)
  };
  renderImportReview(state.pendingImport);
  renderImportResult("模板匹配成功。请确认 Position 后保存。");
  els.importIssues.hidden = true;
  els.importIssues.replaceChildren();
}

function confirmImportedArticle() {
  if (!state.pendingImport) {
    renderImportResult("请先生成审核结果。", true);
    return;
  }

  const baseArticle = articles.find((article) => article.id === state.pendingImport.baseArticleId);
  if (!baseArticle) {
    renderImportResult("未找到对应的高频题目，请重新选择题目后导入。", true);
    return;
  }

  const selected = els.importPositionOptions.querySelector("input[name='importPositionChoice']:checked");
  const manualPosition = normalizeForPractice(els.importManualPositionInput.value);
  const selectedField = state.pendingImport.extractedFields[Number(selected?.value)];
  const position = manualPosition || selectedField?.answer || "";
  const positionSource = manualPosition ? "manual" : selectedField ? "selected" : "unset";

  if (!position) {
    renderImportResult("请选择一个核心内容作为 Position，或手动输入 Position。", true);
    return;
  }

  const article = buildImportedArticle({
    baseArticle,
    paragraphs: state.pendingImport.paragraphs,
    match: state.pendingImport.match,
    position,
    positionSource,
    templateSnapshot: state.pendingImport.templateSnapshot,
    templateScope: state.pendingImport.templateScope
  });
  userArticles.push(article);
  articles.push(article);
  writeUserArticles();
  state.activeArticleId = article.id;
  state.mode = "memory";
  state.answersVisible = false;
  document.querySelectorAll(".mode-tab").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === state.mode);
  });
  clearImportForm();
  render();
  showToast("已确认 Position，并生成速记卡片。");
}

function renderImportResult(message, warn = false) {
  els.importResult.hidden = false;
  els.importResult.classList.toggle("warn", warn);
  els.importResult.innerHTML = escapeHtml(message).replaceAll("\n", "<br>");
}

function renderImportIssues(issues) {
  const normalizedIssues = issues
    .map((issue) => typeof issue === "string" ? { severity: "error", title: "审核问题", message: issue } : issue)
    .filter(Boolean);

  els.importIssues.hidden = normalizedIssues.length === 0;
  els.importIssues.replaceChildren(
    ...normalizedIssues.map((issue, index) => {
      const card = document.createElement("article");
      card.className = `import-issue ${issue.severity || "error"}`;
      const location = issue.moduleLabel
        ? `${issue.moduleLabel}${Number.isInteger(issue.sentenceIndex) ? ` · 第 ${issue.sentenceIndex + 1} 句` : ""}`
        : "";
      card.innerHTML = `
        <div class="import-issue-title">
          <strong>${escapeHtml(issue.title || "审核问题")}</strong>
          ${location ? `<span>${escapeHtml(location)}</span>` : ""}
        </div>
        <p>${escapeHtml(issue.message || "")}</p>
        ${issue.templateSentence ? `
          <div class="issue-quote">
            <b>模板句</b>
            <mark>${escapeHtml(issue.templateSentence)}</mark>
          </div>
        ` : ""}
        ${issue.essaySentence ? `
          <div class="issue-quote original">
            <b>${issue.targetInput === "template" ? "模板原文处" : "作文原文处"}</b>
            <mark>${escapeHtml(issue.essaySentence)}</mark>
          </div>
          <button class="ghost-button issue-locate-button" type="button" data-issue-index="${index}">定位原文</button>
        ` : ""}
      `;
      return card;
    })
  );
  els.importIssues.dataset.issues = JSON.stringify(normalizedIssues.map((issue) => ({
    essaySentence: issue.essaySentence || "",
    targetInput: issue.targetInput || "essay"
  })));
}

function handleImportIssueClick(event) {
  const button = event.target.closest(".issue-locate-button");
  if (!button) return;
  const index = Number(button.dataset.issueIndex);
  const issues = readIssuesFromDataset();
  const issue = issues[index];
  const sentence = issue?.essaySentence;
  if (!sentence) return;
  focusImportText(issue.targetInput === "template" ? els.importTemplateInput : els.importEssayInput, sentence);
}

function readIssuesFromDataset() {
  try {
    return JSON.parse(els.importIssues.dataset.issues || "[]");
  } catch {
    return [];
  }
}

function focusImportText(input, sentence) {
  const raw = input.value;
  const normalizedNeedle = normalizeForPractice(sentence);
  const directIndex = raw.indexOf(sentence);
  const index = directIndex >= 0 ? directIndex : findNormalizedTextIndex(raw, normalizedNeedle);
  input.focus();
  if (index < 0) return;
  const end = Math.min(raw.length, index + sentence.length);
  input.setSelectionRange(index, end);
}

function findNormalizedTextIndex(raw, normalizedNeedle) {
  if (!normalizedNeedle) return -1;
  for (let start = 0; start < raw.length; start += 1) {
    for (let end = start + 1; end <= raw.length; end += 1) {
      const slice = raw.slice(start, end);
      const normalized = normalizeForPractice(slice);
      if (normalized.length > normalizedNeedle.length + 8) break;
      if (normalized === normalizedNeedle) return start;
    }
  }
  return -1;
}

function renderImportReview(pendingImport) {
  const fields = pendingImport.extractedFields;
  const recommendedIndex = recommendPositionIndex(fields);
  els.importReview.hidden = false;
  els.importReviewSummary.textContent = `匹配 ${pendingImport.match.matchedSentences}/${pendingImport.match.totalSentences} 句，抽取 ${pendingImport.match.extractedSlots} 个核心内容。Position 需要你确认。`;
  els.importManualPositionInput.value = fields[recommendedIndex]?.answer || "";
  els.importPositionOptions.replaceChildren(
    ...fields.map((field, index) => {
      const id = `importPositionChoice${index}`;
      const label = document.createElement("label");
      label.className = "position-option";
      label.innerHTML = `
        <input type="radio" name="importPositionChoice" value="${index}" ${index === recommendedIndex ? "checked" : ""}>
        <span>
          <strong>${escapeHtml(field.label)}${index === recommendedIndex ? " · 推荐" : ""}</strong>
          <small>${escapeHtml(field.answer)}</small>
        </span>
      `;
      label.querySelector("input").id = id;
      label.querySelector("input").addEventListener("change", () => {
        els.importManualPositionInput.value = field.answer;
      });
      return label;
    })
  );
}

function auditImportText(rawTemplate, rawEssay, templateModules) {
  return [
    ...auditTextSurface(rawTemplate, "模板", splitEssayInput(rawTemplate), templateModules, { allowPlaceholders: true }),
    ...auditTextSurface(rawEssay, "作文原文", splitEssayInput(rawEssay), null, { allowPlaceholders: false })
  ];
}

function auditTextSurface(rawText, sourceLabel, paragraphs, templateModules, options = {}) {
  const issues = [];
  if (/\s+[,.!?;:]/.test(rawText)) {
    issues.push({
      severity: "error",
      title: `${sourceLabel}标点前有多余空格`,
      message: "英文标点前不应有空格，例如应写成 word, 而不是 word ,。"
    });
  }
  if (/[，。！？；：]/.test(rawText)) {
    issues.push({
      severity: "error",
      title: `${sourceLabel}包含中文标点`,
      message: "WE 英文作文建议统一使用英文标点，避免背诵时格式混乱。"
    });
  }
  if (/[!?.,;:]{2,}/.test(rawText)) {
    issues.push({
      severity: "error",
      title: `${sourceLabel}包含重复标点`,
      message: "发现连续标点，请检查是否误粘贴或漏改。"
    });
  }
  if (/ {2,}/.test(rawText)) {
    issues.push({
      severity: "error",
      title: `${sourceLabel}包含连续空格`,
      message: "发现连续空格，请统一为单个空格，避免影响模板匹配和背诵。"
    });
  }
  if (!hasBalancedPairs(rawText, "(", ")") || !hasBalancedPairs(rawText, "（", "）")) {
    issues.push({
      severity: "error",
      title: `${sourceLabel}括号不成对`,
      message: "发现括号数量不一致，请检查是否漏删或漏补。"
    });
  }
  if (!hasEvenCount(rawText, "\"") || !hasBalancedPairs(rawText, "“", "”")) {
    issues.push({
      severity: "error",
      title: `${sourceLabel}引号可能不成对`,
      message: "发现引号数量异常，请检查引用符号。"
    });
  }

  paragraphs.forEach((paragraph, paragraphIndex) => {
    const module = MODULES[paragraphIndex];
    const moduleKey = module?.[0] || "";
    const moduleLabel = module?.[1] || `第 ${paragraphIndex + 1} 段`;
    const sentences = splitParagraphIntoSentences(paragraph);
    sentences.forEach((sentence, sentenceIndex) => {
      const clean = normalizeForPractice(sentence);
      if (!/[.!?]$/.test(clean)) {
        issues.push(sentenceIssue({
          sourceLabel,
          title: "句子缺少结尾标点",
          message: "句子应以英文句号、问号或感叹号结尾。",
          moduleKey,
          moduleLabel,
          paragraphIndex,
          sentenceIndex,
          sentence: clean
        }));
      }
      const firstLetter = clean.match(/[A-Za-z]/)?.[0];
      if (firstLetter && firstLetter !== firstLetter.toUpperCase()) {
        issues.push(sentenceIssue({
          sourceLabel,
          title: "句子可能没有大写开头",
          message: "句子首个英文字母应大写，请检查是否漏了大写或句子切分有误。",
          moduleKey,
          moduleLabel,
          paragraphIndex,
          sentenceIndex,
          sentence: clean
        }));
      }
      if (!options.allowPlaceholders && /\(\s*\)|（\s*）/.test(clean)) {
        issues.push(sentenceIssue({
          sourceLabel,
          title: "作文原文仍包含模板占位符",
          message: "作文原文里不应出现 ()，请补全后再导入。",
          moduleKey,
          moduleLabel,
          paragraphIndex,
          sentenceIndex,
          sentence: clean
        }));
      }
    });
  });

  return issues;
}

function sentenceIssue({ sourceLabel, title, message, moduleKey, moduleLabel, paragraphIndex, sentenceIndex, sentence }) {
  return {
    severity: "error",
    title: `${sourceLabel}${title}`,
    message,
    moduleKey,
    moduleLabel,
    paragraphIndex,
    sentenceIndex,
    essaySentence: sentence,
    targetInput: sourceLabel === "模板" ? "template" : "essay"
  };
}

function hasBalancedPairs(value, open, close) {
  const opens = String(value).split(open).length - 1;
  const closes = String(value).split(close).length - 1;
  return opens === closes;
}

function hasEvenCount(value, token) {
  return (String(value).split(token).length - 1) % 2 === 0;
}

function flattenPracticeFields(practiceFields) {
  return MODULES.flatMap(([key]) => {
    return (practiceFields[key] || []).map((field) => ({
      ...field,
      moduleKey: key
    }));
  });
}

function recommendPositionIndex(fields) {
  const strongPattern = /point of view|believe|agree|disagree|argue|support|essay/i;
  const strongIndex = fields.findIndex((field) => (
    strongPattern.test(field.templateSentence || "") ||
    strongPattern.test(field.label) ||
    strongPattern.test(field.answer)
  ));
  if (strongIndex >= 0) return strongIndex;

  const introFields = fields
    .map((field, index) => ({ field, index }))
    .filter(({ field }) => field.moduleKey === "introduction");
  if (introFields.length) return introFields[introFields.length - 1].index;

  return 0;
}

function buildImportedArticle({ baseArticle, paragraphs, match, position, positionSource, templateSnapshot, templateScope }) {
  const id = `custom:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 8)}`;
  const modules = MODULES.reduce((result, [key], index) => {
    result[key] = splitParagraphIntoSentences(paragraphs[index] || "");
    return result;
  }, {});
  const versionCount = userArticles.filter((article) => article.parentId === baseArticle.id).length + 1;
  const name = `${baseArticle.title} · 我的版本 ${versionCount}`;
  const memoryCard = buildMemoryCardDraft({
    title: name,
    topic: baseArticle.topic,
    position,
    practiceFields: match.practiceFields
  });
  return {
    id,
    title: `自定义 · ${name}`,
    number: baseArticle.number || "自定义",
    name,
    topic: baseArticle.topic,
    position,
    positionSource,
    positionStatus: "confirmed",
    image: "",
    paragraphs,
    modules,
    practiceFields: match.practiceFields,
    memoryCard,
    essay: paragraphs.join("\n\n"),
    source: "user",
    parentId: baseArticle.id,
    baseTitle: baseArticle.title,
    templateSnapshot,
    templateScope,
    createdAt: new Date().toISOString()
  };
}

function parseTemplateInput(raw) {
  const paragraphs = splitEssayInput(raw);
  const errors = [];
  if (paragraphs.length !== MODULES.length) {
    errors.push(`模板需要 ${MODULES.length} 段，当前识别到 ${paragraphs.length} 段。请用空行分隔段落。`);
  }

  let slotCount = 0;
  let sentenceCount = 0;
  const modules = MODULES.reduce((result, [key], paragraphIndex) => {
    const sentences = splitParagraphIntoSentences(paragraphs[paragraphIndex] || "");
    sentenceCount += sentences.length;
    result[key] = sentences.map((sentence, sentenceIndex) => {
      const compiled = compileTemplateSentence(sentence);
      slotCount += compiled.slotCount;
      return {
        sentence,
        sentenceIndex,
        regex: compiled.regex,
        slotCount: compiled.slotCount
      };
    });
    return result;
  }, {});

  if (!slotCount) {
    errors.push("模板里没有识别到 () 占位符。请用 () 标出需要背写的核心内容。");
  }

  return { modules, errors, slotCount, sentenceCount };
}

function compileTemplateSentence(sentence) {
  const normalized = normalizeForPractice(sentence);
  const parts = normalized.split(/\(\s*\)|（\s*）/g);
  const slotCount = parts.length - 1;
  const pattern = parts
    .map((part) => escapeRegExp(normalizeForPractice(part)).replace(/\s+/g, "\\s+"))
    .join("(.+?)");
  return {
    regex: new RegExp(`^${pattern}$`),
    slotCount
  };
}

function matchEssayWithTemplate(templateModules, paragraphs) {
  const failures = [];
  const practiceFields = {};
  let matchedSentences = 0;
  let totalSentences = 0;
  let extractedSlots = 0;

  MODULES.forEach(([key, label], paragraphIndex) => {
    const templateSentences = templateModules[key] || [];
      const essaySentences = splitParagraphIntoSentences(paragraphs[paragraphIndex] || "");
      totalSentences += templateSentences.length;
      practiceFields[key] = [];

      if (templateSentences.length !== essaySentences.length) {
        failures.push({
          severity: "error",
          title: "句子数量不一致",
          moduleKey: key,
          moduleLabel: label,
          paragraphIndex,
          message: `${label}：模板 ${templateSentences.length} 句，作文 ${essaySentences.length} 句，句子数量不一致。`
        });
      }

    templateSentences.forEach((templateSentence, sentenceIndex) => {
        const essaySentence = normalizeForPractice(essaySentences[sentenceIndex] || "");
        if (!essaySentence) {
          failures.push({
            severity: "error",
            title: "作文缺少对应句子",
            moduleKey: key,
            moduleLabel: label,
            paragraphIndex,
            sentenceIndex,
            templateSentence: templateSentence.sentence,
            message: `${label} 第 ${sentenceIndex + 1} 句：作文缺少对应句子。`
          });
          return;
        }

        const match = essaySentence.match(templateSentence.regex);
        if (!match) {
          failures.push({
            severity: "error",
            title: "模板句未匹配原文",
            moduleKey: key,
            moduleLabel: label,
            paragraphIndex,
            sentenceIndex,
            templateSentence: templateSentence.sentence,
            essaySentence,
            message: `${label} 第 ${sentenceIndex + 1} 句未匹配。`
          });
          return;
        }

      matchedSentences += 1;
      match.slice(1).forEach((answer, slotIndex) => {
        const cleanAnswer = normalizeForPractice(answer);
        if (!cleanAnswer) return;
        extractedSlots += 1;
        practiceFields[key].push({
          answer: cleanAnswer,
          label: `${label.replace(/\s*\/.*$/, "")} 第 ${sentenceIndex + 1} 句 · 核心 ${slotIndex + 1}`,
          templateSentence: templateSentence.sentence
        });
      });
    });
  });

  if (!extractedSlots) {
    failures.push({
      severity: "error",
      title: "未抽取到核心内容",
      message: "没有抽取到核心内容。请确认模板里使用 () 标出了需要背写的部分。"
    });
  }

  return {
    ok: failures.length === 0,
    failures,
    practiceFields,
    matchedSentences,
    totalSentences,
    extractedSlots
  };
}

function matchReportText(match) {
  return [
    `模板未完全匹配：已匹配 ${match.matchedSentences}/${match.totalSentences} 个模板句，抽取 ${match.extractedSlots} 个核心空位。`,
    "请检查以下位置：",
    ...match.failures.map((failure) => `- ${failure.message || failure}`)
  ].join("\n");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

function showAdjacentImage(direction) {
  if (document.fullscreenElement !== els.imageFrame) return;
  const currentIndex = articles.findIndex((article) => article.id === state.activeArticleId);
  const next = articles[(currentIndex + direction + articles.length) % articles.length];
  if (!next) return;
  saveCurrentDrafts();
  state.activeArticleId = next.id;
  state.answersVisible = false;
  els.revealAllButton.textContent = "显示答案";
  render();
  resetImageViewer();
  preloadNeighborImages(next.id, 5);
}

async function registerImageCacheWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    await navigator.serviceWorker.register("./sw.js");
  } catch {
    // The page still works without the persistent cache worker.
  }
}

function scheduleImageCacheWarmup() {
  if (imagePreload.allQueued || !articleImageUrls.size) return;
  const startWarmup = () => {
    imagePreload.allQueued = true;
    articles.forEach((article) => queueImagePreload(article.image, { priority: "normal" }));
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(startWarmup, { timeout: 1600 });
  } else {
    window.setTimeout(startWarmup, 600);
  }
}

function preloadNeighborImages(articleId, radius = 3) {
  if (!articles.length) return;
  const index = articles.findIndex((article) => article.id === articleId);
  if (index < 0) return;

  for (let offset = -radius; offset <= radius; offset += 1) {
    if (offset === 0) continue;
    const article = articles[(index + offset + articles.length) % articles.length];
    queueImagePreload(article?.image, { priority: "high" });
  }
}

function queueImagePreload(path, options = {}) {
  if (!path) return;
  const url = assetUrl(path);
  if (preloadedImages.has(url) || imagePreload.loaded.has(url) || imagePreload.loading.has(url)) return;
  if (imagePreload.queued.has(url)) {
    if (options.priority === "high") {
      imagePreload.queue = [url, ...imagePreload.queue.filter((item) => item !== url)];
    }
    runImagePreloadQueue();
    return;
  }

  imagePreload.queued.add(url);
  if (options.priority === "high") imagePreload.queue.unshift(url);
  else imagePreload.queue.push(url);
  runImagePreloadQueue();
}

function runImagePreloadQueue() {
  while (imagePreload.active < IMAGE_PRELOAD_CONCURRENCY && imagePreload.queue.length) {
    const url = imagePreload.queue.shift();
    imagePreload.queued.delete(url);
    if (!url || preloadedImages.has(url) || imagePreload.loaded.has(url) || imagePreload.loading.has(url)) continue;
    preloadImageUrl(url);
  }
}

function preloadImageUrl(url) {
  const image = new Image();
  image.decoding = "async";
  preloadedImages.set(url, image);
  imagePreload.active += 1;
  imagePreload.loading.add(url);

  image.addEventListener("load", () => finishImagePreload(url, true), { once: true });
  image.addEventListener("error", () => finishImagePreload(url, false), { once: true });
  cacheImageUrl(url)
    .then((cached) => {
      if (cached) imagePreload.loaded.add(url);
    })
    .catch(() => {
      // Cache Storage can fail in private browsing or low-storage conditions.
    })
    .finally(() => {
      image.src = url;
    });
}

async function cacheImageUrl(url) {
  if (!("caches" in window)) return false;
  const cache = await caches.open(IMAGE_CACHE_NAME);
  if (await cache.match(url)) return true;
  const response = await fetch(url, { cache: "force-cache" });
  if (!response.ok) throw new Error(`Image cache failed: ${url}`);
  await cache.put(url, response.clone());
  return true;
}

function finishImagePreload(url, ok) {
  imagePreload.active = Math.max(0, imagePreload.active - 1);
  imagePreload.loading.delete(url);
  if (ok) {
    imagePreload.loaded.add(url);
    imagePreload.failed.delete(url);
  } else {
    imagePreload.loaded.delete(url);
    imagePreload.failed.add(url);
    preloadedImages.delete(url);
  }
  updateImageViewerStatus(getActiveArticle(), imageStatusText(getActiveArticle()));
  runImagePreloadQueue();
}

function showImageLoading(article) {
  els.imageFrame.classList.add("is-image-loading");
  els.levelImage.classList.add("is-loading");
  updateImageViewerStatus(article, "加载中");
}

function handleLevelImageLoad() {
  els.imageFrame.classList.remove("is-image-loading", "is-image-error");
  els.levelImage.classList.remove("is-loading");
  updateImageViewerStatus(getActiveArticle(), imageStatusText(getActiveArticle()));
}

function handleLevelImageError() {
  els.imageFrame.classList.remove("is-image-loading");
  els.imageFrame.classList.add("is-image-error");
  els.levelImage.classList.remove("is-loading");
  updateImageViewerStatus(getActiveArticle(), "图片加载失败");
}

function updateImageViewerStatus(article, stateText) {
  if (!article) return;
  const text = stateText
    ? `${article.title} · ${stateText}`
    : article.title;
  els.imageViewerStatus.textContent = text;
}

function imageStatusText(article) {
  if (!article || !articleImageUrls.size) return "";
  const currentUrl = assetUrl(article.image);
  if (imagePreload.failed.has(currentUrl)) return "图片加载失败";
  const done = imagePreload.loaded.size;
  const total = articleImageUrls.size;
  if (imagePreload.allQueued && done < total) return `缓存中 ${done}/${total}`;
  if (done >= total) return "图片已缓存";
  return "";
}

function handleImageViewerKeydown(event) {
  if (document.fullscreenElement !== els.imageFrame) return;
  if (event.key === "ArrowRight") {
    event.preventDefault();
    showAdjacentImage(1);
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    showAdjacentImage(-1);
  }
}

function startTimer(mode) {
  if (mode === "article" || mode === "memory") return;
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
  els.timerDisplay.hidden = state.mode === "article" || state.mode === "memory" || state.mode === "import";
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
  if (state.mode === "import" || state.mode === "memory") return;
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
  if (article.practiceFields) {
    return MODULES.reduce((modules, [key]) => {
      modules[key] = Array.isArray(article.practiceFields[key])
        ? article.practiceFields[key].map((field, index) => ({
            answer: normalizeForPractice(field.answer),
            label: normalizeForExact(field.label) || `核心内容 ${index + 1}`
          })).filter((field) => field.answer)
        : [];
      return modules;
    }, {});
  }

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

function resolveBaseArticle(article) {
  if (!article || article.source !== "user" || !article.parentId) return article;
  return articles.find((item) => item.id === article.parentId) || article;
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

function splitParagraphIntoSentences(value) {
  const text = normalizeForPractice(value);
  return text.match(/[^.!?]+[.!?]+(?:["”])?|[^.!?]+$/g)
    ?.map((sentence) => normalizeForPractice(sentence))
    .filter(Boolean) || [];
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
    resetImageViewer();
    els.imageFrame.requestFullscreen().catch(() => {
      window.open(els.levelImage.src, "_blank", "noopener");
    });
  } else {
    window.open(els.levelImage.src, "_blank", "noopener");
  }
}

function handleImageFullscreenChange() {
  const isFullscreen = document.fullscreenElement === els.imageFrame;
  els.imageFrame.classList.toggle("is-viewing-fullscreen", isFullscreen);
  if (isFullscreen) {
    resetImageViewer();
    updateImageViewerStatus(getActiveArticle(), els.imageFrame.classList.contains("is-image-loading") ? "加载中" : "");
  } else {
    endImagePan();
    resetImageViewer();
  }
}

function handleImageWheel(event) {
  if (document.fullscreenElement !== els.imageFrame) return;
  event.preventDefault();
  const zoomFactor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
  const previousScale = state.imageViewer.scale;
  const nextScale = clamp(previousScale * zoomFactor, 1, 6);
  if (nextScale === previousScale) return;

  const rect = els.imageFrame.getBoundingClientRect();
  const pointerX = event.clientX - rect.left - rect.width / 2;
  const pointerY = event.clientY - rect.top - rect.height / 2;
  const ratio = nextScale / previousScale;

  state.imageViewer.x = pointerX - (pointerX - state.imageViewer.x) * ratio;
  state.imageViewer.y = pointerY - (pointerY - state.imageViewer.y) * ratio;
  state.imageViewer.scale = nextScale;
  applyImageViewerTransform();
}

function startImagePan(event) {
  if (document.fullscreenElement !== els.imageFrame || event.button !== 0) return;
  if (event.target.closest(".image-nav-button")) return;
  event.preventDefault();
  state.imageViewer.dragging = true;
  state.imageViewer.lastX = event.clientX;
  state.imageViewer.lastY = event.clientY;
  els.imageFrame.classList.add("is-panning");
  els.imageFrame.setPointerCapture?.(event.pointerId);
}

function moveImagePan(event) {
  if (!state.imageViewer.dragging) return;
  event.preventDefault();
  state.imageViewer.x += event.clientX - state.imageViewer.lastX;
  state.imageViewer.y += event.clientY - state.imageViewer.lastY;
  state.imageViewer.lastX = event.clientX;
  state.imageViewer.lastY = event.clientY;
  applyImageViewerTransform();
}

function endImagePan() {
  state.imageViewer.dragging = false;
  els.imageFrame.classList.remove("is-panning");
}

function resetImageViewer() {
  state.imageViewer.scale = 1;
  state.imageViewer.x = 0;
  state.imageViewer.y = 0;
  state.imageViewer.dragging = false;
  applyImageViewerTransform();
}

function applyImageViewerTransform() {
  const { scale, x, y } = state.imageViewer;
  els.levelImage.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function loadUserArticles() {
  const raw = readJson(USER_ARTICLES_KEY, []);
  if (!Array.isArray(raw)) return [];
  return raw
    .map(normalizeImportedArticle)
    .filter(Boolean);
}

function normalizeImportedArticle(article) {
  if (!article || typeof article !== "object") return null;
  const paragraphs = Array.isArray(article.paragraphs)
    ? article.paragraphs.map(normalizeForExact).filter(Boolean)
    : splitEssayInput(article.essay || "");
  if (paragraphs.length !== MODULES.length) return null;

  const title = normalizeForExact(article.name || String(article.title || "").replace(/^自定义 · /, ""));
  const topic = normalizeForExact(article.topic);
  const position = normalizeForExact(article.position);
  if (!title || !topic || !position) return null;

  const modules = MODULES.reduce((result, [key], index) => {
    const existing = article.modules?.[key];
    result[key] = Array.isArray(existing) && existing.length
      ? existing.map(normalizeForPractice).filter(Boolean)
      : splitParagraphIntoSentences(paragraphs[index] || "");
    return result;
  }, {});
  const practiceFields = normalizePracticeFields(article.practiceFields);
  const memoryCard = normalizeMemoryCard(article.memoryCard);

  return {
    id: String(article.id || `custom:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 8)}`),
    title: `自定义 · ${title}`,
    number: "自定义",
    name: title,
    topic,
    position,
    positionSource: article.positionSource || "legacy",
    positionStatus: article.positionStatus || "confirmed",
    image: "",
    paragraphs,
    modules,
    practiceFields,
    memoryCard,
    essay: paragraphs.join("\n\n"),
    source: "user",
    parentId: article.parentId || "",
    baseTitle: article.baseTitle || "",
    templateSnapshot: article.templateSnapshot || "",
    templateScope: article.templateScope || "global",
    createdAt: article.createdAt || new Date().toISOString()
  };
}

function normalizePracticeFields(fields) {
  if (!fields || typeof fields !== "object") return null;
  const normalized = MODULES.reduce((result, [key]) => {
    result[key] = Array.isArray(fields[key])
      ? fields[key].map((field, index) => ({
          answer: normalizeForPractice(field.answer),
          label: normalizeForExact(field.label) || `核心内容 ${index + 1}`
        })).filter((field) => field.answer)
      : [];
    return result;
  }, {});
  const count = MODULES.reduce((sum, [key]) => sum + normalized[key].length, 0);
  return count ? normalized : null;
}

function normalizeMemoryCard(card) {
  if (!card || typeof card !== "object") return null;
  const sections = Array.isArray(card.sections)
    ? card.sections.map((section, sectionIndex) => ({
        title: normalizeForExact(section.title) || MODULES[sectionIndex]?.[1] || `Section ${sectionIndex + 1}`,
        items: Array.isArray(section.items)
          ? section.items.map((item, itemIndex) => ({
              label: normalizeForExact(item.label) || `核心 ${itemIndex + 1}`,
              answer: normalizeForPractice(item.answer)
            })).filter((item) => item.answer)
          : []
      }))
    : [];
  const flow = Array.isArray(card.flow)
    ? card.flow.map((item) => ({
        key: normalizeForExact(item.key) || inferMemoryFlowKey(item.label),
        label: normalizeForExact(item.label),
        value: normalizeForPractice(item.value),
        cn: normalizeForPractice(item.cn)
      })).filter((item) => item.label && item.value)
    : [];
  return {
    status: card.status === "confirmed" ? "confirmed" : "draft",
    title: normalizeForExact(card.title),
    topic: normalizeForExact(card.topic),
    position: normalizeForPractice(card.position),
    flow,
    sections,
    mnemonic: normalizeForPractice(card.mnemonic),
    updatedAt: card.updatedAt || new Date().toISOString()
  };
}

function practiceModulesToFields(modules) {
  return MODULES.reduce((result, [key]) => {
    result[key] = (modules[key] || []).map((field) => ({
      label: field.label,
      answer: field.answer
    }));
    return result;
  }, {});
}

function inferMemoryFlowKey(label) {
  const text = normalizeForExact(label);
  if (text.includes("题目")) return "topic";
  if (text.includes("总论点") && !text.includes("推荐")) return "thesis";
  if (text.includes("分论点1")) return "argument1";
  if (text.includes("分论点2")) return "argument2";
  if (text.includes("推荐") || text.includes("结论")) return "conclusion";
  return "";
}

function buildMemoryCardDraft({ title, topic, position, practiceFields }) {
  const sections = MODULES.map(([key, label]) => ({
    key,
    title: label,
    items: (practiceFields?.[key] || []).map((field, index) => ({
      label: normalizeForExact(field.label) || `核心 ${index + 1}`,
      answer: normalizeForPractice(field.answer)
    })).filter((item) => item.answer)
  }));
  const arg1 = sections.find((section) => section.key === "argument1")?.items || [];
  const arg2 = sections.find((section) => section.key === "argument2")?.items || [];
  const conclusion = sections.find((section) => section.key === "conclusion")?.items || [];
  const flow = [
    { key: "topic", label: "题目相关", value: compactPhrase(topic), cn: "" },
    { key: "thesis", label: "总论点", value: compactPhrase(position), cn: "" },
    { key: "argument1", label: "分论点1及原因", value: compactPhrase(joinAnswers(arg1.slice(0, 3))), cn: "" },
    { key: "argument2", label: "分论点2及原因", value: compactPhrase(joinAnswers(arg2.slice(0, 3))), cn: "" },
    { key: "conclusion", label: "总论点及推荐", value: compactPhrase(joinAnswers(conclusion.slice(-3))), cn: "" }
  ].filter((item) => item.value);
  return {
    status: "draft",
    title: normalizeForExact(title),
    topic: normalizeForExact(topic),
    position: normalizeForPractice(position),
    flow,
    sections,
    mnemonic: buildMnemonicDraft(flow),
    updatedAt: new Date().toISOString()
  };
}

function joinAnswers(items) {
  return items.map((item) => item.answer).filter(Boolean).join(" / ");
}

function compactPhrase(value, maxWords = 9) {
  const words = String(value || "").match(/[A-Za-z0-9']+/g) || [];
  if (!words.length) return "";
  const compact = words.slice(0, maxWords).join(" ");
  return words.length > maxWords ? `${compact}...` : compact;
}

function buildMnemonicDraft(flow) {
  return flow.map((item) => item.value).filter(Boolean).join(" -> ");
}

function writeUserArticles() {
  localStorage.setItem(USER_ARTICLES_KEY, JSON.stringify(userArticles));
}

function loadUserTemplate() {
  const raw = readJson(USER_TEMPLATE_KEY, "");
  const value = typeof raw === "string" ? raw : raw?.raw || "";
  const parsed = parseTemplateInput(value);
  return {
    raw: value,
    parsed: parsed.errors.length ? null : parsed.modules
  };
}

function writeUserTemplate() {
  localStorage.setItem(USER_TEMPLATE_KEY, JSON.stringify(userTemplate.raw));
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
