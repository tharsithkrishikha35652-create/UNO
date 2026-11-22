import { test, expect } from '@playwright/test';

test.describe('Guest mode', () => {
  test('lets a student enter without Firebase account access and uses the selected department', async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem('calcredit_launch_played', 'true');
      window.localStorage.setItem('calcredit_tour_completed_v1', 'true');
    });

    await page.goto('/');

    const guestButton = page.getByRole('button', { name: 'Continue as guest' });
    await expect(guestButton).toBeVisible();
    await guestButton.click();

    const confirmation = page.getByRole('dialog', { name: 'Continue as a guest?' });
    await expect(confirmation).toBeVisible();
    await confirmation.getByRole('button', { name: 'Yes' }).click();

    const departmentDialog = page.getByRole('dialog', { name: 'Select your Department' });
    await expect(departmentDialog).toBeVisible();
    await departmentDialog.getByRole('radio', { name: 'Information Technology' }).click();
    await departmentDialog.getByRole('button', { name: 'Continue as Guest' }).click();

    await page.getByRole('button', { name: 'Open student profile' }).click();
    await expect(page.getByText('Temporary guest session')).toBeVisible();
    await expect(page.getByText('Information Technology', { exact: true })).toBeVisible();
    await expect(page.getByText(/courses and results exist only in memory/i)).toBeVisible();

    await page.getByRole('dialog').getByRole('button', { name: 'Close profile' }).click();
    await page.getByRole('button', { name: 'Choose semester' }).click();
    await page.getByRole('option', { name: 'Semester 1' }).click();
    await page.getByRole('button', { name: 'Calculus, Not started' }).click();

    await page.getByRole('checkbox', { name: 'Include estimated lab & activity average' }).check();
    await page.locator('#test-scored-1').fill('40');
    await page.locator('#test-scored-2').fill('45');
    await page.locator('#ese-marks-input').fill('80');
    await page.getByRole('button', { name: 'Calculate Mark & Grade' }).click();
    await expect(page.getByText('Result calculated for this temporary session only.')).toBeVisible();

    await page.reload();
    await expect(page.getByRole('button', { name: 'Continue as guest' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open student profile' })).toHaveCount(0);
  });
});
