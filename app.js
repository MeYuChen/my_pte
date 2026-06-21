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
  memory: 0,
  article: 300,
  exam: 1200
};

const MEMORY_CARD_FILES = {
  "#5": "./images/memory-cards/005_Transportation_Networks_memory_card.png",
  "#9": "./images/memory-cards/009_Global_Issue_memory_card.png",
  "#17": "./images/memory-cards/017_Formal_Written_Examination_memory_card.png",
  "#24": "./images/memory-cards/024_Information_Revolution_memory_card.png",
  "#30": "./images/memory-cards/030_Shopping_Malls_memory_card.png",
  "#35": "./images/memory-cards/035_Mass_Media_memory_card.png",
  "#39": "./images/memory-cards/039_Right_Balance_memory_card.png",
  "#40": "./images/memory-cards/040_Personal_Life_memory_card.png",
  "#43": "./images/memory-cards/043_Legal_Responsibility_memory_card.png",
  "#46": "./images/memory-cards/046_Worker_Decision_Making_memory_card.png",
  "#56": "./images/memory-cards/056_Experiential_Learning_memory_card.png",
  "#63": "./images/memory-cards/063_Mark_Deduction_memory_card.png",
  "#71": "./images/memory-cards/071_Extending_Life_Expectancy_memory_card.png",
  "#72": "./images/memory-cards/072_Building_Effects_memory_card.png",
  "#76": "./images/memory-cards/076_Facing_Issues_memory_card.png",
  "#77": "./images/memory-cards/077_Studying_Theater_memory_card.png",
  "#86": "./images/memory-cards/086_Digital_Materials_memory_card.png",
  "#90": "./images/memory-cards/090_Age_Limit_memory_card.png",
  "#98": "./images/memory-cards/098_International_Organizations_memory_card.png",
  "#102": "./images/memory-cards/102_Life_Experience_memory_card.png",
  "#106": "./images/memory-cards/106_Effective_Study_memory_card.png",
  "#116": "./images/memory-cards/116_Public_Transportation_memory_card.png",
  "#124": "./images/memory-cards/124_Studying_Abroad_memory_card.png",
  "#149": "./images/memory-cards/149_Law_Effect_memory_card.png",
  "#155": "./images/memory-cards/155_Studying_Climate_Change_memory_card.png",
  "#156": "./images/memory-cards/156_Tourism_s_Pros_and_Cons_memory_card.png",
  "#159": "./images/memory-cards/159_Inventions_memory_card.png",
  "#160": "./images/memory-cards/160_Television_memory_card.png",
  "#162": "./images/memory-cards/162_Fewer_Work_Hours_memory_card.png",
  "#163": "./images/memory-cards/163_Celebrities_Privacy_memory_card.png",
  "#166": "./images/memory-cards/166_Short_Weeks_memory_card.png",
  "#170": "./images/memory-cards/170_Compulsory_Learning_memory_card.png",
  "#171": "./images/memory-cards/171_Old_or_Modern_Buildings_memory_card.png",
  "#173": "./images/memory-cards/173_Harder_Life_memory_card.png",
  "#174": "./images/memory-cards/174_Wage_Cap_memory_card.png",
  "#183": "./images/memory-cards/183_City_or_Countryside_memory_card.png",
  "#184": "./images/memory-cards/184_Foreign_Languages_memory_card.png",
  "#195": "./images/memory-cards/195_Marketing_in_Companies_memory_card.png",
  "#261": "./images/memory-cards/261_Travel_for_Education_memory_card.png"
};

