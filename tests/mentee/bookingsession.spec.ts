import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://globy.wins.web.id/login');
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('mentee_1776344125520@mail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Password123_');
  await page.getByLabel('Sign In').getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('button', { name: 'Book Session' }).click();
  await page.getByText('Online SessionVideo call').click();
  await page.getByText('By CoachChoose your preferred').click();
  await page.getByRole('button', { name: 'Select' }).first().click();
  await page.getByRole('gridcell', { name: '25' }).click();
  // Tunggu sampai jam '14:' muncul dan bisa diklik (misal kita beri batas tunggu 15 detik)
  const slotWaktu = page.getByRole('button', { name: '14:' });
  await expect(slotWaktu).toBeVisible({ timeout: 15000 });
  await slotWaktu.click();
  await page.getByRole('button', { name: 'Continue to Coach Selection' }).click();
  await page.getByRole('textbox', { name: 'Contoh: Career Planning,' }).click();
  await page.getByRole('textbox', { name: 'Contoh: Career Planning,' }).fill('Career Planning');
  await page.getByRole('textbox', { name: 'Add a short description about' }).click();
  await page.getByRole('textbox', { name: 'Add a short description about' }).fill('For job');
  await page.getByRole('textbox', { name: 'Masukkan nama teman Anda (' }).click();
  await page.getByRole('textbox', { name: 'Masukkan nama teman Anda (' }).fill('Salma');
  await page.getByRole('button', { name: 'Confirm & Book Now' }).click();
  await page.getByRole('button', { name: 'Confirm & Book Now' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  // Memastikan element heading muncul dan teksnya tepat (Booking Successful! 🎉)
  await expect(page.getByRole('heading', { name: 'Booking Successful! 🎉' })).toBeVisible({
    timeout: 14000,
  });
  // Cara alternatif jika ingin lebih ketat dalam pengecekan string/typo
  await expect(page.getByRole('heading')).toContainText('Booking Successful!');
});
