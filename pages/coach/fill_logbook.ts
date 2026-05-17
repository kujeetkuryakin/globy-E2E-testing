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

        this.successToast =
            page.getByRole('alert');
    }

    async goto() {

        await this.myLogbookMenu.click();
    }

    async openCompletedTab() {

        await this.completedTab.click();
    }

    async openFirstCompletedSession() {

        const firstRow =
            this.completedRows.first();

        await firstRow
            .locator('td')
            .nth(6)
            .getByRole('button')
            .nth(1)
            .click();
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

        await expect(
            this.successToast
        ).toBeVisible();
    }

    generateWords(totalWords: number): string {

        return Array(totalWords)
            .fill('contoh')
            .join(' ');
    }
}