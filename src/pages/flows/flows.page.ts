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
    this.flowsTable = page.locator("table.flows-table");
    this.flowRow = (name: string, status: string) =>
      page
        .getByRole("row")
        .filter({ has: page.getByRole("cell", { name: name, exact: true }) })
        .filter({ has: page.getByRole("cell", { name: status, exact: true }) });
  }

  async getFlowsTitle(): Promise<string> {
    return await this.flowsTitle.innerText();
  }

  async getFlowsTable(): Promise<Locator> {
    return this.flowsTable;
  }

  async getFlowRowByParams(name: string, status: string): Promise<Locator> {
    return this.flowRow(name, status);
  }

  async clickOnAddNewFlowButton(): Promise<NewFlowPage> {
    await this.addNewFlowButton.click();
    return new NewFlowPage(this.page);
  }
}
