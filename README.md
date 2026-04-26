# Incode E2E Test Suite

Playwright end-to-end test suite for the [Incode demo dashboard](https://demo-dashboard.incode.com) test automation assignment, written in TypeScript using the Page Object Model pattern.

## Architecture

```
src/
├── constants/       # Centralized URLs, UI labels, module names, status codes
├── fixtures/        # Custom test fixture — handles login, exposes basePage
├── helpers/         # API utilities (cleanup, data retrieval) and common utilities
├── pages/           # Page objects, one class per page
│   ├── base/        # BasePage — toast notification helpers
│   ├── flows/       # FlowsPage, NewFlowPage
│   ├── identities/  # IdentitiesPage, SingleIdentityPage
│   └── sessions/    # SessionsPage, SingleSessionPage
└── tests/           # Test specs
```

**Key conventions:**

- All test files import `{ test, expect }` from `src/fixtures/fixtures.ts`, not from `@playwright/test` directly. The fixture authenticates via API, injects the token into `localStorage`, and calls logout after the test completes.
- Tests navigate to pages using `page.goto(PAGE_URLS.<PAGE>)` directly — no side-menu clicks for navigation.
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

Then restart your terminal, navigate back to the project folder, and install the latest LTS version of Node:

```bash
cd incode-challenge
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
npx playwright install chromium --with-deps
```

This downloads Chromium along with its system dependencies.

### 5. Configure environment variables

Create a `.env` file at the project root:

```
USER_EMAIL=<username from Incode_QA_Assignment>
USER_PASSWORD=<password from Incode_QA_Assignment>
API_KEY=<apiKey from localstorage>
```

> On CI these are stored as GitHub repository secrets (`USER_EMAIL`, `USER_PASSWORD`, `API_KEY`) and injected automatically — no `.env` file is needed there.

## Test specs

### `sessions.spec.ts` — Session data verification

An end-to-end test that validates session data is correctly displayed in the UI.

**Precondition:** fetches validated sessions (finished, alive status) via API, picks one at random, then navigates to the Sessions page.

1. Verifies the session row is visible in the sessions table
2. Opens the session detail page and confirms the "Session Info" title is present
3. Scrolls to the ID OCR section and verifies the full name from the OCR data matches the session name

---

### `flows.spec.ts` — Flow creation and activation

Tests the full flow creation workflow from blank form to active entry in the flows table.

**Precondition:** deletes any existing flows matching the test name prefix via API, then navigates to the Flows page.

1. Clicks "New" to open the flow builder
2. Edits the flow name and saves it
3. Searches for and adds three modules: ID Capture, ID Validation, and Face Capture
4. Saves the flow and confirms the success toast
5. Toggles the flow to "Live" (active), saves again, and confirms the toast
6. Navigates back to the Flows page and verifies the new flow appears in the table with "Active" status

---

### `identities.spec.ts` — Add face to database and identity verification

Tests the end-to-end identity creation flow triggered by adding a face from a session.

**Precondition:** deletes all existing identities via API, fetches validated sessions (finished, alive status) and picks one at random, then navigates directly to the single session page by ID.

1. Verifies the "Add face to database" button is enabled
2. Clicks the button, intercepts the API response, and extracts the created identity UUID
3. Confirms the success toast and the "Face in database" status label appear
4. Opens the hamburger menu and navigates to the identity detail page via "Go to Identity"
5. Verifies the identity name (lowercase) and "Identity confirmed" label on the detail page
6. Navigates back to the Identities table via the breadcrumb and confirms the identity row is visible with the correct name (title case) and UUID

---

## Running the tests

```bash
# All tests
npx playwright test

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
