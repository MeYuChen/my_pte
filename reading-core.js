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

  function pointBlankIndices(question, pointId, { includeSecondary = true } = {}) {
    if (!pointId) return (question.answers || []).map((_, index) => index);
    return (question.blank_map || []).reduce((indices, blank, index) => {
      const matchesPrimary = blank.primary_point === pointId;
      const matchesSecondary = includeSecondary && (blank.secondary_points || []).includes(pointId);
      if (matchesPrimary || matchesSecondary) indices.push(index);
      return indices;
    }, []);
  }

  function gradeQuestion(question, responses, targetIndices) {
    const answers = question.answers || [];
    const targetSet = new Set(Array.isArray(targetIndices)
      ? targetIndices
      : answers.map((_, index) => index));
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
    const targetDetails = details.filter((item) => targetSet.has(item.index));
    const correct = details.filter((item) => item.correct).length;
    const targetCorrect = targetDetails.filter((item) => item.correct).length;
    return {
      total: answers.length,
      correct,
      wrong: answers.length - correct,
      targetIndices: [...targetSet],
      targetTotal: targetDetails.length,
      targetCorrect,
      targetWrong: targetDetails.length - targetCorrect,
      details
    };
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

  return { normalizeAnswer, gradeQuestion, formatDuration, pointBlankIndices, questionMatchesPoint };
});