const MEMORY_CATEGORIES = {
  education: {
    label: "教育学习",
    fullLabel: "教育学习类",
    parentLogic: "教育 = 公平 / 能力 / 实践 / 未来机会 / 不是唯一",
    summary: "教育方法有用，但不能绝对化；要看公平、能力、实践和机会。"
  },
  technology: {
    label: "科技媒体",
    fullLabel: "科技与媒体类",
    parentLogic: "科技/媒体 = 信息便利 / 效率提升 / 风险控制 / 理性使用",
    summary: "科技媒体可以提高效率和获取信息，但需要判断力和控制风险。"
  },
  work: {
    label: "工作公司",
    fullLabel: "工作与公司类",
    parentLogic: "工作/公司 = 效率 / 健康 / 成本 / 员工状态 / 长期价值",
    summary: "公司政策要兼顾效率、员工状态、成本和长期发展。"
  },
  rules: {
    label: "政府法律",
    fullLabel: "政府、法律与社会规则类",
    parentLogic: "政府/法律 = 规则 / 资源 / 公平 / 保护 / 限度",
    summary: "规则可以保护公平和安全，但不能过度，要有教育和弹性。"
  },
  environment: {
    label: "环境气候",
    fullLabel: "环境、气候与可持续发展类",
    parentLogic: "环境 = 污染 / 全球风险 / 生活影响 / 合作治理 / 可持续管理",
    summary: "环境问题不是单点问题，而是生活、经济、政府和全球合作的问题。"
  },
  city: {
    label: "城市公共",
    fullLabel: "城市、建筑与公共生活类",
    parentLogic: "城市 = 便利 / 机会 / 安全 / 公共资源 / 文化保护",
    summary: "城市题基本都围绕便利、机会、安全、公共资源和文化价值。"
  },
  life: {
    label: "个人家庭",
    fullLabel: "个人、家庭、健康与社会压力类",
    parentLogic: "个人生活 = 健康 / 压力 / 责任 / 幸福 / 社会支持",
    summary: "个人生活题不要写空泛，要落到健康、压力、家庭责任和支持系统。"
  }
};

const MEMORY_CARD_META = {
  "#5": { categories: ["environment", "city"], hook: "公交优先：少车少堵 + 照顾弱势 + 少污染", logic: "public transport first" },
  "#9": { categories: ["rules"], hook: "气候治理：政府立法 + 资金投入 + 企业配合", logic: "government leads" },
  "#17": { categories: ["education"], hook: "正式笔试：公平测基础 + 测不了综合能力", logic: "useful but incomplete", balanced: true },
  "#24": { categories: ["technology"], hook: "信息革命：快获取知识 + 网络风险", logic: "benefits and risks", balanced: true },
  "#30": { categories: ["city"], hook: "大型商场：一站式便利 + 创造工作 + 兼顾小店", logic: "mostly positive" },
  "#35": { categories: ["technology"], hook: "大众媒体：塑造价值观 + 也会制造焦虑", logic: "influence young people" },
  "#39": { categories: ["work", "life"], hook: "工作生活平衡：保护健康 + 但压力太大", logic: "important but hard", balanced: true },
  "#40": { categories: ["work", "life"], hook: "私人时间：问题普遍 + 公司个人解决", logic: "widespread + solutions" },
  "#43": { categories: ["rules", "life"], hook: "父母责任：要监督孩子 + 责任也要有限", logic: "partly responsible", balanced: true },
  "#46": { categories: ["work"], hook: "员工参与：懂一线问题 + 但会拖慢决策", logic: "advantages > disadvantages", balanced: true },
  "#56": { categories: ["education"], hook: "体验式学习：用中学 + 为工作做准备", logic: "practical learning + job preparation" },
  "#63": { categories: ["education"], hook: "迟交扣分：维护公平 + 但要有弹性", logic: "fairness + flexibility", balanced: true },
  "#71": { categories: ["life"], hook: "寿命延长：救命减痛苦 + 老人也能贡献", logic: "blessing" },
  "#72": { categories: ["city"], hook: "建筑设计：影响效率舒适 + 差设计有危险", logic: "design affects life" },
  "#76": { categories: ["environment"], hook: "全球问题：气候最紧迫 + 需要国际合作", logic: "climate is most pressing" },
  "#77": { categories: ["education"], hook: "古典戏剧：有文化价值 + 但理解困难", logic: "cultural value + teaching difficulty", balanced: true },
  "#86": { categories: ["technology"], hook: "数字材料：方便更新 + 但不能替代图书馆", logic: "useful but not enough", balanced: true },
  "#90": { categories: ["rules"], hook: "年龄限制：判断力不足 + 保护个人和社会", logic: "necessary for risky activities" },
  "#98": { categories: ["rules"], hook: "国际组织：气候跨国界 + 贫困也要合作", logic: "international cooperation" },
  "#102": { categories: ["education"], hook: "生活经验：教实践 + 也要系统教育", logic: "experience + formal education", balanced: true },
  "#106": { categories: ["education"], hook: "边学边工：学习要专注 + 兼职也有好处", logic: "concentration + work benefits", balanced: true },
  "#116": { categories: ["environment", "city"], hook: "低价公交：降低生活成本 + 但会拥挤缺钱", logic: "cheaper transport", balanced: true },
  "#124": { categories: ["education"], hook: "留学：开阔视野 + 但不是人人必须", logic: "valuable but not necessary", balanced: true },
  "#149": { categories: ["rules"], hook: "法律作用：制造后果 + 长期改变习惯", logic: "law + education" },
  "#155": { categories: ["environment"], hook: "气候研究：极端天气 + 粮食安全", logic: "extreme weather + food security" },
  "#156": { categories: ["environment"], hook: "旅游业：赚钱就业 + 但有污染压力", logic: "economy + environmental pressure", balanced: true },
  "#159": { categories: ["technology"], hook: "AI助手：提高效率 + 帮助资源不足的人", logic: "efficiency + equal support" },
  "#160": { categories: ["technology"], hook: "电视作用：放松娱乐 + 也能教育陪伴", logic: "relaxation + education" },
  "#162": { categories: ["work"], hook: "少工作时间：技术提效 + 重视健康生活", logic: "technology + wellbeing" },
  "#163": { categories: [], hook: "名人隐私：公众兴趣 + 个人边界", logic: "privacy balance", balanced: true },
  "#166": { categories: ["work"], hook: "短工作周：创造岗位 + 但成本收入有风险", logic: "benefits + cost risk", balanced: true },
  "#170": { categories: ["education"], hook: "外语必修：全球沟通 + 训练大脑", logic: "communication + personal development" },
  "#171": { categories: ["city"], hook: "古建vs住房：保护文化 + 也要解决住房", logic: "heritage + housing", balanced: true },
  "#173": { categories: ["life"], hook: "孩子更难：竞争压力大 + 数字风险高", logic: "harder childhood" },
  "#174": { categories: ["rules"], hook: "工资上限：限制极端不公 + 但保留激励", logic: "fairness + motivation", balanced: true },
  "#183": { categories: ["city"], hook: "城市生活：机会更多 + 生活更方便", logic: "city is better for me" },
  "#184": { categories: ["education"], hook: "外语学习：AI不能懂文化 + 外语提升能力", logic: "AI cannot replace real language" },
  "#195": { categories: ["work"], hook: "公司营销：信誉建信任 + 折扣会伤品牌", logic: "reputation > discounts" },
  "#261": { categories: ["education"], hook: "教育旅行：直接经验有用 + 但不是必需", logic: "useful but not necessary", balanced: true }
};

