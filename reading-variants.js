window.READING_VARIANTS = {
  version: "2026-10-08-low-frequency-variants",
  description: "为低频细分考点补充的短变式题；用于迁移训练，不计入54道代表题统计。",
  questions: [
    {
      source: "V-D06-01", type: "RW", title: "变式·条件与例外",
      passage: "Plants cannot survive 【 unless, because, such as, despite 】 they receive enough water.",
      answers: ["unless"], options: ["unless, because, such as, despite"],
      blank_map: [{ bid: "V-D06-01:1", answer: "unless", primary_point: "D06", primary_name: "条件、例外与举例", secondary_points: ["P02"], reviewed_explanation: true, explanation: "unless 接完整分句，表示“除非有水，否则无法生存”。because 表原因，such as 后接例项，despite 后接名词或 doing。" }]
    },
    {
      source: "V-D06-02", type: "RW", title: "变式·举例结构",
      passage: "Several renewable sources, 【 such as, unless, whereas, despite 】 wind and solar power, can reduce emissions.",
      answers: ["such as"], options: ["such as, unless, whereas, despite"],
      blank_map: [{ bid: "V-D06-02:1", answer: "such as", primary_point: "D06", primary_name: "条件、例外与举例", secondary_points: ["C08"], reviewed_explanation: true, explanation: "wind and solar power 是 renewable sources 的具体例项，such as 引出名词性例子；其余选项不能放在名词与例项之间。" }]
    },
    {
      source: "V-S06-01", type: "RW", title: "变式·专业义与比喻义",
      passage: "The new program aims to 【 bridge, close, fill, cover 】 the gap between school and work.",
      answers: ["bridge"], options: ["bridge, close, fill, cover"],
      blank_map: [{ bid: "V-S06-01:1", answer: "bridge", primary_point: "S06", primary_name: "一词多义、比喻与专业义", secondary_points: ["C01"], reviewed_explanation: true, explanation: "bridge the gap 是“弥合差距”的固定比喻表达；四个词都可能与 gap 相关，但此处的教育语境强调连接两个阶段。" }]
    },
    {
      source: "V-S06-02", type: "RW", title: "变式·场景词义",
      passage: "In biology, a cell is the basic 【 unit, room, office, chamber 】 of a living organism.",
      answers: ["unit"], options: ["unit, room, office, chamber"],
      blank_map: [{ bid: "V-S06-02:1", answer: "unit", primary_point: "S06", primary_name: "一词多义、比喻与专业义", secondary_points: ["S04"], reviewed_explanation: true, explanation: "biology 语境把 cell 定义为生物体的基本单位，unit 是该学科义；room、office、chamber 是空间或房间义。" }]
    },
    {
      source: "V-G12-01", type: "RW", title: "变式·倒装",
      passage: "Only after the data were reviewed 【 did, had, was, has 】 the committee change its policy.",
      answers: ["did"], options: ["did, had, was, has"],
      blank_map: [{ bid: "V-G12-01:1", answer: "did", primary_point: "G12", primary_name: "倒装、省略与特殊句式", secondary_points: ["G01"], reviewed_explanation: true, explanation: "Only after 放在句首强调时间条件，主句发生部分倒装：did + 主语 + 动词原形。change 已是原形，不能再用 had/was/has。" }]
    },
    {
      source: "V-G12-02", type: "RW", title: "变式·动词省略",
      passage: "The first team accepted the proposal, and the second team 【 did, was, had, has 】 too.",
      answers: ["did"], options: ["did, was, had, has"],
      blank_map: [{ bid: "V-G12-02:1", answer: "did", primary_point: "G12", primary_name: "倒装、省略与特殊句式", secondary_points: ["G10"], reviewed_explanation: true, explanation: "did too 省略前面已经出现的 accepted the proposal，did 代替整个动作；was/had/has 不能承接这个一般过去时动作。" }]
    },
    {
      source: "V-S07-01", type: "RW", title: "变式·范围",
      passage: "The policy affects 【 all, every, each, entire 】 residents in the city.",
      answers: ["all"], options: ["all, every, each, entire"],
      blank_map: [{ bid: "V-S07-01:1", answer: "all", primary_point: "S07", primary_name: "范围、侧重点与语域", secondary_points: ["F03"], reviewed_explanation: true, explanation: "residents 是复数，all residents 表示覆盖全体；every/each 需要单数名词，entire 通常不能直接这样修饰复数。" }]
    },
    {
      source: "V-S07-02", type: "RW", title: "变式·语域",
      passage: "The research report uses a 【 formal, casual, slang, chatty 】 tone throughout.",
      answers: ["formal"], options: ["formal, casual, slang, chatty"],
      blank_map: [{ bid: "V-S07-02:1", answer: "formal", primary_point: "S07", primary_name: "范围、侧重点与语域", secondary_points: ["C02"], reviewed_explanation: true, explanation: "research report 指向正式学术语域，formal 与 report 的文体相配；casual、slang、chatty 都是非正式表达。" }]
    },
    {
      source: "V-F01-01", type: "RW", title: "变式·句法槽位",
      passage: "The committee reached a 【 decision, decide, decisive, deciding 】 after two hours of discussion.",
      answers: ["decision"], options: ["decision, decide, decisive, deciding"],
      blank_map: [{ bid: "V-F01-01:1", answer: "decision", primary_point: "F01", primary_name: "句法槽位与词性", secondary_points: ["C01"], reviewed_explanation: true, explanation: "reached a 后需要名词作宾语，decision 与 reach 构成常见搭配；decide 是动词，decisive 是形容词，deciding 是分词。" }]
    },
    {
      source: "V-F01-02", type: "RW", title: "变式·不定式槽位",
      passage: "The device was designed to 【 reduce, reduction, reducing, reduced 】 energy use.",
      answers: ["reduce"], options: ["reduce, reduction, reducing, reduced"],
      blank_map: [{ bid: "V-F01-02:1", answer: "reduce", primary_point: "F01", primary_name: "句法槽位与词性", secondary_points: ["G05"], reviewed_explanation: true, explanation: "to 后接动词原形，to reduce energy use 表示设计目的；其余选项不是不定式所需的原形。" }]
    },
    {
      source: "V-P03-01", type: "RW", title: "变式·限定词与可数性",
      passage: "There was not 【 much, many, several, a few 】 evidence to support the claim.",
      answers: ["much"], options: ["much, many, several, a few"],
      blank_map: [{ bid: "V-P03-01:1", answer: "much", primary_point: "P03", primary_name: "限定词、代词与功能词选择", secondary_points: ["F03"], reviewed_explanation: true, explanation: "evidence 通常作不可数名词，否定句中用 much evidence；many/several/a few 修饰可数复数。" }]
    },
    {
      source: "V-P03-02", type: "RW", title: "变式·限定词与单数",
      passage: "【 Each, Every, All, Both 】 study used a different method.",
      answers: ["Each"], options: ["Each, Every, All, Both"],
      blank_map: [{ bid: "V-P03-02:1", answer: "Each", primary_point: "P03", primary_name: "限定词、代词与功能词选择", secondary_points: ["F04"], reviewed_explanation: true, explanation: "study 是单数可数名词，Each study 表示逐个研究；Every 也能修饰单数，但这里强调两项研究分别采用不同方法，Each 更准确。" }]
    },
    {
      source: "V-F04-01", type: "RW", title: "变式·复数中心词",
      passage: "The research 【 finding, findings, finding's, findings' 】 were published in a journal.",
      answers: ["findings"], options: ["finding, findings, finding's, findings'"],
      blank_map: [{ bid: "V-F04-01:1", answer: "findings", primary_point: "F04", primary_name: "单复数与所有格", secondary_points: ["G03"], reviewed_explanation: true, explanation: "were 要求复数主语，research findings 表示研究结果；finding's/findings' 是所有格形式，不能作这里的主语。" }]
    },
    {
      source: "V-F04-02", type: "RW", title: "变式·所有格",
      passage: "The 【 scientist's, scientists, scientists', scientist 】 decision surprised the team.",
      answers: ["scientist's"], options: ["scientist's, scientists, scientists', scientist"],
      blank_map: [{ bid: "V-F04-02:1", answer: "scientist's", primary_point: "F04", primary_name: "单复数与所有格", secondary_points: ["P03"], reviewed_explanation: true, explanation: "一个科学家的决定需要单数所有格 scientist's；scientists 是复数，scientists' 表示多个科学家的所有格。" }]
    },
    {
      source: "V-S03-01", type: "RW", title: "变式·变化方向",
      passage: "The number of errors 【 declined, expanded, strengthened, accumulated 】 sharply after training.",
      answers: ["declined"], options: ["declined, expanded, strengthened, accumulated"],
      blank_map: [{ bid: "V-S03-01:1", answer: "declined", primary_point: "S03", primary_name: "变化方向与程度", secondary_points: ["G02"], reviewed_explanation: true, explanation: "培训后错误数量下降，declined 表示减少；expanded/strengthened/accumulated 都不是数量向下变化。" }]
    },
    {
      source: "V-S03-02", type: "RW", title: "变式·变化程度",
      passage: "The reform had only a 【 modest, enormous, permanent, total 】 effect on employment.",
      answers: ["modest"], options: ["modest, enormous, permanent, total"],
      blank_map: [{ bid: "V-S03-02:1", answer: "modest", primary_point: "S03", primary_name: "变化方向与程度", secondary_points: ["S07"], reviewed_explanation: true, explanation: "only 限定影响幅度，modest 表示有限或不大的影响；enormous 与 only 冲突，permanent 说持续时间，total 说完整程度。" }]
    },
    {
      source: "V-Q03-01", type: "RW", title: "变式·单位与范围",
      passage: "The survey found that between 20 【 and, to, from, by 】 30 percent of residents supported the plan.",
      answers: ["and"], options: ["and, to, from, by"],
      blank_map: [{ bid: "V-Q03-01:1", answer: "and", primary_point: "Q03", primary_name: "单位、尺度与范围", secondary_points: ["Q02"], reviewed_explanation: true, explanation: "between 20 and 30 是成对范围结构，两个端点由 and 连接；to/from/by 不能完成 between 的固定框架。" }]
    },
    {
      source: "V-Q03-02", type: "RW", title: "变式·端点介词",
      passage: "The temperature rose from 5 degrees 【 to, at, by, during 】 12 degrees overnight.",
      answers: ["to"], options: ["to, at, by, during"],
      blank_map: [{ bid: "V-Q03-02:1", answer: "to", primary_point: "Q03", primary_name: "单位、尺度与范围", secondary_points: ["P01"], reviewed_explanation: true, explanation: "from 5 to 12 标出变化的起点和终点；at 表位置，by 表变化幅度，during 表时间段。" }]
    },
    {
      source: "V-G01-01", type: "RW", title: "变式·有限谓语",
      passage: "The results 【 show, shows, showing, shown 】 that the treatment is effective.",
      answers: ["show"], options: ["show, shows, showing, shown"],
      blank_map: [{ bid: "V-G01-01:1", answer: "show", primary_point: "G01", primary_name: "句子边界与有限谓语", secondary_points: ["G03"], reviewed_explanation: true, explanation: "The results 是复数主语，需要一个一般现在时有限谓语 show；shows 数不合，showing/shown 不能独立作主句谓语。" }]
    },
    {
      source: "V-G01-02", type: "RW", title: "变式·从句谓语",
      passage: "Although the sample was small, it 【 remained, remaining, remain, has remained 】 useful for the pilot study.",
      answers: ["remained"], options: ["remained, remaining, remain, has remained"],
      blank_map: [{ bid: "V-G01-02:1", answer: "remained", primary_point: "G01", primary_name: "句子边界与有限谓语", secondary_points: ["G02"], reviewed_explanation: true, explanation: "Although 从句使用过去时，主句也叙述同一过去研究阶段，it remained 是完整有限谓语；remaining 不能独立承担谓语功能。" }]
    },
    {
      source: "V-S05-01", type: "RW", title: "变式·事件结果",
      passage: "The new policy led to a 【 reduction, reduce, reducing, reduced 】 in emissions.",
      answers: ["reduction"], options: ["reduction, reduce, reducing, reduced"],
      blank_map: [{ bid: "V-S05-01:1", answer: "reduction", primary_point: "S05", primary_name: "过程阶段与结果", secondary_points: ["F01"], reviewed_explanation: true, explanation: "lead to 后面接名词性结果，a reduction in emissions 表示排放减少；reduce 是动词，reducing/reduced 不符合冠词后的槽位。" }]
    },
    {
      source: "V-S05-02", type: "RW", title: "变式·过程阶段",
      passage: "The researchers collected the data before 【 testing, test, tested, to test 】 the model.",
      answers: ["testing"], options: ["testing, test, tested, to test"],
      blank_map: [{ bid: "V-S05-02:1", answer: "testing", primary_point: "S05", primary_name: "过程阶段与结果", secondary_points: ["G06"], reviewed_explanation: true, explanation: "before 在这里是介词，后接动名词 testing；句意先收集数据，再进行模型测试，表达事件先后阶段。" }]
    }
  ]
};
