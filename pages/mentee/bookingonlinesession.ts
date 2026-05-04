import { Locator, Page, expect } from '@playwright/test';

export type CoachForm = {
  planning: string;
  description: string;
  friendNamed: string;
  /** Tanggal awal yang ingin dicoba. Jika booking gagal, otomatis coba tanggal berikutnya. */
  date: number;
  time: string;
};

export type TopicForm = CoachForm & {
  /** Nama topik yang ingin dipilih, contoh: 'Public Speaking' */
  topic: string;
};

enum Method {
  COACH = 'By CoachChoose your preferred',
  TOPIC = 'By TopicChoose learning topic',
  TIME = 'By Date & TimeChoose schedule',
  BULK_COACH = 'Bulk Booking By CoachSelect a',
}

export class BookingOnlineSession {
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
  btnBackForm: Locator;
  btnCloseModalConfirm: Locator;
  btnCancelModalConfirm: Locator;
  btnCloseNotificationFailed: Locator;

  notificationSuccess: Locator;
  notificationFailedBook: Locator;
  headTextElementFailedBook: Locator;
  paragrafTextElementFailedBook: Locator;
  modalConfirm: Locator;

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
    this.btnBackForm = page.getByRole('button', { name: 'Back' });
    this.btnCloseModalConfirm = page.getByRole('button', { name: 'Close' });
    this.btnCancelModalConfirm = page.getByRole('button', { name: 'Cancel' });
    this.btnCloseNotificationFailed = page.locator(
      'div:nth-child(2) > .fixed > .group > .absolute',
    );

