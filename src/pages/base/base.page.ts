import { Locator, Page } from "@playwright/test";
import { Labels } from "../../constants/labels";

export class BasePage {
  readonly page: Page;
  readonly sideNavigation: Locator;
  readonly navigationLinks: (link: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.sideNavigation = page.getByRole("navigation", { name: Labels.MAIN_NAVIGATION });
    this.navigationLinks = (link: string) => this.sideNavigation.getByRole("link", { name: link });
  }

  async isMainNavigationVisible(): Promise<boolean> {
    await this.sideNavigation.waitFor({ state: "visible" });
    return true;
  }

  async navigateTo(link: string) {
    await this.navigationLinks(link).click();
  }
}
