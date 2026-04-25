import { Locator, Page } from "@playwright/test";
import { SingleSessionPage } from "./single-session.page";

export class SessionsPage {
  readonly page: Page;
  readonly sessionsTable: Locator;
  readonly sessionTableRowByName: (name: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.sessionsTable = page.getByRole("table");
    this.sessionTableRowByName = (name: string) => page.getByRole("row").filter({ hasText: name });
  }

  getSessionsTable(): Locator {
    return this.sessionsTable;
  }

  getSessionRowByName(name: string): Locator {
    return this.sessionTableRowByName(name);
  }

  async clickOnSessionRowByName(name: string): Promise<SingleSessionPage> {
    await this.sessionTableRowByName(name).click();
    return new SingleSessionPage(this.page);
  }
}
