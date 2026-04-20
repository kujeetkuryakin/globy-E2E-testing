import { Page, Locator, expect } from '@playwright/test';

import * as fs from 'fs';
import * as path from 'path';

function getDynamicDate2027() {
    const stateFile = path.resolve(__dirname, 'dateState.json');
    let offset = 0;
    if (fs.existsSync(stateFile)) {
        try {
            const data = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
            if (typeof data.offset === 'number') {
                offset = data.offset;
            }
        } catch (e) { }
    }

    fs.writeFileSync(stateFile, JSON.stringify({ offset: offset + 1 }));

    const base = new Date('2027-01-01');
    base.setDate(base.getDate() + offset);

    const month = base.toLocaleString('en-US', { month: 'long' });
    const day = base.getDate();
    const year = base.getFullYear();

    return { month, day, year };
}

function getRandomTimes() {
    const times = ['06:00', '07:00', '08:00', '09:00'];
    return times.sort(() => 0.5 - Math.random()).slice(0, 3);
}

export class SpecificDateAvailability {
    page: Page;

    coachingScheduleMenu: Locator;
    settingAvailabilityBtn: Locator;

    coachDropdown: Locator;
    searchCoachInput: Locator;
    coachOption: Locator;

    specificDatesBtn: Locator;

    saveOverrideBtn: Locator;

    notification: Locator;

    constructor(page: Page) {
        this.page = page;

        this.coachingScheduleMenu = page.getByRole('link', { name: 'Coaching Schedule' });
        this.settingAvailabilityBtn = page.getByRole('button', { name: 'Setting Availability' });

        this.coachDropdown = page.getByRole('combobox');
        this.searchCoachInput = page.getByRole('textbox', { name: 'Search coaches...' });
        this.coachOption = page.getByText('elayne.selma@gmail.com');

        this.specificDatesBtn = page.getByRole('button', { name: 'Specific Dates' });

        this.saveOverrideBtn = page.getByRole('button', { name: 'Save Override' });

        this.notification = page
            .getByRole('region', { name: /Notifications/i })
            .locator('li')
            .first();
    }

    async openPage() {
        await this.coachingScheduleMenu.click();
        await this.settingAvailabilityBtn.click();
    }

    async selectCoach(keyword: string) {
        await this.coachDropdown.click();
        await this.searchCoachInput.fill(keyword);
        await this.coachOption.click();
    }

    async navigateToMonthYear(targetMonth: string, targetYear: string) {
        let maxAttempts = 24;
        while (maxAttempts > 0) {
            const currentMonthYear = await this.page.locator('.font-semibold').filter({ hasText: /202|203|204/ }).first().textContent();

            if (currentMonthYear && currentMonthYear.includes(targetMonth) && currentMonthYear.includes(targetYear)) {
                break;
            }

            await this.page.locator('button:has(.lucide-chevron-right)').click();
            await this.page.waitForTimeout(200);
            maxAttempts--;
        }
    }

    async selectDynamicDate() {
        const { month, day, year } = getDynamicDate2027();

        await this.specificDatesBtn.click();

        await this.navigateToMonthYear(month, year.toString());
        await this.page.getByRole('button', { name: `${day}`, exact: true }).click();

        return { month, day, year };
    }

    async selectRandomTimes() {
        const times = getRandomTimes();

        for (const time of times) {
            await this.page.getByRole('button', { name: time }).click();
        }

        return times;
    }

    async save() {
        await this.saveOverrideBtn.click();
    }

    async validateSuccess() {
        await expect(this.notification).toBeVisible();
    }

    async validateTimesSelected(times: string[]) {
        for (const time of times) {
            await expect(
                this.page.getByRole('button', { name: time })
            ).toHaveClass(/selected|active|bg-blue-100/);
        }
    }
} 