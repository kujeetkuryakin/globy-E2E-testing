import { test } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';
import { BookingOfflineSession, OfflineTopicForm } from '../../pages/mentee/bookingofflinesession';

test('Booking Offline Session By Topic', async ({ page }) => {
  test.setTimeout(120000);

  const login = new LoginPage(page);
  const booking = new BookingOfflineSession(page);

  const form: OfflineTopicForm = {
    office: 'Tebet OfficeTebet, Jakarta',
    topic: 'Career Planning', // atau sesuaikan dengan topik riil di UI
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
  await booking.bookByTopic(form);
});