import { Page, Locator } from '@playwright/test';

export class AvailabilityPage {
    page: Page;

    coachingScheduleMenu: Locator;
    settingAvailabilityBtn: Locator;

    coachDropdown: Locator;
    searchCoachInput: Locator;
    coachOption: Locator;

    availableButton: Locator;
    saveButton: Locator;

    successNotification: Locator;

    constructor(page: Page) {
        this.page = page;

        this.coachingScheduleMenu = page.getByRole('link', { name: 'Coaching Schedule' });
        this.settingAvailabilityBtn = page.getByRole('button', { name: 'Setting Availability' });

        this.coachDropdown = page.getByRole('combobox');
        this.searchCoachInput = page.getByRole('textbox', { name: 'Search coaches...' });


        this.coachOption = page.getByText('elayne.selma@gmail.com');

        this.availableButton = page.getByRole('button', { name: 'Available' });
        this.saveButton = page.getByRole('button', { name: 'Save Settings' });

        this.successNotification = page
            .getByRole('region', { name: /Notifications/i })
            .locator('text=Your availability settings')
            .first();
    }

    async goto() {
        await this.page.goto('https://globy.wins.web.id/login');
    }

    async openAvailabilitySetting() {
        await this.coachingScheduleMenu.click();
        await this.settingAvailabilityBtn.click();
    }

    async selectCoach(keyword: string) {
        await this.coachDropdown.click();
        await this.searchCoachInput.fill(keyword);
        await this.coachOption.click();
    }

    async toggleAvailability(times: number = 3) {
        for (let i = 0; i < times; i++) {
            await this.availableButton.first().click();
        }
    }

    async save() {
        await this.saveButton.click();
    }

    getSuccessNotification() {
        return this.successNotification;
    }
}