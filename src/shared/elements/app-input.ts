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
  /** Optional value to enter into the input field */
  newValue?: string;
  /** Optional expected current value to validate */
  expectedValue?: string;
}

/**
 * Tests and validates an input field component with optional value operations
 * @param fx - The page fixtures object containing test utilities and common page methods
 * @param params - Configuration object containing:
 *   - `name`: Identifier for the input field used in test assertions and logging
 *   - `placeholder`: Expected placeholder text to validate (optional)
 *   - `parent`: Playwright Locator for the parent element containing the input
 *   - `newValue`: Value to enter into the input field (optional)
 *   - `expectedValue`: Expected current value to validate (optional)
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
 *
 * // Enter a new value into the input
 * await appInput(fx, {
 *   name: 'username',
 *   newValue: 'john_doe',
 *   parent: page.locator('.form-container')
 * });
 *
 * // Validate existing value and enter new value
 * await appInput(fx, {
 *   name: 'email',
 *   expectedValue: 'old@example.com',
 *   newValue: 'new@example.com',
 *   parent: page.locator('[data-testid="email-section"]')
 * });
 * ```
 */
export async function appInput(
  fx: Pages,
  {
    name,
    placeholder,
    parent,
    newValue,
    expectedValue
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

  if (expectedValue) {
    await And(`the user assert the ${name} input value is ${expectedValue}`, async () => {
      await expect(element).toHaveValue(expectedValue);
    });
  }

  if (newValue) {
    await And(`the user enters ${newValue} into the ${name} input`, async () => {
      await element.fill(newValue);
    });

    // Validate the value was entered correctly
    await And(`the user assert the ${name} input value is now ${newValue}`, async () => {
      await expect(element).toHaveValue(newValue);
    });
  }
}
