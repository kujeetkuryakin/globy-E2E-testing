import { test, expect } from '@playwright/test';
import { SessionNotesPage } from '../../../pages/coach/fill_logbook';

test.describe('Fill Logbook Validation', () => {

    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {

        test.setTimeout(90000);
        await page.goto('/coach-dashboard');
    });

    test('condition 1: below 100 words - save button should be disabled', async ({ page }) => {

        test.setTimeout(60000);

        const logbook = new SessionNotesPage(page);

        await logbook.goto();
        await logbook.openCompletedTab();
        await logbook.openCompletedSession(0);

        // Under 100 words → 50 words
        const under100 = logbook.generateWords(50);

        await logbook.sessionNotesInput.clear();
        await logbook.fillSessionNotes(under100);

        await expect(
            logbook.saveChangesButton
        ).toBeDisabled();
    });

    test('condition 2: above 200 words - save button should be disabled', async ({ page }) => {

        test.setTimeout(60000);

        const logbook = new SessionNotesPage(page);

        await logbook.goto();
        await logbook.openCompletedTab();
        await logbook.openCompletedSession(1);

        // Over 200 words → 250 words
        const over200 = logbook.generateWords(250);

        await logbook.sessionNotesInput.clear();
        await logbook.fillSessionNotes(over200);

        await expect(
            logbook.saveChangesButton
        ).toBeDisabled();
    });

    test('condition 3: 100-200 words - save should succeed', async ({ page }) => {

        test.setTimeout(60000);

        const logbook = new SessionNotesPage(page);

        await logbook.goto();
        await logbook.openCompletedTab();

        // System finds the third completed session then fills the logbook
        await logbook.openCompletedSession(2);

        // Valid range → 150 words (between 100 and 200)
        const validNotes = logbook.generateWords(150);

        await logbook.sessionNotesInput.clear();
        await logbook.fillSessionNotes(validNotes);

        await expect(
            logbook.saveChangesButton
        ).toBeEnabled();

        await logbook.saveChanges();

        await logbook.validateSuccessSave();
    });
});