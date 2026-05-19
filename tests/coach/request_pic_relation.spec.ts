import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';
import { MyMenteesPage } from '../../pages/coach/my_mentees';

test('Positive: Coach can request PIC relation transfer', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const myMenteesPage = new MyMenteesPage(page);

  await loginPage.goto();
  await loginPage.login('elayne.selma@gmail.com', 'Password123_');

  await myMenteesPage.goto();
  await myMenteesPage.goToAllMentees();
  
  // Membuka menu dropdown pada mentee baris pertama
  await myMenteesPage.openActionMenu(0);
  await myMenteesPage.requestPICRelation();

  // Verifikasi sukses
  const successMsg = await myMenteesPage.getPICRequestSuccessMessage();
  await expect(successMsg.first()).toBeVisible();
});
