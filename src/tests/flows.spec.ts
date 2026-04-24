import { test, expect } from "../fixtures/fixtures";
import { generateRandomNumbers } from "../helpers/common-helpers";
import { PAGE_URLS, API_URLS } from "../constants/urls";
import { BasePage } from "../pages/base/base.page";
import { FlowsPage } from "../pages/flows/flows.page";
import { Labels } from "../constants/labels";
import { StatusCodes } from "../constants/status-codes";
import { NewFlowPage } from "../pages/flows/new-flow.page";
import { Modules } from "../constants/modules";
import { deleteFlowsByIds } from "../helpers/api-helpers";

let basePage: BasePage;
let flowsPage: FlowsPage;
let newFlowPage: NewFlowPage;
const flowPrefix = "Incode Flow";
const newFlowName: string = `${flowPrefix}_${generateRandomNumbers()}`; // To ensure unique flow name for each test run
const searchPhrase: string = "ID";
const expectedModuleCount: number = 2;

test.beforeEach("Cleanup created flows", async ({ page, request }) => {
  await deleteFlowsByIds(request, flowPrefix);
});

test("Create new active flow and verify in flows table", async ({ page }) => {
  await test.step("Navigate to Flows page", async () => {
    basePage = new BasePage(page);
    expect(await basePage.getSideNavigation()).toBeVisible();

    await basePage.navigateTo(Labels.FLOWS);
    await expect(page).toHaveURL(PAGE_URLS.FLOWS());
    flowsPage = new FlowsPage(page);
    expect(await flowsPage.getFlowsTitle()).toEqual(Labels.FLOWS);
  });

  await test.step("Click on add new flow button", async () => {
    newFlowPage = await flowsPage.clickOnAddNewFlowButton();
    await expect(await newFlowPage.getFlowName(Labels.NEW_FLOW)).toBeVisible();
  });

  await test.step("Enter new flow name and save name", async () => {
    await newFlowPage.clickOnEditFlowNameButton();
    expect(await newFlowPage.getFlowNameInput()).toBeVisible();
    await newFlowPage.enterFlowName(newFlowName);
    await newFlowPage.clickOnSaveButton();
    await expect(await newFlowPage.getFlowName(newFlowName)).toBeVisible();
  });

  await test.step("Add ID Capture module to the flow", async () => {
    expect(await newFlowPage.isSaveChangesButtonDisabled()).toBe(true);
    // Add modules using the search input
    await newFlowPage.searchForModule(searchPhrase);
    await newFlowPage.addModuleUsingHover(Modules.ID_CAPTURE);
    await expect(await newFlowPage.getAddedModuleByName(Modules.ID_CAPTURE)).toHaveCount(
      expectedModuleCount,
    );
    expect(await newFlowPage.isSaveChangesButtonDisabled()).toBe(false);
  });

  await test.step("Add ID Validation module to the flow", async () => {
    await newFlowPage.addModuleUsingHover(Modules.ID_VALIDATION);
    await expect(await newFlowPage.getAddedModuleByName(Modules.ID_VALIDATION)).toHaveCount(
      expectedModuleCount,
    );
    await newFlowPage.clearSearchModuleInput();
  });

  await test.step("Add Face Capture module to the flow", async () => {
    await newFlowPage.addModuleUsingHover(Modules.FACE_CAPTURE);
    await expect(await newFlowPage.getAddedModuleByName(Modules.FACE_CAPTURE)).toHaveCount(
      expectedModuleCount,
    );
  });

  await test.step("Save changes to new flow", async () => {
    await newFlowPage.clickOnSaveChangesButton();
    expect(await basePage.getNotificationToast(Labels.FLOW_SAVED_CORRECTLY)).toBeVisible();
    await basePage.clickCloseNotificationButton();
    expect(await newFlowPage.isSaveChangesButtonDisabled()).toBe(true);
  });

  await test.step("Update created flow to live flow", async () => {
    await newFlowPage.toggleLiveFlow();
    await expect(await newFlowPage.getUnsavedChangesNotification()).toBeVisible();
    expect(await newFlowPage.isSaveChangesButtonDisabled()).toBe(false);
    await newFlowPage.clickOnSaveChangesButton();
    expect(await basePage.getNotificationToast(Labels.FLOW_SAVED_CORRECTLY)).toBeVisible();
    await basePage.clickCloseNotificationButton();
  });

  await test.step("Get back to flows page and verify new flow is visible in the table", async () => {
    await newFlowPage.clickOnBackToFlowListButton();
    expect(await flowsPage.getFlowsTable()).toBeVisible();
    const newFlowRow = await flowsPage.getFlowRowByParams(newFlowName, Labels.ACTIVE);
    await expect(newFlowRow).toBeVisible();
  });
});
