import { Page, Locator } from '@playwright/test';

function getDynamicBookingDate() {
    const date = new Date();

    // 🔥 maju terus tiap hari
    date.setDate(date.getDate() + 1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export class BookSessionPage {
    page: Page;

    coachingScheduleMenu: Locator;
    addSessionBtn: Locator;

    onlineBtn: Locator;

    chooseCoachBtn: Locator;
    chooseMenteeBtn: Locator;

    menteeSearchInput: Locator;

    regularBtn: Locator;

    dateInput: Locator;

    createSessionBtn: Locator;

    successNotif: Locator;

    constructor(page: Page) {
        this.page = page;

        this.coachingScheduleMenu = page.getByRole('link', {
            name: 'Coaching Schedule'
        });

        this.addSessionBtn = page.getByRole('button', {
            name: 'Add Session'
        });

        this.onlineBtn = page.getByRole('button', {
            name: 'Online'
        });

        this.chooseCoachBtn = page.getByRole('button', {
            name: 'Choose coach'
        });

        this.chooseMenteeBtn = page.getByRole('button', {
            name: 'Choose mentee'
        });

        this.menteeSearchInput = page.getByPlaceholder('Search mentees...');

        this.regularBtn = page.getByRole('button', {
            name: 'Regular'
        });

        this.dateInput = page.locator('input[type="date"]');

        this.createSessionBtn = page.getByRole('button', {
            name: 'Create Session'
        });

        this.successNotif = page.getByText(/session/i);
    }

    async goto() {
        await this.coachingScheduleMenu.click();
    }

    async openCreateSession() {
        await this.addSessionBtn.click();
    }

    async chooseOnlineSession() {
        await this.onlineBtn.click();
    }

    async selectCoach() {
        await this.chooseCoachBtn.click();

        await this.page
            .getByRole('option', {
                name: /Coach Elayne/
            })
            .click();
    }

    async selectMentee(keyword: string) {
        await this.chooseMenteeBtn.click();

        await this.menteeSearchInput.fill(keyword);

        await this.page
            .getByRole('option', {
                name: /Daffa Arkan/
            })
            .click();
    }

    async selectRegularType() {
        await this.regularBtn.click();
    }

    async selectDynamicDate() {
        const bookingDate = getDynamicBookingDate();

        await this.dateInput.fill(bookingDate);

        return bookingDate;
    }

    async selectTime(time: string) {
        await this.page.getByRole('button', {
            name: time
        }).click();
    }

    async submit() {
        await this.createSessionBtn.click();
    }
}