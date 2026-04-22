import { Locator, Page } from "@playwright/test";
import { Labels } from "../../constants/labels";

export class SingleSessionPage {
  readonly page: Page;
  readonly sessionInfoTitle: Locator;
  readonly addFaceToDatabaseButton: Locator;
  readonly tooltipMenuButton: Locator;
  readonly idVerificationTable: Locator;
  readonly idOCRTable: Locator;
  readonly idOCRContent: Locator;
  readonly tableCellContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sessionInfoTitle = page.getByText(Labels.SESSION_INFO);
    this.addFaceToDatabaseButton = page.getByTestId("button-icon-iconBtnAdd");
    this.tooltipMenuButton = page.getByTestId("tooltip-wrapper");
    this.idVerificationTable = page.getByText(Labels.ID_VERIFICATION);
    this.idOCRTable = page.getByText(Labels.ID_OCR);
    this.idOCRContent = page.locator(".id-info .dinamic-field");
    this.tableCellContent = page.locator(".content");
  }

  async getSessionInfoTitle(): Promise<string> {
    return await this.sessionInfoTitle.innerText();
  }

  async isAddFaceToDatabaseButtonVisible(): Promise<boolean> {
    await this.addFaceToDatabaseButton.waitFor({ state: "visible" });
    return true;
  }

  async isTooltipMenuButtonVisible(): Promise<boolean> {
    await this.tooltipMenuButton.waitFor({ state: "visible" });
    return true;
  }

  async isIdVerificationTableVisible(): Promise<boolean> {
    await this.idVerificationTable.waitFor({ state: "visible" });
    return true;
  }

  async isIdOCRTableVisible(): Promise<boolean> {
    await this.idOCRTable.scrollIntoViewIfNeeded();
    await this.idOCRTable.waitFor({ state: "visible" });
    return true;
  }

  async getIdOCRContentByLabel(text: string): Promise<string> {
    return await this.idOCRContent
      .filter({ has: this.page.getByRole("heading", { name: text }) })
      .locator(".content")
      .innerText();
  }
}
