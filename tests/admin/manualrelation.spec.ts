import { test } from '@playwright/test';
import { ManualRelationPage } from '../../pages/admin/manualrelation';

test('Admin can manually assign PIC/Coach to a random Mentee', async ({ page }) => {
    test.setTimeout(60000);

    const manualRelation = new ManualRelationPage(page);

    console.log('\n══════════════════════════════════════════════');
    console.log('Mulai proses Assign PIC to Mentee');
    console.log('══════════════════════════════════════════════');

    // 1. Masuk ke halaman Coach-Mentee Relations
    await manualRelation.goto();

    // 2. Klik button "Assign PIC to Mentee"
    await manualRelation.openAssignModal();

    // 3. Search & pilih coach (Elayne)
    await manualRelation.selectCoach('elayne');

    // 4. Pilih Mentee secara acak agar setiap run mentee-nya berbeda
    await manualRelation.selectRandomMentee();

    // 5. Submit form
    await manualRelation.submit();

    // 6. Verifikasi Toast Alert bahwa sukses
    await manualRelation.verifySuccess();
    
    console.log('══════════════════════════════════════════════\n');
});
