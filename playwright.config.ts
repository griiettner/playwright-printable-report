import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: 'src/steps',
  fullyParallel: true,
  reporter: [
    ['line'],
    ['html', { open: 'never', outputFolder: 'reports/playwright' }],
    ['json', { outputFile: 'reports/playwright.json' }],
    ['./src/resources/utils/report-generator.ts', { outputFile: 'reports/bdd/index.html' }],
  ],
  timeout: 60000,
  workers: 1,
  retries: 0,
  use: {
    navigationTimeout: 60000,
    actionTimeout: 45000,
    screenshot: "on",
    trace: "on",
    headless: true,
    video: "retain-on-failure",
    baseURL: ""
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      fullyParallel: true
    }
  ],
  testMatch: [
    '**/*.spec.ts',
    '**/*.steps.ts',
  ],
  outputDir: 'reports/results'
});
