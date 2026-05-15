import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/shared/login.page';

test('Negative: Login with wrong password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  await loginPage.login('ahmadzyddannashevy@gmail.com', 'WrongPassword123!');
  
  await expect(page).toHaveURL(/.*login/);

  const errorMessage = await loginPage.getErrorMessage();
  await expect(errorMessage).toBeVisible();
});
