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
  drill: 0,
  memory: 0,
  article: 300,
  wfd: 0,
  exam: 1200
};
const DEFAULT_TEMPLATE_TIMER_MINUTES = 5;
const MIN_TEMPLATE_TIMER_MINUTES = 1;
const MAX_TEMPLATE_TIMER_MINUTES = 60;
const DRILL_TYPES = [
  { key: "route", label: "一句话串记" },
  { key: "keywords", label: "英文关键词" },
  { key: "skeleton", label: "4 句骨架" },
  { key: "mixed", label: "混合提取" },
  { key: "source", label: "原文背诵" }
];

const MEMORY_CARD_FILES = {
  "#5": "./images/memory-cards/005_Transportation_Networks_memory_card.png?v=20261009-9",
  "#9": "./images/memory-cards/009_Global_Issue_memory_card.png?v=20261009-9",
  "#17": "./images/memory-cards/017_Formal_Written_Examination_memory_card.png?v=20261009-9",
  "#24": "./images/memory-cards/024_Information_Revolution_memory_card.png?v=20261009-9",
  "#30": "./images/memory-cards/030_Shopping_Malls_memory_card.png?v=20261009-9",
  "#35": "./images/memory-cards/035_Mass_Media_memory_card.png?v=20261009-9",
  "#39": "./images/memory-cards/039_Right_Balance_memory_card.png?v=20261009-9",
  "#40": "./images/memory-cards/040_Personal_Life_memory_card.png?v=20261009-9",
  "#43": "./images/memory-cards/043_Legal_Responsibility_memory_card.png?v=20261009-9",
  "#46": "./images/memory-cards/046_Worker_Decision_Making_memory_card.png?v=20261009-9",
  "#56": "./images/memory-cards/056_Experiential_Learning_memory_card.png?v=20261009-9",
  "#63": "./images/memory-cards/063_Mark_Deduction_memory_card.png?v=20261009-9",
  "#71": "./images/memory-cards/071_Extending_Life_Expectancy_memory_card.png?v=20261009-9",
  "#72": "./images/memory-cards/072_Building_Effects_memory_card.png?v=20261009-9",
  "#76": "./images/memory-cards/076_Facing_Issues_memory_card.png?v=20261009-9",
  "#77": "./images/memory-cards/077_Studying_Theater_memory_card.png?v=20261009-9",
  "#86": "./images/memory-cards/086_Digital_Materials_memory_card.png?v=20261009-9",
  "#90": "./images/memory-cards/090_Age_Limit_memory_card.png?v=20261009-9",
  "#98": "./images/memory-cards/098_International_Organizations_memory_card.png?v=20261009-9",
  "#102": "./images/memory-cards/102_Life_Experience_memory_card.png?v=20261009-9",
  "#106": "./images/memory-cards/106_Effective_Study_memory_card.png?v=20261009-9",
  "#116": "./images/memory-cards/116_Public_Transportation_memory_card.png?v=20261009-9",
  "#124": "./images/memory-cards/124_Studying_Abroad_memory_card.png?v=20261009-9",
  "#149": "./images/memory-cards/149_Law_Effect_memory_card.png?v=20261009-9",
  "#155": "./images/memory-cards/155_Studying_Climate_Change_memory_card.png?v=20261009-9",
  "#156": "./images/memory-cards/156_Tourism_s_Pros_and_Cons_memory_card.png?v=20261009-9",
  "#159": "./images/memory-cards/159_Inventions_memory_card.png?v=20261009-9",
  "#160": "./images/memory-cards/160_Television_memory_card.png?v=20261009-9",
  "#162": "./images/memory-cards/162_Fewer_Work_Hours_memory_card.png?v=20261009-9",
  "#163": "./images/memory-cards/163_Celebrities_Privacy_memory_card.png?v=20261009-9",
  "#166": "./images/memory-cards/166_Short_Weeks_memory_card.png?v=20261009-9",
  "#170": "./images/memory-cards/170_Compulsory_Learning_memory_card.png?v=20261009-9",
  "#171": "./images/memory-cards/171_Old_or_Modern_Buildings_memory_card.png?v=20261009-9",
  "#173": "./images/memory-cards/173_Harder_Life_memory_card.png?v=20261009-9",
  "#174": "./images/memory-cards/174_Wage_Cap_memory_card.png?v=20261009-9",
  "#183": "./images/memory-cards/183_City_or_Countryside_memory_card.png?v=20261009-9",
  "#184": "./images/memory-cards/184_Foreign_Languages_memory_card.png?v=20261009-9",
  "#195": "./images/memory-cards/195_Marketing_in_Companies_memory_card.png?v=20261009-9",
  "#261": "./images/memory-cards/261_Travel_for_Education_memory_card.png?v=20261009-9",
  "#101010": "./images/memory-cards/101010_Mass_Media_and_Society_memory_card.jpg?v=20261009-9"
};

const MEMORY_CATEGORIES = {
  "education": {
    "label": "教育 · 学习 · 考试",
    "fullLabel": "教育 · 学习 · 考试"
  },
  "language": {
    "label": "语言 · 留学 · 教育视野",
    "fullLabel": "语言 · 留学 · 教育视野"
  },
  "technology": {
    "label": "科技 · 媒体 · 信息",
    "fullLabel": "科技 · 媒体 · 信息"
  },
  "work": {
    "label": "工作 · 职场 · 经济",
    "fullLabel": "工作 · 职场 · 经济"
  },
  "life": {
    "label": "社会问题 · 家庭 · 个人生活",
    "fullLabel": "社会问题 · 家庭 · 个人生活"
  },
  "city": {
    "label": "城市 · 交通 · 建筑",
    "fullLabel": "城市 · 交通 · 建筑"
  },
  "environment": {
    "label": "环境 · 全球问题 · 旅游",
    "fullLabel": "环境 · 全球问题 · 旅游"
  }
};

