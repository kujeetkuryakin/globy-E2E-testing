import { test } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';
import { BookingOfflineSession, OfflineCoachForm } from '../../pages/mentee/bookingofflinesession';

test('Positive test: Booking Offline Session By Coach', async ({ page }) => {
  test.setTimeout(120000);

  const login = new LoginPage(page);
  const booking = new BookingOfflineSession(page);

//  await page.getByRole('heading', { name: 'Tebet Office' }).click();
//   await page.getByText('Offline SessionFace-to-face').click();
//   await page.getByText('Tebet OfficeTebet, Jakarta').click();

  const form: OfflineCoachForm = {
    office: 'Tebet OfficeTebet, Jakarta',
    planning: 'Career Planning',
    description: 'For Job Purpose',
    friendNamed: 'Friend Name',
    date: 25,
    time: '10:',
  };

  await login.goto();
  await login.login('mentee_1776666826136@mail.com', 'Asaa@3579');

  await booking.bookMode();
  await booking.selectOffice(form.office);
  await booking.bookByCoach(form);
});