import { Locator } from '@playwright/test';
import { type Pages, And } from '../../fixtures';

/**
 * Interface for app label component parameters
 */
interface AppLabel {
  /** The name identifier for the label field */
  name: string;
  /** Optional label text to be displayed */
  label?: string;
  /** The parent locator containing the label element */
  parent: Locator;
  /** Whether the field is required (defaults to false) */
  required?: boolean;
}

/**
 * Tests and validates a label component
 * @param fx - The page fixtures object containing test utilities and common page methods
 * @param params - Configuration object containing:
 *   - `name`: Identifier for the label field used in test assertions and logging
 *   - `label`: Expected label text content to validate (if not provided, function returns early)
 *   - `parent`: Playwright Locator for the parent element containing the label
 *   - `required`: Whether field should show required indicator (defaults to false)
 * @example
 * ```typescript
 * // Optional label (function will return early)
 * await appLabel(fx, {
 *   name: 'username',
 *   parent: page.locator('.form-container')
 * });
 *
 * // Required label with validation
 * await appLabel(fx, {
 *   name: 'email',
 *   label: 'Email Address',
 *   parent: page.locator('.form-container'),
 *   required: true
 * });
 *
 * // Optional label with text validation
 * await appLabel(fx, {
 *   name: 'nickname',
 *   label: 'Nickname (Optional)',
 *   parent: page.locator('[data-testid="profile-form"]'),
 *   required: false
 * });
 * ```
 */
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