const MEMORY_CARD_META = {
  "#17": {
    "categories": [
      "education"
    ],
    "hook": "笔试能公平测基础知识，但测不了创造力、合作和实践能力；所以保留笔试，但不能只靠笔试。",
    "logic": "公平测知识 → 能力覆盖有限 → 组合评估"
  },
  "#56": {
    "categories": [
      "education"
    ],
    "hook": "边做边学能把知识学深，也更接近真实工作；因此适合学校，但最好与传统教学结合。",
    "logic": "理解更深 → 准备真实工作 → 两种教学结合"
  },
  "#63": {
    "categories": [
      "education"
    ],
    "hook": "扣分能维护公平并训练责任感，但处罚不能压过学习本身；所以可以扣，但要有弹性。",
    "logic": "公平与责任 → 处罚服务学习 → 灵活扣分"
  },
  "#77": {
    "categories": [
      "education"
    ],
    "hook": "老戏剧能教文化、语言和人性，但语言难、容易无聊；所以要用现代方法教。",
    "logic": "文化与思考 → 语言难 易失去兴趣 → 现代化教学"
  },
  "#86": {
    "categories": [
      "education"
    ],
    "hook": "数字资料快、方便、易获取，但纸书和图书馆更稳定、专注、可靠；所以两者都需要。",
    "logic": "快速方便 → 纸书稳定可靠 → 数字+传统并存"
  },
  "#102": {
    "categories": [
      "education"
    ],
    "hook": "经验让人真正会做事，正规教育提供系统知识；所以经验重要，但不能替代教育。",
    "logic": "实践能力 → 系统知识 → 经验+教育"
  },
  "#106": {
    "categories": [
      "education"
    ],
    "hook": "边学习边工作能赚收入、积经验，但容易疲惫影响学习；所以可以结合，但必须平衡。",
    "logic": "收入与经验 → 压力与疲劳 → 平衡结合"
  },
  "#124": {
    "categories": [
      "language"
    ],
    "hook": "留学能长见识、练独立，但费用高而且不是人人需要；所以有价值但不是必要条件。",
    "logic": "视野与独立 → 成本高 非人人需要 → 有价值非必需"
  },
  "#170": {
    "categories": [
      "language"
    ],
    "hook": "外语帮助全球沟通，也训练大脑和拓宽思维；所以学校应当必修。",
    "logic": "全球沟通 → 思维与个人发展 → 应当必修"
  },
  "#184": {
    "categories": [
      "language"
    ],
    "hook": "AI能翻译文字，却代替不了文化理解和语言训练；所以外语仍然需要学。",
    "logic": "文化沟通 → 个人能力 → AI不能替代外语"
  },
  "#261": {
    "categories": [
      "language"
    ],
    "hook": "旅行能给直接体验，但成本高，而且不旅行也能获得好教育；所以旅行有价值但不是必需。",
    "logic": "直接体验 → 成本 可替代 → 有价值非必需"
  },
  "#24": {
    "categories": [
      "technology"
    ],
    "hook": "信息革命让知识触手可及，也带来假信息、网瘾和网络风险；所以明显利弊并存。",
    "logic": "快速获取知识 → 误导与网络风险 → 利弊并存"
  },
  "#35": {
    "categories": [
      "technology"
    ],
    "hook": "媒体天天影响年轻人的信息和价值观，也可能制造焦虑和坏榜样；所以影响非常强。",
    "logic": "信息与价值观 → 焦虑与负面模仿 → 媒体影响强"
  },
  "#159": {
    "categories": [
      "technology"
    ],
    "hook": "AI助手提高效率，也让缺资源的人获得学习和工作帮助；所以总体利大于弊。",
    "logic": "提高效率 → 扩大可及性 → 总体有益"
  },
  "#160": {
    "categories": [
      "technology"
    ],
    "hook": "电视既能让人放松，也能教育和提供陪伴；所以它有多种积极功能。",
    "logic": "放松 → 教育 + 陪伴 → 多种用途"
  },
  "#30": {
    "categories": [
      "work"
    ],
    "hook": "商场把购物集中到一处更方便，也能创造就业和税收；所以总体是积极发展。",
    "logic": "一站式便利 → 就业与经济 → 总体积极"
  },
  "#46": {
    "categories": [
      "work"
    ],
    "hook": "员工懂一线，意见能让决策更现实；但参与过多会拖慢速度；所以听员工，管理层最终拍板。",
    "logic": "一线经验 → 决策变慢 → 利大于弊"
  },
  "#162": {
    "categories": [
      "work"
    ],
    "hook": "自动化会减少重复劳动，人们又越来越重视健康和生活；所以未来可能工作更少。",
    "logic": "技术替代重复劳动 → 更重视生活 → 工时可能减少"
  },
  "#166": {
    "categories": [
      "work"
    ],
    "hook": "短工周可能把工作机会分给更多人，但会增加成本、降低收入；若实行应公平覆盖全体。",
    "logic": "分配更多岗位 → 成本与收入 → 谨慎实施"
  },
  "#174": {
    "categories": [
      "work"
    ],
    "hook": "极端高薪会伤公平，但死工资上限会削弱人才激励；所以应控制差距，而不是硬封顶。",
    "logic": "公平与差距 → 激励与人才 → 控制但不封顶"
  },
  "#195": {
    "categories": [
      "work"
    ],
    "hook": "信誉能建立长期信任，而频繁打折会伤品牌价值；所以企业应更重视声誉。",
    "logic": "长期信任 → 短促伤品牌 → 声誉优先"
  },
  "#39": {
    "categories": [
      "life"
    ],
    "hook": "平衡能保护身心健康，但生活成本高、工作随时在线让它很难实现。",
    "logic": "健康与休息 → 成本 + 工作需求 → 平衡很重要"
  },
  "#40": {
    "categories": [
      "life"
    ],
    "hook": "工作侵占私人时间已很普遍；企业尊重私人时间，加上个人时间管理，可以缓解。",
    "logic": "跨行业普遍 → 企业政策 + 时间管理 → 可以改善"
  },
  "#43": {
    "categories": [
      "life"
    ],
    "hook": "父母有监督义务，但不可能控制孩子所有行为；只有明显疏忽时才应承担有限责任。",
    "logic": "监督义务 → 责任要有限公平 → 疏忽才担责"
  },
  "#71": {
    "categories": [
      "life"
    ],
    "hook": "医疗技术能救命、减少痛苦，老年人也能继续贡献；所以寿命延长总体是福。",
    "logic": "救命减痛苦 → 老人仍可贡献 → 总体是福"
  },
  "#90": {
    "categories": [
      "life"
    ],
    "hook": "高风险活动需要成熟判断，驾驶尤其关系公共安全；所以年龄门槛必要，18岁合理。",
    "logic": "成熟与判断 → 公共安全 → 18岁合理"
  },
  "#149": {
    "categories": [
      "life"
    ],
    "hook": "法律一方面靠惩罚阻止坏行为，另一方面划清社会规范；所以确实能影响人的行为。",
    "logic": "惩罚威慑 → 道德与规则引导 → 法律有效"
  },
  "#163": {
    "categories": [
      "life"
    ],
    "hook": "名人仍然是普通人，隐私关系尊严；过度曝光还会恶化公共文化；所以不应放弃隐私权。",
    "logic": "人类尊严 → 公共文化 → 保留隐私"
  },
  "#173": {
    "categories": [
      "life"
    ],
    "hook": "现代孩子承受更强学业社交压力，又面对过去很少有的网络风险；所以成长环境更难。",
    "logic": "竞争与压力 → 数字风险 → 大体同意"
  },
  "#5": {
    "categories": [
      "city"
    ],
    "hook": "堵车靠大运量公交解决；公平+环保让更多人受益；所以优先投公交，不继续扩路。",
    "logic": "减拥堵 大运量 → 可负担 + 环保 → 公交优先"
  },
  "#72": {
    "categories": [
      "city"
    ],
    "hook": "好设计提升舒适和效率，坏设计会带来不便甚至危险；所以建筑直接影响生活和工作。",
    "logic": "舒适与效率 → 不便与安全 → 设计很重要"
  },
  "#116": {
    "categories": [
      "city"
    ],
    "hook": "低价公交能减车流、帮助低收入者，但会增加容量和财政压力；管理好时利大于弊。",
    "logic": "减车流 + 公平 → 容量与财政 → 管理好则利大于弊"
  },
  "#171": {
    "categories": [
      "city"
    ],
    "hook": "古建筑值得保文化，但住房是现实刚需；所以要保护古建筑，却不能挤占现代住房投入。",
    "logic": "文化与身份 → 住房需求 → 部分同意"
  },
  "#183": {
    "categories": [
      "city"
    ],
    "hook": "城市给我更多教育就业机会，也更方便；所以对我而言城市生活更合适。",
    "logic": "机会更多 → 生活方便 → 我选城市"
  },
  "#9": {
    "categories": [
      "environment"
    ],
    "hook": "政府有立法权，也有资源组织大规模行动；所以应由政府牵头，企业和个人配合。",
    "logic": "法律与政策 → 资源与协调 → 政府牵头"
  },
  "#76": {
    "categories": [
      "environment"
    ],
    "hook": "气候变化影响所有国家、后果长期，而且必须国际合作；所以它是最紧迫问题。",
    "logic": "全球影响 → 国际合作 → 气候最紧迫"
  },
  "#98": {
    "categories": [
      "environment"
    ],
    "hook": "全球问题跨国界，一个政府单独解决不了；所以政府必须和国际组织合作。",
    "logic": "问题跨国界 → 合作与资源共享 → 国际合作"
  },
  "#155": {
    "categories": [
      "environment"
    ],
    "hook": "极端天气先毁农业，再威胁粮食安全、健康和稳定；所以这是最值得研究的方向。",
    "logic": "极端天气毁农业 → 粮食安全与稳定 → 研究重点"
  },
  "#156": {
    "categories": [
      "environment"
    ],
    "hook": "旅游带来收入和就业，也会造成污染与文化压力；管理得好时，发展中国家仍可利大于弊。",
    "logic": "经济与就业 → 环境与文化压力 → 管理好则利大于弊"
  },
  "#101010": {
    "categories": [
      "technology"
    ],
    "hook": "媒体影响：引导社会舆论 + 塑造个人性格",
    "logic": "society + individuals"
  }
};

const MEMORY_FILTERS = [
  {
    "key": "all",
    "label": "全部",
    "description": "全部作文"
  },
  {
    "key": "education",
    "label": "教育 · 学习 · 考试",
    "category": "education"
  },
  {
    "key": "language",
    "label": "语言 · 留学 · 教育视野",
    "category": "language"
  },
  {
    "key": "technology",
    "label": "科技 · 媒体 · 信息",
    "category": "technology"
  },
  {
    "key": "work",
    "label": "工作 · 职场 · 经济",
    "category": "work"
  },
  {
    "key": "life",
    "label": "社会问题 · 家庭 · 个人生活",
    "category": "life"
  },
  {
    "key": "city",
    "label": "城市 · 交通 · 建筑",
    "category": "city"
  },
  {
    "key": "environment",
    "label": "环境 · 全球问题 · 旅游",
    "category": "environment"
  }
];

const ARTICLE_TRANSLATIONS = window.WE_TRANSLATIONS || {};
const LEARNING_PATHS = window.WE_LEARNING_PATHS || {};
const DEFAULT_WFD_DATA = window.WFD_DATA || {};
const DEFAULT_WFD_GENERATED_AT = DEFAULT_WFD_DATA.generatedAt || "";
const DEFAULT_WFD_ITEMS = normalizeWfdItems(DEFAULT_WFD_DATA.items || []).map((item) => ({
  ...item,
  origin: "builtin"
}));

