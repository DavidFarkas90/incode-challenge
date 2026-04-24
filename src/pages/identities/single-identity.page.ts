import { Page, Locator } from "@playwright/test";
import { Labels } from "../../constants/labels";

export class SingleIdentityPage {
  readonly page: Page;
  readonly singleIdentityTitle: (identity: string) => Locator;
  readonly identityConfirmedLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.singleIdentityTitle = (identity: string) =>
      page.getByRole("heading", { name: identity, exact: true });
    this.identityConfirmedLabel = page.locator(".confirmed", {
      hasText: Labels.IDENTITY_CONFIRMED,
    });
  }

  async getSingleIdentityTitleByIdentity(identity: string): Promise<Locator> {
    return await this.singleIdentityTitle(identity);
  }

  async getIdentityConfirmedLabel(): Promise<Locator> {
    return await this.identityConfirmedLabel;
  }
}
