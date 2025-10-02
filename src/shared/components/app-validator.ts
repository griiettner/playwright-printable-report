import { Locator } from '@playwright/test';
import { type Pages, And } from '../../fixtures'

/**
 * Interface for app validator component parameters
 */
interface AppValidator {
  /** The name identifier for the validator field */
  name: string;
  /** Optional helper text for the field */
  helper?: string;
  /** Optional error text for validation failures */
  error?: string;
  /** The parent locator containing the validator element */
  parent: Locator;
  /** Whether the field is required (defaults to false) */
  required?: boolean;
}

/**
 * Tests and validates helper/error text for form fields
 * @param fx - The page fixtures object containing test utilities and common page methods
 * @param params - Configuration object containing:
 *   - `name`: Identifier for the validator field used in test assertions and logging
 *   - `helper`: Helper text to display when field is valid (optional)
 *   - `error`: Error text to display when validation fails (optional)
 *   - `parent`: Playwright Locator for the parent element containing the validator
 *   - `required`: Whether field is required (defaults to false, for interface completeness)
 * @remarks
 * The function requires both `helper` and `error` to be provided, otherwise it returns early.
 * It will test whichever text is appropriate based on the current field state.
 * @example
 * ```typescript
 * // Basic validator with both helper and error text
 * await appValidator(fx, {
 *   name: 'email',
 *   helper: 'Enter a valid email address',
 *   error: 'Please enter a valid email address',
 *   parent: page.locator('.form-container')
 * });
 *
 * // Validator will return early if helper or error is missing
 * await appValidator(fx, {
 *   name: 'username',
 *   helper: 'Choose a username', // Missing error text - function returns early
 *   parent: page.locator('.form-container')
 * });
 * ```
 */
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
