import { Locator, Page } from "@playwright/test";
import { Labels } from "../../constants/labels";

export class SingleSessionPage {
  readonly page: Page;
  // Header
  readonly sessionInfoTitle: Locator;
  readonly addFaceToDatabaseButton: Locator;
  readonly faceInDatabaseLabel: Locator;
  readonly hamburgerMenuIcon: Locator;
  readonly menuList: Locator;
  readonly menuListItem: (menuItem: string) => Locator;
  // ID OCR table and content
  readonly idOCRTable: Locator;
  readonly idOCRContent: Locator;
  readonly tableCellContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sessionInfoTitle = page.getByText(Labels.SESSION_INFO);
    this.addFaceToDatabaseButton = page.getByTestId("button-icon-iconBtnAdd");
    this.faceInDatabaseLabel = page.locator(".status-set", { hasText: Labels.FACE_IN_DATABASE });
    this.hamburgerMenuIcon = page.getByRole("button", { name: "menu icon" });
    this.menuList = page.locator("ul.menu-list__list");
    this.menuListItem = (menuItem: string) =>
      page.locator("ul.menu-list__list", { hasText: menuItem });
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

  async getHamburgerMenuIcon(): Promise<Locator> {
    return this.hamburgerMenuIcon;
  }

  async getMenuList(): Promise<Locator> {
    return this.menuList;
  }

  async getMenuListItem(menuItem: string): Promise<Locator> {
    return await this.menuListItem(menuItem);
  }

  async getIdOCRTable(): Promise<Locator> {
    return this.idOCRTable;
  }

  async getIdOCRContent(): Promise<Locator> {
    return this.idOCRContent;
  }

  async getIdOCRContentByLabel(text: string): Promise<string> {
    return await (
      await this.getIdOCRContent()
    )
      .filter({ has: this.page.getByRole("heading", { name: text }) })
      .locator(".content")
      .innerText();
  }

  async clickAddFaceToDatabaseButton(): Promise<void> {
    await this.addFaceToDatabaseButton.click();
  }

  async clickOnHamburgerMenu(): Promise<Locator> {
    await this.hamburgerMenuIcon.click();
    return this.menuList;
  }

  async clickOnMenuItem(menuItem: string): Promise<void> {
    // TODO: Update return type
    await this.menuListItem(menuItem).click();
  }

  async isAddFaceToDatabaseDisabled(): Promise<boolean> {
    return await this.addFaceToDatabaseButton.isDisabled();
  }

  async isIdOCRTableVisible(): Promise<boolean> {
    await (await this.getIdOCRTable()).scrollIntoViewIfNeeded();
    await (await this.getIdOCRTable()).waitFor({ state: "visible" });
    return true;
  }
}
