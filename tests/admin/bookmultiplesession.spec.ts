import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';
import { BookMultipleSessionPage } from '../../pages/admin/bookmultiplesession';

test('Admin can book multiple online coaching sessions with auto-retry date', async ({ page }) => {
  test.setTimeout(140000); 
  
  const login = new LoginPage(page);
  const multipleSession = new BookMultipleSessionPage(page);

  await login.goto();
  await login.login('raniaathallaaa@gmail.com', 'Password123_');

  await multipleSession.goto();
  await multipleSession.openCreateSession();
  
  await multipleSession.chooseModeAndTab();

  await multipleSession.selectCoach('hai', /Coach Haidir/);
  await multipleSession.selectMentee(/Ahmad Zyddan Nashevy/);
  
  await multipleSession.selectRegularType();

  let lastDate1 = await multipleSession.fillSessionDetailsWithRetry(0, '2026-05-16', '09:');
  
  await multipleSession.addNewSessionLine();
  await multipleSession.fillSessionDetailsWithRetry(1, '2026-05-17', '10:');
  
  await multipleSession.submit();
  await multipleSession.verifySuccess();
});