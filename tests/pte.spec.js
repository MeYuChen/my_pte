const { test, expect } = require("@playwright/test");

async function openFresh(page) {
  await page.goto("./index.html");
  await page.evaluate(() => {
    localStorage.removeItem("pte-we-v2-state");
    localStorage.removeItem("pte-we-sidebar-collapsed");
    localStorage.removeItem("pte-we-calendar-collapsed");
  });
  await page.reload();
}

test.describe("desktop flows", () => {
  test.skip(({ isMobile }) => isMobile, "desktop-only behavior");

  test("desktop floating calendar highlights today and can collapse", async ({ page }) => {
    await openFresh(page);

    const today = await page.evaluate(() => ({
      day: new Date().getDate(),
      monthTitle: `${new Date().getFullYear()}年${new Date().getMonth() + 1}月`
    }));
    const calendar = page.locator("#studyCalendar");

    await expect(calendar).toBeVisible();
    await expect(page.locator("#calendarTodayButton")).toHaveText(today.monthTitle);
    await expect(page.locator(".study-calendar-day.is-today")).toHaveText(String(today.day));

    await page.locator("#calendarToggleButton").click();
    await expect(calendar).toHaveClass(/is-collapsed/);
    await expect(page.locator("#calendarBody")).toBeHidden();

    await page.reload();
    await expect(calendar).toHaveClass(/is-collapsed/);
  });

  test("desktop pet tracks study goals from real actions", async ({ page }) => {
    await openFresh(page);

    await expect(page.locator("#studyPet")).toBeVisible();
    await expect(page.locator("#studyPetAvatar")).toBeVisible();
    await expect(page.locator("#studyPetAvatar")).toHaveJSProperty("naturalWidth", 791);
    await expect(page.locator("#studyPetStatus")).toHaveText("粮食 0/30");

    await page.locator("#studyPetAvatar").click();
    await expect(page.locator("#studyPetPanel")).toBeVisible();
    await expect(page.locator("#studyPetGoals")).toContainText("刷卡");
    await expect(page.locator("#studyPetGoals")).toContainText("0 / 30");

    await page.getByRole("button", { name: "刷卡" }).click();
    await page.getByRole("button", { name: "显示答案" }).click();
    await page.getByRole("button", { name: "记住了" }).click();

    await expect(page.locator("#studyPetStatus")).toHaveText("粮食 3/30");
    await expect(page.locator("#studyPetGoals")).toContainText("1 / 30");
  });

  test("desktop drill list click jumps to the selected article", async ({ page }, testInfo) => {
    await openFresh(page);

    await page.getByRole("button", { name: "刷卡" }).click();
    await page.getByRole("button", { name: /#24 Information Revolution/ }).click();

    await expect(page.locator("#drillCardTitle")).toHaveText("#24 Information Revolution");
    await expect(page.locator("#drillProgressText")).toHaveText("16 / 195");
    await expect(page.locator(".level-item.is-active .level-item-title")).toHaveText("#24 Information Revolution");
  });
});

test.describe("mobile flows", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile-only behavior");

  test("mobile hides the floating calendar", async ({ page }) => {
    await openFresh(page);

    await expect(page.locator("#studyCalendar")).toBeHidden();
  });

  test("mobile catalog filters by category and starts from a selected article", async ({ page }, testInfo) => {
    await openFresh(page);

    await page.getByRole("button", { name: "刷卡" }).click();
    await page.getByRole("button", { name: "目录" }).click();
    await expect(page.locator("#catalogPanel")).toBeVisible();
    await expect(page.locator(".catalog-item")).toHaveCount(39);

    await page.locator('.catalog-filter-button[data-memory-filter="education"]').click();
    await expect(page.locator(".catalog-filter-button.is-active")).toHaveText("教育学习");
    await expect(page.locator(".catalog-item")).toHaveCount(10);
    await expect(page.locator(".catalog-item").first().locator("strong")).toHaveText("#17 Formal Written Examination");
    await expect(page.locator("#drillCardTitle")).toHaveText("#17 Formal Written Examination");

    await page.locator(".catalog-item").nth(2).click();
    await expect(page.locator("#catalogPanel")).toBeHidden();
    await expect(page.locator("#drillCardTitle")).toHaveText("#63 Mark Deduction");
    await expect(page.locator("#drillProgressText")).toHaveText("11 / 50");
  });
});

test.describe("shared flows", () => {
  test("drill source card shows highlighted original text", async ({ page }) => {
    await openFresh(page);

    await page.getByRole("button", { name: "刷卡" }).click();
    for (let i = 0; i < 4; i += 1) {
      await page.getByRole("button", { name: "跳过" }).click();
    }
    await expect(page.locator("#drillCardType")).toHaveText("原文背诵");
    await page.getByRole("button", { name: "显示答案" }).click();

    await expect(page.locator(".drill-source-body .article-source-paragraph")).toHaveCount(4);
    await expect(page.locator(".drill-source-body .core-sentence-highlight").first()).toContainText(
      "whether governments should improve public transport"
    );
  });

  test("template timer can be customized and persisted", async ({ page }) => {
    await openFresh(page);

    await expect(page.locator("#templateTimerInput")).toHaveValue("5");
    await expect(page.locator("#timerDisplay")).toHaveText("05:00");
    await expect(page.locator("#startTimerButton")).toHaveText("开始 5 分钟");

    await page.locator("#templateTimerInput").fill("7");
    await page.locator("#templateTimerInput").blur();
    await expect(page.locator("#timerDisplay")).toHaveText("07:00");
    await expect(page.locator("#startTimerButton")).toHaveText("开始 7 分钟");

    await page.getByRole("button", { name: "开始 7 分钟" }).click();
    await expect(page.locator("#templateTimerInput")).toBeDisabled();
    await expect(page.locator("#startTimerButton")).toHaveText(/0[67]:\d{2}/);

    await page.reload();
    await expect(page.locator("#templateTimerInput")).toHaveValue("7");
    await expect(page.locator("#startTimerButton")).toHaveText("开始 7 分钟");
  });

  test("incomplete saved learning state is normalized", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("pte-we-v2-state", JSON.stringify({
        settings: { templateTimerMinutes: 6 }
      }));
      localStorage.removeItem("pte-we-sidebar-collapsed");
    });
    await page.goto("./index.html");

    await expect(page.getByRole("button", { name: "模板" })).toBeVisible();
    await expect(page.locator("#progressSummary")).toContainText("/ 39 已掌握");
    await expect(page.locator("#templateTimerInput")).toHaveValue("6");
    await page.getByRole("button", { name: "刷卡" }).click();
    await expect(page.locator("#drillCardTitle")).toHaveText("#5 Transportation Networks");
  });
});
