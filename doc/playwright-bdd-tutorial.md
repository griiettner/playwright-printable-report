# Playwright BDD Testing Tutorial

## Overview

This tutorial demonstrates how to use the BDD (Behavior-Driven Development) utilities for Playwright testing. The BDD utilities provide a more verbose and granular approach to test writing, making tests more readable and suitable for governance audits and compliance requirements.

## What are BDD Utilities?

The BDD utilities are a wrapper around Playwright's test runner that provides a more descriptive and structured way of writing tests. Instead of traditional test functions, you use BDD keywords like:

- `Feature` - Defines a test suite/feature
- `Scenario` - Defines a specific test case
- `Given` - Sets up preconditions
- `When` - Describes the action being tested
- `Then` - Verifies the expected outcome
- `And` - Continues a previous step
- `Step`, `StepAction`, `StepExpect` - Additional granular steps for detailed audit trails

## Why Use BDD for Governance?

BDD utilities are particularly valuable for governance audits because they:

1. **Provide Clear Intent**: Each step clearly states what the test is doing
2. **Create Audit Trails**: Detailed step-by-step execution logs
3. **Improve Readability**: Tests read like documentation
4. **Enable Better Reporting**: Generate detailed reports for compliance
5. **Support Regulatory Requirements**: Meet audit requirements for test transparency

## Project Structure

```
src/
├── fixtures/
│   ├── fixtures.ts          # BDD setup and configuration
│   └── index.ts            # Exports BDD functions
├── pages/
│   └── common-page.ts      # Page object classes
├── resources/
│   └── utils/
│       ├── bdd.ts          # BDD utility functions
│       └── report-generator.ts # Report generation utilities
└── steps/
    ├── test.steps.ts       # Example BDD tests
    └── test2.steps.ts      # Additional test examples
```

## Getting Started

### 1. Basic Setup

The BDD utilities are already configured in your project. The main setup is in `src/fixtures/fixtures.ts`:

```typescript
import { test as base } from '@playwright/test';
import { createBdd } from '../resources/utils/bdd';

export const test = base.extend({
  // Add your fixtures here
});

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
```

### 2. Writing Your First BDD Test

Here's a basic example of how to write a BDD test:

```typescript
import { Feature, Scenario, Given, Then, And } from '../fixtures';

Feature('User Authentication', ['auth', 'login'], async ({ page }) => {
  Scenario('Successful login with valid credentials', async () => {
    await Given('the user is on the login page', async () => {
      await page.goto('/login');
    });

    await When('the user enters valid credentials', async () => {
      await page.fill('[data-testid="username"]', 'testuser');
      await page.fill('[data-testid="password"]', 'password123');
      await page.click('[data-testid="login-button"]');
    });

    await Then('the user should be redirected to the dashboard', async () => {
      await expect(page).toHaveURL('/dashboard');
    });

    await And('the welcome message should be displayed', async () => {
      await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
    });
  });
});
```

## BDD Keywords Explained

### Feature
Defines a test suite and groups related scenarios together:

```typescript
Feature('User Registration', ['registration', 'user-flow'], async ({ page }) => {
  // Scenarios go here
});
```

**Parameters:**
- `title`: Descriptive name of the feature
- `tags`: Array of tags for categorization and filtering
- `fn`: Function containing the scenarios

### Scenario
Defines a specific test case within a feature:

```typescript
Scenario('User can register with valid information', async () => {
  // Steps go here
});
```

### Given, When, Then (Core BDD Steps)
These represent the three phases of a BDD scenario:

```typescript
await Given('the user is on the registration page', async () => {
  await page.goto('/register');
});

await When('the user fills out the registration form', async () => {
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'SecurePass123!');
  await page.click('[data-testid="register-button"]');
});

await Then('the user should receive a confirmation email', async () => {
  // Email verification logic
});
```

### And (Continuation Step)
Continues from the previous step:

```typescript
await Then('the user should be logged in', async () => {
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
});

await And('the user profile should display their information', async () => {
  await expect(page.locator('[data-testid="user-name"]')).toHaveText('John Doe');
});
```

### Step, StepAction, StepExpect (Granular Steps)
For more detailed audit trails, use these granular steps:

```typescript
await Step('Navigate to application', async () => {
  await page.goto('https://example.com');
});

await StepAction('Click login button', async () => {
  await page.click('[data-testid="login-button"]');
});

await StepExpect('Verify redirect to dashboard', async () => {
  await expect(page).toHaveURL('/dashboard');
});
```

## Advanced Usage

### Using Page Objects

Create page objects for better organization:

```typescript
// src/pages/login-page.ts
export class LoginPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.page.fill('[data-testid="username"]', username);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="login-button"]');
  }

  async getErrorMessage() {
    return this.page.locator('[data-testid="error-message"]');
  }
}
```

Then use in tests:

```typescript
import { LoginPage } from '../pages/login-page';

Feature('Login Functionality', ['auth'], async ({ page }) => {
  Scenario('Invalid login shows error message', async () => {
    const loginPage = new LoginPage(page);

    await Given('the user is on the login page', async () => {
      await loginPage.navigate();
    });

    await When('the user attempts to login with invalid credentials', async () => {
      await loginPage.login('invalid', 'wrong');
    });

    await Then('an error message should be displayed', async () => {
      await expect(loginPage.getErrorMessage()).toBeVisible();
    });
  });
});
```

