import { Locator } from '@playwright/test';
import { expect, type Pages, And } from '../../fixtures'

interface AppInput {
  name: string;
  placeholder?: string;
  parent: Locator;
}

export async function appInput(
  fx: Pages,
  {
    name,
    placeholder,
    parent
  }: AppInput) {

  const element = parent.locator('input[type="text"]');
  await And(`the user assert the ${name} input is visible`, async () => {
    await fx.commonPage.elementVisible(element);
  });

  if (placeholder) {
    await And(`the user assert the ${name} input placeholder is visible and reads ${placeholder}`, async () => {
      await expect(element).toHaveAttribute('placeholder', placeholder);
    });
  }
}
