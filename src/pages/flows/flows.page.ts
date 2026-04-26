import { Page, Locator } from "@playwright/test";
import { Labels } from "../../constants/labels";
import { NewFlowPage } from "./new-flow.page";

export class FlowsPage {
  readonly page: Page;
  readonly flowsTitle: Locator;
  readonly addNewFlowButton: Locator;
  readonly flowsTable: Locator;
  readonly flowRow: (name: string, status: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.flowsTitle = page.getByRole("heading", { name: Labels.FLOWS });
    this.addNewFlowButton = page.getByRole("button", { name: Labels.NEW });
    this.flowsTable = page.getByRole("table");
    this.flowRow = (name: string, status: string) =>
      page
        .getByRole("row")
        .filter({ has: page.getByRole("cell", { name: name, exact: true }) })
        .filter({ has: page.getByRole("cell", { name: status, exact: true }) });
  }

  getFlowsTable(): Locator {
    return this.flowsTable;
  }

  getFlowRowByParams(name: string, status: string): Locator {
    return this.flowRow(name, status);
  }

  async clickOnAddNewFlowButton(): Promise<NewFlowPage> {
    await this.addNewFlowButton.click();
    return new NewFlowPage(this.page);
  }
}
