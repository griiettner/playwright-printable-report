import type { Page, APIRequestContext, Locator } from "@playwright/test";
import { expect } from "../fixtures";

export class CommonPage {
  constructor(
    public page: Page,
    public request: APIRequestContext
  ) {}

  private isLikelySelector(s: string): boolean {
    // heuristics: starts with known selector prefixes or contains CSS/XPath tokens
    return /^(#|\.|\/\/|xpath=|css=|text=|role=|id=|data-testid=|\[)/.test(s);
  }

  getLocator(locator: string | Locator) {
    if (typeof locator !== 'string') return locator;
    if (this.isLikelySelector(locator)) {
      // allow "text=..." and others to pass-through
      return this.page.locator(locator);
    }
    // treat as visible text (exact match). loosen { exact:false } if needed
    return this.page.getByText(locator, { exact: true });
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