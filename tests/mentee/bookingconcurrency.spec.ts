import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';
import { BookingSession, CoachForm } from '../../pages/mentee/bookingsession';

test('Simulasi Race Condition: 2 User Berebut 1 Slot Jadwal', async ({ browser }) => {
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();
  const login1 = new LoginPage(page1);
  const booking1 = new BookingSession(page1);

  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  const login2 = new LoginPage(page2);
  const booking2 = new BookingSession(page2);

  const form: CoachForm = {
    planning: 'Career Planning',
    description: 'Testing concurrency with 2 users',
    friendNamed: 'Fahmi',
    time: '15:',
    date: '30',
  };

  async function prepareBookingToConfirmStage(
    login: LoginPage,
    booking: BookingSession,
    email: string,
  ) {
    await login.goto();
    await login.login(email, 'Password123_');

    await booking.bookMode(true);
    await booking.page.getByText('By Coach', { exact: true }).click();
    await booking.selectCoachBtn.first().click();
    await booking.selectDate(form.date);
    await booking.selectTime(form.time);
    await booking.continueCoachBtn.click();
    await booking.fillFormCoach(form);

    await booking.confirmAndBookBtn.click();
    await booking.confirmBtn.waitFor({ state: 'visible' });
  }

  await Promise.all([
    prepareBookingToConfirmStage(login1, booking1, 'mentee_1776666826136@mail.com'),
    prepareBookingToConfirmStage(login2, booking2, 'mentee_1776344125520@mail.com'),
  ]);

  await Promise.all([booking1.confirmBtn.click(), booking2.confirmBtn.click()]);

  await page1.waitForTimeout(3000);

  const user1Success = await booking1.notificationSuccess.isVisible();
  const user2Success = await booking2.notificationSuccess.isVisible();

  console.log(`Status User 1: ${user1Success ? 'Berhasil Booking' : 'Gagal/Ditolak'}`);
  console.log(`Status User 2: ${user2Success ? 'Berhasil Booking' : 'Gagal/Ditolak'}`);

  expect(user1Success && user2Success).toBeFalsy();
});
