import { test, expect } from "../fixtures/fixtures";
import { getValidatedSessionNames } from "../helpers/api-helpers";
import { PAGE_URLS } from "../constants/urls";
import { BasePage } from "../pages/base/base.page";
import { Labels } from "../constants/labels";
import { SessionsPage } from "../pages/sessions/sessions.page";
import { SingleSessionPage } from "../pages/sessions/single-session.page";

let sessionsPage: SessionsPage;
let singleSessionPage: SingleSessionPage;
let basePage: BasePage;
let sessionNames: string[] = [];
let randomUserName: string;

test("Assert user name in single session page", async ({ page, request }) => {
  await test.step("Navigate to Sessions page", async () => {
    basePage = new BasePage(page);
    expect(await basePage.getSideNavigation()).toBeVisible();

    await basePage.navigateTo(Labels.SESSIONS);
    await expect(page).toHaveURL(PAGE_URLS.SESSIONS());

    sessionsPage = new SessionsPage(page);
    // Get all validated session names via API
    sessionNames = await getValidatedSessionNames(request);
    randomUserName = sessionNames[Math.floor(Math.random() * sessionNames.length)];
  });

  await test.step("Verify sessions table and user session row is visible", async () => {
    const sessionsTable = await sessionsPage.getSessionsTable();
    await expect(sessionsTable).toBeVisible();
    const sessionRow = await sessionsPage.getSessionRowByName(randomUserName);
    await expect(sessionRow).toBeVisible();
  });

  await test.step("Navigate to single session page and verify session info title", async () => {
    await sessionsPage.clickOnSessionRowByName(randomUserName);
    singleSessionPage = new SingleSessionPage(page);
    const sessionTitle = await singleSessionPage.getSessionInfoTitle();
    expect(sessionTitle).toContain(Labels.SESSION_INFO);
  });

  await test.step("Verify ID OCR table and content", async () => {
    const idOCRTableVisible = await singleSessionPage.isIdOCRTableVisible();
    expect(idOCRTableVisible).toBe(true);
    const userNameInTable = await singleSessionPage.getIdOCRContentByLabel(Labels.FULL_NAME_OCR);
    const expectedUserName = randomUserName.toUpperCase(); // OCR content is in uppercase
    expect(userNameInTable, "User name in ID OCR table matches name from sessions table").toBe(
      expectedUserName,
    );
  });
});
