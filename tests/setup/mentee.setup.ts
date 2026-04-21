import { test as setup } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';

setup('mentee login once', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('mentee.test@gmail.com', 'Password123_');

    await page.context().storageState({ path: 'storage/mentee.json' });
});