import { expect, type Pages, Then, And } from '../../fixtures'
import { appInput } from './app-input';
import { appLabel } from './app-label';
import { appValidator } from './app-validator';

interface AppDynamicFieldTextParams {
  name: string;
  label?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  identifier: string;
  required?: boolean;
}

export async function appDynamicFieldText(
  fx: Pages,
  {
    name,
    label,
    placeholder,
    helper,
    error,
    identifier,
    required = false
  }: AppDynamicFieldTextParams) {

  const root = fx.page.locator('app-dynamic-field-text', { has: fx.page.locator(identifier) });
  await Then(`the user assert the ${name} field is visible`, async () => {
    await fx.commonPage.elementVisible(root, 'dynamic field root not found');
  });

  await appLabel(fx, { label, name, parent: root, required });

  await appInput(fx, { name, parent: root, placeholder });

  await appValidator(fx, { name, helper, error, parent: root });
}
