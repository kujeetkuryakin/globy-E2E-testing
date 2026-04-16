import { Page, Locator } from "@playwright/test";

export class ResetPassword {
    page: Page;
    menuUserManagement: Locator
    searchInput: Locator;
    newPasswordInput: Locator;
    confirmPasswordInput: Locator;
    resetPasswordBtn: Locator;
    resetPasswordMenu: Locator;
    resetSuccessMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        this.menuUserManagement = page
            .getByRole('navigation')
            .getByRole('link', { name: 'User Management' });
        this.searchInput = page.getByPlaceholder('Search users...');
        this.newPasswordInput = page.getByRole('textbox', { name: 'New Password' });
        this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password' });
        this.resetPasswordBtn = page.getByRole('button', { name: 'Reset Password' });
        this.resetPasswordMenu = page.getByRole('menuitem', { name: 'Reset Password' });
        this.resetSuccessMessage = page.getByText('Password reset successfully');
    }

    async goToUserManagement() {
        await this.menuUserManagement.click();
    }

    async searchUser(email: string) {
        await this.searchInput.fill(email);
    }

    async resetPasswordFromList(email: string, newPassword: string) {
        await this.searchUser(email);

        const row = this.page.getByRole('row', { name: email });

        await row.getByRole('button', { name: 'More actions' }).click();
        await this.resetPasswordMenu.click();

        await this.newPasswordInput.fill(newPassword);
        await this.confirmPasswordInput.fill(newPassword);

        await this.resetPasswordBtn.click();
    }

    getResetSuccessNotification() {
        return this.resetSuccessMessage.first();
    }

    async logout() {
        await this.page.getByRole('button', { name: 'Logout' }).click();
    }
}