### Setup and Teardown

Use BDD hooks for setup and teardown:

```typescript
Feature('Database Operations', ['database'], async ({ page }) => {
  Before(async ({ page }) => {
    // Setup: Clear database, create test data
    await clearTestDatabase();
  });

  After(async ({ page }) => {
    // Cleanup: Remove test data
    await cleanupTestData();
  });

  Scenario('User can create new record', async () => {
    // Test implementation
  });
});
```

### Working with API Requests

```typescript
Feature('API Integration', ['api', 'integration'], async ({ page, request }) => {
  Scenario('Data synchronization between systems', async () => {
    await Given('the source system has new data', async () => {
      // Setup API data
      await request.post('/api/test-data', {
        data: { id: 1, name: 'Test Record' }
      });
    });

    await When('the synchronization process runs', async () => {
      await request.post('/api/sync');
    });

    await Then('the data should appear in the target system', async () => {
      const response = await request.get('/api/synced-data');
      expect(response.ok()).toBeTruthy();
    });
  });
});
```

## Best Practices for Governance

### 1. Descriptive Step Names
Use clear, descriptive names that explain the business intent:

```typescript
// Good
await Given('the user has a valid account with subscription access');
await When('the user attempts to access premium content');
await Then('the premium content should be displayed without paywall');

// Avoid
await Given('user is logged in');
await When('click button');
await Then('page loads');
```

### 2. Proper Tagging
Use consistent tagging for better organization and reporting:

```typescript
Feature('Payment Processing', [
  'critical',      // Critical business function
  'pci-compliant', // PCI compliance requirement
  'audit-required' // Needs additional audit scrutiny
], async ({ page }) => {
  // Test implementation
});
```

### 3. Detailed Assertions
Provide comprehensive assertions for audit trails:

```typescript
await Then('the transaction should be recorded in the audit log', async () => {
  await StepExpect('Verify transaction ID is generated', async () => {
    await expect(auditLog.transactionId).toBeDefined();
  });

  await StepExpect('Verify timestamp is recorded', async () => {
    await expect(auditLog.timestamp).toBeDefined();
  });

  await StepExpect('Verify user context is captured', async () => {
    await expect(auditLog.userId).toBe('user123');
  });
});
```

### 4. Error Scenario Coverage
Include comprehensive error scenario testing:

```typescript
Feature('Error Handling', ['error-handling', 'resilience'], async ({ page }) => {
  Scenario('System handles network failures gracefully', async () => {
    await Given('the network connection is unstable');
    await When('the user attempts a critical operation');
    await Then('the system should show appropriate error messages');
    await And('the operation should be retryable');
  });
});
```

## Running Tests

### Basic Execution
```bash
npm test
```

### With Specific Tags
```bash
npx playwright test --grep "@critical"
```

### Generate Reports
The BDD utilities integrate with the report generator for detailed audit reports:

```bash
npx playwright test --reporter=line,json
```

## Integration with CI/CD

For governance compliance, integrate BDD tests into your CI/CD pipeline:

```yaml
# .github/workflows/tests.yml
name: BDD Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run BDD Tests
        run: npm test

      - name: Generate Compliance Report
        run: npx playwright test --reporter=json --output=test-results.json

      - name: Upload Test Results
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results.json
```

## Debugging BDD Tests

### Verbose Logging
Run tests with detailed logging for audit purposes:

```bash
npx playwright test --debug --reporter=line,verbose
```

### Step-by-Step Execution
For detailed audit trails, use the granular step functions:

```typescript
await Step('1. Navigate to application home page', async () => {
  await page.goto('/');
});

await StepAction('2. Click on user menu', async () => {
  await page.click('[data-testid="user-menu"]');
});

await StepExpect('3. Verify dropdown menu appears', async () => {
  await expect(page.locator('[data-testid="user-dropdown"]')).toBeVisible();
});
```

## Migration from Standard Tests

To migrate existing Playwright tests to BDD format:

### Before (Standard Test)
```typescript
test('should login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="username"]', 'user');
  await page.fill('[data-testid="password"]', 'pass');
  await page.click('[data-testid="login-button"]');
  await expect(page).toHaveURL('/dashboard');
});
```

### After (BDD Format)
```typescript
Feature('Authentication', ['auth'], async ({ page }) => {
  Scenario('Successful login with valid credentials', async () => {
    await Given('the user is on the login page', async () => {
      await page.goto('/login');
    });

    await When('the user enters valid credentials', async () => {
      await page.fill('[data-testid="username"]', 'user');
      await page.fill('[data-testid="password"]', 'pass');
      await page.click('[data-testid="login-button"]');
    });

    await Then('the user should be redirected to the dashboard', async () => {
      await expect(page).toHaveURL('/dashboard');
    });
  });
});
```

## Conclusion

The BDD utilities provide a powerful way to write more descriptive and auditable tests. By using clear, business-focused language and detailed step tracking, these utilities help meet governance requirements while maintaining test reliability and readability.

Key benefits:
- **Audit Compliance**: Detailed step-by-step execution logs
- **Better Readability**: Tests read like documentation
- **Improved Debugging**: Clear step isolation for issue identification
- **Enhanced Reporting**: Better integration with compliance reporting tools
- **Team Collaboration**: Business stakeholders can understand test intent

For more examples, see the test files in `src/steps/` directory.
