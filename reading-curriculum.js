(function () {
  "use strict";

  const chapters = [
    {
      id: "L01", stage: "形", name: "句子骨架与槽位",
      goal: "先看空格在句子里缺什么，不急着翻译选项。",
      trigger: "主语、谓语、and/or、插入语、倒装或空格词性不清。",
      action: "划分分句，找到主语和有限谓语，再确定空格允许的词性或结构。",
      pointIds: ["F01", "G01", "G03", "G10", "G12"]
    },
    {
      id: "L02", stage: "形", name: "名词、数量与比较",
      goal: "解决可数性、单复数、限定词、数量和比较框架。",
      trigger: "冠词、数量词、百分比、more/less、as...as、单位或范围。",
      action: "先定名词可数性和数量，再检查限定词、单复数及比较两端。",
      pointIds: ["F03", "F04", "P03", "Q01", "Q02", "Q03"]
    },
    {
      id: "L03", stage: "形", name: "时态、语态与动词链",
      goal: "把时间、主谓一致和主动被动一次判断完整。",
      trigger: "明确时间词、助动词、过去分词、主语与谓语距离较远。",
      action: "找时间参照和真正主语，再判断施事/受事，拼出完整动词链。",
      pointIds: ["G02", "G04"]
    },
    {
      id: "L04", stage: "形", name: "to do、doing与done",
      goal: "快速判断不定式、动名词和分词，不靠词尾猜。",
      trigger: "介词后、控制动词后，或名词旁出现非谓语候选。",
      action: "先判断空格作补语还是修饰语，再检查介词、动词配价和逻辑主语。",
      pointIds: ["G05", "G06", "G07"]
    },
    {
      id: "L05", stage: "形", name: "从句与补语",
      goal: "识别关系从句、内容从句和宾语补语的结构缺口。",
      trigger: "that/which/what/whether、先行词，或make/keep/find等结构。",
      action: "判断从句缺什么成分，或宾语后需要什么补语形式。",
      pointIds: ["G08", "G09", "G11"]
    },
    {
      id: "L06", stage: "形", name: "词形与修饰关系",
      goal: "利用词族和副词位置先砍掉形式错误选项。",
      trigger: "选项同词根，或全部是形容词/副词等相近词形。",
      action: "确定修饰对象和所需词性，再核对派生词的具体含义。",
      pointIds: ["F02", "F05"]
    },
    {
      id: "L07", stage: "搭", name: "基础学术搭配",
      goal: "把动词、形容词和名词连成英语真实常用组合。",
      trigger: "空格紧邻核心名词或动词，选项词性相同但组合自然度不同。",
      action: "连读空格两侧2—4个词，优先验证动词＋名词、形容词＋名词和复合术语。",
      pointIds: ["C01", "C02", "C03"]
    },
    {
      id: "L08", stage: "搭", name: "介词配价与固定词块",
      goal: "掌握不可随意替换的介词、小品词和完整表达。",
      trigger: "空格是介词/小词，或前后出现固定框架和可替换槽位。",
      action: "保留两端对象整体读取；搭配仍不能排除时，再进入上下文词义。",
      pointIds: ["C04", "C05", "C06", "C07", "C08", "P01"]
    },
    {
      id: "L09", stage: "逻", name: "指代、复现与定义",
      goal: "利用前后重复信息定位同一对象、类别和例项。",
      trigger: "代词、同义替换、同位语、冒号、定义句或列举。",
      action: "追踪对象词链，找上位类别和回指对象，用前文已知信息锁定答案。",
      pointIds: ["D01", "D02", "S04"]
    },
    {
      id: "L10", stage: "逻", name: "篇章关系与连接",
      goal: "看清因果、转折、递进、条件和举例，不凭褒贬猜。",
      trigger: "连接词、逻辑副词，或前后命题方向发生变化。",
      action: "分别概括前后命题，再判断二者关系及连接词后接结构。",
      pointIds: ["D03", "D04", "D05", "D06", "P02"]
    },
    {
      id: "L11", stage: "义", name: "角色、方向与事件阶段",
      goal: "确认谁对什么做什么，以及答案处在原因、过程还是结果。",
      trigger: "选项主题相近，但动作对象、变化方向或事件阶段不同。",
      action: "写出谁—做什么—对什么，并给变化画箭头、给事件标阶段。",
      pointIds: ["S01", "S03", "S05"]
    },
    {
      id: "L12", stage: "义", name: "近义词精确选择",
      goal: "在语法和搭配都成立后，比较范围、强度、语域和专业义。",
      trigger: "选项词性相同、都能搭配，中文意思也接近。",
      action: "依次比较对象、范围、方向、强度、语域和全文事实；证据不足不编规则。",
      pointIds: ["S02", "S06", "S07"]
    }
  ];

  const pointToChapter = {};
  chapters.forEach((chapter) => chapter.pointIds.forEach((pointId) => {
    pointToChapter[pointId] = chapter.id;
  }));

  const routes = {
    form: { id: "form", label: "形", title: "先查形式", description: "词性、句子骨架、动词形式、名词系统、比较数量。" },
    collocation: { id: "collocation", label: "搭", title: "先查搭配", description: "固定组合、介词配价、短语动词和学术词块。" },
    logic: { id: "logic", label: "逻", title: "先查逻辑", description: "指代、复现、定义、因果、转折、条件和篇章关系。" },
    meaning: { id: "meaning", label: "义", title: "最后辨义", description: "角色、方向、范围、强度、语域和专业义。" }
  };

  const routeByChapter = {
    L01: "form", L02: "form", L03: "form", L04: "form", L05: "form", L06: "form",
    L07: "collocation", L08: "collocation",
    L09: "logic", L10: "logic",
    L11: "meaning", L12: "meaning"
  };

  window.READING_CURRICULUM = { chapters, pointToChapter, routes, routeByChapter };
})();
