import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/shared/login.page';

test('Negative: Login with invalid email format', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  await loginPage.login('ahmadzyddannashevy_at_gmail_com', 'Password123_');
  
  await expect(page).toHaveURL(/.*login/);
  
  const isInvalid = await page.locator('input[type="email"]:invalid').count();
  if (isInvalid > 0) {
    expect(isInvalid).toBeGreaterThan(0);
  } else {
    const errorMessage = await loginPage.getErrorMessage();
    await expect(errorMessage).toBeVisible();
  }
});
