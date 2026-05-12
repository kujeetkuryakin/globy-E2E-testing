import { test } from '@playwright/test';
import { LoginPage } from '../../../pages/shared/login.page';
import { TokenPurchasing } from '../../../pages/mentee/tokenpurchasing';

test('Purchase Offline Token via Bank Transfer', async ({ page }) => {
  test.setTimeout(80000);
  const login = new LoginPage(page);
  const tokenPurchasing = new TokenPurchasing(page);

  await login.goto();
  await login.login('vladimirbatface@gmail.com', 'Password123_');

  await tokenPurchasing.navigateToPurchaseMenu();
  await tokenPurchasing.selectOfflinePackage(1);

  await tokenPurchasing.agreeAndCheckout();
  await tokenPurchasing.payWithBankTransferBCA();

  await tokenPurchasing.verifyPaymentSuccess();
});