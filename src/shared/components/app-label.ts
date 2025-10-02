import { Locator } from '@playwright/test';
import { type Pages, And } from '../../fixtures';

interface AppLabel {
  name: string;
  label?: string;
  parent: Locator;
  required?: boolean;
}

export async function appLabel(
  fx: Pages,
  {
    name,
    label,
    parent,
    required = false
  }: AppLabel) {

  if (!label) return;

  const element = parent.locator('app-label');
  await And(`the user assert the ${name} label is visible`, async () => {
    await fx.commonPage.elementVisible(element);
  });
  await And(`the user assert the ${name} label reads ${label}`, async () => {
    await fx.commonPage.assertTextCopy(element, label);
  });

  await And(`the user assert the ${name} field is ${required ? 'required' : 'optional'}`, async () => {
    const elHelper = element.locator(required ? 'required-text' : 'optional-field');
    await fx.commonPage.elementVisible(elHelper);
    await fx.commonPage.assertTextCopy(elHelper, required ? '*' : '(optionnal)');
  });
}
