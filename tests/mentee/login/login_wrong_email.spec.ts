import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/shared/login.page';

test('Negative: Login with wrong email', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  await loginPage.login('wrong_email123@gmail.com', 'Password123_');
  
  await expect(page).toHaveURL(/.*login/);
  
  const errorMessage = await loginPage.getErrorMessage();
  await expect(errorMessage).toBeVisible();
});
