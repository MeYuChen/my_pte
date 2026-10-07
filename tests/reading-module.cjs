const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const core = require(path.join(root, "reading-core.js"));
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "reading-data.js"), "utf8"), context);
vm.runInNewContext(fs.readFileSync(path.join(root, "reading-method-guides.js"), "utf8"), context);
vm.runInNewContext(fs.readFileSync(path.join(root, "reading-explanations.js"), "utf8"), context);
const data = context.window.READING_DATA;
const guides = context.window.READING_METHOD_GUIDES;
const explanations = context.window.READING_EXPLANATIONS;

assert.equal(data.methods.length, 44, "should include all audited knowledge points");
assert.equal(Object.keys(guides).length, 42, "all non-curated points should have learner guides");
assert.equal(Object.keys(explanations).length, 130, "twenty-one full questions should have reviewed answer reasons");
["RW539", "RW160", "RW600", "RW49", "RW423", "RW418", "RW289", "RW512", "RW148", "RW461", "RW97", "RW449", "RW91", "RW495", "RW90", "RW99", "RW127", "RW396", "RW602", "RW251", "RW535"].forEach((source) => {
  const question = data.questions.find((item) => item.source === source);
  question.answers.forEach((_, index) => {
    assert.ok(explanations[`${source}:${index + 1}`]?.reason, `${source}:${index + 1} should have a reviewed answer reason`);
  });
});
assert.equal(explanations["RW539:2"].primary_point, "D04", "contrast, not tense alone, decides RW539:2 polarity");
assert.equal(explanations["RW539:6"].primary_point, "S01", "semantic role decides RW539:6");
assert.equal(explanations["RW539:7"].primary_point, "S03", "negative direction decides RW539:7");
const methodIds = new Set(data.methods.map((method) => method.id));
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

const caseInsensitive = core.gradeQuestion({ answers: ["Has Been"], blank_map: [{}] }, ["  has   been  "]);
assert.equal(caseInsensitive.correct, 1, "grading should ignore case and repeated whitespace");
assert.equal(core.formatDuration(65), "01:05");
assert.ok(core.questionMatchesPoint(sample, sample.blank_map[0].primary_point));

const html = fs.readFileSync(path.join(root, "reading.html"), "utf8");
assert.match(html, /data-tab="point">考点/);
assert.match(html, /data-tab="method">解法/);
assert.match(html, /data-tab="tips">技巧/);
assert.match(html, /data-tab="practice">练习/);
assert.match(html, /id="questionTimer"/);
assert.match(html, /id="resultDialog"/);

console.log("Reading module tests passed");
