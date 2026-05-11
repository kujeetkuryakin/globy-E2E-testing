import { Locator, Page, expect } from '@playwright/test';

export class TokenPurchasing {
  readonly page: Page;

  readonly myTokensLink: Locator;
  readonly purchaseTokensMenu: Locator;
  readonly buyMoreBtn: Locator;
  readonly offlinePackagesTab: Locator;
  readonly selectPackageBtn: Locator;

  readonly proceedToPaymentBtn: Locator;
  readonly tncCheckbox: Locator;

  readonly bankTransferOption: Locator;
  readonly bcaOption: Locator;
  readonly simulatePaymentBtn: Locator;

  readonly successHeading: Locator;
  readonly goToMyTokensBtn: Locator;

  readonly totalTokenText: Locator;
  readonly headingConfirmToken: Locator;
  readonly dialogConfirmToken: Locator;

  constructor(page: Page) {
    this.page = page;

    this.myTokensLink = page.getByRole('link', { name: 'My Tokens' });
    this.purchaseTokensMenu = page.getByRole('link', { name: 'Purchase Tokens' });
    this.buyMoreBtn = page.getByRole('button', { name: 'Buy More Tokens' });
    this.offlinePackagesTab = page.getByRole('tab', { name: 'Offline Packages' });
    this.selectPackageBtn = page.getByRole('button', { name: 'Select Package' });
    this.totalTokenText = page
      .locator('div')
      .filter({ hasText: /^Online Tokens$/ })
      .locator('.token-amount-class');

    this.tncCheckbox = page.getByRole('checkbox', { name: /I have read and agree/i });
    this.proceedToPaymentBtn = page.getByRole('button', { name: 'Proceed to Payment' });

    this.bankTransferOption = page.getByTestId('payment-channel-list-bank-transfer');
    this.bcaOption = page.getByTestId('payment-channel-bca');
    this.simulatePaymentBtn = page.getByTestId('simulate-button');
    this.headingConfirmToken = page.getByRole('heading', { name: 'Confirm Token Package Purchase' });
    this.dialogConfirmToken = page.getByRole('dialog', { name: 'Confirm Token Package Purchase' });

    this.successHeading = page.getByText(/Payment Successful!/i);
    this.goToMyTokensBtn = page.getByRole('button', { name: 'Go to My Tokens' });
  }

  async navigateToTokens() {
    await this.myTokensLink.click();
  }

  async navigateToPurchaseMenu() {
    await this.purchaseTokensMenu.click();
  }

  /**
   * @param index Pilih urutan paket (0 untuk paket pertama, 1 untuk kedua, dst)
   */
  async selectPackage(index: number = 0) {
    await this.buyMoreBtn.click();
    await this.selectPackageBtn.nth(index).click();
  }

  async selectOfflinePackage(index: number = 0) {
    await this.offlinePackagesTab.click();
    await this.selectPackageBtn.nth(index).click();
  }

  async agreeAndCheckout() {
    await this.proceedToPaymentBtn.click();
    await this.headingConfirmToken.waitFor({state: 'visible'});
    await this.dialogConfirmToken.waitFor({state: 'visible'});

    await this.tncCheckbox.waitFor({ state: 'visible' });
    await this.tncCheckbox.click();
    await this.proceedToPaymentBtn.waitFor({state: 'visible'});
    await this.proceedToPaymentBtn.click();
  }

  async payWithBankTransferBCA() {
    await this.bankTransferOption.click();
    await this.bcaOption.click();

    await this.simulatePaymentBtn.waitFor({ state: 'visible' });
    await this.simulatePaymentBtn.click();
  }

  async verifyPaymentSuccess() {
    await expect(this.successHeading).toBeVisible({ timeout: 15000 });
    await this.goToMyTokensBtn.click();
  }

  async getCurrentTokenBalance(): Promise<number> {
    await this.totalTokenText.waitFor({ state: 'visible' });

    const textValue = await this.totalTokenText.innerText();
    const numericValue = parseInt(textValue.replace(/\D/g, ''), 10);
    return numericValue;
  }
}
