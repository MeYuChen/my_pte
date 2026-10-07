(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ReadingCore = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function normalizeAnswer(value) {
    return String(value ?? "")
      .normalize("NFKC")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
  }

  function gradeQuestion(question, responses) {
    const answers = question.answers || [];
    const details = answers.map((answer, index) => {
      const response = responses[index] ?? "";
      return {
        index,
        response,
        answer,
        correct: normalizeAnswer(response) === normalizeAnswer(answer),
        knowledge: (question.blank_map || [])[index] || null
      };
    });
    const correct = details.filter((item) => item.correct).length;
    return { total: answers.length, correct, wrong: answers.length - correct, details };
  }

  function formatDuration(totalSeconds) {
    const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const minutes = Math.floor(seconds / 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }

  function questionMatchesPoint(question, pointId) {
    if (!pointId) return true;
    return (question.blank_map || []).some((blank) =>
      blank.primary_point === pointId || (blank.secondary_points || []).includes(pointId)
    );
  }

  return { normalizeAnswer, gradeQuestion, formatDuration, questionMatchesPoint };
});
