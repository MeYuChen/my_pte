const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto("./sst.html");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("shows 54 verified SST items and WE-style modes", async ({ page }) => {
  await expect(page.locator("#progressSummary")).toContainText("0 / 54");
  await expect(page.locator("#levelList .level-item")).toHaveCount(54);
  await expect(page.locator("#levelList .level-item").nth(50)).toContainText("Machines Increase Unemployment");
  await expect(page.locator("#levelList .level-item").last()).toContainText("Modern Poetry Course");
  await expect(page.getByRole("button", { name: "模板" })).toHaveClass(/is-active/);
  await expect(page.getByText("听主题 → 抓名词关系 → 拼成 50–70 词")).toBeVisible();
});

test("learn and drill retain logic keywords and final answer", async ({ page }) => {
  await page.getByRole("button", { name: "学习" }).click();
  await expect(page.locator("#logicText")).not.toBeEmpty();
  await expect(page.locator("#keywordList span").first()).toBeVisible();
  await page.getByRole("button", { name: "速记" }).click();
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
