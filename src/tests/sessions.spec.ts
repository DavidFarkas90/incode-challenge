import { test, expect } from "../fixtures/fixtures";
import { getValidatedSessionNames } from "../helpers/api-helpers";
import { getRandomElement } from "../helpers/common-helpers";
import { PAGE_URLS } from "../constants/urls";
import { Labels } from "../constants/labels";
import { SessionsPage } from "../pages/sessions/sessions.page";
import { SingleSessionPage } from "../pages/sessions/single-session.page";

let sessionsPage: SessionsPage;
let singleSessionPage: SingleSessionPage;
let sessionNames: string[] = [];
let randomUserName: string;

test.beforeEach("Precondition: get data and navigate to page", async ({ page, request }) => {
  await test.step("Get valid session names", async () => {
    sessionNames = await getValidatedSessionNames(request);
    randomUserName = getRandomElement(sessionNames);
  });

  await test.step("Navigate to Sessions page", async () => {
    await page.goto(PAGE_URLS.SESSIONS);
    await expect(page).toHaveURL(PAGE_URLS.SESSIONS);

    sessionsPage = new SessionsPage(page);
  });
});

test("Assert user name in single session page", async () => {
  await test.step("Verify sessions table and user session row is visible", async () => {
    const sessionsTable = sessionsPage.getSessionsTable();
    await expect(sessionsTable).toBeVisible();
    const sessionRow = sessionsPage.getSessionRowByName(randomUserName);
    await expect(sessionRow).toBeVisible();
  });

  await test.step("Navigate to single session page and verify session info title", async () => {
    singleSessionPage = await sessionsPage.clickOnSessionRowByName(randomUserName);
    const sessionTitle = await singleSessionPage.getSessionInfoTitle();
    expect(sessionTitle, "Session detail page should display the Session Info title").toContain(
      Labels.SESSION_INFO,
    );
  });

  await test.step("Verify ID OCR table and content", async () => {
    const idOCRTableVisible = await singleSessionPage.isIdOCRTableVisible();
    expect(idOCRTableVisible, "ID OCR table should be visible after scrolling into view").toBe(
      true,
    );
    const userNameInTable = await singleSessionPage.getIdOCRContentByLabel(Labels.FULL_NAME_OCR);
    const expectedUserName = randomUserName.toUpperCase(); // OCR content is in uppercase
    expect(userNameInTable, "User name in ID OCR table matches name from sessions table").toBe(
      expectedUserName,
    );
  });
});
