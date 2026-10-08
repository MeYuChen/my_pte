(function () {
  "use strict";

  const data = window.READING_DATA;
  const curriculum = window.READING_CURRICULUM;
  const explanations = window.READING_EXPLANATIONS || {};
  if (!data || !curriculum) return;

  const el = {};
  [
    "recognitionModule", "recognitionStart", "recognitionReset", "recognitionProgress",
    "recognitionAccuracy", "recognitionSource", "recognitionSnippet", "recognitionOptions",
    "recognitionRoutes", "recognitionFeedback", "recognitionNext"
  ].forEach((id) => { el[id] = document.getElementById(id); });
  if (!el.recognitionModule) return;

  const methods = new Map(data.methods.map((method) => [method.id, method]));
  const chapters = new Map(curriculum.chapters.map((chapter) => [chapter.id, chapter]));
  const pool = buildPool();
  let session = null;

  renderIdle();
  el.recognitionStart.addEventListener("click", startSession);
  el.recognitionReset.addEventListener("click", startSession);
  el.recognitionNext.addEventListener("click", nextItem);
  el.recognitionRoutes.addEventListener("click", answerRoute);
  el.recognitionFeedback.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-recognition-point]");
    if (!button) return;
    document.querySelector('[data-reading-mode="points"]').click();
    location.hash = button.dataset.openRecognitionPoint;
  });

  function buildPool() {
    const items = [];
    data.questions.forEach((question) => {
      question.answers.forEach((answer, index) => {
        const original = question.blank_map[index] || {};
        const override = explanations[original.bid] || {};
        const pointId = override.primary_point || original.primary_point;
        const chapterId = curriculum.pointToChapter[pointId];
        const routeId = curriculum.routeByChapter[chapterId];
        if (!pointId || !chapterId || !routeId) return;
        items.push({
          question,
          index,
          answer,
          pointId,
          chapterId,
          routeId,
          reason: override.reason || original.explanation || "",
          bid: original.bid || `${question.source}:${index + 1}`
        });
      });
    });
    return items;
  }

  function startSession() {
    const size = Math.min(20, pool.length);
    session = {
      items: shuffle([...pool]).slice(0, size),
      index: 0,
      answered: 0,
      correct: 0,
      locked: false
    };
    renderItem();
  }

  function renderIdle() {
    el.recognitionProgress.textContent = "尚未开始";
    el.recognitionAccuracy.textContent = "目标：先判断路线";
    el.recognitionSource.textContent = "随机抽取代表题中的空";
    el.recognitionSnippet.textContent = "点击“开始20空”，只判断这个空首先应该走形、搭、逻还是义。";
    el.recognitionOptions.replaceChildren();
    el.recognitionRoutes.replaceChildren(...routeButtons());
    el.recognitionRoutes.querySelectorAll("button").forEach((button) => { button.disabled = true; });
    el.recognitionFeedback.hidden = true;
    el.recognitionNext.hidden = true;
    el.recognitionReset.hidden = true;
  }

  function renderItem() {
    if (!session || session.index >= session.items.length) {
      renderComplete();
      return;
    }
    const item = session.items[session.index];
    session.locked = false;
    el.recognitionStart.hidden = true;
    el.recognitionReset.hidden = false;
    el.recognitionNext.hidden = true;
    el.recognitionProgress.textContent = `第 ${session.index + 1} / ${session.items.length} 空`;
    el.recognitionAccuracy.textContent = session.answered
      ? `路线判断 ${session.correct} / ${session.answered}`
      : "目标：先判断路线";
    el.recognitionSource.textContent = `${item.question.type} · ${item.bid}`;
    el.recognitionSnippet.textContent = buildSnippet(item.question, item.index);
    renderOptions(item);
    el.recognitionRoutes.replaceChildren(...routeButtons());
    el.recognitionFeedback.hidden = true;
    el.recognitionFeedback.replaceChildren();
  }

  function renderOptions(item) {
    let options = [];
    if (item.question.type === "RW") {
      options = String(item.question.options[item.index] || "").split(",").map((value) => value.trim()).filter(Boolean);
    } else {
      options = [...new Set(item.question.answers)].slice(0, 8);
    }
    el.recognitionOptions.innerHTML = options.length
      ? `<span>候选：</span>${options.map((value) => `<b>${escapeHtml(value)}</b>`).join("")}`
      : "";
  }

  function routeButtons() {
    return Object.values(curriculum.routes).map((route) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.routeId = route.id;
      button.innerHTML = `<strong>${route.label}</strong><span>${route.title}</span>`;
      return button;
    });
  }

  function answerRoute(event) {
    const button = event.target.closest("[data-route-id]");
    if (!button || !session || session.locked) return;
    const item = session.items[session.index];
    const selected = button.dataset.routeId;
    const correct = selected === item.routeId;
    session.locked = true;
    session.answered += 1;
    if (correct) session.correct += 1;

    el.recognitionRoutes.querySelectorAll("button").forEach((candidate) => {
      candidate.disabled = true;
      if (candidate.dataset.routeId === item.routeId) candidate.classList.add("is-correct");
      if (candidate === button && !correct) candidate.classList.add("is-wrong");
    });

    const route = curriculum.routes[item.routeId];
    const chapter = chapters.get(item.chapterId);
    const method = methods.get(item.pointId);
    el.recognitionFeedback.className = `recognition-feedback ${correct ? "is-correct" : "is-wrong"}`;
    el.recognitionFeedback.innerHTML = `
      <p class="eyebrow">${correct ? "路线判断正确" : "先后顺序需要调整"}</p>
      <h3>先走“${escapeHtml(route.label)}” · ${escapeHtml(chapter.name)}</h3>
      <p><strong>识别信号：</strong>${escapeHtml(chapter.trigger)}</p>
      <p><strong>立即动作：</strong>${escapeHtml(chapter.action)}</p>
      <p><strong>本空答案：</strong>${escapeHtml(item.answer)}</p>
      ${item.reason ? `<p><strong>决定证据：</strong>${escapeHtml(item.reason)}</p>` : ""}
      <button class="secondary-button" type="button" data-open-recognition-point="${escapeHtml(item.pointId)}">查看 ${escapeHtml(item.pointId)} · ${escapeHtml(method?.name || "细分考点")}</button>`;
    el.recognitionFeedback.hidden = false;
    el.recognitionNext.hidden = false;
    el.recognitionAccuracy.textContent = `路线判断 ${session.correct} / ${session.answered}`;
  }

  function nextItem() {
    if (!session || !session.locked) return;
    session.index += 1;
    renderItem();
  }

  function renderComplete() {
    const accuracy = session.answered ? Math.round(session.correct / session.answered * 100) : 0;
    el.recognitionProgress.textContent = "本轮完成";
    el.recognitionAccuracy.textContent = `${session.correct} / ${session.answered} · ${accuracy}%`;
    el.recognitionSource.textContent = "混合识别结果";
    el.recognitionSnippet.textContent = accuracy >= 90
      ? "路线识别已经形成基础反应，可以进入完整文章混合训练。"
      : "先复习判断错误的课程，再开始下一轮20空。";
    el.recognitionOptions.replaceChildren();
    el.recognitionRoutes.replaceChildren();
    el.recognitionFeedback.hidden = true;
    el.recognitionNext.hidden = true;
    el.recognitionStart.hidden = false;
    el.recognitionStart.textContent = "再练20空";
  }

  function buildSnippet(question, targetIndex) {
    let blankIndex = 0;
    const completed = question.passage.replace(/【[^】]*】/g, () => {
      const current = blankIndex;
      blankIndex += 1;
      return current === targetIndex ? "［____］" : question.answers[current];
    });
    const marker = completed.indexOf("［____］");
    const startBoundary = Math.max(
      completed.lastIndexOf(".", marker - 1),
      completed.lastIndexOf("?", marker - 1),
      completed.lastIndexOf("!", marker - 1)
    );
    const nextStops = [completed.indexOf(".", marker), completed.indexOf("?", marker), completed.indexOf("!", marker)]
      .filter((value) => value >= 0);
    const endBoundary = nextStops.length ? Math.min(...nextStops) + 1 : completed.length;
    let snippet = completed.slice(startBoundary + 1, endBoundary).trim();
    if (snippet.length > 320) {
      const localStart = Math.max(0, marker - startBoundary - 120);
      snippet = `…${snippet.slice(localStart, localStart + 270)}…`;
    }
    return snippet;
  }

  function shuffle(items) {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const other = Math.floor(Math.random() * (index + 1));
      [items[index], items[other]] = [items[other], items[index]];
    }
    return items;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[character]);
  }
})();
