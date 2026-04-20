import { Locator, Page, expect } from '@playwright/test';

export type CoachForm = {
  planning: string;
  description: string;
  friendNamed: string;
  date: string;
  time: string;
};

enum Method {
  COACH = 'By CoachChoose your preferred',
  TOPIC = 'By TopicChoose learning topic',
  TIME = 'By Date & TimeChoose schedule',
}

export class BookingSession {
  page: Page;

  planning: Locator;
  description: Locator;
  friendNamed: Locator;
  mode: Locator[];

  bookSessionBtn: Locator;
  selectCoachBtn: Locator;
  confirmAndBookBtn: Locator;
  confirmBtn: Locator;
  continueCoachBtn: Locator;
  nextMonthBtn: Locator;

  notificationSuccess: Locator;
  constructor(page: Page) {
    this.page = page;

    this.planning = page.getByRole('textbox', { name: 'Contoh: Career Planning,' });
    this.description = page.getByRole('textbox', { name: 'Add a short description about' });
    this.friendNamed = page.getByRole('textbox', { name: 'Masukkan nama teman Anda (' });
    this.mode = [
      page.getByText('Online SessionVideo call'),
      page.getByText('Offline SessionFace-to-face'),
    ];

    this.selectCoachBtn = page.getByRole('button', { name: 'Select' });
    this.confirmAndBookBtn = page.getByRole('button', { name: 'Confirm & Book Now' });
    this.bookSessionBtn = page.getByRole('button', { name: 'Book Session' });
    this.confirmBtn = page.getByRole('button', { name: 'Confirm', exact: true });
    this.continueCoachBtn = page.getByRole('button', { name: 'Continue to Coach Selection' });
    this.nextMonthBtn = page.getByRole('button', { name: 'Go to next month' });

    this.notificationSuccess = page.getByRole('heading', { name: 'Booking Successful! 🎉' });
  }

  /**
   * @param isOnline Boolean
   * @default isOnline true
   * @desc if you want book online fill true otherwise false
   */
  async bookMode(isOnline: boolean = true) {
    if (isOnline) {
      await this.bookSessionBtn.click();
      this.mode[0].click();
    } else {
      await this.bookSessionBtn.click();
      this.mode[1].click();
    }
  }

  async bookByCoach(form: CoachForm) {
    await this.page.getByText(Method.COACH).click();
    await this.selectCoachBtn.first().click();
    await this.selectDate(form.date);
    await this.selectTime(form.time);
    await this.continueCoachBtn.click();
    await this.fillFormCoach(form);
    await this.confirmAndBookBtn.click();
    await this.confirmBtn.click();
  }

  async fillFormCoach(form?: CoachForm) {
    await this.planning.fill(form ? form.planning : '');
    await this.description.focus();
    await this.description.pressSequentially(form ? form.description : '', { delay: 50 });
    await this.friendNamed.fill(form ? form.friendNamed : '');
  }

  async selectDate(date: string) {
    return this.page.getByRole('gridcell', { name: date }).click();
  }

  async selectTime(time: string) {
    const slotWaktu = this.page.getByRole('button', { name: time });
    await expect(slotWaktu).toBeVisible({ timeout: 25000 });
    await slotWaktu.click();
  }
}
