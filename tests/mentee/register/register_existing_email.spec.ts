import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../../pages/mentee/register';

test('Negative: Register with existing email', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();
  await registerPage.openRegistrationForm();

  await registerPage.fillForm({
    firstName: 'Ahmad',
    lastName: 'Zyddan',
    email: 'ahmadzyddannashevy@gmail.com',
    whatsapp: '081226067611',
    password: 'Ahmad@3447',
    confirmPassword: 'Ahmad@3447',
    agreeTerms: true,
  });

  await registerPage.submit();

  const errorMsg = await registerPage.getErrorMessageEmail();
  await expect(errorMsg).toBeVisible();
});
