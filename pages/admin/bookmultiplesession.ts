import { Page, Locator, expect } from '@playwright/test';

export class BookMultipleSessionPage {
  page: Page;

  coachingScheduleMenu: Locator;
  addSessionBtn: Locator;
  onlineBtn: Locator;
  multipleTab: Locator;
  chooseCoachBtn: Locator;
  coachSearchInput: Locator;
  chooseMenteeBtn: Locator;
  menteeSearchInput: Locator;
  regularBtn: Locator;
  addMoreSessionBtn: Locator;
  createSessionsBtn: Locator;
  successSummaryHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.coachingScheduleMenu = page.getByRole('link', { name: 'Coaching Schedule' });
    this.addSessionBtn = page.getByRole('button', { name: 'Add Session' });
    this.onlineBtn = page.getByRole('button', { name: 'Online' });
    this.multipleTab = page.getByRole('tab', { name: 'Multiple' });
    this.chooseCoachBtn = page.getByRole('button', { name: 'Choose coach' });
    this.coachSearchInput = page.getByPlaceholder('Search coaches...');
    this.chooseMenteeBtn = page.getByRole('button', { name: 'Choose mentee' });
    this.menteeSearchInput = page.getByPlaceholder('Search mentees...'); // Input ini tidak ada di raw script tapi berguna jika butuh search
    this.regularBtn = page.getByRole('button', { name: 'Regular' });
    this.addMoreSessionBtn = page.getByRole('button', { name: '+ Add Session' });
    this.createSessionsBtn = page.getByRole('button', { name: 'Create Sessions' });
    this.successSummaryHeading = page.getByRole('heading', { name: 'Bulk Creation Summary' });
  }

  async goto() {
    await this.coachingScheduleMenu.click();
  }

  async openCreateSession() {
    await this.addSessionBtn.click();
  }

  async chooseModeAndTab() {
    await this.multipleTab.click();
    await this.onlineBtn.first().click(); // Cukup satu kali seperti request user
  }

  async selectCoach(coachNameMatch: string | RegExp) {
    await this.chooseCoachBtn.click();
    await this.page.waitForTimeout(6000);
    await this.page.getByRole('option', { name: coachNameMatch }).click();
  }

  async selectMentee(menteeNameMatch: string | RegExp) {
    await this.chooseMenteeBtn.click();
    // Tambahkan delay jika daftar mentee butuh waktu untuk muncul setelah diklik
    await this.page.waitForTimeout(6000);
    await this.page.getByRole('option', { name: menteeNameMatch }).nth(0).click();
  }

  async selectRegularType() {
    await this.regularBtn.click();
  }

  /**
   * Mengisi detail sesi dengan fitur auto-retry jika jam tidak tersedia
   * @param index Indeks baris sesi (0 untuk baris pertama, 1 untuk baris kedua, dst)
   * @param startDateStr Tanggal awal mulai mencoba dalam format YYYY-MM-DD
   * @param timePattern Pola jam yang dicari, misal '09:'
   * @param maxAttempts Batas maksimal mencoba tanggal berikutnya
   * @returns Tanggal akhir yang sukses dipilih
   */
  async fillSessionDetailsWithRetry(
    index: number,
    startDateStr: string,
    timePattern: string | RegExp,
    maxAttempts: number = 30
  ): Promise<string> {
    let currentDateObj = new Date(startDateStr);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const year = currentDateObj.getFullYear();
      const month = String(currentDateObj.getMonth() + 1).padStart(2, '0');
      const day = String(currentDateObj.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      console.log(`[Session ${index + 1}] Mencoba tanggal: ${dateStr} untuk jam: ${timePattern}`);

      const dateInput = this.page.getByRole('textbox').nth(index);
      await dateInput.fill(dateStr);

      await this.page.waitForTimeout(3000);

      // Pendekatan: cari locator checkbox
      const timeCheckbox = this.page.getByRole('checkbox', { name: timePattern });

      const checkboxVisible = await timeCheckbox.nth(index).waitFor({ state: 'visible', timeout: 2000 })
        .then(() => true)
        .catch(() => false);

      if (checkboxVisible) {
        // Cek apakah disabled
        const isDisabled = await timeCheckbox.nth(index).isDisabled();
        if (!isDisabled) {
          await timeCheckbox.nth(index).click();
          console.log(`✅ Sukses memilih tanggal ${dateStr} dan jam ${timePattern}`);
          return dateStr;
        }
      }

      console.log(`❌ Tanggal ${dateStr} tidak ada slot jam ${timePattern} atau disabled. Maju 1 hari...`);
      // Tambah 1 hari
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }

    throw new Error(`Gagal menemukan slot jam ${timePattern} setelah ${maxAttempts} percobaan mulai dari ${startDateStr}`);
  }

  async addNewSessionLine() {
    await this.addMoreSessionBtn.click();
  }

  async submit() {
    await this.createSessionsBtn.click();
  }

  async verifySuccess() {
    await expect(this.successSummaryHeading).toBeVisible({ timeout: 15000 });
  }
}
