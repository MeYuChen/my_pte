const { test, expect } = require("@playwright/test");

test.describe("Reading module", () => {
  test.skip(({ isMobile }) => isMobile, "desktop Reading acceptance flow");

  test("opens from WE home and traces wrong blanks to knowledge points", async ({ page }) => {
    await page.goto("./index.html");
    await page.getByRole("link", { name: "Reading 考点训练" }).click();

    await expect(page).toHaveURL(/reading\.html/);
    await expect(page.locator(".point-item")).toHaveCount(44);
    await expect(page.locator("#dataSummary")).toContainText("54 题 · 295 空");

    await page.getByRole("button", { name: "练习", exact: true }).click();
    await page.getByRole("button", { name: "开始本题" }).click();
    await expect(page.locator("#submitQuestion")).toBeEnabled();
    await page.locator("#submitQuestion").click();

    await expect(page.locator("#resultDialog")).toBeVisible();
    await expect(page.locator(".wrong-card").first()).toContainText("主考点");
    await expect(page.locator("#scoreStrip")).toContainText("答错");
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
