import { Locator, Page } from "@playwright/test";
import { Labels } from "../../constants/labels";
import strict from "node:assert/strict";

export class NewFlowPage {
  readonly page: Page;
  // Header
  readonly editFlowNameButton: Locator;
  readonly flowNameInput: Locator;
  readonly flowName: (flowName: string) => Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;
  readonly saveChangesButton: Locator;
  // Tabs
  readonly selectModulesTab: Locator;
  readonly settingsTab: Locator;
  // Select Modules tab
  readonly searchModulesInput: Locator;
  readonly presentation: Locator;
  readonly addModuleButton: Locator;
  readonly removeModuleButton: Locator;
  readonly detailsAndConfigurationButton: Locator;
  readonly moduleRow: (moduleName: string) => Locator;
  // Added flow preview
  readonly addedModule: (moduleName: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.selectModulesTab = page.getByRole("tab", { name: Labels.SELECT_MODULES });
    this.settingsTab = page.getByRole("tab", { name: Labels.SETTINGS });
    this.searchModulesInput = page.getByRole("textbox", { name: Labels.SEARCH_MODULES });
    this.presentation = page.getByRole("presentation");
    this.addModuleButton = page.getByRole("button", { name: Labels.ADD });
    this.removeModuleButton = page.getByRole("button", { name: Labels.REMOVE });
    this.editFlowNameButton = page.getByRole("button", { name: Labels.EDIT_FLOW_NAME });
    this.flowNameInput = page.getByRole("textbox", { name: Labels.FLOW_NAME });
    this.flowName = (flowName: string) => page.getByRole("heading", { name: flowName });
    this.cancelButton = page.getByRole("button", { name: Labels.CANCEL });
    this.saveButton = page.getByRole("button", { name: Labels.SAVE, exact: true });
    this.saveChangesButton = page.getByRole("button", { name: Labels.SAVE_CHANGES, exact: true });
    this.detailsAndConfigurationButton = page.getByRole("button", {
      name: Labels.DETAILS_AND_CONFIGURATION,
    });
    this.moduleRow = (moduleName: string) => page.getByText(moduleName);
    this.addedModule = (moduleName: string) => page.getByText(moduleName);
  }
  async getSelectModulesTab(): Promise<Locator> {
    return this.selectModulesTab;
  }
  async getSettingsTab(): Promise<Locator> {
    return this.settingsTab;
  }
  async getSearchModulesInput(): Promise<Locator> {
    return this.searchModulesInput;
  }
  async getPresentation(): Promise<Locator> {
    return this.presentation;
  }
  async getAddModuleButton(): Promise<Locator> {
    return this.addModuleButton;
  }
  async getRemoveModuleButton(): Promise<Locator> {
    return this.removeModuleButton;
  }
  async getEditFlowNameButton(): Promise<Locator> {
    return this.editFlowNameButton;
  }
  async getFlowNameInput(): Promise<Locator> {
    return this.flowNameInput;
  }

  async getFlowName(flowName: string): Promise<Locator> {
    return this.flowName(flowName);
  }

  async getCancelButton(): Promise<Locator> {
    return this.cancelButton;
  }
  async getSaveButton(): Promise<Locator> {
    return this.saveButton;
  }
  async getSaveChangesButton(): Promise<Locator> {
    return this.saveChangesButton;
  }
  async getDetailsAndConfigurationButton(): Promise<Locator> {
    return this.detailsAndConfigurationButton;
  }

  async getModuleRowByName(moduleName: string): Promise<Locator> {
    return this.moduleRow(moduleName);
  }

  async getAddedModuleByName(moduleName: string): Promise<Locator> {
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

  async clickOnCancelButton(): Promise<void> {
    await this.cancelButton.click();
  }

  async clickOnSaveButton(): Promise<void> {
    await this.saveButton.click();
  }

  async clickOnDetailsAndConfigurationButton(): Promise<void> {
    await this.detailsAndConfigurationButton.click();
  }

  async clickOnAddModuleButton(): Promise<void> {
    await this.addModuleButton.click();
  }

  async clickOnRemoveModuleButton(): Promise<void> {
    await this.removeModuleButton.click();
  }

  async hoverOverModuleRow(moduleName: string): Promise<void> {
    await this.moduleRow(moduleName).hover();
  }

  async searchForModule(moduleName: string): Promise<void> {
    await this.searchModulesInput.fill(moduleName);
  }

  async hoverOverSearchedModule(moduleName: string): Promise<void> {
    await this.presentation.filter({ hasText: moduleName }).hover();
  }

  async clearSearchModuleInput(): Promise<void> {
    await this.searchModulesInput.clear();
  }

  async hoverOverAddedModule(moduleName: string): Promise<void> {
    await this.addedModule(moduleName).hover();
  }

  async isSaveChangesButtonDisabled(): Promise<boolean> {
    return await this.saveChangesButton.isDisabled();
  }
}
