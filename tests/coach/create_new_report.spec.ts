import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';
import { MenteeReportsPage } from '../../pages/coach/mentee_reports';

test('Positive: Coach can create a new monthly report', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const reportsPage = new MenteeReportsPage(page);

  await loginPage.goto();
  await loginPage.login('elayne.selma@gmail.com', 'Password123_');

  await reportsPage.goto();
  await reportsPage.viewReport(0);
  
  // Proses membuat laporan bulanan baru
  // Note: Dalam method ini, interaksi dengan modal form dan input bulan 
  // di-handle otomatis berdasarkan pendekatan simulasi keyboard (Enter).
  await reportsPage.createMonthlyReport();

  // Verifikasi sukses
  const successMsg = await reportsPage.getCreateReportSuccessMessage();
  await expect(successMsg.first()).toBeVisible();
});