const ARTICLE_SLOT_PATTERNS = {
  introduction: [
    { regex: /^In this essay, I will describe (.+), and explain why (.+)\.$/, labels: ["描述对象", "我的观点"], suffixes: ["", "."] },
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
    { regex: /^To begin with, one of the most compelling reasons why (.+) is that (.+)\.$/, labels: ["议题", "分论点"], suffixes: ["", "."] },
    { regex: /^To begin with, one of the strongest reasons (.+) is that (.+)\.$/, labels: ["议题", "分论点"], suffixes: ["", "."] },
    { regex: /^To begin with, one of the most compelling advantages of (.+) is that (.+)\.$/, labels: ["议题", "分论点"], suffixes: ["", "."] },
    {
      regex: /^To begin with, one of the most compelling reasons for (?:the significance of )?(.+) is that (.+)\.$/,
      labels: ["关键词", "分论点"],
      suffixes: ["", "."]
    },
    {
      regex: /^This plays a vital role because (.+)\.$/,
      labels: ["原因"],
      suffixes: ["."]
    },
    {
      regex: /^To illustrate, (?:studies have shown that )?(.+)\.$/,
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
      regex: /^(?:Based on my (?:experience|observation)|From my own [^,]+), (.+)\.$/,
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
    { regex: /^Therefore, I strongly (?:believe|agree) that (.+)\.$/, labels: ["总结观点"], suffixes: ["."] },
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

ARTICLE_SLOT_PATTERNS.conclusion.push({ regex: /^Therefore, I strongly recommend (.+)\.$/, labels: ["推荐句"], suffixes: ["."] });
ARTICLE_SLOT_PATTERNS.conclusion.push({ regex: /^To sum up, all the evidence suggests that (.+)\.$/, labels: ["总结观点"], suffixes: ["."] });

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
const IMAGE_CACHE_NAME = "pte-we-images-v9";
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
  examDrafts: {},
  drill: {},
  settings: {}
});
persisted.progress ||= {};
persisted.drafts ||= {};
persisted.examDrafts ||= {};
persisted.drill ||= {};
persisted.wfd ||= {};
persisted.wfd.items = seededWfdItems(persisted.wfd.items || []);
persisted.wfd.progress ||= {};
persisted.wfd.index = normalizeWfdIndex(persisted.wfd.index, persisted.wfd.items.length);
persisted.wfd.syncUrl ||= "";
persisted.wfd.lastSyncedAt ||= "";
persisted.wfd.seedGeneratedAt = DEFAULT_WFD_GENERATED_AT;
persisted.settings ||= {};
persisted.settings.templateTimerMinutes = normalizedTemplateTimerMinutes(persisted.settings.templateTimerMinutes);

const state = {
  mode: "template",
  examType: "single",
  activeArticleId: articles[0]?.id || null,
  sidebarCollapsed: readJson(SIDEBAR_STATE_KEY, false),
  filter: "all",
  memoryFilter: "all",
  articleSourceCollapsed: false,
  articleTranslationVisible: false,
  imageCollapsed: false,
  search: "",
  answersVisible: false,
  drill: {
    index: 0,
    answerVisible: false
  },
  wfd: {
    answerVisible: false,
    checked: false
  },
  compositeExam: {
    active: false,
    articleIds: [],
    currentIndex: 0,
    results: []
  },
  timer: {
    mode: null,
    endsAt: null,
    remaining: templateTimerSeconds(),
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
  openCatalogButton: document.getElementById("openCatalogButton"),
  catalogPanel: document.getElementById("catalogPanel"),
  catalogBackdrop: document.getElementById("catalogBackdrop"),
  catalogFilterList: document.getElementById("catalogFilterList"),
  catalogList: document.getElementById("catalogList"),
  closeCatalogButton: document.getElementById("closeCatalogButton"),
  mobileArticleNav: document.getElementById("mobileArticleNav"),
  mobilePreviousArticleButton: document.getElementById("mobilePreviousArticleButton"),
  mobileNextArticleButton: document.getElementById("mobileNextArticleButton"),
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
  learningPathPanel: document.getElementById("learningPathPanel"),
  learningPathHook: document.getElementById("learningPathHook"),
  learningRouteList: document.getElementById("learningRouteList"),
  learningKeywordList: document.getElementById("learningKeywordList"),
  learningSkeletonList: document.getElementById("learningSkeletonList"),
  drillPanel: document.getElementById("drillPanel"),
  drillCardType: document.getElementById("drillCardType"),
  drillCardTitle: document.getElementById("drillCardTitle"),
  drillProgressText: document.getElementById("drillProgressText"),
  drillQuestion: document.getElementById("drillQuestion"),
  drillRevealButton: document.getElementById("drillRevealButton"),
  drillAnswer: document.getElementById("drillAnswer"),
  drillActions: document.getElementById("drillActions"),
  drillPreviousButton: document.getElementById("drillPreviousButton"),
  drillSkipButton: document.getElementById("drillSkipButton"),
  drillPreviousArticleButton: document.getElementById("drillPreviousArticleButton"),
  drillNextArticleButton: document.getElementById("drillNextArticleButton"),
  imageSection: document.getElementById("imageSection"),
  articleSourcePanel: document.getElementById("articleSourcePanel"),
  articleSourceBody: document.getElementById("articleSourceBody"),
  toggleArticleSourceButton: document.getElementById("toggleArticleSourceButton"),
  toggleArticleTranslationButton: document.getElementById("toggleArticleTranslationButton"),
  levelImage: document.getElementById("levelImage"),
  imageFrame: document.getElementById("imageFrame"),
  imagePreviousButton: document.getElementById("imagePreviousButton"),
  imageNextButton: document.getElementById("imageNextButton"),
  imageViewerStatus: document.getElementById("imageViewerStatus"),
  toggleImageButton: document.getElementById("toggleImageButton"),
  practicePanel: document.getElementById("practicePanel"),
  practiceTitle: document.getElementById("practiceTitle"),
  levelScore: document.getElementById("levelScore"),
  templateTimerInput: document.getElementById("templateTimerInput"),
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
  examResult: document.getElementById("examResult"),
  wfdPanel: document.getElementById("wfdPanel"),
  wfdSummary: document.getElementById("wfdSummary"),
  wfdPreviousButton: document.getElementById("wfdPreviousButton"),
  wfdNextButton: document.getElementById("wfdNextButton"),
  wfdPlayButton: document.getElementById("wfdPlayButton"),
  wfdMeta: document.getElementById("wfdMeta"),
  wfdTitle: document.getElementById("wfdTitle"),
  wfdProgressPill: document.getElementById("wfdProgressPill"),
  wfdInput: document.getElementById("wfdInput"),
  wfdRevealButton: document.getElementById("wfdRevealButton"),
  wfdCheckButton: document.getElementById("wfdCheckButton"),
  wfdResult: document.getElementById("wfdResult"),
  wfdImportText: document.getElementById("wfdImportText"),
  wfdImportAppendButton: document.getElementById("wfdImportAppendButton"),
  wfdImportReplaceButton: document.getElementById("wfdImportReplaceButton"),
  wfdSyncUrlInput: document.getElementById("wfdSyncUrlInput"),
  wfdSyncButton: document.getElementById("wfdSyncButton"),
  wfdClearBankButton: document.getElementById("wfdClearBankButton"),
  wfdSyncStatus: document.getElementById("wfdSyncStatus")
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
  els.openCatalogButton.addEventListener("click", openCatalog);
  els.closeCatalogButton.addEventListener("click", closeCatalog);
  els.catalogBackdrop.addEventListener("click", closeCatalog);
  els.catalogFilterList.addEventListener("click", handleCatalogFilterClick);
  els.mobilePreviousArticleButton.addEventListener("click", () => goToAdjacentArticle(-1));
  els.mobileNextArticleButton.addEventListener("click", () => goToAdjacentArticle(1));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCatalog();
  });

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
    if (state.mode === "exam" && state.examType === "composite" && state.compositeExam.active) {
      showToast("综合考核进行中，请先完成当前考核再切换分类。", true);
      return;
    }
    state.memoryFilter = button.dataset.memoryFilter;
    moveToFirstArticleInCurrentRange();
    render();
  });

  els.toggleImageButton.addEventListener("click", () => {
    state.imageCollapsed = !state.imageCollapsed;
    renderImagePanelState();
  });
  els.toggleArticleSourceButton.addEventListener("click", () => {
    state.articleSourceCollapsed = !state.articleSourceCollapsed;
    renderArticleSourceState();
  });
  els.toggleArticleTranslationButton.addEventListener("click", () => {
    state.articleTranslationVisible = !state.articleTranslationVisible;
    renderArticleSource(getActiveArticle());
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
    if (state.mode === "template") {
      handleTemplateTimerChange();
      startTimer(state.mode);
    }
  });
  els.templateTimerInput.addEventListener("change", handleTemplateTimerChange);
  els.templateTimerInput.addEventListener("blur", handleTemplateTimerChange);
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
  els.drillRevealButton.addEventListener("click", revealDrillAnswer);
  els.drillActions.addEventListener("click", handleDrillGrade);
  els.drillSkipButton.addEventListener("click", nextDrillCard);
  els.drillPreviousButton.addEventListener("click", previousDrillCard);
  els.drillPreviousArticleButton.addEventListener("click", () => goToAdjacentDrillArticle(-1));
  els.drillNextArticleButton.addEventListener("click", () => goToAdjacentDrillArticle(1));
  els.wfdPreviousButton.addEventListener("click", () => goToAdjacentWfd(-1));
  els.wfdNextButton.addEventListener("click", () => goToAdjacentWfd(1));
  els.wfdPlayButton.addEventListener("click", playCurrentWfd);
  els.wfdRevealButton.addEventListener("click", revealCurrentWfd);
  els.wfdCheckButton.addEventListener("click", checkCurrentWfd);
  els.wfdInput.addEventListener("input", saveCurrentWfdDraft);
  els.wfdImportAppendButton.addEventListener("click", () => importWfdItems({ replace: false }));
  els.wfdImportReplaceButton.addEventListener("click", () => importWfdItems({ replace: true }));
  els.wfdSyncButton.addEventListener("click", syncWfdFromUrl);
  els.wfdClearBankButton.addEventListener("click", clearWfdBank);
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
  state.drill.answerVisible = false;
  state.wfd.answerVisible = false;
  state.wfd.checked = false;
  if (mode === "memory" && !memoryArticles().some((article) => article.id === state.activeArticleId)) {
    const first = memoryArticles()[0];
    if (first) state.activeArticleId = first.id;
  }
  if (mode === "article" && !articleArticles().some((article) => article.id === state.activeArticleId)) {
    const first = articleArticles()[0];
    if (first) state.activeArticleId = first.id;
  }
  if (mode === "drill") {
    const cards = drillCards();
    state.drill.index = normalizeDrillIndex(state.drill.index, cards.length);
    if (cards[state.drill.index]) state.activeArticleId = cards[state.drill.index].article.id;
  }
  if (mode === "exam" && !examArticles().some((article) => article.id === state.activeArticleId)) {
    const first = examArticles()[0];
    if (first) state.activeArticleId = first.id;
  }
  if (mode === "exam") {
    state.search = "";
    els.searchInput.value = "";
  }
  if (mode === "wfd") {
    persisted.wfd.index = normalizeWfdIndex(persisted.wfd.index, persisted.wfd.items.length);
    loadCurrentWfdDraft();
  }
  stopTimer(false);
  state.timer.remaining = modeLimitSeconds(mode);
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
  renderCatalog();
  renderMain();
  renderTimer();
}

