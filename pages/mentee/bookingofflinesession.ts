import { Locator, Page } from '@playwright/test';

export type OfflineCoachForm = {
  /** Nama kantor/lokasi offline, contoh: 'Tebet Office' */
  office: string;
  planning: string;
  description: string;
  friendNamed: string;
  /** Tanggal awal yang ingin dicoba. Jika booking gagal, otomatis coba tanggal berikutnya. */
  date: number;
  time: string;
};

export type OfflineTopicForm = OfflineCoachForm & {
  /** Nama topik yang ingin dipilih, contoh: 'Public Speaking' */
  topic: string;
};

enum OfflineMethod {
 COACH = 'By CoachChoose your preferred',
  TOPIC = 'By TopicChoose learning topic',
  TIME = 'By Date & TimeChoose schedule',
  BULK_COACH = 'Bulk Booking By CoachSelect a',
}

export class BookingOfflineSession {
  page: Page;

  planning: Locator;
  description: Locator;
  friendNamed: Locator;

  bookSessionBtn: Locator;
  offlineSessionOption: Locator;
  selectCoachBtn: Locator;
  confirmAndBookBtn: Locator;
  confirmBtn: Locator;
  continueCoachBtn: Locator;
  nextMonthBtn: Locator;
  btnBackForm: Locator;
  btnCloseModalConfirm: Locator;
  btnCancelModalConfirm: Locator;
  btnCloseNotificationFailed: Locator;

  notificationSuccess: Locator;
  headTextElementFailedBook: Locator;
  modalConfirm: Locator;

  constructor(page: Page) {
    this.page = page;

    this.planning = page.getByRole('textbox', { name: 'Contoh: Career Planning,' });
    this.description = page.getByRole('textbox', { name: 'Add a short description about' });
    this.friendNamed = page.getByRole('textbox', { name: 'Masukkan nama teman Anda (' });

    this.bookSessionBtn = page.getByRole('button', { name: 'Book Session' });
    this.offlineSessionOption = page.getByText('Offline SessionFace-to-face');
    this.selectCoachBtn = page.getByRole('button', { name: 'Select' });
    this.confirmAndBookBtn = page.getByRole('button', { name: 'Confirm & Book Now' });
    this.confirmBtn = page.getByRole('button', { name: 'Confirm', exact: true });
    this.continueCoachBtn = page.getByRole('button', { name: 'Continue to Coach Selection' });
    this.nextMonthBtn = page.getByRole('button', { name: 'Go to next month' });
    this.btnBackForm = page.getByRole('button', { name: 'Back' });
    this.btnCloseModalConfirm = page.getByRole('button', { name: 'Close' });
    this.btnCancelModalConfirm = page.getByRole('button', { name: 'Cancel' });
    this.btnCloseNotificationFailed = page.locator(
      'div:nth-child(2) > .fixed > .group > .absolute',
    );

    this.notificationSuccess = page.getByRole('heading', { name: 'Booking Successful! 🎉' });
    this.headTextElementFailedBook = page.getByText('Booking Failed').nth(1);
    this.modalConfirm = page.getByRole('dialog', { name: 'Confirm Booking' });
  }

  /** Klik Book Session lalu pilih Offline Session */
  async bookMode() {
    await this.bookSessionBtn.click();
    await this.offlineSessionOption.click();
  }

  /** Pilih lokasi kantor berdasarkan nama, contoh: 'Tebet OfficeTebet, Jakarta' */
  async selectOffice(officeName: string) {
    await this.page.getByText(officeName).click();
  }

  /** Isi form (planning, description, friendNamed) */
  async fillForm(form: OfflineCoachForm) {
    await this.planning.fill(form.planning);
    await this.description.focus();
    await this.description.pressSequentially(form.description, { delay: 50 });
    await this.friendNamed.fill(form.friendNamed);
  }

  /** Tunggu hasil booking setelah klik Confirm: 'success' | 'failed' | 'timeout' */
  private async _waitBookingResult(): Promise<'success' | 'failed' | 'timeout'> {
    return Promise.race([
      this.notificationSuccess
        .first()
        .waitFor({ state: 'visible', timeout: 14000 })
        .then(() => 'success' as const)
        .catch(() => 'timeout' as const),
      this.headTextElementFailedBook
        .waitFor({ state: 'visible', timeout: 14000 })
        .then(() => 'failed' as const)
        .catch(() => 'timeout' as const),
    ]);
  }

  /**
   * Tutup notifikasi/modal gagal lalu navigasi kembali ke halaman pilih tanggal.
   * @param currentDate Tanggal saat ini (untuk menunggu kalender kembali muncul)
   */
  private async _handleFailedBooking(currentDate: number): Promise<void> {
    console.log(`❌ Booking gagal pada tanggal ${currentDate}, mencoba tanggal berikutnya...`);
    const isModalVisible = await this.modalConfirm.isVisible();
    if (isModalVisible) {
      await this.btnCloseModalConfirm.click();
      await this.btnCancelModalConfirm.click();
    } else {
      await this.btnCloseNotificationFailed.click();
    }
    await this.btnBackForm.scrollIntoViewIfNeeded();
    await this.btnBackForm.click();
    // Tunggu kalender kembali muncul
    await this.page
      .getByRole('gridcell', { name: new RegExp(`^${currentDate}(\\s|$)`) })
      .first()
      .waitFor({ state: 'visible', timeout: 3000 })
      .catch(() => null);
  }

