import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/shared/login.page';
import { MenteeProfilePage } from '../../../pages/mentee/profile';

test('Positive: Mentee can change password successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const profilePage = new MenteeProfilePage(page);

  await loginPage.goto();
  await loginPage.login('ahmadzyddannashevy@gmail.com', 'Password123_');

  await profilePage.goto();

  await profilePage.changePassword('Password123_', 'Password@123_', 'Password@123_');
  
  const successMsg1 = await profilePage.getPasswordSuccessMessage();
  await expect(successMsg1.first()).toBeVisible();

  await profilePage.changePassword('Password@123_', 'Password123_', 'Password123_');

  const successMsg2 = await profilePage.getPasswordSuccessMessage();
  await expect(successMsg2.first()).toBeVisible();
});
