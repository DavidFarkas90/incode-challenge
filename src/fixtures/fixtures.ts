import "dotenv/config";
import { test as base } from "@playwright/test";
import { BasePage } from "../pages/base/base.page";
import { PAGE_URLS } from "../constants/urls";
import { logout, login, setToken } from "../helpers/api-helpers";

export const test = base.extend<{ basePage: BasePage }>({
  page: async ({ page, request }, use) => {
    const token = await login(request);
    setToken(token);

    await page.addInitScript(
      ({ token, apiKey }) => {
        localStorage.setItem("IncodeDashboardLoginData", JSON.stringify({ token, apiKey }));
      },
      { token, apiKey: process.env.API_KEY },
    );

    await page.goto(PAGE_URLS.HOME);

    await use(page);

    await logout(request);
  },
  basePage: async ({ page }, use) => {
    await use(new BasePage(page));
  },
});

export { expect } from "@playwright/test";
