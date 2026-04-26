import { Locator, Page } from "@playwright/test";
import { Labels } from "../../constants/labels";
import { SingleIdentityPage } from "../identities/single-identity.page";

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

  constructor(page: Page) {
    this.page = page;
    this.sessionInfoTitle = page.getByText(Labels.SESSION_INFO);
    this.addFaceToDatabaseButton = page.getByRole("button", { name: Labels.ADD_FACE_TO_DATABASE });
    this.faceInDatabaseLabel = page.getByText(Labels.FACE_IN_DATABASE);
    this.hamburgerMenuIcon = page.getByRole("button", { name: Labels.MENU_ICON });
    this.menuList = page.locator("ul.menu-list__list");
    this.menuListItem = (menuItem: string) => this.menuList.getByText(menuItem);
    this.idOCRTable = page.getByText(Labels.ID_OCR);
    this.idOCRContent = page.locator(".id-info .dinamic-field");
  }

  getFaceInDatabaseLabel(): Locator {
    return this.faceInDatabaseLabel;
  }

  getMenuList(): Locator {
    return this.menuList;
  }

  getIdOCRTable(): Locator {
    return this.idOCRTable;
  }

  getIdOCRContent(): Locator {
    return this.idOCRContent;
  }

  async getIdOCRContentByLabel(text: string): Promise<string> {
    return await this.getIdOCRContent()
      .filter({ has: this.page.getByRole("heading", { name: text }) })
      .locator(".content")
      .innerText();
  }

  async clickAddFaceToDatabaseButton(): Promise<void> {
    await this.addFaceToDatabaseButton.click();
  }

  async clickOnHamburgerMenu(): Promise<void> {
    await this.hamburgerMenuIcon.click();
  }

  async clickOnGoToIdentityMenuItem(): Promise<SingleIdentityPage> {
    await this.menuListItem(Labels.GO_TO_IDENTITY).click();
    return new SingleIdentityPage(this.page);
  }
}
