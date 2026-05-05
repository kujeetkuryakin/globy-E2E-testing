import { Page, Locator } from "@playwright/test";

export class AvailabilitySettingsPage {
  readonly page: Page;
  readonly menuSchedule: Locator;
  readonly btnSettingAvailability: Locator;
  readonly tabWeeklySchedule: Locator;
  readonly tabSpecificDates: Locator;
  readonly tabTimeOff: Locator;
  readonly btnSaveSettings: Locator;
  readonly btnSaveOverride: Locator;
  readonly btnNext: Locator;
  readonly btnBlockDate: Locator;
  readonly inputReason: Locator;
  readonly btnTrashSlot: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuSchedule = page.getByRole("link", { name: "My Schedule" });
    this.btnSettingAvailability = page.getByRole("button", { name: "Setting Availability" });
    this.tabWeeklySchedule = page.getByRole("button", { name: "Weekly Schedule" });
    this.tabSpecificDates = page.getByRole("button", { name: "Specific Dates" });
    this.tabTimeOff = page.getByRole("button", { name: "Time Off" });
    this.btnSaveSettings = page.getByRole("button", { name: "Save Settings" });
    this.btnSaveOverride = page.getByRole("button", { name: "Save Override" });
    this.btnNext = page.getByRole("button", { name: "Berikutnya" });
    this.btnBlockDate = page.getByRole("button", { name: /Blokir \d+ Tanggal/ });
    this.inputReason = page.getByRole("textbox", { name: "Alasan (Opsional)" });
    this.btnTrashSlot = page.locator("button.text-red-500, .text-destructive").last();
  }

  async goToAvailabilitySettings() {
    await this.menuSchedule.first().click();
    await this.btnSettingAvailability.waitFor({ state: "visible" });
    await this.btnSettingAvailability.click();
  }

  async manageWeeklySchedule() {
    await this.tabWeeklySchedule.click();
    await this.page.getByRole("button", { name: "Available" }).nth(4).click();
    await this.page.getByRole("button", { name: "Breaktime" }).first().click();
    await this.page.locator("div:nth-child(4) > button").first().click();
    await this.page.getByRole("button", { name: "Offline" }).first().click();
    await this.btnSaveSettings.click();
  }

  //---SPECIFIC DATES---
  async openSpecificDateDetail(identifier: string | number) {
    await this.tabSpecificDates.click();
    await this.page.waitForLoadState("networkidle");
    if (typeof identifier === "number" || (typeof identifier === "string" && identifier.length <= 2)) {
      const dateBtn = this.page.getByRole("button", { name: identifier.toString(), exact: true });
      await dateBtn.scrollIntoViewIfNeeded();
      await dateBtn.click();
    } else {
      const rowEditBtn = this.page.locator("tr").filter({ hasText: identifier.toString() }).locator(".inline-flex").first();
      await rowEditBtn.scrollIntoViewIfNeeded();
      await rowEditBtn.click();
    }
    await this.btnSaveOverride.waitFor({ state: "visible" });
  }

  async manageSpecificDate(dateNumber: string) {
    await this.tabSpecificDates.click();
    const openCalendarBtn = this.page.getByRole("button").filter({ hasText: /^$/ }).nth(2);
    await openCalendarBtn.waitFor({ state: "visible", timeout: 10000 });
    await openCalendarBtn.click();
    const targetDate = this.page.getByRole("button", { name: dateNumber, exact: true });
    await targetDate.waitFor({ state: "visible" });
    await targetDate.click();
    await this.page.getByRole("button", { name: "online", exact: true }).click();
    await this.page.getByRole("button", { name: "14:", exact: false }).click();
    await this.page.getByRole("button", { name: "offline", exact: true }).click();
    const endTimeLocator = this.page.getByRole("button", { name: "18:", exact: false });
    await this.page.waitForTimeout(500);
    await endTimeLocator.click();
    await this.btnSaveOverride.click();
  }

  async editSpecificDate(rowIdentifier: string | number, note: string) {
    await this.tabSpecificDates.click();
    await this.page.waitForSelector("table, tr", { state: "visible", timeout: 15000 });
    await this.page.waitForLoadState("networkidle");
    let rowEditBtn;
    if (typeof rowIdentifier === "string") {
      const row = this.page.locator("tr").filter({ hasText: rowIdentifier }).first();
      await row.waitFor({ state: "attached", timeout: 10000 });
      rowEditBtn = row.locator(".inline-flex").first();
    } else {
      rowEditBtn = this.page.locator(`tr:nth-child(${rowIdentifier})`).locator(".inline-flex").first();
    }
    try {
      await rowEditBtn.scrollIntoViewIfNeeded({ timeout: 10000 });
      await rowEditBtn.click({ force: true }); // Force click membantu jika elemen terhalang
    } catch (error) {
      throw new Error(`Gagal menemukan baris dengan identifier: ${rowIdentifier}. Pastikan data tersedia di tabel.`);
    }
    const btnOffline = this.page.getByRole("button", { name: "offline", exact: true });
    await btnOffline.waitFor({ state: "visible", timeout: 15000 });
    await btnOffline.click();
    const timeBtn = this.page.getByRole("button", { name: "20:", exact: false });
    await timeBtn.click();
    const noteInput = this.page.getByRole("textbox", { name: /Add notes/i }).last();
    await noteInput.waitFor({ state: "visible" });
    await noteInput.fill(note);
    await this.page.getByRole("button", { name: "breaktime", exact: true }).click();
    await this.page.getByRole("button", { name: "13:", exact: false }).click();
    await this.btnSaveOverride.scrollIntoViewIfNeeded();
    await this.btnSaveOverride.click();
  }

  async deleteSpecificDate(identifier: string | number) {
    await this.openSpecificDateDetail(identifier);
    await this.btnTrashSlot.waitFor({ state: "visible" });
    await this.btnTrashSlot.click();
    await this.btnSaveOverride.click();
  }

  async manageTimeOff(reason: string, dateToBlock: string) {
    await this.tabTimeOff.click();
    await this.inputReason.fill(reason);
    await this.btnNext.click();
    const dateBtn = this.page.getByRole("button", { name: dateToBlock, exact: true });
    if (await dateBtn.isEnabled()) {
      await dateBtn.click();
      await this.btnBlockDate.click();
    } else {
      console.log(`Tanggal ${dateToBlock} sudah diblokir atau tidak dapat diklik.`);
    }
  }
}
