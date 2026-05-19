import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';
import { MyMenteesPage } from '../../pages/coach/my_mentees';

test('Negative: Failed to create new learning goal (API issue)', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const myMenteesPage = new MyMenteesPage(page);

  // 1. Login
  await loginPage.goto();
  await loginPage.login('elayne.selma@gmail.com', 'Password123_');

  // 2. Navigasi ke Mentee Detail -> Goals & Progress
  await myMenteesPage.goto();
  await myMenteesPage.viewMentee(0);
  await myMenteesPage.goToGoalsProgressTab();

  await myMenteesPage.fillNewGoal('Master of public speaking', 'Can overcome nervous in public area');
  await myMenteesPage.submitGoal();

  // 4. Verifikasi notifikasi gagal dari API
  // Berdasarkan feedback Anda: Jika masih muncul notifikasi gagal, tes ini berekspektasi GAGAL.
  // Untuk membuatnya gagal saat terjadi error, kita expect sukses message.
  // Jika API error muncul, maka expect sukses ini akan timeout (gagal).
  const successMsg = await myMenteesPage.getGoalSuccessMessage();
  await expect(successMsg.first()).toBeVisible();
});
