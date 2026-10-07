(function () {
  "use strict";

  const data = window.READING_DATA;
  const core = window.ReadingCore;
  if (!data || !core) throw new Error("Reading data failed to load");

  const STORAGE_KEY = "pte-reading-progress-v1";
  const methodsById = new Map(data.methods.map((method) => [method.id, method]));
  Object.entries(window.READING_METHOD_GUIDES || {}).forEach(([id, guide]) => {
    const method = methodsById.get(id);
    if (method) Object.assign(method, guide);
  });
  applyLearnerFacingMethodFixes();
  applyExplanationOverrides();

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

  function applyLearnerFacingMethodFixes() {
    const fixedChunks = methodsById.get("C08");
    if (fixedChunks) Object.assign(fixedChunks, {
      memory_rule: "先看词性，前后连块；搭配分不出，再看整句义。",
      core_method: "先把空格与前后 2—4 个词连起来读，判断它是否组成固定搭配、短语动词或学术术语；搭配无法排除时，再比较整句意思。",
      decision_steps: [
        "先判断空格需要什么词性，例如名词、动词或介词。",
        "把空格和前后词连读：turn ___、fade ___、self-fulfilling ___，看哪个选项能组成常用完整表达。",
        "如果两个选项都能搭配，就比较它们在整句中的准确含义，不能只凭‘看起来熟悉’作答。"
      ],
      traps: [
        "短语动词换一个小词，意思可能完全不同：turn up 是‘出现’，turn down 是‘拒绝/调低’。",
        "固定术语要选完整名称：self-fulfilling prophecy 是‘自我实现的预言’。",
        "at stake、in danger 等近义表达都可能通顺，此时必须依靠上下文，而不是硬背唯一搭配。"
      ],
      normal_examples: [
        { bid: "RW596:3", answer: "turn up", evidence: "看到 turn ___：此处说稀有鸟类可能‘出现’，锁定 turn up。" },
        { bid: "RW577:4", answer: "fade away", evidence: "看到 fading ___：句意是传统远未‘逐渐消失’，锁定 fade away。" },
        { bid: "RW95:5", answer: "self-fulfilling prophecy", evidence: "看到 self-fulfilling ___：这是完整术语‘自我实现的预言’，直接锁定 prophecy。" }
      ],
      contrast_examples: [
        { bid: "RW534:2", answer: "in some way", evidence: "in some way、in no way、by the way 结构都成立，必须根据整句是‘某种程度’、‘绝不’还是‘顺便说’来选。" },
        { bid: "RW620:8", answer: "at stake", evidence: "at stake 与 in danger 都能表示‘处于危险中’，单靠搭配无法排除，继续查看前后逻辑。" }
      ]
    });

    const synonymChoice = methodsById.get("S02");
    if (synonymChoice) Object.assign(synonymChoice, {
      memory_rule: "先砍词性，再锁搭配，再对句意；两个都能用，就别背假规则。",
      core_method: "近义词不要只比较中文翻译。按“词性 → 搭配 → 精确句意 → 上下文”逐层筛选，哪一层出现排他证据就在哪一层作答。",
      decision_steps: [
        "词性：先看空格位置需要名词、动词、形容词还是副词，形式不对的直接排除。",
        "搭配：查看空格前后的动词、名词或介词，优先选择真实常用的组合。",
        "句意：比较选项的对象、范围、强弱和褒贬，选择最准确描述当前关系的词。",
        "上下文：用前后句的指代、重复词和逻辑方向作最后确认；仍有两个都成立，说明题目缺少唯一证据。"
      ],
      traps: [
        "中文翻译差不多，不代表放进这个句子都一样准确。",
        "先找排他证据，不要凭‘这个词更高级’或‘答案表这样写’硬选。",
        "如果两个词在词性、搭配和句意上都成立，这类题只记语境倾向，不背虚构区别。"
      ],
      normal_examples: [
        { bid: "RW121:4", answer: "personal", evidence: "线索：作者观察的是自己与狗的相处，还承认可能受个人愿望影响。这里强调‘个人亲历’，所以选 personal。" },
        { bid: "RW13:4", answer: "equally", evidence: "先砍词性：applies 需要副词，equality 出局；再看句意：列出的几类儿童都‘同样适用’，所以选 equally。" },
        { bid: "RW395:5", answer: "deterrence", evidence: "线索：restitution and ___ 并列两个惩罚目的。restitution 是补偿，另一个常见目的就是 deterrence（威慑）。" }
      ],
      contrast_examples: [
        { bid: "RW35:1", answer: "technologies", evidence: "前文 modern technology 与后文 brain imaging technologies 形成词汇呼应，因此倾向 technologies；但 methods 也能成立，这不是值得死背的唯一规则。" },
        { bid: "RW619:5", answer: "transforming", evidence: "transforming、converting、altering 在该句中都可能成立，题内没有足够排他线索。结论：标记为重叠题，不编造词义禁区。" }
      ]
    });
  }

  function applyExplanationOverrides() {
    const overrides = window.READING_EXPLANATIONS || {};
    data.questions.forEach((question) => {
      (question.blank_map || []).forEach((blank) => {
        const override = overrides[blank.bid];
        if (!override) return;
        const primary = methodsById.get(override.primary_point);
        Object.assign(blank, {
          primary_point: override.primary_point,
          primary_name: primary ? primary.name : blank.primary_name,
          secondary_points: override.secondary_points || [],
          explanation: override.reason,
          reviewed_explanation: true
        });
      });
    });
  }

  function learnerExplanation(knowledge) {
    if (knowledge.reviewed_explanation && knowledge.explanation) return knowledge.explanation;
    const method = methodsById.get(knowledge.primary_point);
    const path = method?.memory_rule || method?.core_method || "先检查语法、搭配和上下文";
    return `判断路径：${path} 当前这个空只有考点归类，尚未完成人工选项排除说明，不能把原来的自动判定文字当成完整解析。`;
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
        <div class="info-box"><span>专项练习</span><strong>${state.practiceQuestions.length} 题</strong></div>
      </div>`;
    el.methodPanel.innerHTML = `
      <h3 class="section-heading">固定解题顺序</h3>
      <ol class="step-list">${method.decision_steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>`;
    const boundaryTitle = method.id === "C08" ? "不能只靠固定搭配的情况" : "容易混淆的情况";
    const quickChecks = method.quick_checks || [];
    const judgmentContent = quickChecks.length
      ? `<ul>${quickChecks.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}</ul>`
      : `<div class="example-list">${renderExamples(method.normal_examples)}</div>`;
    const boundaryContent = quickChecks.length ? "" : `
      <section class="tip-card tip-card-wide"><h4>${boundaryTitle}</h4><div class="example-list">${renderExamples(method.contrast_examples)}</div></section>`;
    el.tipsPanel.innerHTML = `
      <div class="tip-grid">
        ${method.memory_rule ? `<section class="memory-rule-card"><span>做题口诀</span><strong>${escapeHtml(method.memory_rule)}</strong></section>` : ""}
        <section class="tip-card"><h4>最容易错在哪里</h4><ul>${method.traps.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}</ul></section>
        <section class="tip-card"><h4>${quickChecks.length ? "一眼识别" : "怎么判断"}</h4>${judgmentContent}</section>
        ${boundaryContent}
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
    const practiceMode = question.type === "R" ? "本题答案池选择" : "原始选项选择";
    el.questionMeta.textContent = `专项第 ${state.questionIndex + 1} / ${state.practiceQuestions.length} 题 · ${question.answers.length} 空 · ${practiceMode}`;
    el.practiceStatus.textContent = "点击“开始本题”后开始计时；所有空均使用选择，不需要手打单词。";
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
      const select = document.createElement("select");
      select.disabled = locked;
      select.setAttribute("aria-label", `第 ${blankIndex + 1} 空`);
      select.append(new Option(`第 ${blankIndex + 1} 空`, ""));
      const choices = question.type === "RW"
        ? parseOptions(question.options[blankIndex] || part)
        : [...new Set(question.answers)];
      choices.forEach((option) => select.append(new Option(option, option)));
      wrapper.append(select);
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
          <div class="answer-reason"><strong>为什么选 ${escapeHtml(detail.answer)}</strong><p>${escapeHtml(learnerExplanation(knowledge))}</p></div>
          <span class="point-chip">${knowledge.reviewed_explanation ? "决定性考点" : "归类考点"} ${escapeHtml(knowledge.primary_point || "—")}</span>
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
