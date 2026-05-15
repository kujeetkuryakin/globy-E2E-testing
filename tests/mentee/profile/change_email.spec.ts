import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/shared/login.page';
import { MenteeProfilePage } from '../../../pages/mentee/profile';

test('Positive: Mentee can change email successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const profilePage = new MenteeProfilePage(page);

  await loginPage.goto();
  await loginPage.login('ahmadzyddannashevy@gmail.com', 'Password123_');

  await profilePage.goto();

  await profilePage.changeEmail('ahmadzyddan_temp@gmail.com');
  
  const successMsg1 = await profilePage.getEmailSuccessMessage();
  await expect(successMsg1.first()).toBeVisible();

  await profilePage.changeEmail('ahmadzyddannashevy@gmail.com');

  const successMsg2 = await profilePage.getEmailSuccessMessage();
  await expect(successMsg2.first()).toBeVisible();
});