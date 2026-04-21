import { test, expect } from '@playwright/test';
import { AvailabilityPage } from '../../pages/admin/weeklyavailability';

test('admin set availability success', async ({ page }) => {
    const availability = new AvailabilityPage(page);

    await availability.openAvailabilitySetting();

    await availability.selectCoach('ela');
    await availability.toggleAvailability(3);
    await availability.save();

    await expect(availability.getSuccessNotification()).toBeVisible();
});