import { Page, Locator, expect } from '@playwright/test';

export class BookSessionPage {
    page: Page;

    coachingScheduleMenu: Locator;
    addSessionBtn: Locator;

    onlineBtn: Locator;

    chooseCoachBtn: Locator;
    coachSearchInput: Locator;
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

        this.coachSearchInput = page.getByPlaceholder('Search coaches...');

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

    /**
     * Pilih coach dengan fitur pencarian (sama seperti multiple session)
     * @param keyword Kata kunci pencarian coach
     * @param coachNameMatch Nama coach yang akan dipilih dari dropdown
     */
    async selectCoach(keyword: string, coachNameMatch: string | RegExp) {
        await this.chooseCoachBtn.click();
        await this.page.waitForTimeout(6000);
        await this.coachSearchInput.pressSequentially(keyword, { delay: 110 });
        await this.page.getByRole('option', { name: coachNameMatch }).click();
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

    /**
     * Mencari tanggal yang available untuk Coach Elayne dengan auto-retry.
     * Strategy: isi tanggal → cek apakah ada tombol jam yang aktif (tidak disabled) →
     * jika ada, klik tombol jam pertama yang tersedia → return tanggal.
     * Maju 1 hari jika tidak ada slot aktif.
     *
     * @param startDateStr Tanggal awal mulai mencoba dalam format YYYY-MM-DD
     * @param preferredTime Pola jam yang diutamakan misal '09:' atau '16:' (opsional)
     * @param maxAttempts Batas maksimal mencoba tanggal berikutnya (default 60)
     * @returns Tanggal yang berhasil dipilih
     */
    async selectDateAndTimeWithRetry(
        startDateStr: string,
        preferredTime?: string | RegExp,
        maxAttempts: number = 60
    ): Promise<string> {
        let currentDateObj = new Date(startDateStr);

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const year = currentDateObj.getFullYear();
            const month = String(currentDateObj.getMonth() + 1).padStart(2, '0');
            const day = String(currentDateObj.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            console.log(`[Single Session] Mencoba tanggal: ${dateStr}`);

            // Isi input tanggal
            await this.dateInput.fill(dateStr);

            // Tunggu UI merender tombol jam (2 detik cukup)
            await this.page.waitForTimeout(2000);

            // Jika ada preferredTime, coba dulu
            if (preferredTime) {
                const preferredBtn = this.page.getByRole('button', { name: preferredTime });
                const preferredVisible = await preferredBtn.first().waitFor({ state: 'visible', timeout: 1000 })
                    .then(() => true)
                    .catch(() => false);

                if (preferredVisible) {
                    const isDisabled = await preferredBtn.first().isDisabled();
                    if (!isDisabled) {
                        await preferredBtn.first().click();
                        console.log(`✅ Sukses memilih tanggal ${dateStr} dan jam ${preferredTime}`);
                        return dateStr;
                    }
                }
            }

            // Fallback: ambil tombol jam mana saja yang aktif di halaman
            // Tombol jam biasanya berformat seperti '09:00', '10:00', '16:00', dst.
            const timeRegex = /^\d{2}:/;
            const allTimeBtns = this.page.getByRole('button').filter({ hasText: timeRegex });
            const count = await allTimeBtns.count();

            for (let i = 0; i < count; i++) {
                const btn = allTimeBtns.nth(i);
                const isDisabled = await btn.isDisabled();
                if (!isDisabled) {
                    const btnText = await btn.textContent();
                    await btn.click();
                    console.log(`✅ Sukses memilih tanggal ${dateStr} dengan jam tersedia: ${btnText?.trim()}`);
                    return dateStr;
                }
            }

            console.log(`❌ Tanggal ${dateStr} tidak ada slot jam aktif. Maju 1 hari...`);
            currentDateObj.setDate(currentDateObj.getDate() + 1);
        }

        throw new Error(`Gagal menemukan slot jam aktif setelah ${maxAttempts} percobaan mulai dari ${startDateStr}`);
    }

    async submit() {
        await this.createSessionBtn.click();
    }

    async verifySuccess() {
        await expect(this.successNotif).toBeVisible({ timeout: 15000 });
    }
}