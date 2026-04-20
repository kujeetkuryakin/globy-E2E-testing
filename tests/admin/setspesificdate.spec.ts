import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';
import { SpecificDateAvailability } from '../../pages/admin/setspesificdate';

test('set specific date availability success', async ({ page }) => {
    const login = new LoginPage(page);
    const availability = new SpecificDateAvailability(page);

    await login.goto();
    await login.login('raniaathallaaa@gmail.com', 'Password123_');

    await expect(
        page.getByRole('navigation')
    ).toBeVisible();

    await availability.openPage();

    await availability.selectCoach('ela');

    const { month, day, year } = await availability.selectDynamicDate();
    const times = await availability.selectRandomTimes();

    await availability.save();

    await availability.validateSuccess();

    await availability.validateTimesSelected(times);

    await page.reload();

    await availability.openPage();
    await availability.selectCoach('ela');

    await page.getByRole('button', { name: 'Specific Dates' }).click();
    await availability.navigateToMonthYear(month, year.toString());
    const dayButtons = page.getByRole('button', { name: `${day}`, exact: true });
    if (await dayButtons.count() > 1) {
        if (day > 15) await dayButtons.last().click();
        else await dayButtons.first().click();
    } else {
        await dayButtons.click();
    }
    await availability.validateTimesSelected(times);
});