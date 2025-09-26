import { Page as BasePage, expect as pbexpect, test as base } from '@playwright/test';
import { createBdd } from '../resources/utils/bdd';
import { CommonPage } from '../pages/common-page';

export interface Pages {
  page: BasePage;
  commonPage: CommonPage
}

export const test = base.extend<Pages>({
  commonPage: async ({ page, request }, use) => {
    await use(new CommonPage(page, request));
  }
});

export const expect = pbexpect;
export const {
  Feature,
  Scenario,
  Given,
  When,
  Then,
  And,
  Step,
  StepAction,
  StepExpect,
  Before,
  After,
  BeforeAll,
  AfterAll,
} = createBdd(test);