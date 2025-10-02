import { Locator } from '@playwright/test';
import { expect, type Pages, And } from '../../fixtures'

/**
 * Interface for app input component parameters
 */
interface AppInput {
  /** The name identifier for the input field */
  name: string;
  /** Optional placeholder text for the input field */
  placeholder?: string;
  /** The parent locator containing the input element */
  parent: Locator;
}

/**
 * Tests and validates an input field component
 * @param fx - The page fixtures object containing test utilities and common page methods
 * @param params - Configuration object containing:
 *   - `name`: Identifier for the input field used in test assertions and logging
 *   - `placeholder`: Expected placeholder text to validate (optional)
 *   - `parent`: Playwright Locator for the parent element containing the input
 * @example
 * ```typescript
 * // Basic input validation
 * await appInput(fx, {
 *   name: 'username',
 *   parent: page.locator('.form-container')
 * });
 *
 * // Input with placeholder validation
 * await appInput(fx, {
 *   name: 'email',
 *   placeholder: 'Enter your email address',
 *   parent: page.locator('[data-testid="email-section"]')
 * });
 * ```
 */
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
