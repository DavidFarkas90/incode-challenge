import "dotenv/config";
import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/login/login.page";
import { BasePage } from "../pages/base/base.page";
import { PAGE_URLS } from "../constants/urls";
import { setApiCredentials, logout } from "../helpers/api-helpers";

export const test = base.extend<{ basePage: BasePage }>({
  page: async ({ page, request }, use) => {
    await page.goto(PAGE_URLS.LOGIN());
    const loginPage = new LoginPage(page);
    await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
    await page.waitForURL(PAGE_URLS.HOME);

    // Extract token and api key from localstorage to make API requests
    const { token, apiKey } = await page.evaluate(() => {
      const raw = localStorage.getItem("IncodeDashboardLoginData") ?? "{}";
      return JSON.parse(raw);
    });
    setApiCredentials(token ?? "", apiKey ?? "");

    await use(page);

    await logout(request);
  },
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    expect(await basePage.getSideNavigation()).toBeVisible();
    await use(basePage);
  },
});

export { expect } from "@playwright/test";
