import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/shared/login.page';
import { MenteeProfilePage } from '../../../pages/mentee/profile';

test('Negative: Edit profile failed due to empty required fields', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const profilePage = new MenteeProfilePage(page);

  await loginPage.goto();
  await loginPage.login('ahmadzyddannashevy@gmail.com', 'Password123_');

  await profilePage.goto();

  // Mengosongkan field wajib (First Name) untuk memicu validasi error
  await profilePage.fillProfileForm({
    firstName: '',
  });

  await profilePage.submitProfile();

  const errorMsg = await profilePage.getProfileErrorMessage();
  await expect(errorMsg).toBeVisible();
});
