import { Locator, Page } from "@playwright/test";
import { Labels } from "../../constants/labels";

export class SingleSessionPage {
  readonly page: Page;
  // Header
  readonly sessionInfoTitle: Locator;
  readonly addFaceToDatabaseButton: Locator;
  readonly faceInDatabaseLabel: Locator;
  // ID OCR table and content
  readonly idOCRTable: Locator;
  readonly idOCRContent: Locator;
  readonly tableCellContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sessionInfoTitle = page.getByText(Labels.SESSION_INFO);
    this.addFaceToDatabaseButton = page.getByTestId("button-icon-iconBtnAdd");
    this.faceInDatabaseLabel = page.locator(".status-set", { hasText: Labels.FACE_IN_DATABASE });
    this.idOCRTable = page.getByText(Labels.ID_OCR);
    this.idOCRContent = page.locator(".id-info .dinamic-field");
    this.tableCellContent = page.locator(".content");
  }

  async getSessionInfoTitle(): Promise<string> {
    return await this.sessionInfoTitle.innerText();
  }

  async getAddToFaceButton(): Promise<Locator> {
    return this.addFaceToDatabaseButton;
  }

  async getFaceInDatabaseLabel(): Promise<Locator> {
    return this.faceInDatabaseLabel;
  }

  async getIdOCRTable(): Promise<Locator> {
    return this.idOCRTable;
  }

  async getIdOCRContent(): Promise<Locator> {
    return this.idOCRContent;
  }

  async isIdOCRTableVisible(): Promise<boolean> {
    await (await this.getIdOCRTable()).scrollIntoViewIfNeeded();
    await (await this.getIdOCRTable()).waitFor({ state: "visible" });
    return true;
  }

  async getIdOCRContentByLabel(text: string): Promise<string> {
    return await (
      await this.getIdOCRContent()
    )
      .filter({ has: this.page.getByRole("heading", { name: text }) })
      .locator(".content")
      .innerText();
  }
}
