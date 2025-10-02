import { Locator } from '@playwright/test';
import { type Pages, And } from '../../fixtures'

interface AppValidator {
  name: string;
  helper?: string;
  error?: string;
  parent: Locator;
  required?: boolean;
}

export async function appValidator(
  fx: Pages,
  {
    name,
    helper,
    error,
    parent,
  }: AppValidator) {
  
  if (!helper || !error) return; 

  const element = parent.locator('app-validator');

  const helperEl = element.locator(error ? 'app-error .text-error' : 'app-hint > span');
  await And(`the user assert the ${name} ${error ? 'error' : 'helper'} text is visible`, async () => {
    await fx.commonPage.elementVisible(helperEl);
  });
  await And(`the user assert the ${name} ${error ? 'error' : 'helper'} text reads ${helper}`, async () => {
    await fx.commonPage.assertTextCopy(helperEl, error || helper);
  });
}
