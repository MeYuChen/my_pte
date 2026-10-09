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

  test("pet is removed while existing practice modes remain available", async ({ page }) => {
    await openFresh(page);
    await expect(page.locator("#studyPet")).toHaveCount(0);
    await page.getByRole("button", { name: "速记", exact: true }).click();
    await expect(page.locator(".memory-filter-button")).toHaveCount(8);
    await page.locator('.memory-filter-button[data-memory-filter="education"]').click();
    await expect(page.locator("#levelList .level-item")).toHaveCount(7);
    await expect(page.locator("#learningPathHook")).toContainText("笔试能公平测基础知识");
    await expect(page.locator("#learningRouteList")).toHaveText("笔试能公平测基础知识，但测不了创造力、合作和实践能力；所以保留笔试，但不能只靠笔试。");
    await expect(page.locator("#learningRouteList li")).toHaveCount(0);
    await expect(page.locator("#levelImage")).toHaveAttribute("src", /017_Formal_Written_Examination_memory_card/);
  });

  test("desktop drill list click jumps to the selected article", async ({ page }, testInfo) => {
    await openFresh(page);

    await page.getByRole("button", { name: "刷卡" }).click();
    await page.getByRole("button", { name: /#24 Information Revolution/ }).click();

    await expect(page.locator("#drillCardTitle")).toHaveText("#24 Information Revolution");
    await expect(page.locator("#drillProgressText")).toHaveText("16 / 200");
    await expect(page.locator(".level-item.is-active .level-item-title")).toHaveText("#24 Information Revolution");
  });

  test("extra Mass Media and Society card uses the supplied mnemonic image", async ({ page }) => {
    await openFresh(page);
    await page.getByRole("button", { name: "速记", exact: true }).click();
    await page.locator('.memory-filter-button[data-memory-filter="technology"]').click();
    await page.getByRole("button", { name: /#101010 Mass Media and Society/ }).click();
    await expect(page.locator("#levelImage")).toHaveAttribute("src", /101010_Mass_Media_and_Society_memory_card\.jpg\?v=20261009-9/);
  });

  test("Mass Media and Society article mode shows the supplied path and card", async ({ page }) => {
    await openFresh(page);
    await page.getByRole("button", { name: "文章论点", exact: true }).click();
    await page.getByRole("button", { name: /#101010 Mass Media and Society/ }).click();
    await expect(page.locator("#learningPathPanel")).toBeVisible();
    await expect(page.locator("#learningPathHook")).toContainText("引导社会舆论");
    await expect(page.locator("#levelImage")).toHaveAttribute("src", /101010_Mass_Media_and_Society_memory_card\.jpg\?v=20261009-9/);
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
    await expect(page.locator(".catalog-filter-button.is-active")).toHaveText("教育 · 学习 · 考试");
    await expect(page.locator(".catalog-item")).toHaveCount(7);
    await expect(page.locator(".catalog-item").first().locator("strong")).toHaveText("#17 Formal Written Examination");
    await expect(page.locator("#drillCardTitle")).toHaveText("#17 Formal Written Examination");

    await page.locator(".catalog-item").nth(2).click();
    await expect(page.locator("#catalogPanel")).toBeHidden();
    await expect(page.locator("#drillCardTitle")).toHaveText("#63 Mark Deduction");
    await expect(page.locator("#drillProgressText")).toHaveText("11 / 35");
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

  test("article translation is hidden by default and can be toggled", async ({ page }) => {
    await openFresh(page);

    await page.getByRole("button", { name: "文章论点" }).click();
    await expect(page.locator("#articleSourcePanel")).toBeVisible();
    await expect(page.locator(".article-source-row.zh-row")).toHaveCount(0);

    await page.getByRole("button", { name: "显示中文" }).click();
    await expect(page.locator(".article-source-row.zh-row").first()).toBeVisible();
    await expect(page.locator(".article-source-row.zh-row").first()).toContainText("政府是否应该改善公共交通，而不是为私家车修建更多道路");

    await page.getByRole("button", { name: "隐藏中文" }).click();
    await expect(page.locator(".article-source-row.zh-row")).toHaveCount(0);
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

