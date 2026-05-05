import { test } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';
import { Report } from '../../pages/mentee/report';

test('Send Email Report', async ({ page }, testinfo) => {
  test.setTimeout(testinfo.timeout + 20000);
  const login = new LoginPage(page);
  const report = new Report(page);

  await login.goto();
  await login.login('mentee_1776666826136@mail.com', 'Asaa@3579');

  await report.navigateToReports();
  await report.openActionMenu();
  
  await report.sendEmail();
  await report.verifyEmailSent();
});