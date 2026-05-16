import { Locator, Page, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;

  readonly registerBtn: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly whatsappInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly createAccountBtn: Locator;

  readonly selectPackageBtn: Locator;
  readonly purchaseTokensNowBtn: Locator;
  readonly bankTransferOption: Locator;
  readonly mandiriOption: Locator;
  readonly simulatePaymentBtn: Locator;
  readonly successHeading: Locator;
  readonly goToMyTokensBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.registerBtn = page.getByText('Register');
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.emailInput = page.getByRole('textbox', { name: 'Email Address' });
    this.whatsappInput = page.getByRole('textbox', { name: 'WhatsApp Number' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password' });
    this.termsCheckbox = page.getByRole('checkbox', { name: /I agree to the Terms/i });
    this.createAccountBtn = page.getByRole('button', { name: 'Create Account' });

    this.selectPackageBtn = page.getByRole('button', { name: 'Select Package' });
    this.purchaseTokensNowBtn = page.getByRole('button', { name: 'Purchase Tokens Now' });
    this.bankTransferOption = page.getByTestId('payment-channel-list-bank-transfer');
    this.mandiriOption = page.getByTestId('payment-channel-mandiri');
    this.simulatePaymentBtn = page.getByTestId('simulate-button');
    this.successHeading = page.getByRole('heading', { name: 'Thank You!' });
    this.goToMyTokensBtn = page.getByRole('button', { name: 'Go to My Tokens' });
  }

  async openRegistrationForm() {
    await this.registerBtn.first().waitFor({ state: 'visible', timeout: 5000 });
    await this.registerBtn.first().click();
  }

  async fillForm(data: any) {
    if (data.firstName) await this.firstNameInput.fill(data.firstName);
    if (data.lastName) await this.lastNameInput.fill(data.lastName);
    if (data.email) await this.emailInput.fill(data.email);
    if (data.whatsapp) await this.whatsappInput.fill(data.whatsapp);
    if (data.password) await this.passwordInput.fill(data.password);
    if (data.confirmPassword) await this.confirmPasswordInput.fill(data.confirmPassword);

    if (data.agreeTerms) {
      await this.termsCheckbox.check();
    }
  }

  async submit() {
    await this.createAccountBtn.click();
  }

  async getErrorMessageEmail() {
    this.page
      .getByText('This email address is already')
      .waitFor({ state: 'visible', timeout: 5000 });
    return this.page.getByText('This email address is already').first();
  }

  async getErrorMessagePassword() {
    await this.page
      .getByRole('alert')
      .getByText('Passwords do not match')
      .waitFor({ state: 'visible', timeout: 7000 });
    return this.page.getByRole('alert').getByText('Passwords do not match').first();
  }

  async getErrorMessagePhone() {
    this.page
      .getByText('This WhatsApp number is already registered')
      .waitFor({ state: 'visible', timeout: 5000 });
    return this.page.getByText('This WhatsApp number is already registered').first();
  }

  async purchaseTokenPackage() {
    await this.selectPackageBtn.first().click();
    await this.purchaseTokensNowBtn.click();
    await this.bankTransferOption.click();
    await this.mandiriOption.click();
    await this.simulatePaymentBtn.click();

    await expect(this.successHeading).toBeVisible({ timeout: 15000 });
    await this.goToMyTokensBtn.click();
  }
}
