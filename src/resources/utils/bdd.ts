import type { TestType, TestInfo } from '@playwright/test';

type Body<R = unknown> = () => Promise<R> | R;
type FxOf<T> = T extends TestType<infer F, any> ? F : unknown;

export function createBdd<T extends TestType<any, any>>(test: T) {
  const inTest = () => {
    try {
      test.info();
      return true;
    } catch {
      return false;
    }
  };

  const safeStep = <R = unknown>(title: string, body: Body<R>): Promise<R> => {
    if (typeof body !== 'function') {
      return Promise.reject(new Error(`BDD step "${title}" was called without a body`));
    }
    return inTest()
      ? test.step(title, () => Promise.resolve(body())) // return, do NOT await
      : Promise.resolve(body());
  };

  const wrap =
    (prefix: string) =>
      <R = unknown>(title: string, body: Body<R>) => {
        const pfx = prefix === 'Scenario' ? `${prefix}:` : prefix;
        return safeStep<R>(`${pfx} ${title}`, body);
    }

  function Feature(title: string, tags: string[] = [], fn: (fx: FxOf<T>, info: TestInfo) => Promise<void> | void) {
    const suffix = tags.map((t) => `@${t}`).join(' ');
    return test(`${title} ${suffix}`.trim(),
      async({ page, request, context, browser, commonPage }, info) => {
        for (const t of tags) info.annotations.push({ type: 'tag', description: t });

        return test.step(`Feature: ${title}`, () =>
          Promise.resolve(fn({ page, request, context, browser, commonPage } as FxOf<T>, info)));
      }
    );
  }

  return {
    Feature,
    Scenario: wrap('Scenario'),
    Given: wrap('Given'),
    When: wrap('When'),
    Then: wrap('Then'),
    And: wrap('And'),
    Step: wrap('Step #'),
    StepAction: wrap('Step Action #'),
    StepExpect: wrap('Step Expect #'),
    Before: test.beforeEach,
    After: test.afterEach,
    BeforeAll: test.beforeAll,
    AfterAll: test.afterAll,
  };
}
