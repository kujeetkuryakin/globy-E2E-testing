import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';
import { BookingOnlineSession, CoachForm } from '../../pages/mentee/bookingonlinesession';

test('Positive test: Booking Session Online By Date & Time', async ({ page }) => {
  test.setTimeout(60000);
  const login = new LoginPage(page);
  const booking = new BookingOnlineSession(page);
  const form: CoachForm = {
    planning: 'Career Planning',
    description: 'For Job Purpos',
    friendNamed: 'Fahmi',
    time: '15:00',
    date: 29,
  };

  await login.goto();
  await login.login('mentee_1776666826136@mail.com', 'Asaa@3579');

  await booking.bookMode(true);
  await booking.bookByDateTime(form);

  await expect(booking.notificationSuccess.first()).toBeVisible({ timeout: 5000 });
});

