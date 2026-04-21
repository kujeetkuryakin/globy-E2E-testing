<<<<<<< HEAD
import { test as setup } from "@playwright/test";
import { LoginPage } from "../../pages/shared/login.page";

setup("coach login once", async ({ page }) => {
  setup.setTimeout(60000);
  const login = new LoginPage(page);

  await login.goto();
  await login.login("elayne.selma@gmail.com", "Password123_");

  await page.context().storageState({ path: "storage/coach.json" });
});
=======
import { test as setup } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';

setup('coach login once', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('elayne.selma@gmail.com', 'Password123_');

    await page.waitForLoadState('networkidle');

    await page.context().storageState({ path: 'storage/coach.json' });
});
>>>>>>> 63c762b (edit login session)
