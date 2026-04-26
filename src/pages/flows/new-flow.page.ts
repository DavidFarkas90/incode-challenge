import { Locator, Page } from "@playwright/test";
import { Labels } from "../../constants/labels";
import { FlowsPage } from "./flows.page";

export class NewFlowPage {
  readonly page: Page;
  // Header
  readonly editFlowNameButton: Locator;
  readonly flowNameInput: Locator;
  readonly flowName: (flowName: string) => Locator;
  readonly saveButton: Locator;
  readonly saveChangesButton: Locator;
  readonly liveFlowToggle: Locator;
  readonly unsavedChangesNotification: Locator;
  readonly backToFlowListButton: Locator;
  // Select Modules tab
  readonly searchModulesInput: Locator;
  readonly presentation: Locator;
  readonly addModuleButton: Locator;
  readonly moduleRow: (moduleName: string) => Locator;
  // Added flow preview
  readonly addedModule: (moduleName: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchModulesInput = page.getByRole("textbox", { name: Labels.SEARCH_MODULES });
    this.presentation = page.getByRole("presentation");
    this.addModuleButton = page.getByRole("button", { name: Labels.ADD });
    this.editFlowNameButton = page.getByRole("button", { name: Labels.EDIT_FLOW_NAME });
    this.flowNameInput = page.getByRole("textbox", { name: Labels.FLOW_NAME });
    this.flowName = (flowName: string) => page.getByRole("heading", { name: flowName });
    this.saveButton = page.getByRole("button", { name: Labels.SAVE, exact: true });
    this.saveChangesButton = page.getByRole("button", { name: Labels.SAVE_CHANGES, exact: true });
    this.liveFlowToggle = page.getByRole("button", { name: Labels.LIVE_FLOW });
    this.unsavedChangesNotification = page.getByText(Labels.UNSAVED_CHANGES);
    this.backToFlowListButton = page.getByRole("button", { name: Labels.BACK_FLOW_LIST });
    this.moduleRow = (moduleName: string) => this.presentation.getByText(moduleName);
    this.addedModule = (moduleName: string) => page.getByText(moduleName);
  }
  getFlowNameInput(): Locator {
    return this.flowNameInput;
  }

  getFlowName(flowName: string): Locator {
    return this.flowName(flowName);
  }

  getSaveChangesButton(): Locator {
    return this.saveChangesButton;
  }

  getUnsavedChangesNotification(): Locator {
    return this.unsavedChangesNotification;
  }

  getAddedModuleByName(moduleName: string): Locator {
    return this.addedModule(moduleName);
  }

  async clickOnEditFlowNameButton(): Promise<void> {
    await this.editFlowNameButton.click();
  }

  async enterFlowName(name: string): Promise<void> {
    await this.flowNameInput.fill(name);
  }

  async clickOnSaveChangesButton(): Promise<void> {
    await this.saveChangesButton.click();
  }

  async clickOnSaveButton(): Promise<void> {
    await this.saveButton.click();
  }

  async clickOnBackToFlowListButton(): Promise<FlowsPage> {
    await this.backToFlowListButton.click();
    return new FlowsPage(this.page);
  }

  async clickOnAddModuleButton(): Promise<void> {
    await this.addModuleButton.click();
  }

  async hoverOverModuleRow(moduleName: string): Promise<void> {
    await this.moduleRow(moduleName).hover();
  }

  async searchForModule(moduleName: string): Promise<void> {
    await this.searchModulesInput.fill(moduleName);
  }

  async clearSearchModuleInput(): Promise<void> {
    await this.searchModulesInput.clear();
  }

  async toggleLiveFlow(): Promise<void> {
    await this.liveFlowToggle.click();
  }

  async addModuleUsingHover(moduleName: string): Promise<void> {
    await this.hoverOverModuleRow(moduleName);
    await this.addModuleButton.waitFor({ state: "visible" });
    await this.clickOnAddModuleButton();
  }
}
