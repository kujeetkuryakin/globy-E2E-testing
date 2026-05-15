import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../../pages/mentee/register';

test('Positive: Register successfully and select token package', async ({ page }) => {
  test.setTimeout(120000);

  const registerPage = new RegisterPage(page);
  await registerPage.goto();
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