const MEMORY_FILTERS = [
  { key: "all", label: "全部", description: "39 篇全部速记卡片" },
  { key: "round1", label: "第一轮高频迁移", ids: ["#17", "#56", "#63", "#102", "#124", "#170", "#184", "#261", "#24", "#35", "#86", "#159", "#160", "#9", "#43", "#90", "#149", "#174"] },
  { key: "round2", label: "第二轮场景强化", ids: ["#39", "#40", "#46", "#162", "#166", "#195", "#5", "#30", "#72", "#116", "#171", "#183", "#76", "#155", "#156"] },
  { key: "round3", label: "第三轮专项补强", ids: ["#71", "#77", "#98", "#106", "#173"] },
  { key: "education", label: "教育学习", category: "education" },
  { key: "technology", label: "科技媒体", category: "technology" },
  { key: "work", label: "工作公司", category: "work" },
  { key: "rules", label: "政府法律", category: "rules" },
  { key: "environment", label: "环境气候", category: "environment" },
  { key: "city", label: "城市公共", category: "city" },
  { key: "life", label: "个人家庭", category: "life" },
  { key: "balanced", label: "正反平衡题", balanced: true }
];

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
const preloadedImages = new Map();
const articleImageUrls = new Set([
  ...articles.map((article) => assetUrl(article.image)).filter(Boolean),
  ...articles.map((article) => assetUrl(memoryCardImagePath(article))).filter(Boolean)
]);
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
  memoryFilter: "all",
  articleSourceCollapsed: false,
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
  statusFilterPanel: document.getElementById("statusFilterPanel"),
  memoryFilterPanel: document.getElementById("memoryFilterPanel"),
  memoryFilterList: document.getElementById("memoryFilterList"),
  levelList: document.getElementById("levelList"),
  levelNumber: document.getElementById("levelNumber"),
  levelTitle: document.getElementById("levelTitle"),
  timerDisplay: document.getElementById("timerDisplay"),
  markMasteredButton: document.getElementById("markMasteredButton"),
  nextLevelButton: document.getElementById("nextLevelButton"),
  promptPanel: document.getElementById("promptPanel"),
  topicText: document.getElementById("topicText"),
  positionText: document.getElementById("positionText"),
  memoryMetaPanel: document.getElementById("memoryMetaPanel"),
  memoryParentLogicText: document.getElementById("memoryParentLogicText"),
  memoryHookText: document.getElementById("memoryHookText"),
  memoryWritingLogicText: document.getElementById("memoryWritingLogicText"),
  imageSection: document.getElementById("imageSection"),
  articleSourcePanel: document.getElementById("articleSourcePanel"),
  articleSourceBody: document.getElementById("articleSourceBody"),
  toggleArticleSourceButton: document.getElementById("toggleArticleSourceButton"),
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
renderMemoryFilters();
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

  els.memoryFilterList.addEventListener("click", (event) => {
    const button = event.target.closest(".memory-filter-button");
    if (!button) return;
    state.memoryFilter = button.dataset.memoryFilter;
    const source = navigationArticles();
    const next = source[0];
    if (next) state.activeArticleId = next.id;
    render();
  });

  els.toggleImageButton.addEventListener("click", () => {
    const expanded = els.imageFrame.classList.toggle("is-expanded");
    els.toggleImageButton.textContent = expanded ? "收起" : "展开";
  });
  els.toggleArticleSourceButton.addEventListener("click", () => {
    state.articleSourceCollapsed = !state.articleSourceCollapsed;
    renderArticleSourceState();
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

  els.singleExamModeButton.addEventListener("click", () => setExamType("single"));
  els.compositeExamModeButton.addEventListener("click", () => setExamType("composite"));
  els.startExamButton.addEventListener("click", startCurrentExam);
  els.nextCompositeExamButton.addEventListener("click", goToNextCompositeArticle);
  els.submitExamButton.addEventListener("click", () => submitExam({ auto: false }));
  els.clearExamButton.addEventListener("click", clearExam);
  els.examInput.addEventListener("input", saveExamDraft);
}

function renderMemoryFilters() {
  els.memoryFilterList.replaceChildren(
    ...MEMORY_FILTERS.map((filter) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "memory-filter-button";
      button.dataset.memoryFilter = filter.key;
      button.textContent = filter.label;
      return button;
    })
  );
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
  if (mode === "memory" && !memoryArticles().some((article) => article.id === state.activeArticleId)) {
    const first = memoryArticles()[0];
    if (first) state.activeArticleId = first.id;
  }
  if (mode === "article" && !articleArticles().some((article) => article.id === state.activeArticleId)) {
    const first = articleArticles()[0];
    if (first) state.activeArticleId = first.id;
  }
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
  renderMemoryFilterState();
  renderLevelList();
  renderMain();
  renderTimer();
}

