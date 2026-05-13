import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/shared/login.page';

test('Positive: Login with correct credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  
  await loginPage.login('ahmadzyddannashevy@gmail.com', 'Password123_');
  
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible({ timeout: 15000 });
  
  await loginPage.logout();
});
