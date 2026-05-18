import { Page, Locator, expect } from '@playwright/test';

export class SessionNotesPage {

    page: Page;

    myLogbookMenu: Locator;
    completedTab: Locator;

    completedRows: Locator;

    sessionNotesInput: Locator;

    saveChangesButton: Locator;

    validationText: Locator;

    successToast: Locator;

    constructor(page: Page) {

        this.page = page;

        this.myLogbookMenu =
            page.getByRole('link', {
                name: 'My Logbook'
            });

        this.completedTab =
            page.getByText('Completed').first();

        this.completedRows =
            page.locator('tbody tr');

        this.sessionNotesInput =
            page.getByRole('textbox', {
                name: 'Session Notes'
            });

        this.saveChangesButton =
            page.getByRole('button', {
                name: 'Save Changes'
            });

        this.validationText =
            page.getByText(
                /words \(min 100, max 200\)/i
            );

        // Try both role="alert" and common toast class patterns
        this.successToast =
            page.locator('[role="alert"], .toast, .Toastify__toast, .notification, [class*="toast"], [class*="success"]').first();
    }

    async goto() {

        // Wait for the page to be fully loaded before clicking the menu
        await this.myLogbookMenu.waitFor({ state: 'visible', timeout: 15000 });
        await this.myLogbookMenu.click();
    }

    async openCompletedTab() {

        await this.completedTab.waitFor({ state: 'visible', timeout: 15000 });
        await this.completedTab.click();
    }

    /**
     * Opens the Nth completed session that has a fillable logbook button.
     * sessionIndex = 0 → first available, 1 → second available, etc.
     */
    async openCompletedSession(sessionIndex: number = 0) {

        // Wait until at least one row is visible after switching to Completed tab
        await this.completedRows.first().waitFor({ state: 'visible', timeout: 15000 });

        const rowCount = await this.completedRows.count();

        let found = 0;

        for (let i = 0; i < rowCount; i++) {

            const row = this.completedRows.nth(i);

            // Look for the fill/edit logbook button in the action column (nth(1) = second button)
            const actionButton = row
                .locator('td')
                .nth(6)
                .getByRole('button')
                .nth(1);

            const isVisible = await actionButton.isVisible();

            if (isVisible) {

                if (found === sessionIndex) {

                    await actionButton.click();

                    await expect(
                        this.sessionNotesInput
                    ).toBeVisible({ timeout: 15000 });

                    return;
                }

                found++;
            }
        }

        throw new Error(
            `Could not find completed session at index ${sessionIndex}. Only ${found} session(s) available.`
        );
    }

    async fillSessionNotes(notes: string) {

        await this.sessionNotesInput.fill(notes);
    }

    async saveChanges() {

        await this.saveChangesButton.click();
    }

    async validateCannotSave() {

        await expect(
            this.validationText
        ).toBeVisible();
    }

    async validateSuccessSave() {

        // Wait up to 15s for any success feedback (toast, alert, notification)
        await expect(
            this.successToast
        ).toBeVisible({ timeout: 15000 });
    }

    /**
     * Generates a string with exactly `wordCount` unique words.
     */
    generateWords(wordCount: number): string {

        return Array.from(
            { length: wordCount },
            (_, i) => `kata${i + 1}`
        ).join(' ');
    }
}