  /**
   * Booking offline by Coach dengan auto-retry tanggal jika slot tidak tersedia.
   * Alur: Book Session → Offline → Pilih Office → By Coach → Pilih Coach → Tanggal/Waktu → Form → Confirm
   */
  async bookByCoach(form: OfflineCoachForm, maxAttempts: number = 31): Promise<void> {
    await this.page.getByText(OfflineMethod.COACH).click();
    await this.selectCoachBtn.first().click();

    let currentDate = form.date;
    let movedToNextMonth = false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      console.log(`[Offline Coach - Attempt ${attempt + 1}] Mencoba tanggal: ${currentDate}`);

      const dateRegex = new RegExp(`^${currentDate}(\\s|$)`);
      const dateCell = this.page.getByRole('gridcell', { name: dateRegex });
      const cellCount = await dateCell.count();

      if (cellCount === 0) {
        if (!movedToNextMonth) {
          console.log(`Tanggal ${currentDate} tidak ditemukan, pindah ke bulan berikutnya...`);
          await this.nextMonthBtn.click();
          movedToNextMonth = true;
          currentDate = 1;
          continue;
        }
        throw new Error(`Tanggal ${currentDate} tidak ditemukan setelah pindah bulan.`);
      }

      const isDisabled = await dateCell.first().isDisabled();
      if (isDisabled) {
        console.log(`Tanggal ${currentDate} disabled, melewati...`);
        currentDate++;
        continue;
      }

      await dateCell.first().click();

      const slotWaktu = this.page.getByRole('button', { name: form.time });
      const slotVisible = await slotWaktu
        .waitFor({ state: 'visible', timeout: 2000 })
        .then(() => true)
        .catch(() => false);

      if (!slotVisible) {
        console.log(`Tanggal ${currentDate}: tidak ada slot "${form.time}", melewati...`);
        currentDate++;
        continue;
      }

      await slotWaktu.click();
      await this.continueCoachBtn.click();
      await this.fillForm(form);
      await this.confirmAndBookBtn.scrollIntoViewIfNeeded();
      await this.confirmAndBookBtn.click();
      await this.modalConfirm.waitFor({ state: 'visible', timeout: 8000 });
      await this.confirmBtn.click();

      const result = await this._waitBookingResult();

      if (result === 'success') {
        console.log(`✅ Booking berhasil pada tanggal ${currentDate}!`);
        return;
      }
      if (result === 'failed') {
        await this._handleFailedBooking(currentDate);
        currentDate++;
        continue;
      }
      throw new Error(`Timeout menunggu hasil booking pada tanggal ${currentDate}.`);
    }
    throw new Error(`Tidak ada tanggal tersedia setelah ${maxAttempts} percobaan.`);
  }

  /**
   * Booking offline by Topic dengan auto-retry tanggal jika slot tidak tersedia.
   * Alur: Book Session → Offline → Pilih Office → By Topic → Pilih Topik → Pilih Coach → Tanggal/Waktu → Form → Confirm
   */
  async bookByTopic(form: OfflineTopicForm, maxAttempts: number = 31): Promise<void> {
    await this.page.getByText(OfflineMethod.TOPIC).click();
    // Pilih kartu topik — filter div yang mengandung nama topik
    await this.page.locator('div').filter({ hasText: form.topic }).first().click();
    // Pilih coach pertama yang tersedia untuk topik ini
    await this.selectCoachBtn.first().click();

    let currentDate = form.date;
    let movedToNextMonth = false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      console.log(`[Offline Topic - Attempt ${attempt + 1}] Mencoba tanggal: ${currentDate}`);

      const dateRegex = new RegExp(`^${currentDate}(\\s|$)`);
      const dateCell = this.page.getByRole('gridcell', { name: dateRegex });
      const cellCount = await dateCell.count();

      if (cellCount === 0) {
        if (!movedToNextMonth) {
          console.log(`Tanggal ${currentDate} tidak ditemukan, pindah ke bulan berikutnya...`);
          await this.nextMonthBtn.click();
          movedToNextMonth = true;
          currentDate = 1;
          continue;
        }
        throw new Error(`Tanggal ${currentDate} tidak ditemukan setelah pindah bulan.`);
      }

      const isDisabled = await dateCell.first().isDisabled();
      if (isDisabled) {
        console.log(`Tanggal ${currentDate} disabled, melewati...`);
        currentDate++;
        continue;
      }

      await dateCell.first().click();

      const slotWaktu = this.page.getByRole('button', { name: form.time });
      const slotVisible = await slotWaktu
        .waitFor({ state: 'visible', timeout: 2000 })
        .then(() => true)
        .catch(() => false);

      if (!slotVisible) {
        console.log(`Tanggal ${currentDate}: tidak ada slot "${form.time}", melewati...`);
        currentDate++;
        continue;
      }

      await slotWaktu.click();
      await this.continueCoachBtn.click();
      await this.fillForm(form);
      await this.confirmAndBookBtn.scrollIntoViewIfNeeded();
      await this.confirmAndBookBtn.click();
      await this.modalConfirm.waitFor({ state: 'visible', timeout: 8000 });
      await this.confirmBtn.click();

      const result = await this._waitBookingResult();

      if (result === 'success') {
        console.log(`✅ Booking berhasil pada tanggal ${currentDate}!`);
        return;
      }
      if (result === 'failed') {
        await this._handleFailedBooking(currentDate);
        currentDate++;
        continue;
      }
      throw new Error(`Timeout menunggu hasil booking pada tanggal ${currentDate}.`);
    }
    throw new Error(`Tidak ada tanggal tersedia setelah ${maxAttempts} percobaan.`);
  }

  /**
   * Booking offline by Date & Time dengan auto-retry tanggal jika slot tidak tersedia.
   * Alur: Book Session → Offline → Pilih Office → By Date & Time → Tanggal/Waktu → Pilih Coach → Form → Confirm
   */
  async bookByDateTime(form: OfflineCoachForm, maxAttempts: number = 31): Promise<void> {
    await this.page.getByText(OfflineMethod.TIME).click();

    let currentDate = form.date;
    let movedToNextMonth = false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      console.log(`[Offline DateTime - Attempt ${attempt + 1}] Mencoba tanggal: ${currentDate}`);

      const dateRegex = new RegExp(`^${currentDate}(\\s|$)`);
      const dateCell = this.page.getByRole('gridcell', { name: dateRegex });
      const cellCount = await dateCell.count();

      if (cellCount === 0) {
        if (!movedToNextMonth) {
          console.log(`Tanggal ${currentDate} tidak ditemukan, pindah ke bulan berikutnya...`);
          await this.nextMonthBtn.click();
          movedToNextMonth = true;
          currentDate = 1;
          continue;
        }
        throw new Error(`Tanggal ${currentDate} tidak ditemukan setelah pindah bulan.`);
      }

      const isDisabled = await dateCell.first().isDisabled();
      if (isDisabled) {
        console.log(`Tanggal ${currentDate} disabled, melewati...`);
        currentDate++;
        continue;
      }

      await dateCell.first().click();

      const slotWaktu = this.page.getByRole('button', { name: form.time });
      const slotVisible = await slotWaktu
        .waitFor({ state: 'visible', timeout: 9000 })
        .then(() => true)
        .catch(() => false);

      if (!slotVisible) {
        console.log(`Tanggal ${currentDate}: tidak ada slot "${form.time}", melewati...`);
        currentDate++;
        continue;
      }

      await slotWaktu.click();
      // Lanjut ke halaman Coach Selection, lalu pilih coach pertama yang tersedia
      await this.continueCoachBtn.click();
      await this.selectCoachBtn.first().click();

      await this.fillForm(form);
      await this.confirmAndBookBtn.scrollIntoViewIfNeeded();
      await this.confirmAndBookBtn.click();
      await this.modalConfirm.waitFor({ state: 'visible', timeout: 8000 }).catch(async () => {
        await this.confirmAndBookBtn.click();
      });
      await this.confirmBtn.click();

      const result = await this._waitBookingResult();

      if (result === 'success') {
        console.log(`✅ Booking berhasil pada tanggal ${currentDate}!`);
        return;
      }
      if (result === 'failed') {
        const isModalVisible = await this.modalConfirm.isVisible();
        if (isModalVisible) {
          await this.btnCloseModalConfirm.click();
          await this.btnCancelModalConfirm.click();
        } else {
          await this.btnCloseNotificationFailed.click();
        }
        await this.btnBackForm.scrollIntoViewIfNeeded();
        await this.btnBackForm.click();
        const calendarVisible = await this.page
          .getByRole('gridcell', { name: dateRegex })
          .first()
          .waitFor({ state: 'visible', timeout: 2000 })
          .then(() => true)
          .catch(() => false);
        if (!calendarVisible) {
          // Masih di halaman Coach Selection, klik Back sekali lagi
          await this.btnBackForm.click();
          await this.page
            .getByRole('gridcell', { name: dateRegex })
            .first()
            .waitFor({ state: 'visible', timeout: 3000 })
            .catch(() => null);
        }
        currentDate++;
        continue;
      }
      throw new Error(`Timeout menunggu hasil booking pada tanggal ${currentDate}.`);
    }
    throw new Error(`Tidak ada tanggal tersedia setelah ${maxAttempts} percobaan.`);
  }
}
