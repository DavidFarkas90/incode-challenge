import { Labels } from "../../constants/labels";
import { Locator, Page } from "@playwright/test";
import { SingleSessionPage } from "./single-session.page";

export class SessionsPage {
  readonly page: Page;
  readonly sessionTitle: Locator;
  readonly sessionsTable: Locator;
  readonly moreActionsButton: Locator;
  readonly reviewSessionsButton: Locator;
  readonly sessionTableRowByName: (name: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.sessionTitle = page.getByText(Labels.SESSIONS);
    this.sessionsTable = page.getByRole("table");
    this.moreActionsButton = page.getByRole("button", { name: Labels.ACTIONS });
    this.reviewSessionsButton = page.getByRole("button", { name: Labels.REVIEW_SESSIONS });
    this.sessionTableRowByName = (name: string) => page.getByText(name);
  }

  async getSessionTitle(): Promise<string> {
    return await this.sessionTitle.innerText();
  }

  async isSessionsTableVisible(): Promise<boolean> {
    await this.sessionsTable.waitFor({ state: "visible" });
    return true;
  }

  async getSessionRowByName(name: string): Promise<Locator> {
    return this.sessionTableRowByName(name);
  }

  async clickOnSessionRowByName(name: string): Promise<SingleSessionPage> {
    await this.sessionTableRowByName(name).click();
    return new SingleSessionPage(this.page);
  }
}
