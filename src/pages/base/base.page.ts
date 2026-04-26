import { Locator, Page } from "@playwright/test";
import { Labels } from "../../constants/labels";

export class BasePage {
  readonly page: Page;
  readonly notificationToast: (notificationText: string) => Locator;
  readonly closeToastNotification: Locator;

  constructor(page: Page) {
    this.page = page;
    this.notificationToast = (notificationText: string) =>
      page.getByRole("alert").filter({ hasText: notificationText });
    this.closeToastNotification = page.getByRole("button", { name: Labels.CLOSE });
  }

  getNotificationToast(notificationText: string): Locator {
    return this.notificationToast(notificationText);
  }

  async clickCloseNotificationButton(): Promise<void> {
    await this.closeToastNotification.click();
  }
}
