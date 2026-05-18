import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/shared/login.page';

setup('coach login once', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('elayne.selma@gmail.com', 'Password123_');

    await page.waitForURL(/dashboard/);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    await page.context().storageState({ path: 'storage/coach.json' });
});