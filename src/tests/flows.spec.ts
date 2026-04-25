import { test, expect } from "../fixtures/fixtures";
import { generateRandomNumbers } from "../helpers/common-helpers";
import { PAGE_URLS } from "../constants/urls";
import { FlowsPage } from "../pages/flows/flows.page";
import { Labels } from "../constants/labels";
import { NewFlowPage } from "../pages/flows/new-flow.page";
import { Modules } from "../constants/modules";
import { deleteFlowsByName } from "../helpers/api-helpers";

let flowsPage: FlowsPage;
let newFlowPage: NewFlowPage;
const flowPrefix = "Incode Flow";
const newFlowName: string = `${flowPrefix}_${generateRandomNumbers()}`; // To ensure unique flow name for each test run
const searchPhrase: string = "ID";
const expectedModuleCount: number = 2;

test.beforeEach("Cleanup created flows", async ({ page: _page, request }) => {
  await deleteFlowsByName(request, flowPrefix);
});

test("Create new active flow and verify in flows table", async ({ page, basePage }) => {
  await test.step("Navigate to Flows page", async () => {
    await basePage.navigateTo(Labels.FLOWS);
    await expect(page).toHaveURL(PAGE_URLS.FLOWS);

    flowsPage = new FlowsPage(page);
    expect(
      await flowsPage.getFlowsTitle(),
      "Flows page heading should match expected label",
    ).toEqual(Labels.FLOWS);
  });

  await test.step("Click on add new flow button", async () => {
    newFlowPage = await flowsPage.clickOnAddNewFlowButton();
    await expect(newFlowPage.getFlowName(Labels.NEW_FLOW)).toBeVisible();
  });

  await test.step("Enter new flow name and save name", async () => {
    await newFlowPage.clickOnEditFlowNameButton();
    await expect(newFlowPage.getFlowNameInput()).toBeVisible();
    await newFlowPage.enterFlowName(newFlowName);
    await newFlowPage.clickOnSaveButton();
    await expect(newFlowPage.getFlowName(newFlowName)).toBeVisible();
  });

  await test.step("Add ID Capture module to the flow", async () => {
    expect(
      await newFlowPage.isSaveChangesButtonDisabled(),
      "Save Changes button should be disabled before any module is added",
    ).toBe(true);
    // Add modules using the search input
    await newFlowPage.searchForModule(searchPhrase);
    await newFlowPage.addModuleUsingHover(Modules.ID_CAPTURE);
    await expect(
      newFlowPage.getAddedModuleByName(Modules.ID_CAPTURE),
      "ID Capture module should appear in both the module list and the flow preview",
    ).toHaveCount(expectedModuleCount);
    expect(
      await newFlowPage.isSaveChangesButtonDisabled(),
      "Save Changes button should be enabled after adding a module",
    ).toBe(false);
  });

  await test.step("Add ID Validation module to the flow", async () => {
    await newFlowPage.addModuleUsingHover(Modules.ID_VALIDATION);
    await expect(
      newFlowPage.getAddedModuleByName(Modules.ID_VALIDATION),
      "ID Validation module should appear in both the module list and the flow preview",
    ).toHaveCount(expectedModuleCount);
    await newFlowPage.clearSearchModuleInput();
  });

  await test.step("Add Face Capture module to the flow", async () => {
    await newFlowPage.addModuleUsingHover(Modules.FACE_CAPTURE);
    await expect(
      newFlowPage.getAddedModuleByName(Modules.FACE_CAPTURE),
      "Face Capture module should appear in both the module list and the flow preview",
    ).toHaveCount(expectedModuleCount);
  });

  await test.step("Save changes to new flow", async () => {
    await newFlowPage.clickOnSaveChangesButton();
    await expect(basePage.getNotificationToast(Labels.FLOW_SAVED_CORRECTLY)).toBeVisible();
    await basePage.clickCloseNotificationButton();
    expect(
      await newFlowPage.isSaveChangesButtonDisabled(),
      "Save Changes button should be disabled after saving",
    ).toBe(true);
  });

  await test.step("Update created flow to live flow", async () => {
    await newFlowPage.toggleLiveFlow();
    await expect(newFlowPage.getUnsavedChangesNotification()).toBeVisible();
    expect(
      await newFlowPage.isSaveChangesButtonDisabled(),
      "Save Changes button should be enabled after toggling live flow",
    ).toBe(false);
    await newFlowPage.clickOnSaveChangesButton();
    await expect(basePage.getNotificationToast(Labels.FLOW_SAVED_CORRECTLY)).toBeVisible();
    await basePage.clickCloseNotificationButton();
  });

  await test.step("Get back to flows page and verify new flow is visible in the table", async () => {
    await newFlowPage.clickOnBackToFlowListButton();
    await expect(flowsPage.getFlowsTable()).toBeVisible();
    const newFlowRow = flowsPage.getFlowRowByParams(newFlowName, Labels.ACTIVE);
    await expect(newFlowRow).toBeVisible();
  });
});
