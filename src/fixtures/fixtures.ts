import "dotenv/config";
import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/login/login.page";
import { PAGE_URLS } from "../constants/urls";
import { setApiCredentials } from "../helpers/api-helpers";

export const test = base.extend({
  page: async ({ page }, use) => {
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
  },
});

export { expect } from "@playwright/test";
