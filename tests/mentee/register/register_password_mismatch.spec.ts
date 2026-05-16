import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../../pages/mentee/register';
import { LoginPage } from '../../../pages/shared/login.page';

test('Negative: Confirm password does not match password', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await registerPage.openRegistrationForm();

  await registerPage.fillForm({
    firstName: 'reza',
    lastName: 'arab',
    email: 'rezaarab_test1@gmail.com',
    whatsapp: '081226067619',
    password: 'Ahmad@3447',
    confirmPassword: 'WrongPassword123!',
    agreeTerms: true,
  });

  await registerPage.submit();

  const errorMsg = await registerPage.getErrorMessagePassword();
  await expect(errorMsg).toBeVisible();
});
