import { test, expect } from '@playwright/test';
import { BookSessionPage } from '../../../pages/admin/booksinglesession';

test('admin booking session for mentee', async ({ page }) => {
    const bookingPage = new BookSessionPage(page);
    await page.goto('/admin-dashboard');

    await bookingPage.goto();
    await bookingPage.openCreateSession();

    await bookingPage.chooseModeAndTab();
    await bookingPage.selectCoach(/Coach Elayne/);
    await bookingPage.selectMentee(/Gracie Abrams/);

    await bookingPage.selectRegularType();

    let lastDate1 = await bookingPage.fillSessionDetailsWithRetry(0, '2026-05-16', '14:');

    await bookingPage.submit();

    const successPopup =
        page.getByText(
            /session booked successfully/i
        );

    const insufficientPopup =
        page.getByText(
            /insufficient token balance/i
        );

    const genericErrorPopup =
        page.getByRole('alert');

    try {

        // cek success
        if (
            await successPopup
                .isVisible({ timeout: 5000 })
                .catch(() => false)
        ) {

            console.log(
                '✅ SUCCESS: Session berhasil dibuat'
            );

        }

        // cek insufficient token
        else if (
            await insufficientPopup
                .isVisible({ timeout: 5000 })
                .catch(() => false)
        ) {

            console.log(
                '⚠️ FAILED: Token mentee tidak cukup'
            );

        }
        // cek popup error lain
        else if (
            await genericErrorPopup
                .first()
                .isVisible({ timeout: 5000 })
                .catch(() => false)
        ) {

            const errorText =
                await genericErrorPopup
                    .first()
                    .textContent();

            console.log(
                `❌ ERROR LAIN: ${errorText}`
            );

        }
        else {
            console.log(
                '❌ Tidak ada popup yang muncul'
            );
        }
    } catch (error) {
        console.log(
            '💀 Test gagal total'
        );
        throw error;
    }
});