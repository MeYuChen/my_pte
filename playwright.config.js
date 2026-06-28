const { defineConfig, devices } = require("@playwright/test");
const { pathToFileURL } = require("node:url");

const chromeExecutablePath = process.env.PLAYWRIGHT_CHROME_EXECUTABLE || "/usr/bin/google-chrome";
const baseURL = pathToFileURL(`${__dirname}/`).href;

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    launchOptions: {
      executablePath: chromeExecutablePath,
      args: ["--no-sandbox", "--disable-dev-shm-usage"]
    }
  },
  projects: [
    {
      name: "desktop",
      use: {
        browserName: "chromium",
        viewport: { width: 1280, height: 900 }
      }
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 12"],
        browserName: "chromium",
        launchOptions: {
          executablePath: chromeExecutablePath,
          args: ["--no-sandbox", "--disable-dev-shm-usage"]
        }
      }
    }
  ]
});
