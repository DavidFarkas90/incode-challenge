# Incode E2E Test Suite

Playwright end-to-end test suite for the [Incode demo dashboard](https://demo-dashboard.incode.com), written in TypeScript using the Page Object Model pattern.

## Architecture

```
src/
├── constants/       # Centralized URLs, UI labels, module names, status codes
├── fixtures/        # Custom test fixture — handles login, exposes basePage
├── helpers/         # API utilities (cleanup, data retrieval) and common utilities
├── pages/           # Page objects, one class per page
│   ├── base/        # BasePage — side nav and toast notification helpers
│   ├── flows/       # FlowsPage, NewFlowPage
│   ├── identities/  # IdentitiesPage, SingleIdentityPage
│   ├── login/       # LoginPage
│   └── sessions/    # SessionsPage, SingleSessionPage
└── tests/           # Test specs
```

**Key conventions:**

- All test files import `{ test, expect }` from `src/fixtures/fixtures.ts`, not from `@playwright/test` directly. The fixture handles login before each test and logout after.
- Page objects do not extend `BasePage`. Tests compose them independently.
- All page URLs are relative paths in `src/constants/urls.ts`; `baseURL` is set in `playwright.config.ts`.
- All UI strings used in locators live in `src/constants/labels.ts` — never hardcode them inline.

## Local setup

### 1. Clone the repository

```bash
git clone https://github.com/DavidFarkas90/incode-challenge.git
cd incode-challenge
```

### 2. Install Node.js

Node.js **v18 or later** is required. The recommended approach is to use [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager), which lets you install and switch between Node versions easily.

**Install nvm** (macOS / Linux):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Then restart your terminal, and install the latest LTS version of Node:

```bash
nvm install --lts
nvm use --lts
```

> On Windows, use [nvm-windows](https://github.com/coreybutler/nvm-windows) instead.

npm is bundled with Node.js — no separate install needed.

### 3. Install project dependencies

```bash
npm install
```

### 4. Install Playwright browsers

```bash
npx playwright install --with-deps
```

This downloads Chromium, Firefox, and WebKit along with their system dependencies.

### 5. Configure environment variables

Create a `.env` file at the project root:

```
USER_EMAIL=<username from Incode_QA_Assignment>
USER_PASSWORD=<password from Incode_QA_Assignment>
```

> On CI these are stored as GitHub repository secrets (`USER_EMAIL`, `USER_PASSWORD`) and injected automatically — no `.env` file is needed there.

## Running the tests

```bash
# All tests, all browsers
npx playwright test

# Single browser
npx playwright test --project=chromium

# Sessions tests only
npx playwright test src/tests/sessions.spec.ts
npm run test:sessions

# Flows tests only
npx playwright test src/tests/flows.spec.ts
npm run test:flows

# Identities tests only
npx playwright test src/tests/identities.spec.ts
npm run test:identities

# By test title
npx playwright test --grep "assert user name in single session page"

# Interactive UI mode
npm run open:ui-mode
```

## Test reports

### Locally

An HTML report is generated automatically after each run. Open it with:

```bash
npm run open:report
```

### On CI (GitHub Actions)

1. Go to the repository on GitHub and click the **Actions** tab.
2. Click on a specific workflow run.
3. Scroll to the bottom of the run summary page — the **Artifacts** section contains a `playwright-report` download.
4. Extract the zip and open `index.html` in a browser.

Reports are retained for **30 days**. The report is uploaded even when tests fail.
