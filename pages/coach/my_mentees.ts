import { Page, Locator, expect } from '@playwright/test';

export class MyMenteesPage {
  readonly page: Page;

  // Navigasi Utama
  readonly navLink: Locator;
  readonly allMenteesTab: Locator;
  readonly activeMenteesTab: Locator;

  // Tombol aksi pada tabel (View / Action Menu)
  readonly viewButtons: Locator;

  // Tab Detail Mentee
  readonly goalsProgressTab: Locator;

  // Modal Add New Goal
  readonly addNewGoalBtn: Locator;
  readonly goalTitleInput: Locator;
  readonly goalDescriptionInput: Locator;
  readonly targetMonthInput: Locator;
  readonly submitGoalBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.navLink = page.getByRole('link', { name: 'My Mentees' });
    this.allMenteesTab = page.getByRole('tab', { name: 'All Mentees' });
    this.activeMenteesTab = page.getByRole('tab', { name: 'Active' }); // asumsikan tab default

    this.viewButtons = page.getByRole('button', { name: 'View' });

    this.goalsProgressTab = page.getByRole('tab', { name: 'Goals & Progress' });

    this.addNewGoalBtn = page.getByRole('button', { name: 'Add New Goal' });
    this.goalTitleInput = page.getByRole('textbox', { name: 'Goal Title *' });
    this.goalDescriptionInput = page.getByRole('textbox', { name: 'Description' });
    this.targetMonthInput = page.getByRole('textbox', { name: 'Target Month' });
    this.submitGoalBtn = page.getByRole('button', { name: 'Add Goal' });
  }

  async goto() {
    // Bisa langsung goto url atau klik dari sidebar
    await this.navLink.click();
    await this.page.waitForTimeout(1500); // Tunggu data mentee termuat
  }

  async goToAllMentees() {
    await this.allMenteesTab.click();
    await this.page.waitForTimeout(1000);
  }

  async viewMentee(index: number = 0) {
    await this.viewButtons.nth(index).click();
  }

  async openActionMenu(index: number = 0) {
    // Locator dari rekaman: page.getByRole('button').filter({ hasText: /^$/ }).nth(1)
    // Seringkali icon 3 titik pada baris tabel tidak punya teks.
    // Indexing mungkin berbeda jika ada header, kita gunakan nth(index + 1) sbg fallback dari rekaman
    await this.page
      .getByRole('button')
      .filter({ hasText: /^$/ })
      .nth(index + 1)
      .click();
  }

  async requestPICRelation() {
    await this.page.getByRole('menuitem', { name: 'Request PIC Relations' }).click();
  }

  async getPICRequestSuccessMessage() {
    const msg = this.page.getByText('Transfer request created.');
    await msg.first().waitFor({ state: 'visible', timeout: 5000 });
    return msg;
  }

  async goToGoalsProgressTab() {
    await this.goalsProgressTab.click();
  }

  async fillNewGoal(title: string, description: string) {
    await this.addNewGoalBtn.click();
    await this.page
      .getByRole('heading', { name: 'Add New Learning Goal' })
      .waitFor({ state: 'visible' });

    await this.goalTitleInput.fill(title);
    await this.goalDescriptionInput.fill(description);

    // TODO: Handle input Target Month.
    // Karena berupa elemen input tanggal tipe month-year tapi dropdown tidak ter-handle di recording,
    // Kita bisa coba click lalu press key atau isi valuenya langsung jika DOM membolehkan.
    await this.targetMonthInput.click();
    // Jika input bertipe month (YYYY-MM), kita harus mengisinya dengan format 'YYYY-MM'
    // misal:
    await this.targetMonthInput.fill('2025-04');
  }

  async submitGoal() {
    await this.submitGoalBtn.click();
  }

  async getGoalSuccessMessage() {
    // Sesuai permintaan Anda, jika notifikasi error = tes gagal,
    // maka tes ini akan berekspektasi ada notifikasi sukses "Goal Created" atau semacamnya.
    // Jika API error ("Failed to Create Goal"), pesan sukses tidak muncul dan tes akan gagal (Timeout).
    // Saya berikan contoh locator generic text sukses:
    const msg = this.page.getByText(/Goal (created|added) successfully/i);
    await msg.first().waitFor({ state: 'visible', timeout: 5000 });
    return msg;
  }
}
