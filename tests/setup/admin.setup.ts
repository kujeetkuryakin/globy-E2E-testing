import { test as setup } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';

setup('admin login once', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('raniaathallaaa@gmail.com', 'Password123_');

<<<<<<< HEAD
=======
    await page.waitForLoadState('networkidle');

>>>>>>> 63c762b (edit login session)
    await page.context().storageState({ path: 'storage/admin.json' });
});