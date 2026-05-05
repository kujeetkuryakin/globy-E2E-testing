import { Locator, Page, expect } from '@playwright/test';

export class Report {
  page: Page;

  reportsMenu: Locator;
  viewCellBtn: Locator;
  actionMenuBtn: Locator;
  downloadPdfBtn: Locator;
  sendEmailBtn: Locator;
  viewReportBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.reportsMenu = page.getByRole('link', { name: 'Reports' });
    this.viewCellBtn = page.getByRole('cell', { name: 'View' });
    // Locator untuk menu "titik tiga" di dalam tabel
    this.actionMenuBtn = page.getByRole('table').getByRole('button').filter({ hasText: /^$/ });
    this.downloadPdfBtn = page.getByRole('menuitem', { name: 'PDF' });
    this.sendEmailBtn = page.getByRole('menuitem', { name: 'Send Email' });
    this.viewReportBtn = page.getByRole('menuitem', { name: 'View' });
  }

  async navigateToReports() {
    await this.reportsMenu.click();
  }

  async openActionMenu(expandFirst: boolean = false) {
    if (expandFirst) {
      await this.page.locator('.p-0').first().click();
    }
    await this.viewCellBtn.first().click();
    await this.actionMenuBtn.first().click();
  }

  async downloadPdf() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.downloadPdfBtn.click();
    return await downloadPromise;
  }

  async sendEmail() {
    await this.sendEmailBtn.click();
  }

  async verifyEmailSent() {
    const successTitle = this.page.getByText('Success').nth(2);
    const successDesc = this.page.getByText('Email sent successfully to').nth(1);
    
    await expect(successTitle).toBeVisible();
    await expect(successDesc).toBeVisible();
  }

  async viewReport() {
    await this.viewReportBtn.click();
  }

  async verifyReportContent() {
    // Memastikan elemen-elemen report termuat (dari hasil recording UI)
    await expect(this.page.getByText('General Coaching').nth(1)).toBeVisible();
    await expect(this.page.getByText('Description').nth(1)).toBeVisible();
    await expect(this.page.getByRole('heading', { name: /SESSION HISTORY/i })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Coach Feedback & Assessments' })).toBeVisible();
  }
}
