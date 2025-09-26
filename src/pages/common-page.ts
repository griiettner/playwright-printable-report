import type { Page, APIRequestContext } from "@playwright/test";

export class CommonPage {
  constructor(public page: Page, public request: APIRequestContext) { }
  

}