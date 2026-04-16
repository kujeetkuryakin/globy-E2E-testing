import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';
import { AvailabilityPage } from '../../pages/admin/weeklyavailability';

test('admin set availability success', async ({ page }) => {
    const login = new LoginPage(page);
    const availability = new AvailabilityPage(page);

    await login.goto();
    await login.login('raniaathallaaa@gmail.com', 'Password123_');

    await availability.openAvailabilitySetting();

    await availability.selectCoach('ela');
    await availability.toggleAvailability(3);
    await availability.save();

    await expect(availability.getSuccessNotification()).toBeVisible();
});