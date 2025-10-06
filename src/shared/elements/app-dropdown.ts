import { Locator } from '@playwright/test';
import { type Pages, And, expect } from '../../fixtures';

/**
 * Interface for app dropdown component parameters
 */
interface AppDropdown {
  /** The name identifier for the dropdown field */
  name: string;
  /** Optional placeholder text for the dropdown */
  placeholder?: string;
  /** The parent locator containing the dropdown element */
  parent: Locator;
  /** Optional expected selected value to validate */
  expectedValue?: string;
  /** Optional new value to select in the dropdown */
  newValue?: string;
  /** Available options in the dropdown (for validation) */
  options?: string[];
}

/**
 * Tests and validates a dropdown component with selection capabilities
 * @param fx - The page fixtures object containing test utilities and common page methods
 * @param params - Configuration object containing:
 *   - `name`: Identifier for the dropdown field used in test assertions and logging
 *   - `placeholder`: Placeholder text to validate in dropdown (optional)
 *   - `parent`: Playwright Locator for the parent element containing the dropdown
 *   - `expectedValue`: Current selected value to validate (optional)
 *   - `newValue`: Value to select in the dropdown (optional)
 *   - `options`: Array of available options for validation (optional)
 * @example
 * ```typescript
 * // Basic dropdown with placeholder validation
 * await appDropdown(fx, {
 *   name: 'country',
 *   placeholder: 'Select a country',
 *   parent: page.locator('.form-container')
 * });
 *
 * // Dropdown with value selection
 * await appDropdown(fx, {
 *   name: 'country',
 *   placeholder: 'Select a country',
 *   newValue: 'United States',
 *   parent: page.locator('.form-container')
 * });
 *
 * // Dropdown with value validation
 * await appDropdown(fx, {
 *   name: 'country',
 *   expectedValue: 'Canada',
 *   parent: page.locator('.form-container')
 * });
 *
 * // Dropdown with options validation
 * await appDropdown(fx, {
 *   name: 'priority',
 *   options: ['Low', 'Medium', 'High'],
 *   newValue: 'High',
 *   parent: page.locator('.form-container')
 * });
 * ```
 */
export async function appDropdown(
  fx: Pages,
  {
    name,
    placeholder,
    parent,
    expectedValue,
    newValue,
    options
  }: AppDropdown) {

  const element = parent.locator('app-dropdown select, app-dropdown .dropdown-trigger, [data-testid*="dropdown"]');

  // Test dropdown visibility
  await And(`the user assert the ${name} dropdown is visible`, async () => {
    await fx.commonPage.elementVisible(element);
  });

  // Test placeholder if provided
  if (placeholder) {
    await And(`the user assert the ${name} dropdown placeholder reads ${placeholder}`, async () => {
      await expect(element).toHaveAttribute('placeholder', placeholder);
    });
  }

  // Validate current value if expectedValue provided
  if (expectedValue) {
    await And(`the user assert the ${name} dropdown has ${expectedValue} selected`, async () => {
      // Check for select element
      const selectElement = element.locator('select');
      if (await selectElement.isVisible()) {
        await expect(selectElement).toHaveValue(expectedValue);
      } else {
        // Check for custom dropdown with selected value display
        const selectedValue = element.locator('.dropdown-selected, .selected-value, [data-testid="selected-value"]');
        if (await selectedValue.isVisible()) {
          await fx.commonPage.assertTextCopy(selectedValue, expectedValue);
        }
      }
    });
  }

  // Select new value if newValue provided
  if (newValue) {
    await And(`the user selects ${newValue} from the ${name} dropdown`, async () => {
      // Try select element first
      const selectElement = element.locator('select');
      if (await selectElement.isVisible()) {
        await selectElement.selectOption({ label: newValue });
      } else {
        // Handle custom dropdown
        await element.click(); // Open dropdown

        // Look for option by text
        const option = element.locator(`.dropdown-option, .dropdown-item, [role="option"]`).filter({ hasText: newValue });
        await option.click();
      }
    });
  }

  // Validate options if provided
  if (options && options.length > 0) {
    await And(`the user assert the ${name} dropdown contains all expected options`, async () => {
      // For select elements
      const selectElement = element.locator('select');
      if (await selectElement.isVisible()) {
        for (const option of options) {
          await fx.commonPage.elementVisible(selectElement.locator(`option[value="${option}"], option:has-text("${option}")`));
        }
      } else {
        // For custom dropdowns, open and check options
        await element.click(); // Open dropdown

        for (const option of options) {
          const optionElement = element.locator(`.dropdown-option, .dropdown-item, [role="option"]`).filter({ hasText: option });
          await fx.commonPage.elementVisible(optionElement);
        }
      }
    });
  }
}
