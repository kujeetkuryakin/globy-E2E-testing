import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/mentee/register';

test.describe('Mentee Registration Scenarios', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.openRegistrationForm();
  });

  test('Negative: Confirm password does not match password', async ({ page }) => {
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

    const errorMsg = await registerPage.page.getByText('Passwords do not match').first();
    await expect(errorMsg).toBeVisible();
  });

  test('Negative: Register with existing email', async ({ page }) => {
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

  test('Negative: Register with existing phone number', async ({ page }) => {
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

  test('Positive: Register successfully and select token package', async ({ page }) => {
    test.setTimeout(120000); 
    
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
});
