import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';
import { BookingSession, CoachForm } from '../../pages/mentee/bookingsession';

test('Positive Test: Booking Session By Coach', async ({ page }) => {
  test.setTimeout(40000);
  const login = new LoginPage(page);
  const booking = new BookingSession(page);
  const form: CoachForm = {
    planning: 'Career Planning',
    description: 'For Job Purpos',
    friendNamed: 'Fahmi',
    time: '15:00',
    date: 30,
  };

  await login.goto();
  await login.login('mentee_1776666826136@mail.com', 'Password123_');

  await booking.bookMode(true);

  await booking.bookByCoach(form);

  await expect(booking.notificationSuccess.first()).toBeVisible({
    timeout: 5000,
  });
});
