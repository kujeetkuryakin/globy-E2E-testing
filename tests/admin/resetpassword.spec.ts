import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';
import { CreateMenteeRegular } from '../../pages/admin/creatementeeregular';
import { ResetPassword } from '../../pages/admin/resetpassword';


test('admin reset password success', async ({ page }) => {
    const login = new LoginPage(page);
    const createUserPage = new CreateMenteeRegular(page);
    const resetPasswordPage = new ResetPassword(page);

    const timestamp = Date.now();

    const user = {
        firstName: 'Test',
        lastName: 'Mentee',
        email: `mentee_${timestamp}@mail.com`,
        phone: `08${timestamp.toString().slice(-10)}`,
        password: 'Password123_',
        newPassword: `Newpass_${timestamp}`
    };

    // login admin
    await login.goto();
    await login.login('raniaathallaaa@gmail.com', 'Password123_');

    // create user
    await createUserPage.goToUserManagement();
    await createUserPage.openCreateUser();
    await createUserPage.fillForm(user);
    await createUserPage.submit();

    await expect(
        createUserPage.getSuccessNotification().first()
    ).toBeVisible();

    // reset password
    await resetPasswordPage.resetPasswordFromList(
        user.email,
        user.newPassword
    );

    await expect(
        resetPasswordPage.getResetSuccessNotification().first()
    ).toBeVisible();

    // logout admin
    await page.getByRole('button', { name: 'Logout' }).click();

    // login pakai password baru
    await login.login(user.email, user.newPassword);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/login-failure.png' });

    await expect(page).toHaveURL(/dashboard/);
});