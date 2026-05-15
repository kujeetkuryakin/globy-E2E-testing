import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../../pages/mentee/register';

test('Negative: Confirm password does not match password', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();
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
