import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/shared/login.page';
import { TokenPurchasing } from '../../../pages/mentee/tokenpurchasing';

test.describe('Feature: Token Purchasing', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.login('vladimirbatface@gmail.com', 'Password123_');
    await page.goto('/dashboard');
  });

  test('Positive: User should be able to buy token using BCA Virtual Account', async ({ page }) => {
    const tokenPage = new TokenPurchasing(page);

    await tokenPage.navigateToTokens();
    await tokenPage.selectPackage(0);
    await tokenPage.agreeAndCheckout();
    await tokenPage.payWithBankTransferBCA();
    await tokenPage.verifyPaymentSuccess();
  });
});
