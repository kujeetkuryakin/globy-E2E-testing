import { test } from "@playwright/test";
import { LoginPage } from "../../../pages/shared/login.page";
import { AvailabilitySettingsPage } from "../../../pages/coach/availability_settings";

test("Setting Specific Dates (Online, Offline, Breaktime)", async ({ page }) => {
  test.setTimeout(60000);
  const loginPage = new LoginPage(page);
  const specific_dates = new AvailabilitySettingsPage(page);

  await loginPage.goto();
  await loginPage.login("elayne.selma@gmail.com", "Password123_");

  await specific_dates.goToAvailabilitySettings();
  await specific_dates.manageSpecificDate("7");
});
