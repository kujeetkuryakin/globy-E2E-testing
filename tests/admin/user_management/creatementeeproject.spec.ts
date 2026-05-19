import { test, expect } from '@playwright/test';
import { CreateMenteeProject } from '../../../pages/admin/creatementeeproject';
import { LoginPage } from '../../../pages/shared/login.page';

test('admin create mentee project success', async ({ page }) => {
  const userPage = new CreateMenteeProject(page);

  const timestamp = Date.now();
  const user = {
    firstName: 'Test',
    lastName: 'Project',
    email: `project_${timestamp}@mail.com`,
    phone: `08${timestamp.toString().slice(-10)}`,
    password: 'Password123_',
  };

  await page.goto('/admin-dashboard');
  await userPage.goToUserManagement();
  await userPage.openCreateUser();

  await userPage.fillForm(user);
  await userPage.selectProject();
  await userPage.submit();
  try {

    await expect(userPage.getSuccessNotification().first())
      .toBeVisible({ timeout: 5000 });

    console.log('✅ SUCCESS: mentee project berhasil dibuat');

  } catch (error) {

    console.log('❌ FAILED: popup success tidak muncul');

    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);

    const pageContent = await page.textContent('body');
    console.log(
      '📄 Page content snippet:',
      pageContent?.slice(0, 300)
    );

    throw error;
  }

});