function renderSummary() {
  const mastered = articles.filter((article) => masteryLevel(getArticleProgress(article.id)).key === "skilled").length;
  els.progressSummary.textContent = `${mastered} / ${articles.length} 已掌握`;
}

function renderMemoryFilterState() {
  const showsMemoryFilters = state.mode === "memory" || state.mode === "article";
  els.memoryFilterPanel.hidden = !showsMemoryFilters;
  els.statusFilterPanel.hidden = state.mode === "memory";
  document.querySelectorAll(".memory-filter-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.memoryFilter === state.memoryFilter);
  });
}
function renderMemoryMeta(article) {
  if (!article) {
    els.memoryParentLogicText.textContent = "";
    els.memoryHookText.textContent = "";
    els.memoryWritingLogicText.textContent = "";
    return;
  }
  const meta = memoryMeta(article);
  const category = meta?.categories?.map((key) => MEMORY_CATEGORIES[key]).filter(Boolean)[0];
  els.memoryParentLogicText.textContent = category
    ? `${category.fullLabel}：${category.parentLogic}`
    : "未归入母逻辑：按卡片直接速记。";
  els.memoryHookText.textContent = meta?.hook || "暂无中文钩子";
  els.memoryWritingLogicText.textContent = meta?.logic || category?.summary || "按图片链路记忆。";
}

function examHeaderLabel() {
  if (state.examType === "composite") {
    return state.compositeExam.active
      ? `综合考核 ${state.compositeExam.currentIndex + 1} / ${state.compositeExam.articleIds.length}`
      : "综合考核";
  }
  return "单篇考核";
}