function renderSummary() {
  const mastered = articles.filter((article) => masteryLevel(getArticleProgress(article.id)).key === "skilled").length;
  els.progressSummary.textContent = `${mastered} / ${articles.length} 已掌握`;
}

function renderMemoryFilterState() {
  const showsMemoryFilters = usesMemoryCatalog();
  els.memoryFilterPanel.hidden = !showsMemoryFilters;
  els.statusFilterPanel.hidden = showsMemoryFilters;
  document.querySelectorAll(".memory-filter-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.memoryFilter === state.memoryFilter);
  });
}

function usesMemoryCatalog() {
  return state.mode === "memory" || state.mode === "article" || state.mode === "exam" || state.mode === "drill";
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
    ? category.fullLabel
    : "未归入母逻辑：按卡片直接速记。";
  els.memoryHookText.textContent = meta?.hook || "暂无中文钩子";
  els.memoryWritingLogicText.textContent = meta?.logic || category?.summary || "按图片链路记忆。";
}

function renderLearningPath(article) {
  if (!els.learningPathPanel) return;
  const path = learningPath(article);
  const shouldShow = usesMemoryCatalog() && Boolean(path);
  els.learningPathPanel.hidden = !shouldShow;
  if (!shouldShow) {
    els.learningPathHook.textContent = "";
    els.learningRouteList.textContent = "";
    fillList(els.learningKeywordList, []);
    fillList(els.learningSkeletonList, []);
    return;
  }

  els.learningPathHook.textContent = path.cnHook || "";
  els.learningRouteList.textContent = path.cnHook || "";
  fillList(els.learningKeywordList, path.keywords || []);
  fillList(els.learningSkeletonList, path.skeleton || []);
}

function fillList(list, items) {
  if (!list) return;
  list.replaceChildren(
    ...items.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    })
  );
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

function examArticles() {
  return filteredByMemoryRange();
}

function navigationArticles() {
  if (state.mode === "drill") return articleArticles();
  if (state.mode === "memory") return memoryArticles();
  if (state.mode === "article") return articleArticles();
  if (state.mode === "exam") return examArticles();
  return articles;
}
function memoryMeta(article) {
  return MEMORY_CARD_META[article?.number] || null;
}

