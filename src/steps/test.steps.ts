import { Feature, Given, Scenario, Then, And, expect } from '../fixtures';

Feature('Google Test', ['google'], async (fx) => {
  await Scenario('Performa google seach', async () => {
    await Given('The user visits google.com', async() => {
      await fx.page.goto('https://www.google.com');
    });

    await Then('the user verify the logo is visible', async () => {
      await expect(fx.page.getByRole('img', { name: 'Google' })).toBeVisible();
    });

    await And('the user verify the search box is visible', async () => {
      await expect(fx.page.getByRole('combobox', { name: 'Search' })).toBeVisible();
    });

    await Then(`user enters the word 'Playwright' to the search box and press enter`, async () => {
      await fx.page.getByRole('combobox', { name: 'Search' }).click();
      await fx.page.getByRole('combobox', { name: 'Search' }).fill('Playwright');
    });
  })
});