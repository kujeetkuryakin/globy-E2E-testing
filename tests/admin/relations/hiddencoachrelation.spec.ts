import { test } from '@playwright/test';
import { CoachRelationPage } from '../../pages/admin/hiddencoachrelation';

/**
 * Test: Hidden coach seharusnya TIDAK memiliki relasi dengan mentee.
 *
 * Alur:
 * 1. Buka Coach List → konfirmasi Coach Jennifer berstatus Hidden
 * 2. Buka Coach-Mentee Relations → search "jennifer"
 * 3. Validasi: Coach Jennifer tidak muncul di daftar relasi
 *
 * Jika test GAGAL → BUG: hidden coach masih bisa memiliki relasi (harus diperbaiki)
 * Jika test LULUS → sistem sudah benar memblokir hidden coach dari memiliki relasi
 */
test('hidden coach should not have mentee relation', async ({ page }) => {
    test.setTimeout(60000);

    const coachPage = new CoachRelationPage(page);

    await page.goto('/admin-dashboard');

    // ─────────────────────────────────────────────
    // STEP 1: Konfirmasi Coach Jennifer berstatus Hidden
    // ─────────────────────────────────────────────
    console.log('\n══════════════════════════════════════════════');
    console.log('STEP 1: Validasi status Coach Jennifer di Coach List');
    console.log('══════════════════════════════════════════════');

    await coachPage.gotoCoachList();
    await coachPage.validateCoachHidden('Coach Jennifer');

    // ─────────────────────────────────────────────
    // STEP 2: Buka halaman Coach-Mentee Relations
    // ─────────────────────────────────────────────
    console.log('\n══════════════════════════════════════════════');
    console.log('STEP 2: Buka halaman Coach-Mentee Relations');
    console.log('══════════════════════════════════════════════');

    await coachPage.gotoRelations();

    // ─────────────────────────────────────────────
    // STEP 3: Search relasi untuk "jennifer"
    // ─────────────────────────────────────────────
    console.log('\n══════════════════════════════════════════════');
    console.log('STEP 3: Cari relasi dengan keyword "jennifer"');
    console.log('══════════════════════════════════════════════');

    await coachPage.searchCoachRelation('jennifer');

    // ─────────────────────────────────────────────
    // STEP 4: Validasi Coach Jennifer TIDAK ada di relasi
    // ─────────────────────────────────────────────
    console.log('\n══════════════════════════════════════════════');
    console.log('STEP 4: Validasi Coach Jennifer tidak memiliki relasi');
    console.log('Ekspektasi: coach hidden = tidak boleh punya relasi');
    console.log('══════════════════════════════════════════════');

    await coachPage.validateCoachHasNoRelation('Coach Jennifer');

    // Bonus: cek apakah ada empty state message
    await coachPage.validateEmptyRelationState();

    console.log('\n══════════════════════════════════════════════');
    console.log('✅ TEST SELESAI: Coach Jennifer (Hidden) tidak memiliki relasi');
    console.log('   Sistem sudah benar memblokir hidden coach dari relasi mentee');
    console.log('══════════════════════════════════════════════\n');
});