import { Locator, Page, expect } from '@playwright/test';

export class MenteeProfilePage {
  readonly page: Page;

  // General profile actions
  readonly goToProfileBtn: Locator;

  // Edit Profile Form
  readonly editProfileTab: Locator;
  readonly saveProfileBtn: Locator;
  readonly postalCodeInput: Locator;
  readonly addressInput: Locator;
  readonly bioInput: Locator;
  readonly schoolNameInput: Locator;
  readonly schoolWhatsAppInput: Locator;
  readonly parentNameInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;

  // Change Password
  readonly changePasswordTab: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmNewPasswordInput: Locator;
  readonly submitChangePasswordBtn: Locator;

  readonly changeEmailBtn: Locator;
  readonly newEmailInput: Locator;
  readonly submitChangeEmailBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.goToProfileBtn = page.locator('a[href="/mentee/profile"]').first();

    this.editProfileTab = page.getByRole('button', { name: 'Edit Profile' });
    this.saveProfileBtn = page.getByRole('button', { name: 'Save' });

    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });

    this.postalCodeInput = page.getByRole('textbox', { name: 'Ex:' });
    this.addressInput = page.getByRole('textbox', { name: 'Nama jalan, nomor rumah, RT/' });
    this.bioInput = page.getByRole('textbox', { name: 'Bio/Description' });
    this.schoolNameInput = page.getByRole('textbox', { name: 'School Name' });
    this.schoolWhatsAppInput = page.getByRole('textbox', { name: 'School WhatsApp' });
    this.parentNameInput = page.getByRole('textbox', { name: 'Parent Name' });

    this.changePasswordTab = page.getByRole('button', { name: 'Change Password' }).first();
    this.currentPasswordInput = page.getByRole('textbox', { name: 'Current Password' });
    this.newPasswordInput = page.getByRole('textbox', { name: 'New Password', exact: true });
    this.confirmNewPasswordInput = page.getByRole('textbox', { name: 'Confirm New Password' });
    this.submitChangePasswordBtn = page.getByRole('button', { name: 'Change Password' }).last();

    this.changeEmailBtn = page.getByRole('button', { name: 'Ubah Email' });
    this.newEmailInput = page.getByRole('textbox', { name: 'Masukkan email baru' });
    this.submitChangeEmailBtn = page.getByRole('button', { name: 'Simpan Email' });
  }

  async goto() {
    await this.page.waitForTimeout(2000);
    await this.page.goto('/profile');
  }

  async fillProfileForm(data: any) {
    await this.editProfileTab.waitFor({ state: 'visible', timeout: 7000 });
    await this.editProfileTab.click();

    if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
    if (data.postalCode !== undefined) await this.postalCodeInput.fill(data.postalCode);
    if (data.address !== undefined) await this.addressInput.fill(data.address);
    if (data.bio !== undefined) await this.bioInput.fill(data.bio);
    if (data.schoolName !== undefined) await this.schoolNameInput.fill(data.schoolName);
    if (data.schoolWhatsApp !== undefined) await this.schoolWhatsAppInput.fill(data.schoolWhatsApp);
    if (data.parentName !== undefined) await this.parentNameInput.fill(data.parentName);

    if (data.province) {
      await this.page.getByRole('combobox').filter({ hasText: 'Pilih Provinsi' }).click();
      await this.page.getByRole('option', { name: data.province }).click();
    }
  }

  async submitProfile() {
    await this.saveProfileBtn.click();
  }

  async getProfileSuccessMessage() {
    const msg = this.page.getByText('Profile updated successfully');
    await msg.first().waitFor({ state: 'visible', timeout: 5000 });
    return msg;
  }

  async getProfileErrorMessage() {
    // const errorBody = this.page.getByText('First name, last name, and email are required');
    // await errorBody.first().waitFor({ state: 'visible', timeout: 5000 });
    // return errorBody;
    const errorNotification = this.page.getByText('Notification Validation').first();
    await errorNotification.waitFor({ state: 'visible', timeout: 5000 });
    return errorNotification;
  }

  async changePassword(current: string, newPass: string, confirmNewPass: string) {
    await this.changePasswordTab.waitFor({ state: 'visible', timeout: 7000 });
    await this.changePasswordTab.click();
    await this.currentPasswordInput.fill(current);
    await this.newPasswordInput.fill(newPass);
    await this.confirmNewPasswordInput.fill(confirmNewPass);
    await this.submitChangePasswordBtn.click();
  }

  async getPasswordSuccessMessage() {
    const msg = this.page.getByText('Password changed successfully');
    await msg.first().waitFor({ state: 'visible', timeout: 5000 });
    return msg;
  }

  async changeEmail(newEmail: string) {
    await this.changeEmailBtn.waitFor({ state: 'visible', timeout: 7000 });
    await this.changeEmailBtn.click();

    await this.newEmailInput.fill(newEmail);
    await this.submitChangeEmailBtn.click();
  }

  async getEmailSuccessMessage() {
    const msg = this.page.getByText('Email berhasil diubah');
    await msg.first().waitFor({ state: 'visible', timeout: 5000 });
    return msg;
  }
}
