import { Page, Locator } from "@playwright/test";
import { Labels } from "../../constants/labels";

export class IdentitiesPage {
  readonly page: Page;
  readonly identitiesTitle: Locator;
  readonly identitiesRow: (name: string, identity: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.identitiesTitle = page.getByRole("heading", { name: Labels.IDENTITIES });
    this.identitiesRow = (name: string, identity: string) =>
      page
        .getByRole("row")
        .filter({ has: page.getByRole("cell", { name: name, exact: true }) })
        .filter({ has: page.getByRole("cell", { name: identity, exact: true }) });
  }

  getIdentitiesTitle(): Locator {
    return this.identitiesTitle;
  }

  getIdentitiesRowByParams(name: string, identity: string): Locator {
    return this.identitiesRow(name, identity);
  }
}
