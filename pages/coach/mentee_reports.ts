import { Page, Locator, expect } from '@playwright/test';

export class MenteeReportsPage {
  readonly page: Page;

  // Navigasi Utama
  readonly navLink: Locator;

  // View Button
  readonly viewButtons: Locator;

  // Fitur Create Month Report
  readonly createMonthBtn: Locator;
  readonly selectMonthInput: Locator;
  readonly createReportSubmitBtn: Locator;

  // Fitur Feedback
  readonly feedbackButtons: Locator;
  readonly strengthsInput: Locator;
  readonly nextMonthGoalsInput: Locator;
  readonly areasForImprovementInput: Locator;
  readonly coachNotesInput: Locator;
  readonly saveFeedbackBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.navLink = page.getByRole('link', { name: 'Mentee Reports' });
    this.viewButtons = page.getByRole('button', { name: 'View' });

    // Create Report
    this.createMonthBtn = page.getByRole('button', { name: 'Create Month' });
    this.selectMonthInput = page.getByRole('textbox', { name: 'Select Month' });
    this.createReportSubmitBtn = page.getByRole('button', { name: 'Create Report' }); // Modal final

    // Feedback
    this.feedbackButtons = page.getByRole('button', { name: 'Feedback' });
    this.strengthsInput = page.getByRole('textbox', { name: 'Strengths' });
    this.nextMonthGoalsInput = page.getByRole('textbox', { name: 'Next Month Goals' });
    this.areasForImprovementInput = page.getByRole('textbox', { name: 'Areas for Improvement' });
    this.coachNotesInput = page.getByRole('textbox', { name: 'Coach Notes' });
    this.saveFeedbackBtn = page.getByRole('button', { name: 'Save Feedback' });
  }

  async goto() {
    await this.navLink.click();
    await this.page.waitForTimeout(1500);
  }

  async viewReport(index: number = 0) {
    await this.viewButtons.nth(index).click();
    await this.page.waitForTimeout(1500);
  }

  async createMonthlyReport() {
    await this.createMonthBtn.click();

    await this.selectMonthInput.click();
    await this.page.waitForTimeout(500);

    await this.selectMonthInput.press('Enter');

    await this.createReportSubmitBtn.click();
  }

  async getCreateReportSuccessMessage() {
    const msg = this.page.getByText('Monthly report created');
    await msg.first().waitFor({ state: 'visible', timeout: 5000 });
    return msg;
  }

  async openFeedbackForm(index: number = 0) {
    await this.feedbackButtons.nth(index).click();
    await this.page.waitForTimeout(1000);
  }

  async fillFeedbackForm(data: {
    strengths: string;
    nextGoals: string;
    areas: string;
    coachNotes: string;
  }) {
    await this.strengthsInput.fill(data.strengths);
    await this.nextMonthGoalsInput.fill(data.nextGoals);
    await this.areasForImprovementInput.fill(data.areas);
    await this.coachNotesInput.fill(data.coachNotes);
  }

  async submitFeedback() {
    await this.saveFeedbackBtn.click();
  }

  async getFeedbackSuccessMessage() {
    const msg = this.page.getByText('Monthly feedback saved');
    await msg.first().waitFor({ state: 'visible', timeout: 5000 });
    return msg;
  }
}
