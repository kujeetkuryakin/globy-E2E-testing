import { test } from "@playwright/test";
import { LoginPage } from "../../../pages/shared/login.page";
import { AvailabislitySettingsPage } from "../../../pages/coach/availability_settings";

test("Edit Specific Date", async ({ page }) => {
  test.setTimeout(60000);
  const loginPage = new LoginPage(page);
  const specific_dates = new AvailabilitySettingsPage(page);

  await loginPage.goto();
  await loginPage.login("elayne.selma@gmail.com", "Password123_");

  await specific_dates.goToAvailabilitySettings();
  await specific_dates.editSpecificDate("29 April 2026", "Khusus Membership");
});
