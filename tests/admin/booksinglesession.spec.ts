import { test, expect } from '@playwright/test';
import { BookSessionPage } from '../../pages/admin/booksinglesession.ts';

test('admin booking single session for mentee with auto-retry date', async ({ page }) => {
    test.setTimeout(200000); // Timeout lebih panjang karena ada loop pencarian slot (max 60 hari × 2s)

    const bookingPage = new BookSessionPage(page);

    await page.goto('/admin-dashboard');

    await bookingPage.goto();

    await bookingPage.openCreateSession();

    await bookingPage.chooseOnlineSession();

    // Pilih Coach Elayne dengan fitur pencarian (sama seperti multiple session)
    await bookingPage.selectCoach('ela', /Coach Elayne/);

    await bookingPage.selectMentee('daf');

    const menteeOption = page.getByRole('option', { name: 'Daffa Arkan' });
    await menteeOption.waitFor({
        state: 'visible',
        timeout: 10000
    });

    await bookingPage.selectRegularType();

    // Auto-retry cari tanggal yang available mulai dari hari ini + 1
    // Ganti tanggal start sesuai kebutuhan
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Tidak perlu tentukan jam spesifik — otomatis pilih jam pertama yang tersedia
    const bookingDate = await bookingPage.selectDateAndTimeWithRetry(startDate);

    await bookingPage.submit();

    console.log(`✅ Booking berhasil pada tanggal: ${bookingDate}`);

    await bookingPage.verifySuccess();
});