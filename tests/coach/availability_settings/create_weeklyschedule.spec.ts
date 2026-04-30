import { test } from "@playwright/test";
import { LoginPage } from "../../../pages/shared/login.page";
import { AvailabilitySettingsPage } from "../../../pages/coach/availability_settings";

test("Setting Weekly Schedule Coach", async ({ page }) => {
  test.setTimeout(60000);
  const loginPage = new LoginPage(page);
  const weekly = new AvailabilitySettingsPage(page);

  await loginPage.goto();
  await loginPage.login("elayne.selma@gmail.com", "Password123_");

  await weekly.goToAvailabilitySettings();
  await weekly.manageWeeklySchedule();
});
