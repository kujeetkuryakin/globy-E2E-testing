import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../../pages/mentee/register';

test('Negative: Register with existing phone number', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();
  await registerPage.openRegistrationForm();

  const uniqueEmail = `test_phone_${Date.now()}@gmail.com`;

  await registerPage.fillForm({
    firstName: 'Ahmad',
    lastName: 'PhoneTest',
    email: uniqueEmail,
    whatsapp: '081226067619',
    password: 'Ahmad@3447',
    confirmPassword: 'Ahmad@3447',
    agreeTerms: true,
  });

  await registerPage.submit();

  const errorMsg = await registerPage.getErrorMessagePhone();
  await expect(errorMsg).toBeVisible();
});
