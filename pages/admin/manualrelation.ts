import { Page, Locator, expect } from '@playwright/test';

export class ManualRelationPage {
    page: Page;

    relationsMenu: Locator;
    assignPicBtn: Locator;
    coachSearchInput: Locator;
    createRelationBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        this.relationsMenu = page.getByRole('link', { name: 'Coach-Mentee Relations' });
        this.assignPicBtn = page.getByRole('button', { name: 'Assign PIC to Mentee' });
        this.coachSearchInput = page.getByRole('textbox', { name: 'Search coaches...' });
        this.createRelationBtn = page.getByRole('button', { name: 'Create Relation' });
    }

    async goto() {
        await this.page.goto('/admin-dashboard');
        // Tunggu navigasi SPA selesai — cek munculnya sidebar link sebagai sinyal halaman loaded
        await this.relationsMenu.waitFor({ state: 'visible', timeout: 15000 });
        await this.relationsMenu.click();
        // Tunggu sampai button "Assign PIC to Mentee" muncul sebagai sinyal halaman relasi sudah load
        await this.assignPicBtn.waitFor({ state: 'visible', timeout: 15000 });
    }

    async openAssignModal() {
        await this.assignPicBtn.click();
        // Tunggu dialog/modal muncul
        await this.page.getByRole('dialog').waitFor({ state: 'visible', timeout: 10000 });
        await this.page.waitForTimeout(500); // Animasi modal selesai
    }

    /**
     * Pilih coach di dalam modal dengan cara yang memicu React state update.
     * Klik pada container div dari item coach (bukan text nodenya langsung).
     */
    async selectCoach(coachName: string) {
        await this.coachSearchInput.fill(coachName);
        await this.page.waitForTimeout(2000); // Tunggu hasil search muncul

        const modal = this.page.getByRole('dialog');

        // Cari div yang mengandung nama coach DAN email (@ symbol) — ini adalah card itemnya.
        // nth(0) mengambil elemen terkecil yang masih mengandung keduanya.
        // Kita filter dari yang paling spesifik: div yang hanya berisi teks coach, bukan seluruh modal.
        const coachCard = modal.locator('div').filter({
            hasText: new RegExp(coachName, 'i')
        }).filter({
            hasText: /@/ // Pastikan mengandung email
        }).last(); // .last() = node terdalam yang masih wrap keduanya

        await coachCard.waitFor({ state: 'visible', timeout: 5000 });
        await coachCard.click();

        console.log(`[Modal] Coach "${coachName}" dipilih`);
        await this.page.waitForTimeout(1000); // Beri waktu React update state
    }

    /**
     * Pilih mentee secara acak dari daftar yang muncul di modal.
     * Mencari semua item div mentee (berformat: Avatar + Nama + Email),
     * lalu memilih salah satu secara random dan mengkliknya.
     */
    async selectRandomMentee() {
        await this.page.waitForTimeout(2000); // Tunggu list mentee load setelah coach dipilih

        const modal = this.page.getByRole('dialog');

        // Cari semua div item mentee: berisi email (@), BUKAN berisi nama coach yang sudah dipilih
        // Setiap mentee item adalah div kecil dengan format: "Initials | Name | email"
        const allMenteeDivs = modal.locator('div').filter({
            hasText: /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ // Mengandung email
        }).filter({
            hasNotText: /Search coaches|Search mentees|active mentees/i // Bukan search input atau coach item
        });

        const count = await allMenteeDivs.count();
        console.log(`[Modal] Ditemukan ${count} kandidat div mentee`);

        if (count === 0) {
            throw new Error('❌ Tidak ada mentee yang tersedia di daftar modal');
        }

        // Pilih random index
        const randomIndex = Math.floor(Math.random() * count);
        const chosenMenteeDiv = allMenteeDivs.nth(randomIndex);

        const menteeText = await chosenMenteeDiv.textContent();
        console.log(`[Modal] ✨ Memilih mentee secara acak: "${menteeText?.trim()}"`);

        await chosenMenteeDiv.click();
        await this.page.waitForTimeout(1000); // Beri waktu React update state
    }

    async submit() {
        // Tunggu sampai tombol "Create Relation" aktif (tidak disabled)
        // Ini membuktikan bahwa coach dan mentee sudah terpilih dengan benar
        await expect(
            this.createRelationBtn,
            '❌ Tombol "Create Relation" masih disabled — coach atau mentee belum terpilih dengan benar'
        ).toBeEnabled({ timeout: 10000 });

        await this.createRelationBtn.click();
    }

    async verifySuccess() {
        const successToast = this.page.getByText(/Coach-mentee relation created/i).first();

        await expect(
            successToast,
            '❌ Notifikasi "Coach-mentee relation created" tidak muncul'
        ).toBeVisible({ timeout: 10000 });

        console.log('✅ Relation berhasil dibuat! Notifikasi sukses muncul.');
    }
}
