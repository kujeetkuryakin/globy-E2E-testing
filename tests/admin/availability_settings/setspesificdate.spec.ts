import { test, expect } from '@playwright/test';
import { SpecificDateAvailability } from '../../../pages/admin/setspesificdate';

test('set specific date availability success', async ({ page }) => {
    const availability = new SpecificDateAvailability(page);

    await page.goto('/admin-dashboard');

    await expect(
        page.getByRole('navigation')
    ).toBeVisible();

    await availability.openPage();

    await availability.selectCoach('ela');

    const {
        month,
        day,
        year,
        fullDate
    } = await availability.selectDynamicDate();
    const times = await availability.selectRandomTimes();

    await availability.save();

    await availability.validateSuccess();

    await availability.validateTimesSelected(times);

    await page.reload();

    await availability.openPage();
    await availability.selectCoach('ela');

    await page.getByRole('button', { name: 'Specific Dates' }).click();
    await page.locator('input[type="date"]').fill(fullDate);
    await availability.validateTimesSelected(times);
});