function learningPath(article) {
  return LEARNING_PATHS[article?.number] || null;
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
  if (state.mode === "wfd") {
    renderWfdLevelList();
    return;
  }
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
            usesMemoryCatalog()
              ? memoryLevelMeta(article)
              : `${practiceFieldCount(article)} 空 · 近5次 ${windowCorrectCount(progress)}/5`
          }</span>
        </span>
        <span class="status-pill ${level.key}">
          ${level.label}
        </span>
      `;
      button.addEventListener("click", () => {
        selectCatalogArticle(article);
      });
      return button;
    })
  );
}

function renderWfdLevelList() {
  const query = state.search;
  const visibleItems = persisted.wfd.items.filter((item) => {
    const haystack = `${item.sentence} ${(item.sources || []).join(" ")}`.toLowerCase();
    return !query || haystack.includes(query);
  });
  els.levelList.replaceChildren(
    ...visibleItems.map((item) => {
      const index = persisted.wfd.items.findIndex((entry) => entry.id === item.id);
      const progress = wfdProgress(item.id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "level-item";
      button.classList.toggle("is-active", index === persisted.wfd.index);
      button.innerHTML = `
        <span>
          <span class="level-item-title">${escapeHtml(item.sentence)}</span>
          <span class="level-item-meta">${escapeHtml(wfdMetaText(item))}</span>
        </span>
        <span class="status-pill ${progress.mastered ? "skilled" : progress.lastResult === "failed" ? "weak" : "learning"}">
          ${progress.mastered ? "已掌握" : progress.lastResult === "failed" ? "错题" : "待练"}
        </span>
      `;
      button.addEventListener("click", () => {
        saveCurrentWfdDraft();
        persisted.wfd.index = index;
        state.wfd.answerVisible = false;
        state.wfd.checked = false;
        loadCurrentWfdDraft();
        writeState();
        render();
      });
      return button;
    })
  );
}

function renderCatalog() {
  if (!els.catalogList) return;
  renderCatalogFilters();
  const items = navigationArticles();
  els.catalogList.replaceChildren(
    ...items.map((article) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "catalog-item";
      button.classList.toggle("is-active", article.id === currentCatalogArticleId());
      button.innerHTML = `
        <span>
          <strong>${escapeHtml(article.title)}</strong>
          <small>${escapeHtml(memoryLevelMeta(article))}</small>
        </span>
        <span>${article.id === currentCatalogArticleId() ? "当前" : "开始"}</span>
      `;
      button.addEventListener("click", () => selectCatalogArticle(article));
      return button;
    })
  );
}

function renderCatalogFilters() {
  if (!els.catalogFilterList) return;
  const shouldShow = usesMemoryCatalog();
  els.catalogFilterList.hidden = !shouldShow;
  if (!shouldShow) {
    els.catalogFilterList.replaceChildren();
    return;
  }
  els.catalogFilterList.replaceChildren(
    ...MEMORY_FILTERS.map((filter) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "catalog-filter-button";
      button.classList.toggle("is-active", filter.key === state.memoryFilter);
      button.dataset.memoryFilter = filter.key;
      button.textContent = filter.label;
      return button;
    })
  );
}

function handleCatalogFilterClick(event) {
  const button = event.target.closest(".catalog-filter-button");
  if (!button) return;
  if (state.mode === "exam" && state.examType === "composite" && state.compositeExam.active) {
    showToast("综合考核进行中，请先完成当前考核再切换分类。", true);
    return;
  }
  saveCurrentDrafts();
  state.memoryFilter = button.dataset.memoryFilter;
  moveToFirstArticleInCurrentRange();
  renderMemoryFilterState();
  renderLevelList();
  renderCatalog();
  renderMain();
  renderTimer();
}

function currentCatalogArticleId() {
  if (state.mode === "drill") return currentDrillCard()?.article.id || state.activeArticleId;
  return state.activeArticleId;
}

function openCatalog() {
  renderCatalog();
  els.catalogPanel.hidden = false;
  document.body.classList.add("is-catalog-open");
}

function closeCatalog() {
  if (!els.catalogPanel || els.catalogPanel.hidden) return;
  els.catalogPanel.hidden = true;
  document.body.classList.remove("is-catalog-open");
}

function selectCatalogArticle(article) {
  if (state.mode === "exam" && state.examType === "composite" && state.compositeExam.active) {
    showToast("综合考核进行中，请先完成当前篇。", true);
    return;
  }
  saveCurrentDrafts();
  if (state.mode === "exam") {
    state.examType = "single";
    state.compositeExam.active = false;
    els.examResult.hidden = true;
  }
  if (state.mode === "template") {
    state.activeArticleId = article.id;
    closeCatalog();
    setMode("article");
    return;
  }
  jumpToArticle(article.id);
  closeCatalog();
  render();
}

function jumpToArticle(articleId) {
  state.activeArticleId = articleId;
  state.answersVisible = false;
  state.drill.answerVisible = false;
  if (els.revealAllButton) els.revealAllButton.textContent = "显示答案";
  if (state.mode === "drill") {
    const cards = drillCards();
    const index = cards.findIndex((card) => card.article.id === articleId);
    state.drill.index = index >= 0 ? index : 0;
    const card = cards[state.drill.index];
    if (card) state.activeArticleId = card.article.id;
  }
}

function moveToFirstArticleInCurrentRange() {
  const source = navigationArticles();
  const next = source[0];
  if (!next) return;
  jumpToArticle(next.id);
}

function renderMain() {
  const item = currentPracticeItem();
  const isMemoryMode = state.mode === "memory";
  const isDrillMode = state.mode === "drill";
  const isWfdMode = state.mode === "wfd";

  els.appShell.classList.toggle("is-memory-mode", isMemoryMode);
  els.appShell.classList.toggle("is-drill-mode", isDrillMode);
  els.appShell.classList.toggle("is-wfd-mode", isWfdMode);
  els.appShell.classList.toggle("is-article-mode", state.mode === "article");
  els.practicePanel.hidden = state.mode === "exam" || isMemoryMode || isDrillMode || isWfdMode;
  els.mobileArticleNav.hidden = state.mode === "template" || state.mode === "exam" || isDrillMode || isWfdMode;
  els.articleSourcePanel.hidden = state.mode !== "article";
  els.drillPanel.hidden = !isDrillMode;
  els.examPanel.hidden = state.mode !== "exam";
  els.wfdPanel.hidden = !isWfdMode;
  els.markMasteredButton.hidden = state.mode === "template" || state.mode === "exam" || isDrillMode || isWfdMode;
  els.nextLevelButton.hidden = state.mode === "template" || state.mode === "exam" || isDrillMode || isWfdMode;
  els.promptPanel.hidden = state.mode === "template" || state.mode === "exam" || isMemoryMode || isDrillMode || isWfdMode;
  els.memoryMetaPanel.hidden = !usesMemoryCatalog() || isDrillMode || isWfdMode;
  els.learningPathPanel.hidden = !usesMemoryCatalog() || isDrillMode || isWfdMode;
  els.imageSection.hidden = state.mode === "template" || state.mode === "exam" || isDrillMode || isWfdMode || !displayImagePath(item);
  if (isWfdMode) {
    els.levelNumber.textContent = "Write From Dictation";
    els.levelTitle.textContent = "候选高频听写";
    els.timerDisplay.hidden = true;
    renderMemoryMeta(null);
    renderLearningPath(null);
    renderDrill(null);
    renderArticleSource(null);
    renderWfd();
    return;
  }
  if (!item) return;
  if (state.mode === "exam") {
    els.levelImage.removeAttribute("src");
    els.topicText.textContent = "";
    els.positionText.textContent = "";
  }
  if (!els.imageSection.hidden) {
    renderImagePanelState();
  }

  if (state.mode === "template") {
    els.levelNumber.textContent = "模板练习";
    els.levelTitle.textContent = template.title;
    els.practiceTitle.textContent = templatePracticeTitle();
    els.levelScore.textContent = scoreText(template.id);
    renderLearningPath(null);
    renderDrill(null);
  } else {
    const article = state.mode === "exam" ? currentExamArticle() : getActiveArticle();
    if (isDrillMode) {
      els.levelNumber.textContent = "刷卡训练";
      els.levelTitle.textContent = "核心素材提取";
      renderMemoryMeta(null);
      renderLearningPath(null);
      renderArticleSource(null);
      renderDrill(article);
      return;
    }
    if (state.mode === "exam") {
      els.levelNumber.textContent = examHeaderLabel();
      els.levelTitle.textContent = state.examType === "composite" ? "综合考核" : article.title;
      els.examTopicText.textContent = article.topic;
      renderMemoryMeta(article);
      renderLearningPath(article);
      renderDrill(null);
    } else {
      const meta = memoryMeta(article);
      els.levelNumber.textContent = isMemoryMode ? "图片速记" : article.number;
      els.levelTitle.textContent = isMemoryMode ? article.title : article.name;
      els.topicText.textContent = article.topic;
      els.positionText.textContent = article.position;
      renderMemoryMeta(usesMemoryCatalog() ? article : null);
      renderLearningPath(usesMemoryCatalog() ? article : null);
      renderDrill(null);
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

function renderImagePanelState() {
  if (!els.imageSection) return;
  els.imageSection.classList.toggle("is-collapsed", state.imageCollapsed);
  els.imageFrame.classList.toggle("is-expanded", !state.imageCollapsed);
  els.toggleImageButton.textContent = state.imageCollapsed ? "展开关卡图片" : "收起";
}

function renderArticleSourceState() {
  if (!els.articleSourcePanel) return;
  els.articleSourcePanel.classList.toggle("is-collapsed", state.articleSourceCollapsed);
  els.articleSourcePanel.classList.toggle("is-translation-visible", state.articleTranslationVisible);
  els.toggleArticleSourceButton.textContent = state.articleSourceCollapsed ? "展开" : "收起";
  if (els.toggleArticleTranslationButton) {
    els.toggleArticleTranslationButton.textContent = state.articleTranslationVisible ? "隐藏中文" : "显示中文";
    els.toggleArticleTranslationButton.setAttribute("aria-pressed", String(state.articleTranslationVisible));
  }
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
      const paragraphEl = document.createElement("article");
      paragraphEl.className = "article-source-paragraph";
      paragraphEl.innerHTML = articleSourceParagraphHtml(article, paragraph, index);
      return paragraphEl;
    })
  );
}

function drillCards() {
  return articleArticles()
    .filter((article) => learningPath(article))
    .flatMap((article) => DRILL_TYPES.map((type) => ({
      id: `${article.number}:${type.key}`,
      article,
      type
    })));
}

function normalizeDrillIndex(index, total) {
  if (!total) return 0;
  return ((index % total) + total) % total;
}

function currentDrillCard() {
  const cards = drillCards();
  if (!cards.length) return null;
  state.drill.index = normalizeDrillIndex(state.drill.index, cards.length);
  return cards[state.drill.index];
}

function renderDrill() {
  if (!els.drillPanel || state.mode !== "drill") return;
  const cards = drillCards();
  const card = currentDrillCard();
  if (!card) {
    els.drillCardType.textContent = "暂无卡片";
    els.drillCardTitle.textContent = "没有可刷内容";
    els.drillProgressText.textContent = "0 / 0";
    els.drillQuestion.textContent = "当前筛选范围没有分层背诵数据。";
    els.drillAnswer.hidden = true;
    els.drillActions.hidden = true;
    return;
  }

  const { article, type } = card;
  const path = learningPath(article);
  state.activeArticleId = article.id;
  els.drillCardType.textContent = type.label;
  els.drillCardTitle.textContent = `${article.number} ${article.name}`;
  els.drillProgressText.textContent = `${state.drill.index + 1} / ${cards.length}`;
  els.drillQuestion.innerHTML = drillQuestionHtml(article, path, type.key);
  els.drillAnswer.innerHTML = drillAnswerHtml(article, path, type.key);
  els.drillAnswer.hidden = !state.drill.answerVisible;
  els.drillActions.hidden = !state.drill.answerVisible;
  els.drillRevealButton.hidden = state.drill.answerVisible;
}

function drillQuestionHtml(article, path, type) {
  if (type === "route") {
    return `
      <span class="drill-prompt-label">看到题目，回忆一句话串记</span>
      <strong>${escapeHtml(article.topic)}</strong>
      <p>用一句话串起立场、两个分论点和结论。</p>
    `;
  }
  if (type === "keywords") {
    return `
      <span class="drill-prompt-label">根据一句话串记，回忆英文锚点</span>
      <strong>${escapeHtml(path.cnHook)}</strong>
    `;
  }
  if (type === "skeleton") {
    return `
      <span class="drill-prompt-label">根据关键词，默写 4 句英文骨架</span>
      ${tagListHtml(path.keywords, "drill-keyword-chip")}
    `;
  }
  if (type === "source") {
    return `
      <span class="drill-prompt-label">全文背诵前，先回忆高亮核心句</span>
      <p class="drill-topic-text">${escapeHtml(article.topic)}</p>
      <p>先默写或口头复述全文；重点确认黄色高亮部分是否能准确写出。</p>
    `;
  }
  return `
    <span class="drill-prompt-label">混合提取</span>
    <strong>${escapeHtml(article.topic)}</strong>
    <p>直接说出一句话串记、英文锚点和 4 句英文骨架。</p>
  `;
}

function drillAnswerHtml(article, path, type) {
  const routeBlock = `
    <section>
      <span>一句话串记</span>
      <p class="drill-hook">${escapeHtml(path.cnHook)}</p>
    </section>
  `;
  const keywordBlock = `
    <section>
      <span>英文关键词</span>
      ${tagListHtml(path.keywords, "drill-keyword-chip")}
    </section>
  `;
  const skeletonBlock = `
    <section>
      <span>4 句英文骨架</span>
      ${orderedListHtml(path.skeleton)}
    </section>
  `;
  if (type === "route") return routeBlock;
  if (type === "keywords") return keywordBlock;
  if (type === "skeleton") return skeletonBlock;
  if (type === "source") return drillSourceHtml(article);
  return routeBlock + keywordBlock + skeletonBlock;
}

function drillSourceHtml(article) {
  return `
    <section class="drill-source-panel">
      <span>作文原文 · 高亮为重点背诵</span>
      <div class="drill-source-body">
        ${article.paragraphs.map((paragraph, index) => `
          <div class="article-source-paragraph">
            ${articleSourceParagraphHtml(article, paragraph, index)}
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function orderedListHtml(items) {
  return `<ol>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
}

function tagListHtml(items, className) {
  return `<div class="drill-chip-list">${items.map((item) => `<span class="${className}">${escapeHtml(item)}</span>`).join("")}</div>`;
}

function revealDrillAnswer() {
  state.drill.answerVisible = true;
  renderDrill();
}

function handleDrillGrade(event) {
  const button = event.target.closest("[data-grade]");
  if (!button) return;
  const card = currentDrillCard();
  if (!card) return;
  const grade = button.dataset.grade;
  const key = card.id;
  const previous = persisted.drill[key] || { reviews: 0, streak: 0 };
  const delta = grade === "known" ? 1 : grade === "vague" ? 0 : -1;
  persisted.drill[key] = {
    reviews: (previous.reviews || 0) + 1,
    streak: grade === "known" ? (previous.streak || 0) + 1 : 0,
    strength: Math.max(0, Math.min(5, (previous.strength || 0) + delta)),
    grade,
    reviewedAt: new Date().toISOString()
  };

  writeState();
  nextDrillCard();
}

function nextDrillCard() {
  const cards = drillCards();
  if (!cards.length) return;
  state.drill.index = normalizeDrillIndex(state.drill.index + 1, cards.length);
  state.drill.answerVisible = false;
  render();
}

function previousDrillCard() {
  const cards = drillCards();
  if (!cards.length) return;
  state.drill.index = normalizeDrillIndex(state.drill.index - 1, cards.length);
  state.drill.answerVisible = false;
  render();
}

function goToAdjacentDrillArticle(direction) {
  const current = currentDrillCard();
  const items = navigationArticles();
  if (!current || !items.length) return;
  const currentIndex = items.findIndex((article) => article.id === current.article.id);
  const next = items[(currentIndex + direction + items.length) % items.length];
  if (!next) return;
  jumpToArticle(next.id);
  render();
}

function renderWfd() {
  const items = persisted.wfd.items;
  persisted.wfd.index = normalizeWfdIndex(persisted.wfd.index, items.length);
  const item = currentWfdItem();
  const mastered = items.filter((entry) => wfdProgress(entry.id).mastered).length;
  const generated = DEFAULT_WFD_GENERATED_AT ? ` · 更新 ${formatDate(DEFAULT_WFD_GENERATED_AT)}` : "";
  els.wfdSummary.textContent = `${items.length} 句候选高频 · ${mastered} 句已掌握${generated}`;
  els.wfdSyncUrlInput.value = persisted.wfd.syncUrl || "";
  els.wfdSyncStatus.textContent = persisted.wfd.lastSyncedAt
    ? `上次同步 ${formatDateTime(persisted.wfd.lastSyncedAt)}`
    : "未同步";
  els.wfdProgressPill.textContent = items.length ? `${persisted.wfd.index + 1} / ${items.length}` : "0 / 0";
  els.wfdPreviousButton.disabled = items.length < 2;
  els.wfdNextButton.disabled = items.length < 2;
  els.wfdPlayButton.disabled = !item;
  els.wfdRevealButton.disabled = !item;
  els.wfdCheckButton.disabled = !item;

  if (!item) {
    els.wfdMeta.textContent = "先导入候选库";
    els.wfdTitle.textContent = "暂无题目";
    els.wfdInput.value = "";
    els.wfdInput.disabled = true;
    els.wfdResult.hidden = false;
    els.wfdResult.innerHTML = `
      <div class="wfd-empty">
        <strong>还没有 WFD 题库</strong>
        <p>自动更新源暂时没有生成数据；可以稍后刷新，或先用同步源补充。</p>
      </div>
    `;
    return;
  }

  const progress = wfdProgress(item.id);
  els.wfdMeta.textContent = wfdMetaText(item);
  els.wfdTitle.textContent = progress.mastered ? "已掌握 · 继续抽查" : "听一句，默写一句";
  els.wfdInput.disabled = false;
  if (els.wfdInput.dataset.itemId !== item.id) {
    loadCurrentWfdDraft();
  }
  if (state.wfd.answerVisible || state.wfd.checked) {
    renderWfdResult(item);
  } else {
    els.wfdResult.hidden = true;
    els.wfdResult.textContent = "";
  }
}

function currentWfdItem() {
  return persisted.wfd.items[persisted.wfd.index] || null;
}

function goToAdjacentWfd(direction) {
  if (!persisted.wfd.items.length) return;
  saveCurrentWfdDraft();
  persisted.wfd.index = normalizeWfdIndex(persisted.wfd.index + direction, persisted.wfd.items.length);
  state.wfd.answerVisible = false;
  state.wfd.checked = false;
  loadCurrentWfdDraft();
  writeState();
  renderWfd();
}

function loadCurrentWfdDraft() {
  const item = currentWfdItem();
  els.wfdInput.dataset.itemId = item?.id || "";
  els.wfdInput.value = item ? (wfdProgress(item.id).draft || "") : "";
}

function saveCurrentWfdDraft() {
  const item = currentWfdItem();
  if (!item) return;
  const progress = wfdProgress(item.id);
  progress.draft = els.wfdInput.value;
  progress.updatedAt = new Date().toISOString();
  writeState();
}

function revealCurrentWfd() {
  if (!currentWfdItem()) return;
  state.wfd.answerVisible = true;
  renderWfd();
}

function checkCurrentWfd() {
  const item = currentWfdItem();
  if (!item) return;
  const actual = els.wfdInput.value;
  const expectedWords = wfdWords(item.sentence);
  const actualWords = wfdWords(actual);
  const passed = expectedWords.length > 0 &&
    expectedWords.length === actualWords.length &&
    expectedWords.every((word, index) => word === actualWords[index]);
  const progress = wfdProgress(item.id);
  progress.draft = actual;
  progress.reviews = (progress.reviews || 0) + 1;
  progress.correct = (progress.correct || 0) + (passed ? 1 : 0);
  progress.streak = passed ? (progress.streak || 0) + 1 : 0;
  progress.mastered = progress.streak >= 2 || Boolean(progress.mastered && passed);
  progress.lastResult = passed ? "passed" : "failed";
  progress.updatedAt = new Date().toISOString();
  state.wfd.checked = true;
  state.wfd.answerVisible = true;

  writeState();
  renderWfd();
}

function renderWfdResult(item) {
  const progress = wfdProgress(item.id);
  const diff = tokenDiff(wfdCompareTokens(item.sentence), wfdCompareTokens(progress.draft || ""));
  const sourceList = item.sources?.length ? item.sources.join(" / ") : "未标注来源";
  els.wfdResult.hidden = false;
  els.wfdResult.innerHTML = `
    <div class="wfd-result-heading">
      <span>${progress.lastResult === "passed" ? "通过" : state.wfd.checked ? "需复习" : "答案"}</span>
      <strong>${escapeHtml(item.sentence)}</strong>
      <small>来源：${escapeHtml(sourceList)}${item.audio ? " · 有音频" : " · TTS 播放"}</small>
    </div>
    <div class="diff-columns">
      <div class="diff-cell expected">
        <strong>标准答案</strong>
        <div class="exam-diff-text">${renderDiffTokens(diff.expected, "expected")}</div>
      </div>
      <div class="diff-cell actual">
        <strong>你的答案</strong>
        <div class="exam-diff-text">${renderDiffTokens(diff.actual, "actual") || '<span class="muted-token">[未填写]</span>'}</div>
      </div>
    </div>
  `;
}

function playCurrentWfd() {
  const item = currentWfdItem();
  if (!item) return;
  if (item.audio) {
    const audio = new Audio(item.audio);
    audio.play().catch(() => speakWfdSentence(item.sentence));
    return;
  }
  speakWfdSentence(item.sentence);
}

function speakWfdSentence(sentence) {
  if (!("speechSynthesis" in window)) {
    showToast("当前浏览器不支持朗读，请先显示答案自读。", true);
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(sentence);
  utterance.lang = "en-US";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

function importWfdItems({ replace }) {
  const parsed = parseWfdImport(els.wfdImportText.value);
  if (!parsed.length) {
    showToast("没有识别到有效 WFD 句子。", true);
    return;
  }
  mergeWfdItems(parsed, { replace });
  persisted.wfd.index = 0;
  state.wfd.answerVisible = false;
  state.wfd.checked = false;
  els.wfdImportText.value = "";
  loadCurrentWfdDraft();
  writeState();
  render();
  showToast(`${replace ? "替换" : "追加"} ${parsed.length} 句，已自动去重。`);
}

async function syncWfdFromUrl() {
  const url = els.wfdSyncUrlInput.value.trim();
  if (!url) {
    showToast("先填写同步源地址。", true);
    return;
  }
  try {
    els.wfdSyncButton.disabled = true;
    els.wfdSyncStatus.textContent = "同步中...";
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const parsed = parseWfdImport(text);
    if (!parsed.length) throw new Error("未识别到题目");
    persisted.wfd.syncUrl = url;
    persisted.wfd.lastSyncedAt = new Date().toISOString();
    mergeWfdItems(parsed, { replace: false });
    writeState();
    render();
    showToast(`同步 ${parsed.length} 句，已按句子去重。`);
  } catch (error) {
    els.wfdSyncStatus.textContent = "同步失败";
    showToast(`同步失败：${error.message || "可能被 CORS 限制"}`, true);
  } finally {
    els.wfdSyncButton.disabled = false;
  }
}

function clearWfdBank() {
  persisted.wfd.items = seededWfdItems([]);
  persisted.wfd.progress = {};
  persisted.wfd.index = 0;
  state.wfd.answerVisible = false;
  state.wfd.checked = false;
  writeState();
  render();
}

function parseWfdImport(raw) {
  const text = String(raw || "").trim();
  if (!text) return [];
  const fromJson = parseWfdJson(text);
  if (fromJson.length) return fromJson;
  return text
    .split(/\n+/)
    .map((line) => line.replace(/^\s*\d+[\.)、-]\s*/, "").trim())
    .map((sentence) => normalizeWfdItem({ sentence, sources: ["manual"], origin: "custom" }))
    .filter(Boolean);
}

function parseWfdJson(text) {
  try {
    const parsed = JSON.parse(text);
    const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed.items) ? parsed.items : [];
    return normalizeWfdItems(list.map((item) => (
      typeof item === "string" ? { sentence: item, origin: "custom" } : { ...item, origin: "custom" }
    )));
  } catch {
    return [];
  }
}

function seededWfdItems(items) {
  const customItems = normalizeWfdItems(items).filter((item) => item.origin === "custom");
  return mergeWfdCatalogItems(DEFAULT_WFD_ITEMS, customItems);
}

function mergeWfdCatalogItems(primary, secondary) {
  const merged = new Map();
  primary.forEach((item) => merged.set(item.id, item));
  secondary.forEach((item) => {
    const previous = merged.get(item.id);
    merged.set(item.id, previous ? mergeWfdItem(previous, item) : item);
  });
  return [...merged.values()];
}

function mergeWfdItems(items, { replace }) {
  const merged = new Map();
  if (!replace) {
    persisted.wfd.items.forEach((item) => merged.set(item.id, item));
  }
  items.forEach((item) => {
    const previous = merged.get(item.id);
    merged.set(item.id, previous ? mergeWfdItem(previous, item) : item);
  });
  persisted.wfd.items = [...merged.values()];
  persisted.wfd.index = normalizeWfdIndex(persisted.wfd.index, persisted.wfd.items.length);
}

function mergeWfdItem(previous, next) {
  return {
    ...previous,
    sentence: previous.sentence || next.sentence,
    audio: previous.audio || next.audio || "",
    sources: [...new Set([...(previous.sources || []), ...(next.sources || [])])],
    sourceCount: Math.max(previous.sourceCount || 0, next.sourceCount || 0),
    priorityScore: Math.max(previous.priorityScore || 0, next.priorityScore || 0),
    origin: previous.origin === "custom" || next.origin === "custom" ? "custom" : "builtin",
    updatedAt: next.updatedAt || previous.updatedAt || ""
  };
}

function normalizeWfdItems(items) {
  const map = new Map();
  (Array.isArray(items) ? items : []).forEach((item) => {
    const normalized = normalizeWfdItem(item);
    if (!normalized) return;
    const previous = map.get(normalized.id);
    map.set(normalized.id, previous ? mergeWfdItem(previous, normalized) : normalized);
  });
  return [...map.values()];
}

function normalizeWfdItem(item) {
  const sentence = cleanWfdSentence(typeof item === "string" ? item : item?.sentence);
  if (!isLikelyWfdSentence(sentence)) return null;
  const sources = Array.isArray(item?.sources)
    ? item.sources
    : item?.source
      ? [item.source]
      : [];
  return {
    id: wfdSentenceKey(sentence),
    sentence,
    sources: sources.map((source) => String(source).trim()).filter(Boolean),
    audio: typeof item?.audio === "string" ? item.audio.trim() : "",
    sourceCount: Number.isFinite(Number(item?.sourceCount)) ? Number(item.sourceCount) : sources.length,
    priorityScore: Number.isFinite(Number(item?.priorityScore)) ? Number(item.priorityScore) : 0,
    origin: item?.origin === "custom" || sources.includes("manual") ? "custom" : "builtin",
    updatedAt: typeof item?.updatedAt === "string" ? item.updatedAt : ""
  };
}

function cleanWfdSentence(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/^["'“”]+|["'“”]+$/g, "")
    .trim();
}

function isLikelyWfdSentence(sentence) {
  const count = wfdWords(sentence).length;
  return count >= 4 && count <= 24 && /[A-Za-z]/.test(sentence);
}

function wfdSentenceKey(sentence) {
  return wfdWords(sentence).join("-");
}

function wfdWords(value) {
  return String(value || "").toLowerCase().match(/[a-z0-9']+/g) || [];
}

function wfdCompareTokens(value) {
  return wfdWords(value);
}

function wfdProgress(id) {
  persisted.wfd.progress[id] ||= {
    draft: "",
    reviews: 0,
    correct: 0,
    streak: 0,
    mastered: false,
    lastResult: "",
    updatedAt: ""
  };
  return persisted.wfd.progress[id];
}

function normalizeWfdIndex(index, length) {
  if (!length) return 0;
  const parsed = Number.parseInt(index, 10);
  if (!Number.isFinite(parsed)) return 0;
  return ((parsed % length) + length) % length;
}

function wfdMetaText(item) {
  const sourceCount = item.sources?.length || 0;
  const progress = wfdProgress(item.id);
  const parts = [
    sourceCount ? `${sourceCount} 个来源` : "未标注来源",
    progress.reviews ? `练过 ${progress.reviews} 次` : "未练习",
    progress.mastered ? "已掌握" : "候选高频"
  ];
  return parts.join(" · ");
}

function articleSourceParagraphHtml(article, paragraph, paragraphIndex) {
  const englishHtml = renderHighlightedText(paragraph, articleCoreRanges(article, paragraph, paragraphIndex));
  const chinese = translatedParagraph(article, paragraphIndex);
  const chineseHtml = chinese
    ? renderHighlightedText(chinese.text, chinese.ranges, "core-sentence-highlight zh")
    : '<span class="translation-missing">暂无中文翻译，待导入校对版译文后显示。</span>';
  const shouldRenderChinese = state.mode !== "article" || state.articleTranslationVisible;
  const chineseRowHtml = shouldRenderChinese
    ? `
    <div class="article-source-row zh-row">
      <span class="article-source-label">中</span>
      <p>${chineseHtml}</p>
    </div>`
    : "";
  return `
    <div class="article-source-row">
      <span class="article-source-label">EN</span>
      <p>${englishHtml}</p>
    </div>
    ${chineseRowHtml}
  `;
}

function articleCoreRanges(article, paragraph, paragraphIndex) {
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

  return ranges;
}

function translatedParagraph(article, paragraphIndex) {
  const translation = ARTICLE_TRANSLATIONS[article?.number];
  if (!translation) return null;

  const paragraph = translation.paragraphs?.[paragraphIndex];
  if (!paragraph) return null;

  return { text: paragraph, ranges: chineseCoreRanges(paragraph, paragraphIndex) };
}

function chineseCoreRanges(paragraph, paragraphIndex) {
  if (paragraphIndex === 0) return chineseIntroductionRanges(paragraph);
  if (paragraphIndex === 3) return chineseConclusionRanges(paragraph);
  return chineseBodyRanges(paragraph);
}

function chineseIntroductionRanges(paragraph) {
  const ranges = [];
  addBetweenRange(ranges, paragraph, "关于", "，这一问题");
  addBetweenRange(ranges, paragraph, "许多人认为", "。");
  addAfterRange(ranges, paragraph, "在这篇文章中，我将阐述我的观点：", "。");
  return ranges;
}

function chineseBodyRanges(paragraph) {
  const ranges = [];
  addAfterRange(ranges, paragraph, "重要性的一个最有说服力的原因是，", "。");
  addAfterRange(ranges, paragraph, "不可忽视的关键因素是，", "。");
  addAfterRange(ranges, paragraph, "因为", "。");
  addAfterRange(ranges, paragraph, "研究表明，", "。");
  addAfterRange(ranges, paragraph, "根据我的经验，", "。");
  addAfterRange(ranges, paragraph, "因此，", "。");
  return ranges;
}

function chineseConclusionRanges(paragraph) {
  const ranges = [];
  addBetweenRange(ranges, paragraph, "所有证据都表明，", "，主要是因为");
  addBetweenRange(ranges, paragraph, "主要是因为", "。");
  addAfterRange(ranges, paragraph, "我强烈建议", "。");
  return ranges;
}

function addAfterRange(ranges, text, marker, endMarker, startFrom = 0) {
  const markerIndex = text.indexOf(marker, startFrom);
  if (markerIndex < 0) return false;
  const start = markerIndex + marker.length;
  const end = text.indexOf(endMarker, start);
  if (end <= start) return false;
  ranges.push({ start, end });
  return true;
}

function addBetweenRange(ranges, text, startMarker, endMarker, startFrom = 0) {
  const markerIndex = text.indexOf(startMarker, startFrom);
  if (markerIndex < 0) return false;
  const start = markerIndex + startMarker.length;
  const end = text.indexOf(endMarker, start);
  if (end <= start) return false;
  ranges.push({ start, end });
  return true;
}

function renderHighlightedText(text, ranges, className = "core-sentence-highlight") {
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
    html += `<mark class="${className}">${escapeHtml(text.slice(range.start, range.end))}</mark>`;
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
  els.nextCompositeExamButton.hidden =
    state.examType !== "composite" ||
    !state.compositeExam.active ||
    state.compositeExam.currentIndex >= state.compositeExam.articleIds.length - 1;
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
    articleIds: shuffledArticles(examArticles()).slice(0, 4).map((article) => article.id),
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
      const progress = updateProgressWithResult(article.id, passed, {
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
  const totalCount = state.compositeExam.articleIds.length || 4;
  showToast(`综合考核已提交：${passedCount}/${totalCount} 篇通过，${compositeScore(passedCount, totalCount)} 分。`, passedCount < totalCount);
}

function gradeEssay(article, value) {
  const expectedParagraphs = article.paragraphs.map(normalizeForExact);
  const actualParagraphs = splitEssayInput(value, expectedParagraphs.length);
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
  const totalCount = state.compositeExam.articleIds.length || 4;
  const score = compositeScore(passedCount, totalCount);
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
  goToAdjacentArticle(1);
}

function goToAdjacentArticle(direction) {
  const items = navigationArticles();
  const index = items.findIndex((article) => article.id === state.activeArticleId);
  const next = items[(index + direction + items.length) % items.length];
  if (!next) return;
  saveCurrentDrafts();
  jumpToArticle(next.id);
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
    await navigator.serviceWorker.register("./sw.js?v=20261009-26", { updateViaCache: "none" });
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
  const seconds = modeLimitSeconds(mode);
  state.timer = {
    mode,
    endsAt: Date.now() + seconds * 1000,
    startedAt: Date.now(),
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
  const seconds = state.timer.interval ? state.timer.remaining : modeLimitSeconds(state.mode);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const showPracticeTimer = state.mode === "template";
  els.timerDisplay.hidden = state.mode === "article" || state.mode === "memory" || state.mode === "drill" || state.mode === "wfd";
  els.templateTimerInput.closest(".timer-setting").hidden = !showPracticeTimer;
  els.templateTimerInput.disabled = state.timer.interval && state.timer.mode === "template";
  els.templateTimerInput.value = String(templateTimerMinutes());
  els.startTimerButton.hidden = !showPracticeTimer;
  els.timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  els.timerDisplay.classList.toggle("is-warning", seconds <= 60 && seconds > 0);
  els.timerDisplay.classList.toggle("is-ended", seconds === 0);
  els.startTimerButton.textContent = state.timer.interval
    ? `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    : state.mode === "template"
      ? `开始 ${templateTimerMinutes()} 分钟`
      : "开始计时";
  els.startExamButton.textContent = state.timer.interval && state.mode === "exam" ? "计时中" : "开始";
}

function handleTemplateTimerChange() {
  const minutes = normalizedTemplateTimerMinutes(els.templateTimerInput.value);
  persisted.settings.templateTimerMinutes = minutes;
  els.templateTimerInput.value = String(minutes);
  writeState();
  if (!(state.timer.interval && state.timer.mode === "template")) {
    state.timer.remaining = templateTimerSeconds();
    renderTimer();
  }
  if (state.mode === "template") {
    els.practiceTitle.textContent = templatePracticeTitle();
  }
}

function modeLimitSeconds(mode) {
  if (mode === "template") return templateTimerSeconds();
  return MODE_LIMITS[mode] || MODE_LIMITS.template;
}

function templateTimerSeconds() {
  return templateTimerMinutes() * 60;
}

function templateTimerMinutes() {
  return normalizedTemplateTimerMinutes(persisted.settings?.templateTimerMinutes);
}

function templatePracticeTitle() {
  return `${templateTimerMinutes()} 分钟模板默写`;
}

function normalizedTemplateTimerMinutes(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return DEFAULT_TEMPLATE_TIMER_MINUTES;
  return clamp(parsed, MIN_TEMPLATE_TIMER_MINUTES, MAX_TEMPLATE_TIMER_MINUTES);
}

function saveCurrentDrafts() {
  if (state.mode === "memory" || state.mode === "drill") return;
  if (state.mode === "wfd") {
    saveCurrentWfdDraft();
    return;
  }
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
  return String(value || "").match(/[A-Za-z0-9']+|\s+|[^\sA-Za-z0-9']/g) || [];
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
    if (isWhitespaceToken(token.value)) return renderWhitespaceDiffToken(token, type);
    const className = token.status === "same"
      ? "diff-token"
      : `diff-token ${type === "actual" ? "extra" : "missing"}`;
    return `${prefix}<mark class="${className}">${escapeHtml(token.value)}</mark>`;
  }).join("");
}

function renderWhitespaceDiffToken(token, type) {
  if (token.status === "same") return escapeHtml(token.value);
  const count = token.value.length;
  const className = `diff-token whitespace ${type === "actual" ? "extra" : "missing"}`;
  return `<mark class="${className}" title="${type === "actual" ? "多余空格" : "缺少空格"}">空格×${count}</mark>`;
}

function shouldSeparate(previous, current) {
  if (isWhitespaceToken(previous) || isWhitespaceToken(current)) return false;
  return isWordToken(previous) && isWordToken(current);
}

function isWordToken(token) {
  return /^[A-Za-z0-9']+$/.test(token);
}

function isWhitespaceToken(token) {
  return /^\s+$/.test(token);
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

function shuffledArticles(source = articles) {
  return [...source]
    .map((article) => ({ article, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ article }) => article);
}

function compositeScore(passedCount, totalCount = 4) {
  if (!totalCount) return 0;
  const ratio = passedCount / totalCount;
  if (ratio >= 1) return 100;
  if (ratio >= 0.75) return 75;
  if (ratio >= 0.5) return 50;
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

function splitEssayInput(value, expectedCount = 4) {
  const normalized = String(value || "")
    .replace(/\r\n?/g, "\n")
    .trim();
  if (!normalized) return [];

  const candidates = [
    splitAndClean(normalized, /\n\s*\n+/),
    splitAndClean(normalized, /\n+/),
    splitByEssayMarkers(normalized)
  ].filter((items) => items.length);

  const exact = candidates.find((items) => items.length === expectedCount);
  if (exact) return exact;

  return candidates.sort((first, second) => (
    Math.abs(first.length - expectedCount) - Math.abs(second.length - expectedCount) ||
    second.length - first.length
  ))[0];
}

function splitAndClean(value, separator) {
  return value
    .split(separator)
    .map(normalizeForExact)
    .filter(Boolean);
}

function splitByEssayMarkers(value) {
  const markerPattern = /\s+(?=(?:To begin with|In addition|However|To sum up),)/g;
  return splitAndClean(value.replace(markerPattern, "\n"), /\n+/);
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
  const value = String(rawPath || "");
  const suffixStart = value.search(/[?#]/);
  const path = suffixStart < 0 ? value : value.slice(0, suffixStart);
  const suffix = suffixStart < 0 ? "" : value.slice(suffixStart);
  return path.split("/").map((segment) => {
    if (segment === "." || segment === "..") return segment;
    return encodeURIComponent(decodeURIComponent(segment));
  }).join("/") + suffix;
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

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getMonth() + 1}月${date.getDate()}日`;
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
