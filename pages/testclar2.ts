import { Page, Locator } from '@playwright/test';

export class LoginPage {
    page: Page;
    emailInput: Locator;
    passwordInput: Locator;
    signInBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        this.emailInput = page.getByRole('textbox', { name: 'Email Address' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.signInBtn = page.locator('button[type="submit"]');
    }

    async goto() {
        await this.page.goto('https://globy.wins.web.id/login');
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInBtn.click();
    }
}