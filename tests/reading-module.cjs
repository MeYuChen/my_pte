const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const core = require(path.join(root, "reading-core.js"));
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "reading-data.js"), "utf8"), context);
vm.runInNewContext(fs.readFileSync(path.join(root, "reading-variants.js"), "utf8"), context);
vm.runInNewContext(fs.readFileSync(path.join(root, "reading-method-guides.js"), "utf8"), context);
vm.runInNewContext(fs.readFileSync(path.join(root, "reading-explanations.js"), "utf8"), context);
vm.runInNewContext(fs.readFileSync(path.join(root, "reading-curriculum.js"), "utf8"), context);
vm.runInNewContext(fs.readFileSync(path.join(root, "reading-collocations.js"), "utf8"), context);
vm.runInNewContext(fs.readFileSync(path.join(root, "reading-collocation-examples.js"), "utf8"), context);
vm.runInNewContext(fs.readFileSync(path.join(root, "reading-collocation-example-translations.js"), "utf8"), context);
vm.runInNewContext(fs.readFileSync(path.join(root, "reading-collocation-tiers.js"), "utf8"), context);
const data = context.window.READING_DATA;
const variants = context.window.READING_VARIANTS.questions;
const guides = context.window.READING_METHOD_GUIDES;
const explanations = context.window.READING_EXPLANATIONS;
const curriculum = context.window.READING_CURRICULUM;
const collocations = context.window.READING_COLLOCATIONS.items;
const collocationTiers = context.window.READING_COLLOCATION_TIERS;
const collocationExamples = context.window.READING_COLLOCATION_EXAMPLES;
const collocationExampleTranslations = context.window.READING_COLLOCATION_EXAMPLE_TRANSLATIONS;

assert.equal(collocations.length, 683, "collocation IDs should remain stable");
const tierCounts = collocationTiers.summarize(collocations);
assert.deepEqual({ ...tierCounts }, { must: 209, useful: 306, reference: 168, all: 683 }, "collocations should be split into focused learning tiers");
assert.equal(collocationTiers.classify(collocations.find((item) => item.id === "K047")), "must", "slot frames belong in the must-learn deck");
assert.equal(collocationTiers.classify(collocations.find((item) => item.id === "K516")), "reference", "ordinary academic chunks stay out of the default deck");
const mustCollocations = collocations.filter((item) => collocationTiers.classify(item) === "must");
assert.equal(Object.keys(collocationExamples).length, mustCollocations.length, "every must-learn collocation should have one reviewed example");
mustCollocations.forEach((item) => {
  assert.ok(collocationExamples[item.id], `${item.id} should have an example`);
  assert.ok(collocationExamples[item.id].length <= 100, `${item.id} example should stay short`);
  assert.ok(collocationExampleTranslations[item.id], `${item.id} should have a Chinese example translation`);
});

assert.equal(data.methods.length, 44, "should include all audited knowledge points");
assert.equal(Object.keys(guides).length, 42, "all non-curated points should have learner guides");
assert.equal(Object.keys(explanations).length, 295, "every representative blank should have a reviewed answer reason");
data.questions.forEach((question) => {
  question.answers.forEach((_, index) => {
    const key = `${question.source}:${index + 1}`;
    assert.ok(explanations[key]?.reason, `${key} should have a reviewed answer reason`);
    assert.doesNotMatch(explanations[key].reason, /逐项比较|获得有效排他证据|给定词.*语境.*相容|R原材料无干扰词池|原词池缺失/u, `${key} should not expose audit boilerplate`);
  });
});
assert.equal(explanations["RW539:2"].primary_point, "D04", "contrast, not tense alone, decides RW539:2 polarity");
assert.equal(explanations["RW539:6"].primary_point, "S01", "semantic role decides RW539:6");
assert.equal(explanations["RW539:7"].primary_point, "S03", "negative direction decides RW539:7");
assert.match(explanations["RW160:1"].reason, /四个候选.*形式不能区分/, "RW160:1 should record the form scan before the decisive collocation");
assert.doesNotMatch(explanations["RW160:1"].reason, /appears to.*动词原形/, "RW160:1 should not invent an absolute appears-to rule");
assert.ok(explanations["RW160:1"].secondary_points.includes("G03"), "RW160:1 should link the singular subject scan");
const methodIds = new Set(data.methods.map((method) => method.id));
assert.equal(curriculum.chapters.length, 12, "learner view should merge the catalogue into twelve courses");
const curriculumPointIds = curriculum.chapters.flatMap((chapter) => chapter.pointIds);
assert.equal(curriculumPointIds.length, 44, "every fine-grained point should appear in the curriculum");
assert.equal(new Set(curriculumPointIds).size, 44, "a point should not be duplicated across courses");
methodIds.forEach((id) => assert.ok(curriculum.pointToChapter[id], `${id} should map to a learner course`));
curriculum.chapters.forEach((chapter) => {
  assert.ok(["形", "搭", "逻", "义"].includes(chapter.stage), `${chapter.id} should use one live route`);
  assert.ok(chapter.trigger && chapter.action, `${chapter.id} should teach signal and action`);
});
Object.entries(explanations).forEach(([key, explanation]) => {
  assert.ok(methodIds.has(explanation.primary_point), `${key} should use a known decisive point`);
  explanation.secondary_points.forEach((point) => assert.ok(methodIds.has(point), `${key} should use known secondary points`));
});
data.methods.filter((method) => !["S02", "C08"].includes(method.id)).forEach((method) => {
  assert.ok(guides[method.id]?.memory_rule, `${method.id} should have a memorable learner rule`);
  assert.ok(guides[method.id]?.quick_checks?.length >= 2, `${method.id} should have quick recognition checks`);
});
assert.equal(data.questions.length, 54, "should include all representative questions");
assert.equal(data.questions.reduce((sum, question) => sum + question.answers.length, 0), 295, "blank total should match audit");
assert.equal(variants.length, 22, "low-frequency points should have 22 transfer variants");
assert.ok(variants.every((question) => question.source.startsWith("V-")), "variants should be visibly labeled");
assert.equal(new Set(variants.flatMap((question) => question.blank_map.map((blank) => blank.primary_point))).size, 11, "variants should cover the low-frequency point set");
variants.forEach((question) => {
  assert.equal(question.answers.length, question.blank_map.length, `${question.source} map should cover every variant blank`);
  question.answers.forEach((answer, index) => assert.equal(question.blank_map[index].answer, answer, `${question.source}:${index + 1} answer/map`));
});
assert.ok(data.questions.some((question) => question.type === "RW"), "should contain RW option questions");
assert.ok(data.questions.some((question) => question.type === "R"), "should contain R recall questions");

