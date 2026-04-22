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

  async getSideNavigation(): Promise<Locator> {
    return this.sideNavigation;
  }

  async navigateTo(link: string) {
    await this.navigationLinks(link).click();
  }
}
