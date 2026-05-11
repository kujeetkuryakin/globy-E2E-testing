import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/shared/login.page';
import { BookingOnlineSession, CoachForm } from '../../../pages/mentee/bookingonlinesession';

test('Positive Test: Booking Session Online By Coach', async ({ page }) => {
  test.setTimeout(40000);
  const login = new LoginPage(page);
  const booking = new BookingOnlineSession(page);
  const form: CoachForm = {
    planning: 'Career Planning',
    description: 'For Job Purpos',
    friendNamed: 'Fahmi',
    time: '15:00',
    date: 30,
  };

  await login.goto();
  await login.login('ahmadzyddannashevy@gmail.com', 'Password123_');
  await page.goto('/dashboard');
  await booking.bookMode(true);
  await booking.bookByCoach(form);
  await expect(booking.notificationSuccess.first()).toBeVisible(
    {
      timeout: 5000,
    });
});

