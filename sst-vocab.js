/* SST vocabulary study component: source-grounded, locally persisted review status. */
(function () {
  "use strict";
  const dictionary = (window.SST_VOCAB_DATA && window.SST_VOCAB_DATA.items) || [];
  const key = "pte-sst-vocab-v1";
  const byId = new Map(dictionary.map(function (term) { return [term.id, term]; }));
  const valid = new Set(["unreviewed", "unknown", "slow", "known"]);
  const initial = dictionary.filter(function (t) { return t.diagnostic === "unknown"; });
  const label = { unreviewed: "未测试", unknown: "不会", slow: "反应慢", known: "记住了" };
  const html = function (s) { return String(s || "").replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  }); };
  function makeUI() {
    const $ = function (id) { return document.getElementById(id); };
    const status = Object.fromEntries(initial.map(function (item) { return [item.id, "unknown"]; }));
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "{}");
      if (saved && typeof saved === "object" && !Array.isArray(saved)) {
        Object.entries(saved).forEach(function (entry) {
          if (byId.has(entry[0]) && valid.has(entry[1])) status[entry[0]] = entry[1];
        });
      }
    } catch (_) { /* Bad saved data should not stop the rest of SST. */ }
    let category = "all";
    let scope = "all";
    let filter = "pending";
    let search = "";
    let selected = "";
    let revealed = false;
    let articleType = "word";
    let listLimit = 24;
    let currentId = "S001";
    const title = function (id) {
      const found = (window.SST_DATA && window.SST_DATA.items || []).find(function (x) { return x.id === id; });
      return found ? found.title_en : id;
    };
    const getStatus = function (item) { return status[item.id] || "unreviewed"; };
    const save = function () { localStorage.setItem(key, JSON.stringify(status)); };
    const summary = function (items) {
      const known = items.filter(function (x) { return getStatus(x) === "known"; }).length;
      const unknown = items.filter(function (x) { return getStatus(x) === "unknown"; }).length;
      const slow = items.filter(function (x) { return getStatus(x) === "slow"; }).length;
      return { known: known, unknown: unknown, slow: slow, pending: items.length - known };
    };
    function articleItems(id) {
      return dictionary.filter(function (v) { return v.sources.includes(id); });
    }
    function filtered() {
      return dictionary.filter(function (term) {
        if (scope === "current" && !term.sources.includes(currentId)) return false;
        if (category !== "all" && term.type !== category) return false;
        const mark = getStatus(term);
        if (filter === "pending" && mark === "known") return false;
        if (!["all", "pending"].includes(filter) && mark !== filter) return false;
        return !search || (term.term + " " + term.meaning + " " + term.sources.join(" ")).toLowerCase().includes(search);
      });
    }
    function statusBadge(item) {
      const s = getStatus(item);
      return '<span class="sst-vocab-status is-' + html(s) + '">' + html(label[s]) + "</span>";
    }
    function gradeActions(item) {
      return '<div class="sst-vocab-grades" data-vocab-id="' + html(item.id) + '">' +
        '<button type="button" data-vocab-grade="unknown">不会</button>' +
        '<button type="button" data-vocab-grade="slow">反应慢</button>' +
        '<button type="button" data-vocab-grade="known">记住了</button>' +
        '<button type="button" data-vocab-grade="unreviewed" class="vocab-reset">重置</button></div>';
    }
    function articleRows(list) {
      if (!list.length) return '<p class="sst-vocab-empty">这篇暂无该类型的词汇。</p>';
      return list.map(function (v) {
        return '<div class="sst-vocab-article-item" data-item="' + html(v.id) + '"><details>' +
          '<summary><strong>' + html(v.term) + '</strong>' + statusBadge(v) + '</summary>' +
          '<p class="sst-vocab-meaning">' + html(v.meaning) + '</p>' +
          '<p class="sst-vocab-example"><small>萤火虫原文</small> ' + html(v.example) + '</p>' +
          gradeActions(v) + '</details></div>';
      }).join("");
    }
    function renderArticle(id) {
      currentId = id;
      const box = $("articleVocabSection");
      if (!box) return;
      const all = articleItems(id);
      const words = all.filter(function (x) { return x.type === "word"; }).length;
      const phrases = all.length - words;
      $("articleVocabMeta").textContent = words + " 个单词 · " + phrases + " 条短语；点开查看中文和原文。";
      $("articleVocabTabs").querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("is-active", b.dataset.articleType === articleType);
        b.setAttribute("aria-pressed", String(b.dataset.articleType === articleType));
      });
      $("articleVocabItems").innerHTML = all.length ? articleRows(all.filter(function (v) { return v.type === articleType; })) :
        '<p class="sst-vocab-empty">这篇没有收录词汇；萤火虫文档未收录的文章不会用机器识别稿补齐。</p>';
    }
    function renderStats() {
      const s = summary(dictionary);
      $("vocabProgress").textContent = s.known + " / " + dictionary.length + " 已掌握，" +
        s.unknown + " 不会，" + s.slow + " 反应慢";
    }
    function renderCard(options) {
      const list = filtered();
      if (options && options.next) {
        let next = list.findIndex(function (x) { return x.id === selected; }) + 1;
        if (next >= list.length) next = 0;
        selected = list.length ? list[next].id : "";
        revealed = false;
      } else if (!list.some(function (x) { return x.id === selected; })) {
        selected = list[0] ? list[0].id : "";
        revealed = false;
      }
      const item = byId.get(selected);
      $("vocabDeckCount").textContent = "当前筛选 " + list.length + " 条";
      if (!item || !list.length) {
        $("vocabCard").innerHTML = '<p class="sst-vocab-empty">没有匹配的词汇；可切换“全部文章”或“所有状态”。</p>';
        $("vocabNext").disabled = true;
        return;
      }
      $("vocabNext").disabled = false;
      $("vocabCard").innerHTML =
        '<div class="sst-vocab-card-caption">' + (item.type === "word" ? "单词" : "固定搭配／短语") +
        ' · ' + html(item.sources.map(title).slice(0, 2).join(" / ")) + '</div>' +
        '<h3>' + html(item.term) + "</h3>" +
        '<div class="sst-vocab-card-meaning">' + (revealed ?
          '<p><b>' + html(item.meaning) + '</b></p><p class="sst-vocab-example">' + html(item.example) + "</p>" :
          '<button type="button" class="primary-button" id="vocabReveal">显示中文释义与原句</button>') + '</div>' +
        '<div class="sst-vocab-card-footer">' + statusBadge(item) +
        ' <span>出处：' + html(item.sources.join(" · ")) + '</span></div>' +
        (revealed ? gradeActions(item) : "");
    }
    function renderList() {
      const items = filtered();
      $("vocabItemList").innerHTML = items.slice(0, listLimit).map(function (item) {
        return '<button type="button" class="sst-vocab-list-row ' +
          (item.id === selected ? "is-selected" : "") + '" data-select-vocab="' + html(item.id) + '">' +
          '<span><b>' + html(item.term) + '</b><small>' + html(item.sources.join(" · ")) + '</small></span>' +
          statusBadge(item) + '</button>';
      }).join("") || '<p class="sst-vocab-empty">当前没有匹配的词汇。</p>';
      $("vocabShowMore").hidden = items.length <= listLimit;
      $("vocabShowMore").textContent = "继续显示（已显示 " + Math.min(listLimit,items.length) + " / " + items.length + "）";
    }
    function renderStudy(id) {
      currentId = id;
      $("vocabScope").value = scope;
      $("vocabType").value = category;
      $("vocabStatusFilter").value = filter;
      $("vocabSearch").value = search;
      renderStats();
      renderCard();
      renderList();
    }
    function mark(itemId, grade, inArticle) {
      if (!byId.has(itemId) || !valid.has(grade)) return;
      if (grade === "unreviewed") delete status[itemId];
      else status[itemId] = grade;
      save();
      renderStats();
      if (inArticle) {
        renderArticle(currentId);
        // Keep expanded row open so a user can still see the meaning just graded.
        const element = [...$("articleVocabItems").querySelectorAll("[data-item]")].find(function (e) {
          return e.dataset.item === itemId;
        });
        if (element) element.querySelector("details").open = true;
      } else {
        const pool = filtered();
        const oldPos = pool.findIndex(function (x) { return x.id === itemId; });
        // Marking a known term removes it from "待复习" immediately.
        if (!pool.some(function (x) { return x.id === itemId; })) {
          selected = pool.length ? pool[Math.max(0,Math.min(oldPos,pool.length-1))].id : "";
          revealed = false;
        } else {
          selected = itemId;
          revealed = true;
        }
        renderCard();
        renderList();
      }
    }
    function bind() {
      $("articleVocabTabs").addEventListener("click", function (e) {
        const b=e.target.closest("button[data-article-type]");
        if (b) { articleType=b.dataset.articleType;renderArticle(currentId); }
      });
      $("articleVocabItems").addEventListener("click", function (e) {
        const b=e.target.closest("[data-vocab-grade]");
        if (!b) return;
        const wrap=b.closest("[data-vocab-id]");
        if (wrap) mark(wrap.dataset.vocabId,b.dataset.vocabGrade,true);
      });
      const change = function () { selected="";revealed=false;listLimit=24;renderStudy(currentId); };
      $("vocabScope").addEventListener("change",function (e) {scope=e.target.value;change();});
      $("vocabType").addEventListener("change",function (e) {category=e.target.value;change();});
      $("vocabStatusFilter").addEventListener("change",function (e) {filter=e.target.value;change();});
      $("vocabSearch").addEventListener("input",function (e) {search=e.target.value.trim().toLowerCase();change();});
      $("vocabCard").addEventListener("click",function (e) {
        if (e.target.id === "vocabReveal") {revealed=true;renderCard();return;}
        const b=e.target.closest("[data-vocab-grade]");
        if (b && selected) mark(selected,b.dataset.vocabGrade,false);
      });
      $("vocabNext").addEventListener("click",function () {renderCard({next:true});renderList();});
      $("vocabShowMore").addEventListener("click",function () {listLimit+=24;renderList();});
      $("vocabItemList").addEventListener("click",function (e) {
        const b=e.target.closest("[data-select-vocab]");
        if (b) {selected=b.dataset.selectVocab;revealed=false;renderCard();renderList();}
      });
      $("vocabSpeak").addEventListener("click",function () {
        const word=byId.get(selected);
        if (!word || !("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        const utterance=new SpeechSynthesisUtterance(word.term);
        utterance.lang="en-AU"; utterance.rate=0.85;
        window.speechSynthesis.speak(utterance);
      });
      $("vocabSpeak").disabled = !("speechSynthesis" in window);
    }
    bind();
    return { renderArticle: renderArticle, renderStudy: renderStudy,
             wordCount: dictionary.filter(function (i) {return i.type==="word";}).length,
             phraseCount: dictionary.filter(function (i) {return i.type==="phrase";}).length };
  }
  window.createSstVocabularyUI=makeUI;
})();