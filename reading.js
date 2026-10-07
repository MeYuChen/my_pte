(function () {
  "use strict";

  const data = window.READING_DATA;
  const core = window.ReadingCore;
  if (!data || !core) throw new Error("Reading data failed to load");

  const STORAGE_KEY = "pte-reading-progress-v1";
  const methodsById = new Map(data.methods.map((method) => [method.id, method]));
  const state = {
    pointId: resolveInitialPoint(),
    tab: "point",
    pointFilter: "all",
    query: "",
    practiceQuestions: [],
    questionIndex: 0,
    startedAt: null,
    timerHandle: null,
    elapsedSeconds: 0,
    lastResult: null,
    progress: loadProgress()
  };

  const el = {};
  [
    "dataSummary", "pointSearch", "pointList", "pointModule", "pointTitle", "pointFrequency",
    "pointProgress", "contentTabs", "pointPanel", "methodPanel", "tipsPanel", "practicePanel",
    "questionSource", "questionTitle", "questionMeta", "questionTimer", "previousQuestion",
    "nextQuestion", "startQuestion", "submitQuestion", "practiceStatus", "passageCard",
    "resultDialog", "resultTitle", "scoreStrip", "wrongPoints", "closeResult",
    "reviewFirstWrong", "continuePractice"
  ].forEach((id) => { el[id] = document.getElementById(id); });

  init();

  function init() {
    el.dataSummary.textContent = `${data.stats.pointCount} 个考点 · ${data.stats.questionCount} 题 · ${data.stats.blankCount} 空`;
    bindEvents();
    selectPoint(state.pointId, false);
  }

  function bindEvents() {
    el.pointSearch.addEventListener("input", () => {
      state.query = el.pointSearch.value.trim().toLowerCase();
      renderPointList();
    });
    document.querySelectorAll("[data-point-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        state.pointFilter = button.dataset.pointFilter;
        document.querySelectorAll("[data-point-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
        renderPointList();
      });
    });
    el.contentTabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-tab]");
      if (button) setTab(button.dataset.tab);
    });
    el.previousQuestion.addEventListener("click", () => moveQuestion(-1));
    el.nextQuestion.addEventListener("click", () => moveQuestion(1));
    el.startQuestion.addEventListener("click", startQuestion);
    el.submitQuestion.addEventListener("click", submitQuestion);
    el.closeResult.addEventListener("click", closeResult);
    el.continuePractice.addEventListener("click", () => { closeResult(); moveQuestion(1); startQuestion(); });
    el.reviewFirstWrong.addEventListener("click", reviewFirstWrong);
    el.resultDialog.addEventListener("click", (event) => {
      if (event.target === el.resultDialog) closeResult();
    });
    window.addEventListener("hashchange", () => {
      const pointId = location.hash.replace(/^#/, "");
      if (methodsById.has(pointId) && pointId !== state.pointId) selectPoint(pointId, false);
    });
  }

  function resolveInitialPoint() {
    const fromHash = location.hash.replace(/^#/, "");
    return methodsById.has(fromHash) ? fromHash : data.methods[0].id;
  }

  function selectPoint(pointId, updateHash = true) {
    if (!methodsById.has(pointId)) return;
    stopTimer();
    state.pointId = pointId;
    state.practiceQuestions = data.questions.filter((question) => core.questionMatchesPoint(question, pointId));
    state.questionIndex = 0;
    state.lastResult = null;
    if (updateHash || location.hash.replace(/^#/, "") !== pointId) {
      history.replaceState(null, "", `#${pointId}`);
    }
    renderPointList();
    renderPointContent();
    renderQuestion();
  }

  function visibleMethods() {
    return data.methods.filter((method) => {
      const matchesQuery = !state.query || `${method.id} ${method.name} ${method.module}`.toLowerCase().includes(state.query);
      const matchesFilter = state.pointFilter === "all"
        || (state.pointFilter === "high" && method.primary_count >= 100)
        || (state.pointFilter === "weak" && method.teacher_coverage !== "完整讲解");
      return matchesQuery && matchesFilter;
    });
  }

  function renderPointList() {
    el.pointList.replaceChildren(...visibleMethods().map((method) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `point-item${method.id === state.pointId ? " is-active" : ""}`;
      button.innerHTML = `<span class="point-id">${escapeHtml(method.id)}</span><span class="point-name">${escapeHtml(method.name)}</span><span class="point-count">${method.primary_count}</span>`;
      button.addEventListener("click", () => selectPoint(method.id));
      return button;
    }));
  }

  function renderPointContent() {
    const method = methodsById.get(state.pointId);
    const progress = state.progress.points[state.pointId] || { attempts: 0, correct: 0, total: 0 };
    const accuracy = progress.total ? `${Math.round(progress.correct / progress.total * 100)}% 正确` : "尚未练习";
    el.pointModule.textContent = `${method.id} · ${method.module}`;
    el.pointTitle.textContent = method.name;
    el.pointFrequency.textContent = `主考点 ${method.primary_count} 次 · 关联 ${method.all_link_count} 次`;
    el.pointProgress.textContent = progress.attempts ? `${progress.attempts} 次练习 · ${accuracy}` : accuracy;
    el.pointPanel.innerHTML = `
      <div class="lead-card">
        <p class="eyebrow">这个考点解决什么</p>
        <h3>${escapeHtml(method.name)}</h3>
        <p>${escapeHtml(method.core_method)}</p>
      </div>
      <div class="info-grid">
        <div class="info-box"><span>题库主考频次</span><strong>${method.primary_count} 空</strong></div>
        <div class="info-box"><span>含关联考点</span><strong>${method.all_link_count} 空</strong></div>
        <div class="info-box"><span>现有讲解覆盖</span><strong>${escapeHtml(method.teacher_coverage)}</strong></div>
      </div>`;
    el.methodPanel.innerHTML = `
      <h3 class="section-heading">固定解题顺序</h3>
      <ol class="step-list">${method.decision_steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>`;
    el.tipsPanel.innerHTML = `
      <div class="tip-grid">
        <section class="tip-card"><h4>易错提醒</h4><ul>${method.traps.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}</ul></section>
        <section class="tip-card"><h4>讲解补充</h4><p>${escapeHtml(method.teacher_gap || "该考点已有完整讲解。")}</p></section>
        <section class="tip-card"><h4>正常例题</h4><div class="example-list">${renderExamples(method.normal_examples)}</div></section>
        <section class="tip-card"><h4>边界 / 近义对比例</h4><div class="example-list">${renderExamples(method.contrast_examples)}</div></section>
      </div>`;
  }

  function renderExamples(examples) {
    if (!examples || !examples.length) return "<p>暂无代表例。</p>";
    return examples.map((item) => `<div class="example"><strong>${escapeHtml(item.bid)} · ${escapeHtml(item.answer)}</strong><br>${escapeHtml(item.evidence)}</div>`).join("");
  }

  function setTab(tab) {
    state.tab = tab;
    document.querySelectorAll("[data-tab]").forEach((button) => button.classList.toggle("is-active", button.dataset.tab === tab));
    document.querySelectorAll("[data-panel]").forEach((panel) => { panel.hidden = panel.dataset.panel !== tab; });
  }

  function currentQuestion() { return state.practiceQuestions[state.questionIndex] || null; }

  function renderQuestion() {
    stopTimer();
    state.elapsedSeconds = 0;
    el.questionTimer.textContent = "00:00";
    el.submitQuestion.disabled = true;
    el.startQuestion.disabled = !currentQuestion();
    el.startQuestion.textContent = "开始本题";
    el.practiceStatus.className = "practice-status";
    const question = currentQuestion();
    if (!question) {
      el.questionSource.textContent = "暂无专项题";
      el.questionTitle.textContent = "当前考点暂未选入代表训练集";
      el.questionMeta.textContent = "仍可学习考点、解法和技巧。";
      el.passageCard.textContent = "此处会在后续全题库训练扩展中继续补题。";
      return;
    }
    el.questionSource.textContent = `${question.type} · ${question.source}`;
    el.questionTitle.textContent = question.title || question.source;
    el.questionMeta.textContent = `专项第 ${state.questionIndex + 1} / ${state.practiceQuestions.length} 题 · ${question.answers.length} 空 · ${question.mode}`;
    el.practiceStatus.textContent = "点击“开始本题”后开始计时；提交即停止计时并判分。";
    renderPassage(question, true);
  }

  function renderPassage(question, locked) {
    const parts = question.passage.split(/【([^】]*)】/g);
    const fragment = document.createDocumentFragment();
    let blankIndex = 0;
    parts.forEach((part, index) => {
      if (index % 2 === 0) {
        fragment.append(document.createTextNode(part));
        return;
      }
      const wrapper = document.createElement("span");
      wrapper.className = "blank-field";
      wrapper.dataset.blankIndex = String(blankIndex);
      if (question.type === "RW") {
        const select = document.createElement("select");
        select.disabled = locked;
        select.setAttribute("aria-label", `第 ${blankIndex + 1} 空`);
        select.append(new Option(`第 ${blankIndex + 1} 空`, ""));
        parseOptions(question.options[blankIndex] || part).forEach((option) => select.append(new Option(option, option)));
        wrapper.append(select);
      } else {
        const input = document.createElement("input");
        input.type = "text";
        input.disabled = locked;
        input.autocomplete = "off";
        input.placeholder = `第 ${blankIndex + 1} 空`;
        input.setAttribute("aria-label", `第 ${blankIndex + 1} 空`);
        wrapper.append(input);
      }
      fragment.append(wrapper);
      blankIndex += 1;
    });
    el.passageCard.replaceChildren(fragment);
    el.passageCard.classList.toggle("is-locked", locked);
  }

  function parseOptions(optionText) {
    return String(optionText).split(",").map((item) => item.trim()).filter(Boolean);
  }

  function startQuestion() {
    const question = currentQuestion();
    if (!question) return;
    stopTimer();
    state.elapsedSeconds = 0;
    state.startedAt = Date.now();
    state.lastResult = null;
    renderPassage(question, false);
    el.questionTimer.textContent = "00:00";
    el.submitQuestion.disabled = false;
    el.startQuestion.textContent = "重新开始";
    el.practiceStatus.className = "practice-status is-good";
    el.practiceStatus.textContent = "计时中。完成全部空后提交。";
    state.timerHandle = window.setInterval(updateTimer, 250);
    const firstControl = el.passageCard.querySelector("select, input");
    if (firstControl) firstControl.focus();
  }

  function updateTimer() {
    if (!state.startedAt) return;
    state.elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000);
    el.questionTimer.textContent = core.formatDuration(state.elapsedSeconds);
  }

  function stopTimer() {
    if (state.timerHandle) window.clearInterval(state.timerHandle);
    state.timerHandle = null;
    if (state.startedAt) state.elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000);
    state.startedAt = null;
  }

  function submitQuestion() {
    const question = currentQuestion();
    if (!question || !state.startedAt) return;
    stopTimer();
    const controls = [...el.passageCard.querySelectorAll("select, input")];
    const responses = controls.map((control) => control.value);
    const result = core.gradeQuestion(question, responses);
    result.seconds = state.elapsedSeconds;
    state.lastResult = result;
    controls.forEach((control, index) => {
      control.disabled = true;
      const detail = result.details[index];
      const wrapper = control.closest(".blank-field");
      wrapper.classList.add(detail.correct ? "is-correct" : "is-wrong");
      if (!detail.correct) {
        const note = document.createElement("span");
        note.className = "answer-note";
        note.textContent = `答案：${detail.answer}`;
        wrapper.append(note);
      }
    });
    el.submitQuestion.disabled = true;
    el.practiceStatus.className = `practice-status${result.wrong === 0 ? " is-good" : ""}`;
    el.practiceStatus.textContent = `已提交：答对 ${result.correct}，答错 ${result.wrong}，用时 ${core.formatDuration(result.seconds)}。`;
    recordProgress(result);
    renderPointContent();
    showResult(result);
  }

  function recordProgress(result) {
    const current = state.progress.points[state.pointId] || { attempts: 0, correct: 0, total: 0, seconds: 0 };
    current.attempts += 1;
    current.correct += result.correct;
    current.total += result.total;
    current.seconds += result.seconds;
    state.progress.points[state.pointId] = current;
    state.progress.sessions.push({
      at: new Date().toISOString(), pointId: state.pointId, source: currentQuestion().source,
      correct: result.correct, total: result.total, seconds: result.seconds
    });
    state.progress.sessions = state.progress.sessions.slice(-200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  }

  function showResult(result) {
    el.resultTitle.textContent = result.wrong ? `有 ${result.wrong} 个空需要复盘` : "全部答对";
    el.scoreStrip.innerHTML = [
      [result.total, "总空数"], [result.correct, "答对"], [result.wrong, "答错"], [core.formatDuration(result.seconds), "用时"]
    ].map(([value, label]) => `<div class="score-cell"><strong>${value}</strong><span>${label}</span></div>`).join("");
    const wrong = result.details.filter((detail) => !detail.correct);
    el.reviewFirstWrong.hidden = !wrong.length;
    if (!wrong.length) {
      el.wrongPoints.innerHTML = '<div class="perfect-result">这题没有错误考点，可以直接进入下一题。</div>';
    } else {
      el.wrongPoints.innerHTML = wrong.map((detail) => {
        const knowledge = detail.knowledge || {};
        const secondary = (knowledge.secondary_points || []).map((id) => methodsById.get(id)).filter(Boolean);
        return `<article class="wrong-card" data-point-id="${escapeHtml(knowledge.primary_point || "")}">
          <h4>第 ${detail.index + 1} 空：${escapeHtml(knowledge.primary_point || "未分类")} · ${escapeHtml(knowledge.primary_name || "待复核")}</h4>
          <p>你的答案：<strong>${escapeHtml(detail.response || "（未作答）")}</strong>　正确答案：<strong>${escapeHtml(detail.answer)}</strong></p>
          <p>${escapeHtml(knowledge.evidence || "暂无题内证据说明。")}</p>
          <span class="point-chip">主考点 ${escapeHtml(knowledge.primary_point || "—")}</span>
          ${secondary.map((point) => `<span class="point-chip">关联 ${escapeHtml(point.id)} · ${escapeHtml(point.name)}</span>`).join("")}
        </article>`;
      }).join("");
    }
    if (typeof el.resultDialog.showModal === "function") el.resultDialog.showModal();
    else el.resultDialog.setAttribute("open", "");
  }

  function reviewFirstWrong() {
    const first = state.lastResult && state.lastResult.details.find((detail) => !detail.correct && detail.knowledge);
    if (!first) return;
    closeResult();
    selectPoint(first.knowledge.primary_point);
    setTab("method");
  }

  function closeResult() {
    if (typeof el.resultDialog.close === "function") el.resultDialog.close();
    else el.resultDialog.removeAttribute("open");
  }

  function moveQuestion(delta) {
    if (!state.practiceQuestions.length) return;
    state.questionIndex = (state.questionIndex + delta + state.practiceQuestions.length) % state.practiceQuestions.length;
    renderQuestion();
  }

  function loadProgress() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (parsed && parsed.points && Array.isArray(parsed.sessions)) return parsed;
    } catch (_) { /* Ignore damaged local progress. */ }
    return { points: {}, sessions: [] };
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[character]);
  }
})();
