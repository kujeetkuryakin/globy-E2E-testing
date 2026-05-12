import { Page, Locator, expect } from '@playwright/test';

export class CoachRelationPage {

    page: Page;

    coachListMenu: Locator;
    relationsMenu: Locator;
    searchRelationInput: Locator;

    constructor(page: Page) {

        this.page = page;

        this.coachListMenu = page.getByRole(
            'link',
            { name: 'Coach List' }
        );

        this.relationsMenu = page.getByRole(
            'link',
            { name: 'Coach-Mentee Relations' }
        );

        this.searchRelationInput =
            page.getByPlaceholder('Search relations...');
    }

    async gotoCoachList() {
        await this.coachListMenu.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Validasi bahwa coach tertentu berstatus Hidden di Coach List.
     * Jika tidak Hidden, test akan fail dengan pesan yang jelas.
     */
    async validateCoachHidden(coachName: string) {
        // Cari baris table yang mengandung nama coach
        const coachRow = this.page.locator('tr').filter({ hasText: coachName });

        await expect(
            coachRow,
            `❌ Coach "${coachName}" tidak ditemukan di Coach List`
        ).toBeVisible({ timeout: 10000 });

        const statusText = await coachRow.textContent();
        console.log(`[Coach List] "${coachName}" row content: ${statusText?.trim()}`);

        await expect(
            coachRow,
            `❌ Coach "${coachName}" seharusnya berstatus HIDDEN di Coach List`
        ).toContainText(/hidden/i);

        console.log(`✅ Konfirmasi: "${coachName}" berstatus Hidden di Coach List`);
    }

    async gotoRelations() {
        await this.relationsMenu.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Cari relasi berdasarkan keyword di halaman Coach-Mentee Relations.
     * Tunggu result muncul atau konfirmasi empty state.
     */
    async searchCoachRelation(keyword: string) {
        await this.searchRelationInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.searchRelationInput.fill(keyword);
        await this.page.waitForTimeout(5000); // Tunggu lebih lama agar data sempat loading muncul
    }

    /**
     * Validasi bahwa coach yang Hidden TIDAK memiliki relasi di halaman Coach-Mentee Relations.
     *
     * Cara kerja:
     * - Cari relasi yang mengandung nama secara lebih umum (misal tanpa kata 'Coach')
     * - Jika ada → FAIL dengan laporan jelas (bug: hidden coach masih punya relasi)
     * - Jika tidak ada → PASS (sesuai ekspektasi)
     *
     * @param coachName Nama coach yang dicek (misalnya 'Coach Jennifer')
     */
    async validateCoachHasNoRelation(coachName: string) {
        // Ambil hanya nama aslinya, misal 'Coach Jennifer' -> 'Jennifer'
        const baseName = coachName.replace(/coach\s/i, '').trim();

        // Cari elemen apapun yang mengandung nama tersebut secara case-insensitive
        const relationItems = this.page.getByText(new RegExp(baseName, 'i'));

        // Karena kita sudah search 'jennifer' di kolom search, apapun yang muncul di tabel
        // atau list yang mengandung 'jennifer' adalah hasil pencarian tersebut.
        const count = await relationItems.count();

        console.log(`[Relations] Jumlah elemen yang menampilkan "${baseName}": ${count}`);

        if (count > 0) {
            // Kita coba kumpulkan beberapa teks untuk memberikan konteks bug
            let foundTexts = [];
            for(let i=0; i < Math.min(count, 3); i++) {
                foundTexts.push(await relationItems.nth(i).textContent());
            }
            console.error(`❌ BUG TERDETEKSI: Coach dengan nama "${baseName}" (status: HIDDEN) masih ditemukan di halaman Relations!`);
            console.error(`   → Ditemukan teks: ${JSON.stringify(foundTexts)}`);
        } else {
            console.log(`✅ OK: Coach "${baseName}" (status: HIDDEN) tidak memiliki relasi di halaman Relations`);
        }

        // Assertion utama
        await expect(
            relationItems.first(),
            `🐛 BUG: Coach "${coachName}" berstatus HIDDEN tapi elemen dengan nama "${baseName}" masih muncul di halaman Coach-Mentee Relations!\n` +
            `   Ekspektasi: coach hidden TIDAK boleh memiliki relasi dengan mentee manapun.`
        ).not.toBeVisible({ timeout: 5000 });
    }

    /**
     * Verifikasi halaman Relations menampilkan empty state / pesan tidak ada data
     * setelah search coach yang hidden.
     */
    async validateEmptyRelationState() {
        // Cek apakah ada teks kosong/empty state
        const emptyState = this.page.getByText(/no relation|tidak ada|no data|empty/i);
        const isEmptyVisible = await emptyState.isVisible().catch(() => false);

        if (isEmptyVisible) {
            console.log(`✅ Halaman Relations menampilkan empty state — tidak ada relasi ditemukan`);
        } else {
            console.log(`ℹ️ Halaman Relations tidak menampilkan pesan empty state eksplisit`);
        }

        return isEmptyVisible;
    }
}