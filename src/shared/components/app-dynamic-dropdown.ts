import { type Pages, Then } from '../../fixtures'
import { appDropdown, appLabel, appValidator } from '../elements';

/**
 * Interface for app dynamic dropdown component parameters
 */
interface AppDynamicDropdown {
  /** The name identifier for the dynamic dropdown field */
  name: string;
  /** Optional label text to be displayed */
  label?: string;
  /** Optional placeholder text for the dropdown */
  placeholder?: string;
  /** Optional helper text for the field */
  helper?: string;
  /** Optional error text for validation failures, when present, it has priority over the `helper` settings */
  error?: string;
  /** CSS selector or locator identifier for the dynamic dropdown field */
  identifier: string;
  /** Whether the field is required (defaults to false) */
  required?: boolean;
  /** Optional expected selected value to validate */
  expectedValue?: string;
  /** Optional new value to select in the dropdown */
  newValue?: string;
  /** Available options in the dropdown (for validation) */
  options?: string[];
}

/**
 * Tests and validates a complete dynamic dropdown field component including label, dropdown, and validation
 * This function combines appLabel, appDropdown, and appValidator to provide comprehensive dropdown field testing
 * @param fx - The page fixtures object containing test utilities and common page methods
 * @param params - Configuration object containing:
 *   - `name`: Identifier for the dynamic dropdown field used in test assertions and logging
 *   - `label`: Label text content to validate (optional, passed to appLabel)
 *   - `placeholder`: Placeholder text to validate in dropdown (optional, passed to appDropdown)
 *   - `helper`: Helper text for field guidance (optional, passed to appValidator)
 *   - `error`: Error text for validation failures (optional, passed to appValidator)
 *   - `identifier`: CSS selector or locator to identify the specific dynamic dropdown field instance
 *   - `required`: Whether field should show required indicator (defaults to false, passed to appLabel)
 *   - `expectedValue`: Current selected value to validate (optional, passed to appDropdown)
 *   - `newValue`: Value to select in the dropdown (optional, passed to appDropdown)
 *   - `options`: Array of available options for validation (optional, passed to appDropdown)
 * @remarks
 * The function will test all provided components in sequence:
 * 1. Validates the root dynamic dropdown container is visible
 * 2. Tests label component (if label provided)
 * 3. Tests dropdown component with selection capabilities (if placeholder, expectedValue, newValue, or options provided)
 * 4. Tests validator component (if helper and error provided)
 * @example
 * ```typescript
 * // Complete dropdown field with all components
 * await appDynamicDropdown(fx, {
 *   name: 'country',
 *   label: 'Country',
 *   placeholder: 'Select your country',
 *   helper: 'Choose the country where you currently reside',
 *   error: 'Please select a country',
 *   identifier: '[data-testid="country-field"]',
 *   required: true,
 *   options: ['United States', 'Canada', 'Mexico', 'United Kingdom']
 * });
 *
 * // Minimal dropdown field with just label
 * await appDynamicDropdown(fx, {
 *   name: 'priority',
 *   label: 'Priority Level',
 *   identifier: '[data-testid="priority-field"]'
 * });
 *
 * // Dropdown field with value selection
 * await appDynamicDropdown(fx, {
 *   name: 'status',
 *   label: 'Status',
 *   newValue: 'Active',
 *   identifier: '[data-testid="status-field"]',
 *   options: ['Active', 'Inactive', 'Pending']
 * });
 *
 * // Dropdown field with value validation
 * await appDynamicDropdown(fx, {
 *   name: 'category',
 *   label: 'Category',
 *   expectedValue: 'Electronics',
 *   identifier: '[data-testid="category-field"]',
 *   required: true
 * });
 *
 * // Dropdown field with mixed optional components
 * await appDynamicDropdown(fx, {
 *   name: 'department',
 *   label: 'Department',
 *   placeholder: 'Choose department',
 *   helper: 'Select your department from the list',
 *   error: 'Department selection is required',
 *   expectedValue: 'Engineering',
 *   newValue: 'Marketing',
 *   identifier: '[data-testid="department-field"]',
 *   required: true,
 *   options: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance']
 * });
 * ```
 */
export async function appDynamicDropdown(
  fx: Pages,
  {
    name,
    label,
    placeholder,
    helper,
    error,
    identifier,
    required = false,
    expectedValue,
    newValue,
    options
  }: AppDynamicDropdown) {

  const root = fx.page.locator('app-dynamic-dropdown, app-dropdown-field', { has: fx.page.locator(identifier) });
  await Then(`the user assert the ${name} dropdown field is visible`, async () => {
    await fx.commonPage.elementVisible(root, 'dynamic dropdown field root not found');
  });

  await appLabel(fx, { label, name, parent: root, required });

  await appDropdown(fx, {
    name,
    parent: root,
    placeholder,
    expectedValue,
    newValue,
    options
  });

  await appValidator(fx, { name, helper, error, parent: root });
}
