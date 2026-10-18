const { test, expect } = require("@playwright/test");
const { readdirSync } = require("node:fs");
const { join } = require("node:path");

test.beforeEach(async ({ page }) => {
  await page.goto("./sst.html");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("bundles one mnemonic image for every SST item", () => {
  const images = readdirSync(join(__dirname, "..", "images", "sst")).filter((name) => name.startsWith("S") && name.endsWith(".webp"));
  expect(images).toHaveLength(60);
});

test("shows 60 imported SST items and WE-style modes", async ({ page }) => {
  await expect(page.locator("#progressSummary")).toContainText("0 / 60");
  await expect(page.locator("#levelList .level-item")).toHaveCount(60);
  await expect(page.locator("#levelList [data-id=\"S051\"]")).toContainText("Machines Increase Unemployment");
  await expect(page.locator("#levelList [data-id=\"S054\"]")).toContainText("Modern Poetry Course");
  await expect(page.getByRole("button", { name: "模板" })).toHaveClass(/is-active/);
  await expect(page.getByText("听主题 → 抓名词关系 → 拼成 50–70 词")).toBeVisible();
  await expect(page.locator("#categoryOverview .category-card")).toHaveCount(7);
});

test("filters the seven-category workbook structure", async ({ page }) => {
  await page.locator("#categoryOverview [data-category=\"C04\"]").click();
  await expect(page.locator("#levelList .level-item")).toHaveCount(11);
  await expect(page.locator("#levelList .category-heading")).toContainText("经济商业 · 管理");
  await expect(page.locator("#levelList .level-item").first()).toContainText("Definition of Risk");
  await expect(page.locator("#levelList .level-item").last()).toContainText("University Competition");
});

test("learn and drill retain logic keywords and final answer", async ({ page }) => {
  await page.getByRole("button", { name: "学习" }).click();
  await expect(page.locator("#logicText")).not.toBeEmpty();
  await expect(page.locator("#keywordList span").first()).toBeVisible();
  await expect(page.locator("#mnemonicImage")).toBeVisible();
  expect(await page.locator("#mnemonicImage").evaluate((image) => image.naturalWidth)).toBeGreaterThan(500);
  await page.getByRole("button", { name: "速记" }).click();
  await expect(page.locator("#drillMnemonicImage")).toBeVisible();
  await page.getByRole("button", { name: "显示成品答案" }).click();
  await expect(page.locator("#drillAnswer")).toContainText("biology");
  await page.getByRole("button", { name: "记住了" }).click();
  await expect(page.locator("#progressSummary")).toContainText("1 / 60");
});

test("exam reports transparent checks and reference answer", async ({ page }) => {
  await page.getByRole("button", { name: "考核" }).click();
  await page.locator("#beginWritingButton").click();
  await page.locator("#examInput").fill("Biology provides important information about DNA and RNA. All life forms use genetic information and cells as their fundamental building blocks. Living organisms also conduct metabolism and share similar basic chemistry. These common features show that creatures on the earth are closely connected, although they may look very different from one another in the natural world.");
  await expect(page.locator("#wordCount")).toContainText("words");
  await page.getByRole("button", { name: "提交检查" }).click();
  await expect(page.locator("#examResult")).toContainText("原词覆盖");
  await expect(page.locator("#examResult")).toContainText("不是官方分数");
  await expect(page.locator("#examResult")).toContainText("参考答案");
});

test("shows the actual ASR transcript rather than the SST reference answer", async ({ page }) => {
  await page.getByRole("button", { name: "学习" }).click();
  await expect(page.locator("#transcriptContents")).toContainText("Now, the study of biology is responsible");
  await expect(page.locator("#transcriptContents")).not.toContainText("The lecture shows information about biology");
  await expect(page.locator("#transcriptContents .sst-reading-zh").first()).not.toBeEmpty();
  await expect(page.locator("#sstAudio")).toHaveAttribute("src", /BiologyDNAandRNA\.mp3/);
});

test('exam textarea accepts typing before audio completion', async ({ page }) => {
  await page.getByRole('button', { name: '考核' }).click();
  await page.locator('#examInput').fill('This lecture discusses a scientific experiment.');
  await expect(page.locator('#examInput')).toHaveValue('This lecture discusses a scientific experiment.');
});

test('SST key sentence dictation can be typed and checked', async ({ page }) => {
  await page.getByRole('button', { name: '听写' }).click();
  await expect(page.locator('.dictation-line')).toHaveCount(5);
  await page.locator('.dictation-line').first().fill('Biology uses DNA and RNA to store genetic information.');
  await expect(page.locator('#dictationWordCount')).toContainText('words');
  await page.locator('#dictationSubmit').click();
  await expect(page.locator('#dictationResult')).toContainText('关键短语覆盖');
});

test('SST has only one transcript and shows paragraph bilingual layout', async ({page}) => {
  await page.getByRole('button',{name:'学习'}).click();
  await expect(page.locator('#fireflyPanel')).toHaveCount(0);
  await expect(page.locator('#transcriptContents .sst-reading-paragraph')).toHaveCount(4);
  await expect(page.locator('#transcriptContents .sst-reading-en').first()).toContainText('Now, the study of biology');
  await expect(page.locator('#transcriptContents .sst-reading-zh').first()).not.toBeEmpty();
  await expect(page.locator('#sstAudio')).toHaveAttribute('src',/BiologyDNAandRNA\.mp3/);
});

test('article vocabulary is sourced per SST topic, separated into words and phrases', async ({page}) => {
  await page.getByRole('button', {name:'学习'}).click();
  await expect(page.locator('#articleVocabMeta')).toContainText('单词');
  await expect(page.locator('#articleVocabItems')).toContainText('molecule');
  await expect(page.locator('#articleVocabItems')).not.toContainText('regimen');
  await page.locator('#articleVocabTabs button[data-article-type="phrase"]').click();
  await expect(page.locator('#articleVocabItems')).toContainText('storing and transmitting');
  await expect(page.locator('#articleVocabItems')).not.toContainText('molecule');
});

test('word meaning reveal, known flag and persistence across reloads', async ({page}) => {
  await page.getByRole('button', {name:'学习'}).click();
  const molecule=page.locator('#articleVocabItems [data-item="word:molecule"]');
  await molecule.locator('summary').click();
  await expect(molecule).toContainText('分子');
  await molecule.getByRole('button',{name:'记住了'}).click();
  await expect(molecule).toContainText('记住了');
  await page.reload();
  await page.getByRole('button',{name:'学习'}).click();
  await expect(page.locator('#articleVocabItems [data-item="word:molecule"]')).toContainText('记住了');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('pte-sst-vocab-v1'))['word:molecule'])).toBe('known');
});

