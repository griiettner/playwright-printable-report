import type { Page, APIRequestContext, Locator } from "@playwright/test";
import { expect } from "../fixtures";

export class CommonPage {
  constructor(
    public page: Page,
    public request: APIRequestContext
  ) {}

  getLocator(locator: string | Locator) {
    return typeof locator === 'string' ? this.page.locator(locator) : locator;
  }

  async elementVisible(locator: string | Locator, message: string = '', notVisible: boolean = false) {
    const element = this.getLocator(locator);

    if (notVisible) {
      await expect(element, message).not.toBeVisible();
    } else {
      await expect(element, message).toBeVisible();
    }
  }

  async assertTextCopy(locator: string | Locator, text: string) {
    const element = this.getLocator(locator);
    await expect(element).toHaveText(text, { useInnerText: true });
  }
}