import { type Pages, And, Then } from '../../fixtures'

/**
 * Interface for app sub-title component parameters
 * This is a specialized function for testing sub-title elements within app-dynamic-page components
 */
interface AppSubTitle {
  /** The expected text content of the sub-title */
  text: string;
}

/**
 * Tests and validates a sub-title component within an app-dynamic-page container
 *
 * This is a specialized function designed specifically for testing sub-title elements
 * that appear within app-dynamic-page components. It uses a fixed locator strategy
 * since the use case doesn't require dynamic parent containers.
 *
 * @param fx - The page fixtures object containing test utilities and common page methods
 * @param params - Configuration object containing:
 *   - `text`: Expected text content to validate in the sub-title
 *
 * @example
 * ```typescript
 * // Basic sub-title validation for app-dynamic-page
 * await appSubTitle(fx, { text: 'Policy Requirement' });
 *
 * // Test different sub-title content
 * await appSubTitle(fx, { text: 'Additional Information' });
 * ```
 *
 * @remarks
 * This function is specifically designed for sub-title elements within app-dynamic-page components.
 * For more flexible sub-title testing across different parent containers, consider using a more
 * generic approach with dynamic parent parameters.
 */
export async function appSubTitle(fx: Pages, { text }: AppSubTitle) {

  const element = fx.page.locator('app-dynamic-page > .sub-title');

  await Then(`the user assert the ${text} Create Page Header is visible`, async () => {
    await fx.commonPage.elementVisible(element, `${text} sub-title not found`);
  });

  await And(`the user assert the Create Page Header text reads ${text}`, async () => {
    await fx.commonPage.assertTextCopy(element, text);
  });
}
