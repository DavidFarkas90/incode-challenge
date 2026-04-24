import { Page, Locator } from "@playwright/test";
import { Labels } from "../../constants/labels";
import { IdentitiesPage } from "./identities.page";

export class SingleIdentityPage {
  readonly page: Page;
  readonly singleIdentityTitle: (identity: string) => Locator;
  readonly backToIdentitiesBreadCrumb: Locator;
  readonly identityConfirmedLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.singleIdentityTitle = (identity: string) =>
      page.getByRole("heading", { name: identity, exact: true });
    this.backToIdentitiesBreadCrumb = page.locator(".go-back", { hasText: Labels.IDENTITIES });
    this.identityConfirmedLabel = page.locator(".confirmed", {
      hasText: Labels.IDENTITY_CONFIRMED,
    });
  }

  async getSingleIdentityTitleByIdentity(identity: string): Promise<Locator> {
    return await this.singleIdentityTitle(identity);
  }

  async getBackToIdentitiesBreadCrumb(): Promise<Locator> {
    return await this.backToIdentitiesBreadCrumb;
  }

  async getIdentityConfirmedLabel(): Promise<Locator> {
    return await this.identityConfirmedLabel;
  }

  async clickBackToIdentitiesBreadCrumb(): Promise<IdentitiesPage> {
    await this.backToIdentitiesBreadCrumb.click();
    return new IdentitiesPage(this.page);
  }
}
