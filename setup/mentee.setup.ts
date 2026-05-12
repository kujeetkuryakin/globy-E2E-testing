import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/shared/login.page';

setup('mentee login once', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('vladimirbatface@gmail.com', 'Password123_');

    await page.waitForURL('**/dashboard**', { timeout: 15000 }).catch(() => { });
    await expect(page.getByRole('navigation').first()).toBeVisible();

    await page.context().storageState({ path: 'storage/mentee.json' });
});