import { test, expect } from "../fixtures/fixtures";
import { PAGE_URLS, API_URLS } from "../constants/urls";
import { BasePage } from "../pages/base/base.page";
import { FlowsPage } from "../pages/flows/flows.page";
import { Labels } from "../constants/labels";
import { StatusCodes } from "../constants/status-codes";
import { NewFlowPage } from "../pages/flows/new-flow.page";
import { Modules } from "../constants/modules";
import { deleteFlowsById } from "../helpers/api-helpers";

let basePage: BasePage;
let flowsPage: FlowsPage;
let newFlowPage: NewFlowPage;
let flowId = "";
const newFlowName = `Incode Flow_${Math.floor(Math.random() * 1000)}`; // To ensure unique flow name for each test run
const expectedModuleCount = 2;

test.afterEach("Cleanup created flow", async ({ request }) => {
  if (flowId) {
    await deleteFlowsById(request, flowId);
    flowId = "";
  }
});

test("create new flow and verify in flows table", async ({ page }) => {
  await test.step("Navigate to Flows page", async () => {
    basePage = new BasePage(page);
    expect(await basePage.getSideNavigation()).toBeVisible();

    await basePage.navigateTo(Labels.FLOWS);
    await expect(page).toHaveURL(PAGE_URLS.FLOWS());
    flowsPage = new FlowsPage(page);
    expect(await flowsPage.getFlowsTitle()).toEqual(Labels.FLOWS);
  });

  await test.step("Click on add new flow button", async () => {
    await flowsPage.clickOnAddNewFlowButton();
    newFlowPage = new NewFlowPage(page);
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
    await newFlowPage.hoverOverModuleRow(Modules.ID_CAPTURE);
    await expect(await newFlowPage.getAddModuleButton()).toBeVisible();
    await newFlowPage.clickOnAddModuleButton();
    await expect(await newFlowPage.getAddedModuleByName(Modules.ID_CAPTURE)).toHaveCount(
      expectedModuleCount,
    );
    expect(await newFlowPage.isSaveChangesButtonDisabled()).toBe(false);
  });

  await test.step("Add ID Validation module to the flow", async () => {
    await newFlowPage.hoverOverModuleRow(Modules.ID_VALIDATION);
    await expect(await newFlowPage.getAddModuleButton()).toBeVisible();
    await newFlowPage.clickOnAddModuleButton();
    await expect(await newFlowPage.getAddedModuleByName(Modules.ID_VALIDATION)).toHaveCount(
      expectedModuleCount,
    );
  });

  await test.step("Add Face Capture module to the flow", async () => {
    await newFlowPage.searchForModule(Modules.FACE_CAPTURE);
    await newFlowPage.hoverOverSearchedModule(Modules.FACE_CAPTURE);
    await expect(await newFlowPage.getAddModuleButton()).toBeVisible();
    await newFlowPage.clickOnAddModuleButton();
    await newFlowPage.clearSearchModuleInput();
    await expect(await newFlowPage.getAddedModuleByName(Modules.FACE_CAPTURE)).toHaveCount(
      expectedModuleCount,
    );
  });

  await test.step("Save changes to new flow", async () => {
    // Intercept request to save flowId for cleanup
    const responsePromise = page.waitForResponse(
      (res) => res.url().startsWith(API_URLS.FLOW_BASE_URL()) && res.request().method() === "POST",
    );
    await newFlowPage.clickOnSaveChangesButton();
    // Extract created flowId
    const response = await responsePromise;
    await expect(response.status()).toEqual(StatusCodes.SUCCESS);
    const body = await response.json();
    flowId = body.flowId;

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