function filteredByMemoryRange({ requireMemoryCard = false } = {}) {
  const filter = MEMORY_FILTERS.find((item) => item.key === state.memoryFilter) || MEMORY_FILTERS[0];
  return articles.filter((article) => {
    const hasMemoryCard = Boolean(memoryCardImagePath(article));
    if (requireMemoryCard && !hasMemoryCard) return false;
    if (!hasMemoryCard && filter.key !== "all") return false;
    const number = article.number;
    const meta = memoryMeta(article);
    if (filter.ids) return filter.ids.includes(number);
    if (filter.category) return meta?.categories?.includes(filter.category);
    if (filter.balanced) return Boolean(meta?.balanced);
    return true;
  });
}

function memoryArticles() {
  return filteredByMemoryRange({ requireMemoryCard: true });
}

function articleArticles() {
  return filteredByMemoryRange();
}

function navigationArticles() {
  if (state.mode === "memory") return memoryArticles();
  if (state.mode === "article") return articleArticles();
  return articles;
}
function memoryMeta(article) {
  return MEMORY_CARD_META[article?.number] || null;
}

function memoryCardImagePath(article) {
  return MEMORY_CARD_FILES[article?.number] || "";
}

function displayImagePath(article) {
  if (state.mode === "memory") return memoryCardImagePath(article);
  if (state.mode === "article") return memoryCardImagePath(article) || article?.image;
  return article?.image;
}
function memoryLevelMeta(article) {
  const meta = memoryMeta(article);
  const labels = meta?.categories?.map((key) => MEMORY_CATEGORIES[key]?.label).filter(Boolean) || [];
  const prefix = labels.length ? labels.join(" / ") : "图片速记";
  return `${prefix} · ${meta?.hook || "按卡片记忆"}`;
}