    this.notificationSuccess = page.getByRole('heading', { name: 'Booking Successful! 🎉' });
    this.notificationFailedBook = page.getByRole('listitem').nth(1);
    this.headTextElementFailedBook = page.getByText('Booking Failed').nth(1);
    this.paragrafTextElementFailedBook = page.getByText('Failed to book session').nth(1);
    this.modalConfirm = page.getByRole('dialog', { name: 'Confirm Booking' });
  }

  /**
   * @param isOnline Boolean
   * @default isOnline true
   * @desc if you want book online fill true otherwise false
   */
  async bookMode(isOnline: boolean = true) {
    await this.bookSessionBtn.click();
    await (isOnline ? this.mode[0] : this.mode[1]).click();
  }

  async bookByCoach(form: CoachForm, maxAttempts: number = 31): Promise<void> {
    await this.page.getByText(Method.COACH).click();
    await this.selectCoachBtn.first().click();

    let currentDate = form.date;
    let movedToNextMonth = false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      console.log(`[Attempt ${attempt + 1}] Mencoba tanggal: ${currentDate}`);

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
        console.log(
          `Tanggal ${currentDate} disabled (sudah lewat atau tidak tersedia), melewati...`,
        );
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
        console.log(
          `Tanggal ${currentDate}: tidak ada slot "${form.time}", mencoba tanggal berikutnya...`,
        );
        const anotherTime = this.page.getByRole('button', { name: '10:00' });
        const slotVisibleAnotherTime = await anotherTime
          .waitFor({ state: 'visible', timeout: 2000 })
          .then(() => true)
          .catch(() => false);
        if (!slotVisibleAnotherTime) {
          currentDate++;
          continue;
        }
        await anotherTime.click();
      } else {
        await slotWaktu.click();
      }

      await this.continueCoachBtn.click();
      await this.fillFormCoach(form);
      // Scroll ke tombol karena form panjang — bisa di luar viewport
      await this.confirmAndBookBtn.scrollIntoViewIfNeeded();
      await this.confirmAndBookBtn.click();
      // Tunggu modal konfirmasi muncul sebelum klik Confirm
      await this.modalConfirm.waitFor({ state: 'visible', timeout: 8000 });
      await this.confirmBtn.click();

      const result = await Promise.race([
        this.notificationSuccess
          .first()
          .waitFor({ state: 'visible', timeout: 4000 })
          .then(() => 'success' as const)
          .catch(() => 'timeout' as const),
        this.headTextElementFailedBook
          .waitFor({ state: 'visible', timeout: 4000 })
          .then(() => 'failed' as const)
          .catch(() => 'timeout' as const),
      ]);

      if (result === 'success') {
        console.log(`✅ Booking berhasil pada tanggal ${currentDate}!`);
        return;
      }

      if (result === 'failed') {
        console.log(`❌ Booking gagal pada tanggal ${currentDate}, mencoba tanggal berikutnya...`);
        result[0];
        const isVisible = await this.modalConfirm.isVisible({ timeout: 2000 });
        if (isVisible) {
          await this.btnCloseModalConfirm.click();
          await this.btnCancelModalConfirm.click();
          await this.btnBackForm.scrollIntoViewIfNeeded();
          await this.btnBackForm.click();
        } else {
          await this.btnCloseNotificationFailed.click();
          await this.btnBackForm.scrollIntoViewIfNeeded();
          await this.btnBackForm.click();
        }

        await this.page
          .getByRole('gridcell', { name: new RegExp(`^${currentDate}(\\s|$)`) })
          .first()
          .waitFor({ state: 'visible', timeout: 3000 })
          .catch(() => null);
        currentDate++;
        continue;
      }

      throw new Error(`Timeout menunggu hasil booking pada tanggal ${currentDate}.`);
    }

    throw new Error(`Tidak ada tanggal tersedia setelah ${maxAttempts} percobaan.`);
  }

  async fillFormCoach(form?: CoachForm) {
    await this.planning.fill(form ? form.planning : '');
    await this.description.focus();
    await this.description.pressSequentially(form ? form.description : '', { delay: 50 });
    await this.friendNamed.fill(form ? form.friendNamed : '');
  }

  /** Tunggu hasil booking setelah klik Confirm: 'success' | 'failed' | 'timeout' */
  private async _waitBookingResult(): Promise<'success' | 'failed' | 'timeout'> {
    return Promise.race([
      this.notificationSuccess
        .first()
        .waitFor({ state: 'visible', timeout: 23000 })
        .then(() => 'success' as const)
        .catch(() => 'timeout' as const),
      this.headTextElementFailedBook
        .waitFor({ state: 'visible', timeout: 23000 })
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

  async bookByTopic(form: TopicForm, maxAttempts: number = 31): Promise<void> {
    await this.page.getByText(Method.TOPIC).click();
    // Pilih kartu topik — filter div yang mengandung nama topik
    await this.page.locator('div').filter({ hasText: form.topic }).first().click();
    // Pilih coach pertama yang tersedia untuk topik ini
    await this.selectCoachBtn.first().click();

    let currentDate = form.date;
    let movedToNextMonth = false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      console.log(`[Topic - Attempt ${attempt + 1}] Mencoba tanggal: ${currentDate}`);

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
      await this.fillFormCoach(form);
      // Scroll ke tombol karena form panjang — bisa di luar viewport
      await this.confirmAndBookBtn.scrollIntoViewIfNeeded();
      await this.confirmAndBookBtn.click();
      // Tunggu modal konfirmasi muncul sebelum klik Confirm
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

  async bookByDateTime(form: CoachForm, maxAttempts: number = 31): Promise<void> {
    await this.page.getByText(Method.TIME).click();

    let currentDate = form.date;
    let movedToNextMonth = false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      console.log(`[DateTime - Attempt ${attempt + 1}] Mencoba tanggal: ${currentDate}`);

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

      await this.fillFormCoach(form);
      // Scroll ke tombol karena form panjang — bisa di luar viewport
      await this.confirmAndBookBtn.scrollIntoViewIfNeeded();
      await this.confirmAndBookBtn.click();
      // Tunggu modal konfirmasi muncul sebelum klik Confirm
      await this.modalConfirm.waitFor({ state: 'visible', timeout: 8000 }).catch(async ()=>{
        await this.confirmAndBookBtn.click();
      })
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

  async bookBulkByCoach(dates: number[], times: string[]): Promise<void> {

    await this.page.evaluate(() => window.scrollBy(0, 500));
    
    const bulkMethod = this.page.getByText(Method.BULK_COACH).first();
    await bulkMethod.waitFor({ state: 'visible', timeout: 5000 });
    await bulkMethod.click();

    await this.selectCoachBtn.first().waitFor({ state: 'visible', timeout: 5000 });
    await this.selectCoachBtn.first().click();

    let lastSelectedDate = -1;


    for (let i = 0; i < dates.length; i++) {
      let currentDate = dates[i];

      if (lastSelectedDate !== -1 && currentDate <= lastSelectedDate) {
         currentDate = lastSelectedDate + 1;
      }
      
      let movedToNextMonth = false;
      let success = false;
      let maxAttempts = 31;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        console.log(`[Bulk - Attempt ${attempt + 1}] Mencoba tanggal: ${currentDate} untuk slot: ${times[i]}`);
        
        const dateStr = currentDate.toString().split('').join('\\s*');
        const dateRegex = new RegExp(`^${dateStr}(\\s|$)`);
        const dateCells = this.page.getByRole('gridcell', { name: dateRegex });
        
        const count = await dateCells.count();
        if (count === 0) {
          if (!movedToNextMonth) {
            console.log(`Tanggal ${currentDate} tidak ditemukan, pindah ke bulan berikutnya...`);
            await this.nextMonthBtn.click();
            await this.page.waitForTimeout(500); 
            movedToNextMonth = true;
            currentDate = 1;
            continue;
          }
          throw new Error(`Tanggal ${currentDate} tidak ditemukan setelah pindah bulan.`);
        }
        

        let validCell = null;
        for (let j = 0; j < count; j++) {
          if (!(await dateCells.nth(j).isDisabled())) {
            validCell = dateCells.nth(j);
            break;
          }
        }
        
        if (!validCell) {
          console.log(`Tanggal ${currentDate} disabled, mencoba hari berikutnya...`);
          currentDate++;
          continue;
        }

        // Klik tanggal
        await validCell.click();
        await this.page.waitForTimeout(500); // Tunggu UI waktu muncul
        
        // Berdasarkan interaksi UI, jika ini adalah tanggal kedua/ketiga, 
        // kita mungkin perlu menggeser slider waktu untuk melihat slot tanggal ini.
        if (i > 0) {
           const nextBtn = this.page.getByRole('button').filter({ hasText: /^$/ }).nth(4);
           // Hanya klik jika tombol next tersedia
           if (await nextBtn.isVisible()) {
             await nextBtn.click();
             await this.page.waitForTimeout(500);
           }
        }

        // Cek apakah waktu tersedia
        const slotWaktu = this.page.getByRole('button', { name: new RegExp(times[i]) });
        const slotVisible = await slotWaktu.first()
          .waitFor({ state: 'visible', timeout: 3000 })
          .then(() => true)
          .catch(() => false);

        if (!slotVisible) {
          console.log(`Tanggal ${currentDate}: tidak ada slot waktu "${times[i]}", membatalkan tanggal ini...`);
          // Un-click tanggal yang tidak memiliki waktu yang valid
          await validCell.click();
          await this.page.waitForTimeout(500);
          
          currentDate++;
          continue;
        }

        // Klik slot waktu
        await slotWaktu.first().click();
        success = true;
        lastSelectedDate = currentDate; // Simpan tanggal yang sukses agar iterasi berikutnya tidak bentrok
        break; // Lanjut ke jadwal berikutnya (i+1)
      }

      if (!success) {
        throw new Error(`Tidak ada tanggal & waktu yang tersedia untuk permintaan ke-${i + 1}`);
      }
    }

    // 3. Konfirmasi Bulk Booking
    await this.page.getByRole('button', { name: 'Confirm Bulk Booking' }).click();
    
    // 4. Konfirmasi di modal
    await this.modalConfirm.waitFor({ state: 'visible', timeout: 8000 }).catch(async () => {
      await this.page.getByRole('button', { name: 'Confirm Bulk Booking' }).click();
    });
    await this.confirmBtn.click();

    // 5. Tunggu hasil booking
    const result = await this._waitBookingResult();
    if (result === 'success') {
      console.log(`✅ Bulk Booking berhasil!`);
      return;
    }
    
    throw new Error('Bulk booking gagal atau timeout.');
  }

  async selectDate(date: number): Promise<void> {
    const cell = this.page.getByRole('gridcell', { name: new RegExp(`^${date}(\\s|$)`) }).first();
    await expect(cell).toBeVisible({ timeout: 5000 });
    await cell.click();
  }

  async selectTime(time: string) {
    const slotWaktu = this.page.getByRole('button', { name: time });
    await expect(slotWaktu).toBeVisible({ timeout: 10000 });
    await slotWaktu.click();
  }
}
