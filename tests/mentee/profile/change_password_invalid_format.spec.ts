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

  const successMsg = page.getByText('Password changed successfully').first();

  try {
    await expect(successMsg).not.toBeVisible({ timeout: 4000 });
  } catch (e) {
    await profilePage.changePassword('sandi123', 'Password123_', 'Password123_');

    throw new Error(
      "PENGUJIAN GAGAL (DIHARAPKAN): Web Globy saat ini tidak memvalidasi format keamanan password. Password lemah ('sandi123') berhasil tersimpan padahal seharusnya ditolak oleh sistem.",
    );
  }

  const errorMsg = await profilePage.getPasswordErrorMessage();
  await expect(errorMsg, 'Pesan Error Format Password Tidak Muncul').toBeVisible();
});
