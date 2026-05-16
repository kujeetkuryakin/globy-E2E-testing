import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/shared/login.page';
import { MenteeProfilePage } from '../../../pages/mentee/profile';

test('Negative: Mentee change password with invalid format', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const profilePage = new MenteeProfilePage(page);

  await loginPage.goto();
  await loginPage.login('ahmadzyddannashevy@gmail.com', 'Password123_');

  await profilePage.goto();

  await profilePage.changePassword('Password123_', 'sandi123', 'sandi123');
  
  const errorMsg = await profilePage.getPasswordErrorMessage();
  await expect(errorMsg).toBeVisible();
});
