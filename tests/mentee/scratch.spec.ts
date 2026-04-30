import { test, expect } from '@playwright/test';

test.use({ storageState: 'storage/mentee.json' });

test('check mentee dash', async ({ page }) => {
  await page.goto('https://globy.wins.web.id/');
  await page.waitForTimeout(3000);
  console.log('URL IS:', page.url());
  const body = await page.innerHTML('body');
  require('fs').writeFileSync('mentee_body.html', body);
});
