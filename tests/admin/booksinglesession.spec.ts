import { test, expect } from '@playwright/test';
import { BookSessionPage } from '../../pages/admin/booksinglesession.ts';

test('admin booking session for mentee', async ({ page }) => {
    const bookingPage = new BookSessionPage(page);

    await page.goto('/admin-dashboard');

    await bookingPage.goto();

    await bookingPage.openCreateSession();

    await bookingPage.chooseOnlineSession();

    await bookingPage.selectCoach();

    await bookingPage.selectMentee('daf');

    const menteeOption = page.getByRole('option', { name: 'Daffa Arkan' });
    await menteeOption.waitFor({
        state: 'visible',
        timeout: 10000
    });

    await bookingPage.selectRegularType();

    const bookingDate = await bookingPage.selectDynamicDate();

    await bookingPage.selectTime('16:');

    await bookingPage.submit();

    console.log(`Booking date used: ${bookingDate}`);

    await expect(
        bookingPage.successNotif
    ).toBeVisible();
});