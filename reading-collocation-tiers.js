(function () {
  "use strict";

  const LABELS = {
    must: "必背",
    useful: "结构扩展",
    reference: "查阅词块",
    all: "全部"
  };

  const HIGH_RISK_EXPLANATION = /(后接|to do|doing|不可数|主谓|倒装|区分|不是|不用|不可省|不能|单数|复数|一致|主动结构|被动|语境决定|多义|取决于)/i;
  const SLOT_FRAME = /(^| )(A|B|sb|sth|someone|something)( |$)/;
  const MANUAL_MUST = new Set([
    "abide by", "account for", "after all", "as a result", "as a result of",
    "as opposed to", "at the expense of", "at the heart of", "at stake",
    "based on", "be at stake", "be to blame", "because of", "belong to",
    "by means of", "comply with", "consist of", "contribute to", "cope with",
    "derive from", "dispose of", "due to", "engage in", "exposed to",
    "focus on", "give rise to", "in accordance with", "in contrast to",
    "in light of", "in response to", "in spite of", "in terms of",
    "insist on", "involved in", "known as", "lead to", "on behalf of",
    "other than", "prone to", "rather than", "refer to", "rely on",
    "responsible for", "result from", "result in", "stem from",
    "subject to", "take into account", "with regard to", "working knowledge of"
  ]);

  function classify(item) {
    const category = item.category || "";
    const phrase = item.phrase || "";
    const meaning = item.meaning || "";
    if (category.includes("惯用语") || category === "短语动词") return "must";
    if (category === "常用词块") return "reference";
    if (HIGH_RISK_EXPLANATION.test(meaning) || SLOT_FRAME.test(phrase) || MANUAL_MUST.has(phrase.toLowerCase())) {
      return "must";
    }
    return "useful";
  }

  function summarize(items) {
    return items.reduce((counts, item) => {
      counts[classify(item)] += 1;
      counts.all += 1;
      return counts;
    }, { must: 0, useful: 0, reference: 0, all: 0 });
  }

  window.READING_COLLOCATION_TIERS = { LABELS, classify, summarize };
})();