const linkedPoints = new Set();
data.questions.forEach((question) => {
  const passageBlankCount = (question.passage.match(/【[^】]*】/g) || []).length;
  assert.equal(passageBlankCount, question.answers.length, `${question.source} passage must render every answer blank`);
  assert.equal(question.answers.length, question.blank_map.length, `${question.source} map must cover every blank`);
  if (question.type === "RW") {
    question.answers.forEach((answer, index) => {
      const options = question.options[index].split(",").map((item) => item.trim());
      assert.ok(options.includes(answer), `${question.source}:${index + 1} answer must exist in its option list`);
    });
  }
  question.blank_map.forEach((blank) => {
    linkedPoints.add(blank.primary_point);
    blank.secondary_points.forEach((point) => linkedPoints.add(point));
  });
});
data.methods.forEach((method) => assert.ok(linkedPoints.has(method.id), `${method.id} should be linked to training`));

const sample = data.questions[0];
const perfect = core.gradeQuestion(sample, [...sample.answers]);
assert.deepEqual({ correct: perfect.correct, wrong: perfect.wrong }, { correct: sample.answers.length, wrong: 0 });
const scoped = core.gradeQuestion(sample, [...sample.answers], [0]);
assert.equal(scoped.targetTotal, 1, "scoped grading should isolate the target blank");
assert.equal(scoped.targetCorrect, 1, "scoped grading should score the target blank");
assert.equal(scoped.total, sample.answers.length, "scoped grading should retain whole-question diagnostics");
assert.deepEqual(core.pointBlankIndices(sample, sample.blank_map[0].primary_point), [0]);

const caseInsensitive = core.gradeQuestion({ answers: ["Has Been"], blank_map: [{}] }, ["  has   been  "]);
assert.equal(caseInsensitive.correct, 1, "grading should ignore case and repeated whitespace");
assert.equal(core.formatDuration(65), "01:05");
assert.ok(core.questionMatchesPoint(sample, sample.blank_map[0].primary_point));

const html = fs.readFileSync(path.join(root, "reading.html"), "utf8");
const recognitionJs = fs.readFileSync(path.join(root, "reading-recognition.js"), "utf8");
assert.match(html, /data-tab="point">识别/);
assert.match(html, /data-tab="method">解法/);
assert.match(html, /data-tab="tips">避坑/);
assert.match(html, /data-tab="practice">练习/);
assert.match(html, /data-reading-mode="recognition">识别训练/);
assert.match(html, /data-collocation-tier="must"/);
assert.match(html, /reading-collocation-examples\.js/);
assert.match(html, /reading-collocation-example-translations\.js/);
assert.match(html, /reading-collocation-tiers\.js/);
assert.match(html, /id="recognitionRoutes"/);
assert.match(html, /id="questionTimer"/);
assert.match(html, /id="resultPanel"/);
assert.match(html, /id="returnToReview"/);
assert.match(html, /data-point-filter="weak"/);
assert.match(html, /reading-variants\.js/);
assert.doesNotMatch(html, /<dialog/);
assert.doesNotMatch(recognitionJs, /先走“/, "recognition feedback should distinguish scan order from decisive evidence");
assert.match(recognitionJs, /决定证据在/, "recognition feedback should name the decisive evidence layer");

console.log("Reading module tests passed");
