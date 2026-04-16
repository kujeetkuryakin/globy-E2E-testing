import { Page, Locator } from '@playwright/test';

type User = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
};

export class CreateMenteeProject {
    page: Page;

    menuUserManagement: Locator;
    addUserBtn: Locator;

    firstNameInput: Locator;
    lastNameInput: Locator;
    emailInput: Locator;
    phoneInput: Locator;
    roleDropdown: Locator;
    menteeOption: Locator;
    projectBtn: Locator;
    regularBtn: Locator;
    passwordInput: Locator;

    createUserBtn: Locator;
    successMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        this.menuUserManagement = page
            .getByRole('navigation')
            .getByRole('link', { name: 'User Management' });
        this.addUserBtn = page.getByRole('button', { name: 'Add User' });
        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.phoneInput = page.getByRole('textbox', { name: 'Phone' });
        this.roleDropdown = page.getByRole('combobox');
        this.projectBtn = page.getByRole('button', { name: 'Project' });
        this.regularBtn = page.getByRole('button', { name: 'Regular' });
        this.menteeOption = page.getByRole('option', { name: 'Mentee' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.createUserBtn = page.getByRole('button', { name: 'Create User' });
        this.successMessage = page.getByText('User created successfully');
    }

    getSuccessNotification() {
        return this.page
            .getByRole('region', { name: /Notifications/i })
            .getByText('User created successfully');
    }

    async goToUserManagement() {
        await this.menuUserManagement.click();
    }

    async openCreateUser() {
        await this.addUserBtn.click();
    }

    async fillForm(user: User) {
        await this.firstNameInput.fill(user.firstName);
        await this.lastNameInput.fill(user.lastName);
        await this.emailInput.fill(user.email);
        await this.phoneInput.fill(user.phone);
        await this.roleDropdown.click();
        await this.menteeOption.click();
        await this.passwordInput.fill(user.password);
    }

    async selectRegular() {
        await this.regularBtn.click();
    }

    async selectProject() {
        await this.projectBtn.click();
    }

    async submit() {
        await this.createUserBtn.click();
    }
}