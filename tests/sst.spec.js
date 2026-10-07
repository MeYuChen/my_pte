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
  expect(images).toHaveLength(54);
});

test("shows 54 verified SST items and WE-style modes", async ({ page }) => {
  await expect(page.locator("#progressSummary")).toContainText("0 / 54");
  await expect(page.locator("#levelList .level-item")).toHaveCount(54);
  await expect(page.locator("#levelList [data-id=\"S051\"]")).toContainText("Machines Increase Unemployment");
  await expect(page.locator("#levelList [data-id=\"S054\"]")).toContainText("Modern Poetry Course");
  await expect(page.getByRole("button", { name: "模板" })).toHaveClass(/is-active/);
  await expect(page.getByText("听主题 → 抓名词关系 → 拼成 50–70 词")).toBeVisible();
  await expect(page.locator("#categoryOverview .category-card")).toHaveCount(8);
});

test("filters the approved eight-category workbook structure", async ({ page }) => {
  await page.locator("#categoryOverview [data-category=\"C04\"]").click();
  await expect(page.locator("#levelList .level-item")).toHaveCount(10);
  await expect(page.locator("#levelList .category-heading")).toContainText("商业 · 经济 · 管理");
  await expect(page.locator("#levelList .level-item").first()).toContainText("Definition of Risk");
  await expect(page.locator("#levelList .level-item").last()).toContainText("Machines Increase Unemployment");
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
  await expect(page.locator("#progressSummary")).toContainText("1 / 54");
});

test("exam reports transparent checks and reference answer", async ({ page }) => {
  await page.getByRole("button", { name: "考核" }).click();
  await page.locator("#examInput").fill("Biology provides important information about DNA and RNA. All life forms use genetic information and cells as their fundamental building blocks. Living organisms also conduct metabolism and share similar basic chemistry. These common features show that creatures on the earth are closely connected, although they may look very different from one another in the natural world.");
  await expect(page.locator("#wordCount")).toContainText("words");
  await page.getByRole("button", { name: "提交检查" }).click();
  await expect(page.locator("#examResult")).toContainText("原词覆盖");
  await expect(page.locator("#examResult")).toContainText("不是官方分数");
  await expect(page.locator("#examResult")).toContainText("参考答案");
});
