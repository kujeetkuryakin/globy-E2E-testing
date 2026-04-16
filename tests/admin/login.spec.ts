import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';

test('admin login', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('raniaathallaaa@gmail.com', 'Password123_');

    await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
}); 