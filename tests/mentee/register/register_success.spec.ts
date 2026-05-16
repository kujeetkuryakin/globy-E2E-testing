import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../../pages/mentee/register';
import { LoginPage } from '../../../pages/shared/login.page';

test('Positive: Register successfully and select token package', async ({ page }) => {
  test.setTimeout(120000);

  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await registerPage.openRegistrationForm();

  const uniqueTimestamp = Date.now();
  const uniqueEmail = `rezaarab_${uniqueTimestamp}@gmail.com`;
  const uniquePhone = `0812${uniqueTimestamp.toString().slice(-8)}`;

  await registerPage.fillForm({
    firstName: 'Reza',
    lastName: 'Sukses',
    email: uniqueEmail,
    whatsapp: uniquePhone,
    password: 'Ahmad@3447',
    confirmPassword: 'Ahmad@3447',
    agreeTerms: true,
  });

  await registerPage.submit();

  await registerPage.purchaseTokenPackage();

  await expect(page).toHaveURL(/.*token/i);
});
