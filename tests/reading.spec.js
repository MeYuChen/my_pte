const { test, expect } = require("@playwright/test");

test.describe("Reading module", () => {
  test.skip(({ isMobile }) => isMobile, "desktop Reading acceptance flow");

  test("opens from WE home and traces wrong blanks to knowledge points", async ({ page }) => {
    await page.goto("./index.html");
    await page.getByRole("link", { name: "Reading 考点训练" }).click();

    await expect(page).toHaveURL(/reading\.html/);
    await expect(page.locator(".point-item")).toHaveCount(44);
    await expect(page.locator("#dataSummary")).toContainText("54 题 · 295 空");
    const guideCoverage = await page.evaluate(() => ({
      total: window.READING_DATA.methods.length,
      withRule: window.READING_DATA.methods.filter((method) => method.memory_rule).length
    }));
    expect(guideCoverage).toEqual({ total: 44, withRule: 44 });

    await page.getByRole("button", { name: "技巧", exact: true }).click();
    await expect(page.locator(".memory-rule-card")).toContainText("先砍词性，再锁搭配，再对句意");
    await expect(page.locator("#tipsPanel")).not.toContainText("给定答案不自动等于唯一答案");

    await page.getByRole("button", { name: "练习", exact: true }).click();
    await page.getByRole("button", { name: "开始本题" }).click();
    await expect(page.locator("#submitQuestion")).toBeEnabled();
    await page.locator("#submitQuestion").click();

    await expect(page.locator("#resultPanel")).toBeVisible();
    await expect(page.locator(".wrong-card").first()).toContainText("决定性考点");
    await expect(page.locator("#scoreStrip")).toContainText("答错");
    await page.locator("#questionTitle").click();
    await expect(page.locator("#resultPanel")).toBeVisible();
  });

  test("grades a complete RW question and stores its session", async ({ page }) => {
    await page.goto("./reading.html");
    await page.evaluate(() => localStorage.removeItem("pte-reading-progress-v1"));
    await page.reload();

    await page.getByRole("button", { name: "练习", exact: true }).click();
    await page.getByRole("button", { name: "开始本题" }).click();
    const answers = await page.evaluate(() => {
      const question = window.READING_DATA.questions.find((item) =>
        window.ReadingCore.questionMatchesPoint(item, location.hash.slice(1))
      );
      return question.answers;
    });
    const selects = page.locator("#passageCard select");
    await expect(selects).toHaveCount(answers.length);
    for (let index = 0; index < answers.length; index += 1) {
      await selects.nth(index).selectOption({ label: answers[index] });
    }
    await page.locator("#submitQuestion").click();

    await expect(page.locator("#resultTitle")).toHaveText("全部答对");
    await expect(page.locator("#scoreStrip")).toContainText("0");
    const sessions = await page.evaluate(() => JSON.parse(localStorage.getItem("pte-reading-progress-v1")).sessions);
    expect(sessions).toHaveLength(1);
    expect(sessions[0].correct).toBe(sessions[0].total);
  });

  test("wrong-answer review explains the decisive clue instead of repeating audit boilerplate", async ({ page }) => {
    await page.goto("./reading.html#S02");
    await page.getByRole("button", { name: "练习", exact: true }).click();
    await page.getByRole("button", { name: "开始本题" }).click();
    const answers = await page.evaluate(() => window.READING_DATA.questions.find((item) => item.source === "RW539").answers);
    const wrongAnswers = { 1: "has been", 5: "forbidden", 6: "improved" };
    const selects = page.locator("#passageCard select");
    for (let index = 0; index < answers.length; index += 1) {
      await selects.nth(index).selectOption({ label: wrongAnswers[index] || answers[index] });
    }
    await page.locator("#submitQuestion").click();

    await expect(page.locator(".wrong-card")).toHaveCount(3);
    const review = page.locator("#wrongPoints");
    await expect(review).toContainText("although 表示转折");
    await expect(review).toContainText("规则禁止统一原则");
    await expect(review).toContainText("false wit、puns、ambiguity");
    await expect(review).not.toContainText("逐项比较");
    await expect(review).toContainText("决定性考点 D04");
    await expect(review).toContainText("决定性考点 S01");
    await expect(review).toContainText("决定性考点 S03");
    expect(await page.locator(".point-item.is-related").count()).toBeGreaterThan(2);

    const firstPoint = page.locator("[data-review-point]").first();
    await firstPoint.click();
    await expect(page.locator(".wrong-card").first().locator(".point-preview")).toBeVisible();
    await expect(page.locator(".wrong-card").first().locator(".point-preview")).toContainText("核心：");
    await page.locator(".wrong-card").first().getByRole("button", { name: "进入完整考点" }).click();
    await expect(page.locator("#methodPanel")).toBeVisible();
    await expect(page).toHaveURL(/#D04$/);
    await expect(page.locator("#returnReviewBar")).toBeVisible();
    expect(await page.locator(".point-item.is-related").count()).toBeGreaterThan(2);

    await page.getByRole("button", { name: "← 返回本题解析" }).click();
    await expect(page.locator("#practicePanel")).toBeVisible();
    await expect(page.locator("#resultPanel")).toBeVisible();
    await expect(page.locator(".wrong-card")).toHaveCount(3);
    await expect(page).toHaveURL(/#S02$/);
  });

  test("R questions use an answer pool instead of text entry", async ({ page }) => {
    await page.goto("./reading.html");
    const target = await page.evaluate(() => {
      for (const method of window.READING_DATA.methods) {
        const first = window.READING_DATA.questions.find((question) =>
          window.ReadingCore.questionMatchesPoint(question, method.id)
        );
        if (first && first.type === "R") return { pointId: method.id, answers: first.answers };
      }
      return null;
    });
    expect(target).not.toBeNull();

    await page.goto(`./reading.html#${target.pointId}`);
    await page.getByRole("button", { name: "练习", exact: true }).click();
    await page.getByRole("button", { name: "开始本题" }).click();

    await expect(page.locator("#questionMeta")).toContainText("本题答案池选择");
    await expect(page.locator("#passageCard input")).toHaveCount(0);
    await expect(page.locator("#passageCard select")).toHaveCount(target.answers.length);
  });
});
