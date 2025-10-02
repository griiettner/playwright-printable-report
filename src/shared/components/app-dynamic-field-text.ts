import { expect, type Pages, Then, And } from '../../fixtures'
import { appInput } from './app-input';
import { appLabel } from './app-label';
import { appValidator } from './app-validator';

/**
 * Interface for app dynamic field text component parameters
 */
interface AppDynamicFieldText {
  /** The name identifier for the dynamic field */
  name: string;
  /** Optional label text to be displayed */
  label?: string;
  /** Optional placeholder text for the input field */
  placeholder?: string;
  /** Optional helper text for the field */
  helper?: string;
  /** Optional error text for validation failures, when present, it has priority over the `helper` settings */
  error?: string;
  /** CSS selector or locator identifier for the dynamic field */
  identifier: string;
  /** Whether the field is required (defaults to false) */
  required?: boolean;
}

/**
 * Tests and validates a complete dynamic text field component including label, input, and validation
 * This function combines appLabel, appInput, and appValidator to provide comprehensive field testing
 * @param fx - The page fixtures object containing test utilities and common page methods
 * @param params - Configuration object containing:
 *   - `name`: Identifier for the dynamic field used in test assertions and logging
 *   - `label`: Label text content to validate (optional, passed to appLabel)
 *   - `placeholder`: Placeholder text to validate in input field (optional, passed to appInput)
 *   - `helper`: Helper text for field guidance (optional, passed to appValidator)
 *   - `error`: Error text for validation failures (optional, passed to appValidator)
 *   - `identifier`: CSS selector or locator to identify the specific dynamic field instance
 *   - `required`: Whether field should show required indicator (defaults to false, passed to appLabel)
 * @remarks
 * The function will test all provided components in sequence:
 * 1. Validates the root dynamic field container is visible
 * 2. Tests label component (if label provided)
 * 3. Tests input component (if placeholder provided)
 * 4. Tests validator component (if helper and error provided)
 * @example
 * ```typescript
 * // Complete field with all components
 * await appDynamicFieldText(fx, {
 *   name: 'email',
 *   label: 'Email Address',
 *   placeholder: 'Enter your email address',
 *   helper: 'We will use this to send you updates',
 *   error: 'Please enter a valid email address',
 *   identifier: '[data-testid="email-field"]',
 *   required: true
 * });
 *
 * // Minimal field with just label
 * await appDynamicFieldText(fx, {
 *   name: 'username',
 *   label: 'Username',
 *   identifier: '[data-testid="username-field"]'
 * });
 *
 * // Field with mixed optional components
 * await appDynamicFieldText(fx, {
 *   name: 'phone',
 *   label: 'Phone Number',
 *   placeholder: '(555) 123-4567',
 *   helper: 'Enter numbers only',
 *   error: 'Please enter a valid phone number',
 *   identifier: '[data-testid="phone-field"]',
 *   required: false
 * });
 * ```
 */
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
  }: AppDynamicFieldText) {

  const root = fx.page.locator('app-dynamic-field-text', { has: fx.page.locator(identifier) });
  await Then(`the user assert the ${name} field is visible`, async () => {
    await fx.commonPage.elementVisible(root, 'dynamic field root not found');
  });

  await appLabel(fx, { label, name, parent: root, required });

  await appInput(fx, { name, parent: root, placeholder });

  await appValidator(fx, { name, helper, error, parent: root });
}
