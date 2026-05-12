import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';

test.describe('Login Scenarios', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Positive: Login with correct credentials', async ({ page }) => {
    await loginPage.login('ahmadzyddannashevy@gmail.com', 'Password123_');
    
    // Verifikasi login berhasil dengan memastikan tombol Logout muncul
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible({ timeout: 15000 });
    
    // Logout setelah sukses
    await loginPage.logout();
  });

  test('Negative: Login with wrong email', async ({ page }) => {
    await loginPage.login('wrong_email123@gmail.com', 'Password123_');
    
    // Verifikasi tetap di halaman login (atau muncul pesan error)
    await expect(page).toHaveURL(/.*login/);
    
    const errorMessage = await loginPage.getErrorMessage();
    await expect(errorMessage).toBeVisible();
  });

  test('Negative: Login with wrong password', async ({ page }) => {
    await loginPage.login('ahmadzyddannashevy@gmail.com', 'WrongPassword123!');
    
    // Verifikasi tetap di halaman login (atau muncul pesan error)
    await expect(page).toHaveURL(/.*login/);

    const errorMessage = await loginPage.getErrorMessage();
    await expect(errorMessage).toBeVisible();
  });

  test('Negative: Login with invalid email format', async ({ page }) => {
    // Menggunakan format email yang tidak valid
    await loginPage.login('ahmadzyddannashevy_at_gmail_com', 'Password123_');
    
    // Harusnya tidak bisa submit atau muncul pesan error form validation
    await expect(page).toHaveURL(/.*login/);
    
    // Mengecek apakah browser HTML5 validation aktif (input:invalid) atau ada pesan error kustom
    const isInvalid = await page.locator('input[type="email"]:invalid').count();
    if (isInvalid > 0) {
      expect(isInvalid).toBeGreaterThan(0);
    } else {
      const errorMessage = await loginPage.getErrorMessage();
      await expect(errorMessage).toBeVisible();
    }
  });
});