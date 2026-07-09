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

  test("desktop pet dashboard shows calendar, exam countdown and editable goals", async ({ page }) => {
    await openFresh(page);

    const today = await page.evaluate(() => ({
      day: new Date().getDate(),
      monthTitle: `${new Date().getFullYear()}年${new Date().getMonth() + 1}月`
    }));

    await page.locator("#studyPetAvatar").click();
    await expect(page.locator("#studyPetPanel")).toBeVisible();
    await expect(page.locator("#calendarTodayButton")).toHaveText(today.monthTitle);
    await expect(page.locator(".study-pet-calendar-day.is-today")).toContainText(String(today.day));
    await expect(page.locator("#selectedStudyDateLabel")).toHaveText("今天");
    await expect(page.locator("#examCountdownCard")).toContainText("未设置");

    await page.getByText("目标与考试设置").click();
    await page.locator("#examDateInput").fill("2026-07-20");
    await page.locator("#examDateInput").blur();
    await expect(page.locator("#examCountdownCard")).toContainText("2026-07-20");

    await page.locator("#dailyGoalCardsInput").fill("12");
    await page.locator("#dailyGoalCardsInput").blur();
    await expect(page.locator("#studyPetGoals")).toContainText("0 / 12");
  });

  test("desktop pet tracks study goals from real actions", async ({ page }) => {
    await openFresh(page);

    await expect(page.locator("#studyPet")).toBeVisible();
    await expect(page.locator("#studyPetAvatar")).toBeVisible();
    await expect(page.locator("#studyPetAvatar")).toHaveJSProperty("naturalWidth", 791);
    await expect(page.locator("#studyPetStatus")).toHaveText("粮食 0 · 目标 0/4");

    await page.locator("#studyPetAvatar").click();
    await expect(page.locator("#studyPetPanel")).toBeVisible();
    await expect(page.locator("#studyPetGoals")).toContainText("刷卡");
    await expect(page.locator("#studyPetGoals")).toContainText("0 / 30");

    await page.getByRole("button", { name: "刷卡" }).click();
    await page.getByRole("button", { name: "显示答案" }).click();
    await page.getByRole("button", { name: "记住了" }).click();

    await expect(page.locator("#studyPetStatus")).toHaveText("粮食 3 · 目标 0/4");
    await expect(page.locator("#studyPetGoals")).toContainText("1 / 30");
  });

  test("desktop pet drag does not open the image asset", async ({ page }) => {
    await openFresh(page);

    const avatar = page.locator("#studyPetAvatar");
    const box = await avatar.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(page.viewportSize().width + 500, box.y + box.height / 2, { steps: 8 });
    await page.mouse.up();

    await expect(page).toHaveURL(/index\.html$/);
    const petBox = await page.locator("#studyPet").boundingBox();
    expect(petBox.x + petBox.width).toBeLessThanOrEqual(page.viewportSize().width + 1);
  });

  test("desktop drill list click jumps to the selected article", async ({ page }, testInfo) => {
    await openFresh(page);

    await page.getByRole("button", { name: "刷卡" }).click();
    await page.getByRole("button", { name: /#24 Information Revolution/ }).click();

    await expect(page.locator("#drillCardTitle")).toHaveText("#24 Information Revolution");
    await expect(page.locator("#drillProgressText")).toHaveText("16 / 195");
    await expect(page.locator(".level-item.is-active .level-item-title")).toHaveText("#24 Information Revolution");
  });

  test("desktop WFD imports, checks and persists local progress", async ({ page }) => {
    await openFresh(page);

    await page.getByRole("button", { name: "WFD" }).click();
    await expect(page.locator("#wfdSummary")).toContainText("189 句候选高频");
    await expect(page.locator(".level-item")).toHaveCount(189);

    await page.locator("#wfdImportText").fill("The custom practice sentence belongs only to this local test.");
    await page.locator("#wfdImportAppendButton").click();
    await expect(page.locator("#wfdSummary")).toContainText("190 句候选高频");
    await expect(page.locator(".level-item")).toHaveCount(190);

    await page.locator(".level-item").last().click();
    await page.locator("#wfdInput").fill("The custom practice sentence belongs only to this local test.");
    await page.locator("#wfdCheckButton").click();
    await expect(page.locator("#wfdResult")).toContainText("通过");
    await expect(page.locator("#studyPetStatus")).toHaveText("粮食 4 · 目标 1/4");

    await page.reload();
    await page.getByRole("button", { name: "WFD" }).click();
    await expect(page.locator("#wfdSummary")).toContainText("190 句候选高频");
    await page.locator(".level-item").last().click();
    await expect(page.locator(".level-item.is-active .level-item-meta")).toContainText("练过 1 次");
  });

  test("desktop exam accepts four paragraphs separated by single line breaks", async ({ page }) => {
    await openFresh(page);

    const essay = await page.evaluate(() => window.WE_DATA.articles[0].paragraphs.join("\n"));
    await page.getByRole("button", { name: "考核" }).click();
    await page.locator("#examInput").fill(essay);
    await page.locator("#submitExamButton").click();

    await expect(page.locator("#examResult")).toContainText("满分通过");
    await expect(page.locator("#examResult")).not.toContainText("段落不匹配");
  });

  test("desktop exam diff makes extra spaces visible", async ({ page }) => {
    await openFresh(page);

    const essay = await page.evaluate(() => (
      window.WE_DATA.articles[0].paragraphs.join("\n").replace("The issue", "The  issue")
    ));
    await page.getByRole("button", { name: "考核" }).click();
    await page.locator("#examInput").fill(essay);
    await page.locator("#submitExamButton").click();

    await expect(page.locator("#examResult")).toContainText("空格×2");
  });
});

test.describe("mobile flows", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile-only behavior");

  test("mobile catalog filters by category and starts from a selected article", async ({ page }, testInfo) => {
    await openFresh(page);

    await page.getByRole("button", { name: "刷卡" }).click();
    await page.getByRole("button", { name: "目录" }).click();
    await expect(page.locator("#catalogPanel")).toBeVisible();
    const articleCount = await page.evaluate(() => window.WE_DATA.articles.length);
    await expect(page.locator(".catalog-item")).toHaveCount(articleCount);

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

    const articleCount = await page.evaluate(() => window.WE_DATA.articles.length);
    await expect(page.getByRole("button", { name: "模板" })).toBeVisible();
    await expect(page.locator("#progressSummary")).toContainText(`/ ${articleCount} 已掌握`);
    await expect(page.locator("#templateTimerInput")).toHaveValue("6");
    await page.getByRole("button", { name: "刷卡" }).click();
    await expect(page.locator("#drillCardTitle")).toHaveText("#5 Transportation Networks");
  });
});