function renderLevelList() {
  const sourceArticles = navigationArticles();
  const visibleArticles = sourceArticles.filter((article) => {
    const progress = getArticleProgress(article.id);
    const meta = memoryMeta(article);
    const haystack = `${article.title} ${article.topic} ${article.position} ${meta?.hook || ""} ${meta?.logic || ""}`.toLowerCase();
    const matchesSearch = !state.search || haystack.includes(state.search);
    const matchesFilter =
      state.mode === "exam" ||
      state.mode === "memory" ||
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
              : state.mode === "memory"
                ? memoryLevelMeta(article)
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
  const isMemoryMode = state.mode === "memory";

  els.appShell.classList.toggle("is-memory-mode", isMemoryMode);
  els.appShell.classList.toggle("is-article-mode", state.mode === "article");
  els.practicePanel.hidden = state.mode === "exam" || isMemoryMode;
  els.articleSourcePanel.hidden = state.mode !== "article";
  els.examPanel.hidden = state.mode !== "exam";
  els.markMasteredButton.hidden = state.mode === "template" || state.mode === "exam";
  els.nextLevelButton.hidden = state.mode === "template" || state.mode === "exam";
  els.promptPanel.hidden = state.mode === "template" || state.mode === "exam" || isMemoryMode;
  els.memoryMetaPanel.hidden = !isMemoryMode;
  els.imageSection.hidden = state.mode === "template" || state.mode === "exam" || !displayImagePath(item);
  if (state.mode === "exam") {
    els.levelImage.removeAttribute("src");
    els.topicText.textContent = "";
    els.positionText.textContent = "";
    renderMemoryMeta(null);
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
      const meta = memoryMeta(article);
      els.levelNumber.textContent = isMemoryMode ? "图片速记" : article.number;
      els.levelTitle.textContent = isMemoryMode ? article.title : article.name;
      els.topicText.textContent = article.topic;
      els.positionText.textContent = article.position;
      renderMemoryMeta(isMemoryMode ? article : null);
      renderArticleSource(state.mode === "article" ? article : null);
      const imageUrl = assetUrl(displayImagePath(article));
      if (els.levelImage.getAttribute("src") !== imageUrl) {
        showImageLoading(article);
        els.levelImage.src = imageUrl;
      } else {
        updateImageViewerStatus(article, "");
      }
      els.levelImage.alt = isMemoryMode || state.mode === "article" ? `${article.title} 速记卡片` : article.title;
      preloadNeighborImages(article.id);
      els.practiceTitle.textContent = isMemoryMode ? "图片速记" : "文章论点默写";
      els.levelScore.textContent = scoreText(article.id);
      els.markMasteredButton.textContent = isMemoryMode ? "重置进度" : "重置进度";
      if (meta) {
        els.levelNumber.textContent = `${meta.categories.map((key) => MEMORY_CATEGORIES[key]?.label).filter(Boolean).join(" / ") || "图片速记"} · ${article.number}`;
      }
    }
    renderExam(article);
  }

  if (state.mode !== "exam" && !isMemoryMode) renderPractice(item);
  renderArticleSourceState();
}

function renderArticleSourceState() {
  if (!els.articleSourcePanel) return;
  els.articleSourcePanel.classList.toggle("is-collapsed", state.articleSourceCollapsed);
  els.toggleArticleSourceButton.textContent = state.articleSourceCollapsed ? "展开" : "收起";
  els.articleSourceBody.hidden = state.articleSourceCollapsed;
}

function renderArticleSource(article) {
  if (!els.articleSourceBody) return;
  if (!article || state.mode !== "article") {
    els.articleSourceBody.replaceChildren();
    return;
  }

  const paragraphs = article.paragraphs || MODULES.map(([key]) => (article.modules[key] || []).join(" ")).filter(Boolean);
  els.articleSourceBody.replaceChildren(
    ...paragraphs.map((paragraph, index) => {
      const paragraphEl = document.createElement("p");
      paragraphEl.className = "article-source-paragraph";
      paragraphEl.innerHTML = highlightArticleParagraph(article, paragraph, index);
      return paragraphEl;
    })
  );
}

function highlightArticleParagraph(article, paragraph, paragraphIndex) {
  const moduleKey = MODULES[paragraphIndex]?.[0];
  const sentences = article.modules[moduleKey] || [];
  const ranges = [];

  sentences.forEach((sentence, sentenceIndex) => {
    const sentenceStart = paragraph.indexOf(sentence);
    if (sentenceStart < 0) return;
    const fields = extractArticleFields(moduleKey, sentence, sentenceIndex);
    fields.forEach((field) => {
      const answer = field.answer.trim();
      if (!answer) return;
      const localStart = sentence.indexOf(answer);
      if (localStart < 0) return;
      ranges.push({
        start: sentenceStart + localStart,
        end: sentenceStart + localStart + answer.length
      });
    });
  });

  if (!ranges.length) return escapeHtml(paragraph);
  return renderHighlightedText(paragraph, ranges);
}

function renderHighlightedText(text, ranges) {
  const normalized = ranges
    .filter((range) => range.end > range.start)
    .sort((a, b) => a.start - b.start)
    .reduce((items, range) => {
      const previous = items[items.length - 1];
      if (previous && range.start <= previous.end) {
        previous.end = Math.max(previous.end, range.end);
      } else {
        items.push({ ...range });
      }
      return items;
    }, []);

  let cursor = 0;
  let html = "";
  normalized.forEach((range) => {
    html += escapeHtml(text.slice(cursor, range.start));
    html += `<mark class="core-sentence-highlight">${escapeHtml(text.slice(range.start, range.end))}</mark>`;
    cursor = range.end;
  });
  html += escapeHtml(text.slice(cursor));
  return html;
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
  const items = navigationArticles();
  const index = items.findIndex((article) => article.id === state.activeArticleId);
  const next = items[(index + 1) % items.length];
  if (!next) return;
  saveCurrentDrafts();
  state.activeArticleId = next.id;
  state.answersVisible = false;
  els.revealAllButton.textContent = "显示答案";
  render();
}

function showAdjacentImage(direction) {
  if (document.fullscreenElement !== els.imageFrame) return;
  const items = navigationArticles();
  const currentIndex = items.findIndex((article) => article.id === state.activeArticleId);
  const next = items[(currentIndex + direction + items.length) % items.length];
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
    articles.forEach((article) => {
      queueImagePreload(article.image, { priority: "normal" });
      queueImagePreload(memoryCardImagePath(article), { priority: "normal" });
    });
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(startWarmup, { timeout: 1600 });
  } else {
    window.setTimeout(startWarmup, 600);
  }
}

function preloadNeighborImages(articleId, radius = 3) {
  const items = navigationArticles();
  if (!items.length) return;
  const index = items.findIndex((article) => article.id === articleId);
  if (index < 0) return;

  for (let offset = -radius; offset <= radius; offset += 1) {
    if (offset === 0) continue;
    const article = items[(index + offset + items.length) % items.length];
    queueImagePreload(displayImagePath(article), { priority: "high" });
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
  const currentUrl = assetUrl(displayImagePath(article));
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
  els.timerDisplay.hidden = state.mode === "article" || state.mode === "memory";
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
  if (state.mode === "memory") return;
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
