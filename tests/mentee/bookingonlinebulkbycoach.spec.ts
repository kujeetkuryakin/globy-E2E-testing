import { test, expect } from '@playwright/test';
import { BookingOnlineSession } from '../../pages/mentee/bookingonlinesession';
import { LoginPage } from '../../pages/shared/login.page';

test('Bulk booking by coach', async ({ page }) => {
  test.setTimeout(140000);

  const login = new LoginPage(page);
  const bookingSession = new BookingOnlineSession(page);
  
  await login.goto();
  await login.login('mentee_1776666826136@mail.com', 'Asaa@3579');

  await bookingSession.bookMode(true);
  
  await bookingSession.bookBulkByCoach([7, 8], ['09:', '11:']);
});