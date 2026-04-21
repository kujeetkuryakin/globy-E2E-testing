import { test, expect } from '@playwright/test';
import { CreateMenteeProject } from '../../pages/admin/creatementeeproject';
import { LoginPage } from '../../pages/shared/login.page';

test('Positive Test: admin create mentee project success', async ({ page }) => {
<<<<<<< HEAD
  const login = new LoginPage(page);
  const userPage = new CreateMenteeProject(page);
=======
    const userPage = new CreateMenteeProject(page);
>>>>>>> 63c762b (edit login session)

  const timestamp = Date.now();
  const user = {
    firstName: 'Test',
    lastName: 'Project',
    email: `project_${timestamp}@mail.com`,
    phone: `08${timestamp.toString().slice(-10)}`,
    password: 'Password123_',
  };

<<<<<<< HEAD
  await login.goto();
  await login.login('raniaathallaaa@gmail.com', 'Password123_');

  await userPage.goToUserManagement();
  await userPage.openCreateUser();
=======
    await page.goto('https://globy.wins.web.id/admin-dashboard');
    await userPage.goToUserManagement();
    await userPage.openCreateUser();
>>>>>>> 63c762b (edit login session)

  await userPage.fillForm(user);
  await userPage.selectProject();
  await userPage.submit();

  await expect(userPage.getSuccessNotification().first()).toBeVisible();
});
