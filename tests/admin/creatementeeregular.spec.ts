import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';
import { CreateMenteeRegular } from '../../pages/admin/creatementeeregular';

test('admin create mentee regular success', async ({ page }) => {
    const login = new LoginPage(page);
    const userPage = new CreateMenteeRegular(page);

    const timestamp = Date.now();
    const user = {
        firstName: 'Test',
        lastName: 'Mentee',
        email: `mentee_${timestamp}@mail.com`,
        phone: `08${timestamp.toString().slice(-10)}`,
        password: 'Password123_'
    };

    await login.goto();
    await login.login('raniaathallaaa@gmail.com', 'Password123_');

    await userPage.goToUserManagement();
    await userPage.openCreateUser();
    await userPage.fillForm(user);
    await userPage.submit();

    await expect(userPage.getSuccessNotification().first()).toBeVisible();
});
