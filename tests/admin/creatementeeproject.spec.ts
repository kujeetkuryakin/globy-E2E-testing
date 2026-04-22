import { test, expect } from '@playwright/test';
import { CreateMenteeProject } from '../../pages/admin/creatementeeproject';
import { LoginPage } from '../../pages/shared/login.page';

test('Positive Test: admin create mentee project success', async ({ page }) => {
  const login = new LoginPage(page);
  const userPage = new CreateMenteeProject(page);

  const timestamp = Date.now();
  const user = {
    firstName: 'Test',
    lastName: 'Project',
    email: `project_${timestamp}@mail.com`,
    phone: `08${timestamp.toString().slice(-10)}`,
    password: 'Password123_',
  };

  await login.goto();
  await login.login('raniaathallaaa@gmail.com', 'Password123_');

  await userPage.goToUserManagement();
  await userPage.openCreateUser();

  await userPage.fillForm(user);
  await userPage.selectProject();
  await userPage.submit();

  await expect(userPage.getSuccessNotification().first()).toBeVisible();
});