test('global vocabulary mode supports flashcard, type filter and pending status', async ({page}) => {
  await page.getByRole('button',{name:'词汇'}).click();
  await expect(page.locator('#vocabProgress')).toContainText('9 不会');
  await expect(page.locator('#vocabDeckCount')).toContainText('198 条');
  await page.locator('#vocabType').selectOption('word');
  await expect(page.locator('#vocabDeckCount')).toContainText('139 条');
  await page.locator('#vocabStatusFilter').selectOption('unknown');
  await expect(page.locator('#vocabDeckCount')).toContainText('9 条');
  await expect(page.locator('#vocabCard')).toContainText('equatorial');
  await page.locator('#vocabCard #vocabReveal').click();
  await expect(page.locator('#vocabCard')).toContainText('赤道的');
  await page.locator('#vocabCard [data-vocab-grade="known"]').click();
  await expect(page.locator('#vocabDeckCount')).toContainText('8 条');
  await expect(page.locator('#vocabProgress')).toContainText('1 / 198 已掌握');
  await page.reload();
  await page.getByRole('button',{name:'词汇'}).click();
  await expect(page.locator('#vocabProgress')).toContainText('1 / 198 已掌握');
});

test('phrase and current-lecture filtering plus source search work', async ({page}) => {
  await page.getByRole('button',{name:'学习'}).click();
  await page.getByRole('button',{name:'词汇'}).click();
  await page.locator('#vocabType').selectOption('phrase');
  await expect(page.locator('#vocabDeckCount')).toContainText('59 条');
  await page.locator('#vocabScope').selectOption('current');
  await expect(page.locator('#vocabCard')).toContainText('genetic and inherited information');
  await page.locator('#vocabSearch').fill('storing and transmitting');
  await expect(page.locator('#vocabDeckCount')).toContainText('1 条');
  await expect(page.locator('#vocabCard')).toContainText('storing and transmitting');
  await page.locator('#vocabScope').selectOption('all');
  await page.locator('#vocabSearch').fill('S050');
  await expect(page.locator('#vocabDeckCount')).toContainText('条');
  await expect(page.locator('#vocabCard')).not.toContainText('storing and transmitting');
});

test('missing Firefly article has no invented vocabulary entry', async ({page}) => {
  await page.getByRole('button',{name:'学习'}).click();
  await page.locator('#levelList [data-id="S030"]').evaluate(button => button.click());
  await expect(page.locator('#articleVocabMeta')).toContainText('0 个单词');
  await expect(page.locator('#articleVocabItems')).toContainText('没有收录');
  await page.getByRole('button',{name:'词汇'}).click();
  await page.locator('#vocabScope').selectOption('current');
  await expect(page.locator('#vocabDeckCount')).toContainText('0 条');
});
