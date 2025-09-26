import { Feature, Given, Scenario, Then, And, expect, StepAction } from '../fixtures';

Feature('Apple Test', ['apple'], async (fx) => {
  await Scenario('Performa apple seach', async () => {
    await Given('The user visits apple.com', async() => {
      await fx.page.goto('https://www.apple.com');
    });

    await StepAction(`1: Visit Home`, async () => {
      await Then('the user verify the logo is visible', async () => {
        await expect(fx.page.getByLabel('Apple', { exact: true })).toBeVisible();
      });
      
      await And('the user verify the store link visible', async () => {
        await expect(fx.page.getByLabel('Store', { exact: true })).toBeVisible();
      });
    });

    await StepAction(`2: Visit Store`, async () => {
      await Then(`the user clicks the store link`, async () => {
        await fx.page.getByLabel('Store', { exact: true }).click();
      });
      
      await And(`on the next page the user see if slogan is correct`, async () => {
        await expect(fx.page.getByText('Store. The best way to buy')).toBeVisible();
        await expect(fx.page.getByRole('main')).toContainText('The best way to buy the products you love.');
      });
    });
  })
});