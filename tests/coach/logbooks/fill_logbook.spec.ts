import { test, expect } from '@playwright/test';
import { SessionNotesPage } from '../../../pages/coach/fill_logbook';

test.describe('Session Notes Validation', () => {

    test.beforeEach(async ({ page }) => {

        const logbook =
            new SessionNotesPage(page);

        await page.goto('/coach-dashboard');

        await logbook.goto();

        await logbook.openCompletedTab();

        await logbook.openFirstCompletedSession();
    });

    // ─────────────────────────────────────────────
    // CONDITION 1
    // < 100 words
    // Save button should be disabled
    // ─────────────────────────────────────────────

    test('cannot save notes below 100 words', async ({ page }) => {

        const logbook =
            new SessionNotesPage(page);

        const under100 =
            logbook.generateWords(50);

        await logbook.fillSessionNotes(
            under100
        );

        await expect(
            logbook.saveChangesButton
        ).toBeDisabled();
    });

    // ─────────────────────────────────────────────
    // CONDITION 2
    // > 200 words
    // Save button should be disabled
    // ─────────────────────────────────────────────

    test('cannot save notes above 200 words', async ({ page }) => {

        const logbook =
            new SessionNotesPage(page);

        const over200 =
            logbook.generateWords(250);

        await logbook.fillSessionNotes(
            over200
        );

        await expect(
            logbook.saveChangesButton
        ).toBeDisabled();
    });

    // ─────────────────────────────────────────────
    // CONDITION 3
    // 100-200 words
    // Save should succeed
    // ─────────────────────────────────────────────

    test('can save notes between 100 until 200 words', async ({ page }) => {

        const logbook =
            new SessionNotesPage(page);

        const validNotes =
            logbook.generateWords(150);

        await logbook.fillSessionNotes(
            validNotes
        );

        await expect(
            logbook.saveChangesButton
        ).toBeEnabled();

        await logbook.saveChanges();

        await logbook.validateSuccessSave();
    });
});