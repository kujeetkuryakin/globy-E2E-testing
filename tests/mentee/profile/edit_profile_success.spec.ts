import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/shared/login.page';
import { MenteeProfilePage } from '../../../pages/mentee/profile';

test('Positive: Edit profile successfully', async ({ page }) => {
  test.setTimeout(80000);
  const loginPage = new LoginPage(page);
  const profilePage = new MenteeProfilePage(page);

  await loginPage.goto();
  await loginPage.login('ahmadzyddannashevy@gmail.com', 'Password123_');

  await profilePage.goto();

  await profilePage.fillProfileForm({
    postalCode: '401113',
    address: 'Jl. Mandarin',
    bio: 'Do what you think good to you',
    schoolName: 'Universitas Akmil',
    schoolWhatsApp: '08123456777',
    parentName: 'Paulina',
  });

  await profilePage.submitProfile();

  const successMsg = await profilePage.getProfileSuccessMessage();
  await expect(successMsg.first()).toBeVisible();
});
