(() => {
  "use strict";
  const articles = window.WE_STUDY_DATA;
  const categories = [...new Set(articles.map((article) => article.category))];
  const content = document.getElementById("content");
  const sidebar = document.getElementById("sidebar");
  const byId = new Map(articles.map((article) => [article.id, article]));
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const categoryHref = (category) => `#category/${categories.indexOf(category)}`;
  const articleHref = (id, view = "card") => `#${view}/${id}`;
  const group = (category) => articles.filter((article) => article.category === category);
  const icons = [
    '<path d="M12 10h24v28H12zM18 18h12M18 24h12M18 30h7"/><path d="m25 29 4 4 8-8"/>',
    '<path d="M24 8a16 16 0 1 0 16 16"/><path d="m29 9 10 10M39 9 29 19M17 23h14M17 29h9"/>',
    '<path d="M10 24h28M28 14l10 10-10 10M10 12v24"/>'
  ];
  sidebar.innerHTML = categories.map((category) => `<details open><summary>${escape(category)}</summary>${group(category).map((article) => `<a href="${articleHref(article.id)}" data-article="${article.id}">#${article.id} ${escape(article.title)}</a>`).join("")}</details>`).join("");
  function topicList(items) {
    return `<ul class="topic-list">${items.map((article) => `<li><a href="${articleHref(article.id)}">#${article.id} ${escape(article.title)}<small>${escape(article.name)}</small></a></li>`).join("")}</ul>`;
  }
  function indexPage() {
    content.innerHTML = `<p class="eyebrow">39 ESSAYS / 7 CATEGORIES</p><h1>一类一类背</h1><p class="subtitle">题目 → 记忆卡 → 正文</p><div class="category-grid">${categories.map((category) => `<section class="category-card"><h2><a href="${categoryHref(category)}">${escape(category)}</a> <small>${group(category).length} 篇</small></h2>${topicList(group(category))}</section>`).join("")}</div>`;
  }
  function categoryPage(category) {
    content.innerHTML = `<nav class="breadcrumb" aria-label="页内导航"><a href="#index">目录</a></nav><p class="eyebrow">${group(category).length} ESSAYS</p><h1>${escape(category)}</h1><section class="paper">${topicList(group(category))}</section>`;
  }
  function articleHeader(article, view) {
    return `<nav class="breadcrumb" aria-label="页内导航"><a href="#index">目录</a><a href="${categoryHref(article.category)}">本类首页</a><a href="${articleHref(article.id, view === "card" ? "essay" : "card")}">${view === "card" ? "完整原文" : "记忆卡"}</a></nav><p class="eyebrow">${escape(article.category)}</p><div class="article-title"><h1>#${article.id} ${escape(article.title)}</h1><span class="en-title">${escape(article.name)}</span></div>`;
  }
  function pager(article, view) {
    const items = group(article.category);
    const index = items.findIndex((item) => item.id === article.id);
    return `<nav class="pager" aria-label="同类文章翻页">${index > 0 ? `<a href="${articleHref(items[index - 1].id, view)}">← 上一篇</a>` : '<span class="disabled">本类第一篇</span>'}<span>${index + 1} / ${items.length}</span>${index + 1 < items.length ? `<a href="${articleHref(items[index + 1].id, view)}">下一篇 →</a>` : `<a href="${categoryHref(article.category)}">本类目录 →</a>`}</nav>`;
  }
  function cardPage(article) {
    content.innerHTML = articleHeader(article, "card") + `<article class="paper"><div class="topic"><p class="topic-en" lang="en">${escape(article.topic)}</p><p class="topic-cn">${escape(article.topicCn)}</p></div><div class="position"><span class="section-label">立场</span><span lang="en">${escape(article.position)}</span></div><div class="hook"><span class="section-label">一句话串记</span>${escape(article.hook)}</div><div class="flow">${article.flow.map((point, index) => `${index ? '<span class="flow-arrow" aria-hidden="true">→</span>' : ""}<div class="flow-node"><svg viewBox="0 0 48 48" aria-hidden="true">${icons[index]}</svg><small>${["BP1", "BP2", "CONCLUSION"][index]}</small><strong>${escape(point)}</strong></div>`).join("")}</div><div class="anchors"><span class="section-label">英文锚点</span>${article.anchors.map((anchor) => `<p lang="en">${escape(anchor)}</p>`).join("")}</div><div class="recall"><span>闭眼复述 题目意思 → 立场 → BP1 → BP2 → Conclusion</span><a class="primary" href="${articleHref(article.id, "essay")}">正文</a></div></article>` + pager(article, "card");
  }
  function essayPage(article) {
    content.innerHTML = articleHeader(article, "essay") + `<div class="reader-controls"><label><input type="checkbox" id="showChinese" checked>中文</label><label><input type="checkbox" id="showHighlights" checked>高亮</label></div><article class="paper essay" id="essay">${article.paragraphs.map((paragraph) => `<p>${paragraph.map((sentence) => `<span lang="en">${sentence.runs.map((run) => run.variable ? `<mark>${escape(run.text)}</mark>` : escape(run.text)).join("")}</span> <span class="translation" lang="zh-CN">${escape(sentence.cn)}</span> `).join("")}</p>`).join("")}</article>` + pager(article, "essay");
    document.getElementById("showChinese").addEventListener("change", (event) => document.getElementById("essay").classList.toggle("hide-cn", !event.target.checked));
    document.getElementById("showHighlights").addEventListener("change", (event) => document.getElementById("essay").classList.toggle("hide-highlights", !event.target.checked));
  }
  function render() {
    const [view, id] = location.hash.slice(1).split("/");
    const article = byId.get(id);
    if (view === "category" && /^\d+$/.test(id || "") && categories[Number(id)]) categoryPage(categories[Number(id)]);
    else if (article && (view === "card" || view === "essay")) (view === "card" ? cardPage : essayPage)(article);
    else indexPage();
    document.title = article && ["card", "essay"].includes(view) ? `#${article.id} ${article.title} · PTE WE` : "PTE WE · 分类背诵";
    sidebar.querySelectorAll("[data-article]").forEach((link) => {
      if (article?.id === link.dataset.article && ["card", "essay"].includes(view)) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
    content.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", render);
  render();
})();
