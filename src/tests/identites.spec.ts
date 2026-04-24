import { test, expect } from "../fixtures/fixtures";
import { Labels } from "../constants/labels";
import { StatusCodes } from "../constants/status-codes";
import { getValidatedSessionNames, deleteAllExistingIdentities } from "../helpers/api-helpers";
import { getRandomElement, toTitleCase } from "../helpers/common-helpers";
import { PAGE_URLS, API_URLS } from "../constants/urls";
import { BasePage } from "../pages/base/base.page";
import { SessionsPage } from "../pages/sessions/sessions.page";
import { SingleSessionPage } from "../pages/sessions/single-session.page";
import { IdentitiesPage } from "../pages/identities/identities.page";
import { SingleIdentityPage } from "../pages/identities/single-identity.page";

let sessionsPage: SessionsPage;
let singleSessionPage: SingleSessionPage;
let singleIdentityPage: SingleIdentityPage;
let identitiesPage: IdentitiesPage;
let basePage: BasePage;
let sessionNames: string[] = [];
let randomUserName: string;
let userIdentity: string;
let userIdentityTitleCase: string;
let identityId: string;

test.beforeEach(
  "Precondition: cleanup existing data, and navigate to page",
  async ({ page, request }) => {
    await test.step("Cleanup existing identities", async () => {
      await deleteAllExistingIdentities(request);
    });

    await test.step("Navigate to Sessions > Single session page", async () => {
      basePage = new BasePage(page);
      expect(await basePage.getSideNavigation()).toBeVisible();

      await basePage.navigateTo(Labels.SESSIONS);
      await expect(page).toHaveURL(PAGE_URLS.SESSIONS());

      sessionsPage = new SessionsPage(page);
      // Get all validated session names via API
      sessionNames = await getValidatedSessionNames(request);
      randomUserName = getRandomElement(sessionNames);
      userIdentity = randomUserName.toLowerCase(); // On single identity page it's in lowercase
      userIdentityTitleCase = toTitleCase(randomUserName); // In identity table it's in title case
      await sessionsPage.clickOnSessionRowByName(randomUserName);
      singleSessionPage = new SingleSessionPage(page);
    });
  },
);

test("Add face to database and verify it on Identities page", async ({ page }) => {
  await test.step("Verify the face is not added to database", async () => {
    await expect(await singleSessionPage.isAddFaceToDatabaseDisabled()).toEqual(false);
  });

  await test.step("Add face to database", async () => {
    // Intercept request to save identityId for verification
    const responsePromise = page.waitForResponse(
      (res) =>
        res.url().startsWith(API_URLS.ADD_FACE_TO_DATABASE()) && res.request().method() === "POST",
    );
    await singleSessionPage.clickAddFaceToDatabaseButton();
    const toast = await basePage.getNotificationToast(Labels.FACE_ADDED_TO_DB);
    await expect(toast).toBeVisible();

    await expect(await singleSessionPage.getFaceInDatabaseLabel()).toBeVisible();
    // Extract created identityId
    const response = await responsePromise;
    await expect(response.status()).toEqual(StatusCodes.SUCCESS);
    const body = await response.json();
    identityId = body.uuid;
    await expect(toast).not.toBeVisible({ timeout: 10000 }); // Wait for toast to disappear so that the identity is added to the table
  });

  await test.step("Navigate to Identities page", async () => {
    await singleSessionPage.clickOnHamburgerMenu();
    await expect(await singleSessionPage.getMenuList()).toBeVisible();
    await singleSessionPage.clickOnMenuItem(Labels.GO_TO_IDENTITY);
    singleIdentityPage = new SingleIdentityPage(page);
  });

  await test.step("Verify the single identity data", async () => {
    await expect(
      await singleIdentityPage.getSingleIdentityTitleByIdentity(userIdentity),
    ).toBeVisible();
    await expect(await singleIdentityPage.getIdentityConfirmedLabel()).toBeVisible();
  });

  await test.step("Navigate to Identities table, and verify the identity is shown in the table", async () => {
    await singleIdentityPage.clickBackToIdentitiesBreadCrumb();
    identitiesPage = new IdentitiesPage(page);
    await expect(await identitiesPage.getIdentitiesTitle()).toBeVisible();
    await expect(
      await identitiesPage.getIdentitiesRowByParams(userIdentityTitleCase, identityId),
    ).toBeVisible();
  });
});
