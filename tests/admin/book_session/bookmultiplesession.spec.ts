import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';
import { BookMultipleSessionPage } from '../../pages/admin/bookmultiplesession';

test('Admin can book multiple online coaching sessions with auto-retry date', async ({ page }) => {
  test.setTimeout(140000); // Set timeout lebih panjang karena ada loop pencarian slot
  
  const login = new LoginPage(page);
  const multipleSession = new BookMultipleSessionPage(page);

  await login.goto();
  await login.login('raniaathallaaa@gmail.com', 'Password123_');

  await multipleSession.goto();
  await multipleSession.openCreateSession();
  
  // Memilih mode dan tab (hanya klik Online 1 kali sesuai instruksi)
  await multipleSession.chooseModeAndTab();

  await multipleSession.selectCoach('hai', /Coach Haidir/);
  await multipleSession.selectMentee(/Ahmad Zyddan Nashevy/);
  
  await multipleSession.selectRegularType();

  // Session 1: Akan mencari otomatis mulai dari tanggal 13 Mei 2026 jika slot tidak tersedia
  let lastDate1 = await multipleSession.fillSessionDetailsWithRetry(0, '2026-05-16', '09:');
  
  // Tambah baris baru
  await multipleSession.addNewSessionLine();
  
  // Session 2: Akan mencari otomatis mulai dari tanggal 15 Mei 2026
  // (Anda juga bisa mengatur logic ini menggunakan lastDate1 jika ingin selalu maju dari tanggal session sebelumnya)
  await multipleSession.fillSessionDetailsWithRetry(1, '2026-05-17', '10:');
  
  // Submit
  await multipleSession.submit();
  // Tunggu kesuksesan
  await multipleSession.verifySuccess();
});