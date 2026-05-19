import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/shared/login.page';
import { MenteeReportsPage } from '../../pages/coach/mentee_reports';

test('Positive: Coach can fill monthly feedback', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const reportsPage = new MenteeReportsPage(page);

  await loginPage.goto();
  await loginPage.login('elayne.selma@gmail.com', 'Password123_');

  await reportsPage.goto();
  await reportsPage.viewReport(0);
  
  // Membuka form feedback dari report baris pertama (index 0)
  await reportsPage.openFeedbackForm(0);

  // Mengisi form feedback
  const feedbackContent = 'We have missed your presence in our recent sessions! You have such a solid foundation, particularly with your expressive delivery and deep topic understanding, but consistent momentum is key as we approach the competition. To truly bridge the gap and master the advanced critical thinking and formal speech structures we are currently tackling, regular attendance is vital.\n\nWe want to ensure you feel fully confident and prepared. By joining our upcoming sessions, you’ll gain the specific insights needed to turn those natural strengths into a winning performance. Your growth is our priority, and every session is an opportunity to refine your skills further. Let’s dive back in together, I’m looking forward to seeing you there soon!';
  
  await reportsPage.fillFeedbackForm({
    strengths: feedbackContent,
    nextGoals: feedbackContent,
    areas: feedbackContent,
    coachNotes: feedbackContent
  });

  await reportsPage.submitFeedback();

  // Verifikasi sukses
  const successMsg = await reportsPage.getFeedbackSuccessMessage();
  await expect(successMsg.first()).toBeVisible();
});
