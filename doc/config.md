# Configuration Guide

This document explains how to configure and use the environment-specific settings for Playwright tests in this repository.

---

## 1. Config Files

There are two key config files:

- **`playwright.config.ts`**  
  Main Playwright configuration (timeouts, reporters, browsers, etc.).

- **`uat.config.ts`**  
  Environment-specific settings for UAT.  
  This file is created by copying from `uat.config.ts.template`.

---

## 2. UAT Config (`uat.config.ts`)

The `uat.config.ts` file contains:

### Impersonation
```ts
export const Impersonate = true;
```

- Enables logging in as predefined test users.

- Set to `false` if impersonation is not needed.

### Config Object

```ts
export const Config = {
  appUrl: (env: 'qa' | 'dev' | 'uat') =>
    `https://exceptionone-ui-${env}.clouddqt.capitalone.com/v2/`,
  tokenUrl: "https://api-it.cloud.capitalone.com/oauth2/token",
  apiBaseUrl: "https://api-it.cloud.capitalone.com/",
  clientId: "",
  clientSecret: "",
};
```

- `appUrl`: Generates the UI base URL depending on environment.

- `tokenUrl`: OAuth2 endpoint for authentication tokens.

- `apiBaseUrl`: Base URL for APIs.

- `clientId / clientSecret`: OAuth2 credentials (to be filled securely).

### User Types

```ts
export enum UserType {
  Requester = "Requester",
}
```

- Defines roles for testing (expandable with more roles).

### User Interface

```ts
export interface User {
  username: string;
  password: string;
  name: string;
}
```

### Users Mapping

```ts
export const users: Users = {
  [UserType.Requester]: {
    username: "",
    password: "",
    name: ""
  }
};
```

- Define test user credentials here for each role.

- Start with empty values and fill per environment.

## 3. How to Use

### Create `uat.config.ts`

```bash
cp uat.config.ts.template uat.config.ts
```

### Fill in values

- `clientId`, `clientSecret`

User credentials for each `UserType`

### Import in tests

```ts
import { Config, users, Impersonate } from '../uat.config';
```

## 4. Best Practices

- Do not commit real credentials.

- Use environment variables or secret management tools where possible.

- Keep `uat.config.ts`.template as the reference version.

- Extend `UserType` when new roles are needed.