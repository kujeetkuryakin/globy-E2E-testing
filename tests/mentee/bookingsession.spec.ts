import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';
import { BookingSession, CoachForm } from '../../pages/mentee/bookingsession';

test('booking Session By Coach', async ({ page }) => {
  const login = new LoginPage(page);
  const booking = new BookingSession(page);
  const form: CoachForm = {
    planning: 'Career Planning',
    description: 'For Job Purpos',
    friendNamed: 'Fahmi',
    time: '12:',
    date: '25',
  };

  await login.goto();
  await login.login('mentee_1776344125520@mail.com', 'Password123_');

  await booking.bookMode(true);
  await booking.bookByCoach(form);

  await expect(booking.notificationSuccess).toBeVisible({
    timeout: 14000,
  });
});
