import { test, expect } from '@playwright/test';

test.describe('CalCredit Brand & Launch Animation Suite', () => {
  test('launch animation appears, finishes, and the app is usable', async ({ page }) => {
    // Clear session storage so launch sequence plays
    await page.addInitScript(() => {
      window.sessionStorage.clear();
    });

    await page.goto('/');

    // Launch animation overlay should appear on cold start
    const launchOverlay = page.locator('[role="status"][aria-label="CalCredit is loading"]');
    await expect(launchOverlay).toBeAttached();

    // Verify key SVG animation elements exist inside
    await expect(launchOverlay.locator('.cc-c-arc')).toBeAttached();
    await expect(launchOverlay.locator('.cc-wordmark')).toBeAttached();
    await expect(launchOverlay.locator('.cc-subtitle')).toBeAttached();

    // Wait for the animation to finish and unmount/fade out (total runtime ~1.98s, max timeout 4000ms)
    await expect(launchOverlay).toHaveCount(0, { timeout: 4500 });

    // Confirm session storage was set so it won't play again
    const launchPlayed = await page.evaluate(() =>
      window.sessionStorage.getItem('calcredit_launch_played')
    );
    expect(launchPlayed).toBe('true');

    // Confirm the app is usable
    const appRoot = page.locator('#root');
    await expect(appRoot).toBeVisible();
    await expect(page.locator('button').first()).toBeVisible();
  });

  test('reduced-motion shows no animation and finishes cleanly', async ({ page }) => {
    // Emulate prefers-reduced-motion: reduce
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      window.sessionStorage.clear();
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const launchOverlay = page.locator('[role="status"][aria-label="CalCredit is loading"]');
    // If caught before the reduced-motion 400ms duration finishes, verify no motion was run
    if (await launchOverlay.count() > 0) {
      const arcDashoffset = await launchOverlay.locator('.cc-c-arc').evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.getPropertyValue('stroke-dashoffset') || (el as SVGElement).style.strokeDashoffset || '';
      });
      expect(arcDashoffset === '0px' || arcDashoffset === '0' || arcDashoffset === '').toBe(true);
    }

    // In reduced motion, overlay completes and unmounts cleanly
    await expect(launchOverlay).toHaveCount(0, { timeout: 3000 });

    // App is ready and interactive
    await expect(page.locator('#root')).toBeVisible();
  });

  test('credits screen renders wordmark branding cleanly', async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem('calcredit_launch_played', 'true');
    });

    await page.goto('/?screen=credits');
    // Ensure the wordmark is rendered in the eyebrow of the credits page
    const creditsWordmark = page.locator('.credits-rise [role="img"][aria-label="CalCredit"]');
    await expect(creditsWordmark).toBeVisible();
  });

  test('no element overflows at 360px width', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.addInitScript(() => {
      window.sessionStorage.setItem('calcredit_launch_played', 'true');
    });

    // Test on login / auth screen
    await page.goto('/');
    await page.waitForTimeout(500);

    const authOverflow = await page.evaluate(() => {
      const docWidth = document.documentElement.clientWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      return { docWidth, scrollWidth, overflows: scrollWidth > docWidth };
    });
    expect(authOverflow.overflows).toBe(false);

    // Test on credits screen
    await page.goto('/?screen=credits');
    await page.waitForTimeout(500);

    const creditsOverflow = await page.evaluate(() => {
      const docWidth = document.documentElement.clientWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      return { docWidth, scrollWidth, overflows: scrollWidth > docWidth };
    });
    expect(creditsOverflow.overflows).toBe(false);
  });
});
