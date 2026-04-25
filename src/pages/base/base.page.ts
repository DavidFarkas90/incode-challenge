import { Locator, Page } from "@playwright/test";
import { Labels } from "../../constants/labels";

export class BasePage {
  readonly page: Page;
  readonly sideNavigation: Locator;
  readonly navigationLinks: (link: string) => Locator;
  readonly notificationToast: (notificationText: string) => Locator;
  readonly closeToastNotification: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sideNavigation = page.getByRole("navigation", { name: Labels.MAIN_NAVIGATION });
    this.navigationLinks = (link: string) =>
      this.sideNavigation.getByRole("link").filter({ hasText: new RegExp(`^\\s*${link}\\s*$`) });
    this.notificationToast = (notificationText: string) =>
      page.locator(".Toastify__toast", { hasText: notificationText });
    this.closeToastNotification = page.getByRole("button", { name: Labels.CLOSE });
  }

  async getSideNavigation(): Promise<Locator> {
    return this.sideNavigation;
  }

  async getNotificationToast(notificationText: string): Promise<Locator> {
    return this.notificationToast(notificationText);
  }

  async navigateTo(link: string) {
    await this.navigationLinks(link).click();
  }

  async clickCloseNotificationButton(): Promise<void> {
    await this.closeToastNotification.click();
  }
}
