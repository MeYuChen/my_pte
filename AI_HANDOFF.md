# AI Handoff

本文档用于让新的 AI/开发者快速接手 `my_pte` 项目。优先阅读本文，再看 `README.md` 和 `CHANGELOG.md`。

## 项目是什么

`my_pte` 是一个用于提高 PTE WE 高频作文背诵效率的离线网页工具。核心目标不是做通用作文产品，而是帮助用户用最短时间背完固定题库文章，并快速定位错误。

当前部署方式是 GitHub Pages 静态站点，也可以本地直接用静态服务器打开。没有后端、没有账号系统、没有数据库。练习记录保存在浏览器 `localStorage`。

## 当前目标

当前优先级：

1. 让用户尽快背完 39 篇 WE 高频作文。
2. 默写后立刻指出具体错误位置，减少人工找错时间。
3. 图片关卡可快速浏览、放大、拖拽，用于速记。
4. 功能稳定后再考虑合入 `master` 和 GitHub Pages 发布。

暂时不要优先做商业化、账号、支付、后端同步等功能。

## 分支状态

- `master`：线上 GitHub Pages 主要分支。
- `develop`：当前功能开发分支。

开发新功能先在 `develop`，用户确认后再合入 `master`。合入前更新 `CHANGELOG.md`。

## 文件结构

- `index.html`：页面结构，所有 DOM 节点都在这里。
- `styles.css`：全部样式，包括布局、练习面板、差异高亮、图片全屏查看器。
- `app.js`：全部交互逻辑，项目没有框架。
- `practice-data.js`：题库数据，挂载到 `window.WE_DATA`。
- `images/`：39 篇文章对应的关卡图片。
- `sw.js`：Service Worker，用于缓存静态资源和关卡图片。
- `CHANGELOG.md`：版本迭代记录，每次功能更新都要维护。
- `README.md`：基础使用说明。

## 核心功能现状

### 模板练习

练习完整模板句。用户输入必须与模板句一致，包括标点。入口在 `state.mode === "template"`。

相关代码：

- `templatePracticeModules()`
- `renderPractice()`
- `checkPractice()`

### 文章论点练习

练习从标准作文原文中刨除模板后的填空内容。注意：如果填空片段在原文中走到句尾，句号属于答案；如果只是句中片段，不带句号。

例子：

- `The issue of whether ... private cars has triggered...` 的答案是 `whether ... private cars`
- `Many people claim that new roads are necessary for car owners.` 的答案是 `new roads are necessary for car owners.`

相关代码：

- `ARTICLE_SLOT_PATTERNS`
- `articlePracticeModules()`
- `extractArticleFields()`
- `normalizeForPractice()`

### 考核模式

考核要求整篇作文按段落与标准答案完全一致。单篇考核 20 分钟，综合考核随机 4 篇，每篇 20 分钟。

相关代码：

- `gradeEssay()`
- `renderExamResult()`
- `renderCompositeResult()`
- `examDiffHtml()`

### 错误高亮

模板练习、文章论点、单篇考核、综合考核都已经支持词级/标点级差异高亮。

规则：

- 标准答案中用户漏掉的 token：黄色高亮。
- 用户多写的 token：黄色高亮并删除线。
- 标点也作为 token 参与比较。

相关代码：

- `diffAnswerHtml()`
- `examDiffHtml()`
- `diffTokens()`
- `tokenDiff()`
- `renderDiffTokens()`

### 熟练度规则

每个 case 使用最近 5 次滑动窗口判断熟练度：

- 0 次正确：未熟悉
- 最近 5 次内 1 次正确：熟悉
- 最近 5 次内 3 次正确：掌握
- 最近 5 次内 5 次正确：熟练

左上角“已掌握”只统计 `熟练`。

相关代码：

- `MASTERY_STEPS`
- `updateProgressWithResult()`
- `masteryLevel()`
- `recentResults()`
- `windowCorrectCount()`

### 图片查看器

文章论点模式默认展开关卡图片。双击图片进入全屏。

全屏功能：

- 图片按视口完整显示。
- 鼠标滚轮缩放。
- 左键拖拽平移。
- 左右按钮切换上一张/下一张。
- 键盘 `ArrowLeft` / `ArrowRight` 切换。
- 点击上一张/下一张按钮时，快速连点不会触发双击退出。
- 非按钮区域双击仍可退出全屏。
- `Esc` 退出全屏。
- 当前图片会优先预加载前后若干张；打开站点后会后台缓存全部关卡图片，改善 GitHub Pages 上快速翻图的等待时间。
- `sw.js` 提供 Service Worker 缓存，图片命中缓存后刷新或再次访问也能更快加载。
- 修改静态资源缓存策略时要更新 `sw.js` 里的缓存版本名，避免旧缓存继续生效。

相关代码：

- `openImageFullscreen()`
- `preloadNeighborImages()`
- `scheduleImageCacheWarmup()`
- `handleImageWheel()`
- `startImagePan()`
- `moveImagePan()`
- `showAdjacentImage()`
- `handleImageViewerKeydown()`
- `sw.js`

相关 DOM/CSS：

- `#imageFrame`
- `#levelImage`
- `.image-nav-button`
- `.image-frame:fullscreen`

### 左侧栏

左侧栏已改为单个 toggle 按钮：

- 展开时按钮贴在 sidebar 右边，点击收起。
- 收起时按钮贴在页面左边，点击展开。
- 收起状态保存在 `localStorage`。

相关代码：

- `SIDEBAR_STATE_KEY`
- `toggleSidebar()`
- `renderSidebarState()`

## 本地运行

推荐用静态服务器：

```bash
python3 -m http.server 8765
```

然后打开：

```text
http://127.0.0.1:8765/
```

本环境里启动服务器可能需要提权。预览结束后要停掉服务器，避免占用端口。

## 验证命令

修改 `app.js` 后至少运行：

```bash
node --check app.js
```

提交前运行：

```bash
git diff --check
git status --short
```

如果改了页面交互，启动本地服务器手动预览。

## 当前已知限制

- 没有账号系统，练习记录只保存在当前浏览器。
- 换电脑/换浏览器会丢失练习记录。
- 题库数据是静态 JS，不支持后台管理。
- `body` 有 `min-width: 1120px`，当前主要面向电脑浏览器，移动端未适配。
- 考核模式是严格全文匹配，容错很低，这是当前设计目标，不是 bug。
- `ARTICLE_SLOT_PATTERNS` 依赖当前作文模板。如果标准答案模板变化，需要同步更新提取规则。

## 后续优化方向

优先考虑能直接提高背诵效率的功能：

- 错题集中复习。
- 只显示未熟练/错误高频的关卡。
- 快捷键：检查、下一篇、显示答案、清空。
- 图片全屏查看器增加当前题号/标题显示。
- 导出/导入 `localStorage` 练习记录，解决换设备丢进度问题。
- 移动端布局适配。

暂缓：

- 登录、会员、支付。
- 多用户云同步。
- 大规模题库后台。

## 开发约定

- 保持静态站点结构，不引入构建工具，除非用户明确要求。
- 功能改动尽量集中在 `app.js`、`styles.css`、`index.html`。
- 每次用户确认功能后提交到 `develop`。
- 合入 `master` 前更新 `CHANGELOG.md`。
- 不要破坏用户已有 `localStorage` 数据结构，除非有迁移方案。
- 如果改文章论点提取逻辑，必须用第 5 篇这类例子验证句号归属。
