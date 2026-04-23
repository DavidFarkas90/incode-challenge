import { Locator, Page } from "@playwright/test";
import { PAGE_URLS } from "../../constants/urls";
import { Labels } from "../../constants/labels";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId("email-input");
    this.passwordInput = page.getByRole("textbox", { name: Labels.PASSWORD });
    this.loginButton = page.getByRole("button", { name: Labels.LOG_IN });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.emailInput.press("Tab");
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
