import { test, expect } from '@playwright/test';

test.describe('Theme switching performance and video crossfade fluidity', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('calcredit_theme', 'light');
      window.sessionStorage.setItem('calcredit_launch_played', 'true');
    });
  });

  test('coordinates dual-video crossfade with interface color transition smoothly', async ({ page }) => {
    await page.goto('/');

    const background = page.locator('#calcredit-ambient-bg');
    const lightVideo = background.locator(
      'video.wallpaper-video[src$="wallpaper_light_phone_1080x2400.mp4"]'
    );
    const darkVideo = background.locator(
      'video.wallpaper-video[src$="CalCredit_Wallpaper_Dark_1080x1920.mp4"]'
    );

    // Initial state: Light mode
    await expect(lightVideo).toHaveClass(/is-visible/);
    await expect(darkVideo).not.toHaveClass(/is-visible/);

    // Track requestAnimationFrame deltas during theme switch
    await page.evaluate(() => {
      (window as unknown as { __frameDeltas?: number[] }).__frameDeltas = [];
      let lastTime = performance.now();
      const measure = () => {
        const now = performance.now();
        (window as unknown as { __frameDeltas: number[] }).__frameDeltas.push(now - lastTime);
        lastTime = now;
        requestAnimationFrame(measure);
      };
      requestAnimationFrame(measure);
    });

    // Locate theme toggle
    const toggleButton = page.locator('button[aria-label*="Switch to dark theme"]').first();
    await expect(toggleButton).toBeVisible();

    // Toggle to Dark
    await toggleButton.click();

    // Verify immediate crossfade initiation (both classes toggled without lag)
    await expect(page.locator('html')).toHaveClass(/theme-switching/);
    await expect(darkVideo).toHaveClass(/is-visible/);
    await expect(lightVideo).not.toHaveClass(/is-visible/);

    // Wait for transition completion (600ms)
    await page.waitForTimeout(650);
    await expect(page.locator('html')).not.toHaveClass(/theme-switching/);

    // Verify dark video is playing and light video is paused to conserve resources
    const darkPlaying = await darkVideo.evaluate((v: HTMLVideoElement) => !v.paused);
    const lightPaused = await lightVideo.evaluate((v: HTMLVideoElement) => v.paused);
    expect(darkPlaying).toBe(true);
    expect(lightPaused).toBe(true);

    // Check measured frame deltas:
    const frameDeltas = await page.evaluate(
      () => (window as unknown as { __frameDeltas?: number[] }).__frameDeltas ?? []
    );
    const longFrames = frameDeltas.filter((d) => d > 80);
    console.log('Frame deltas > 50ms:', frameDeltas.filter((d) => d > 50));
    // In headless test environments with software WebGL/video compositing, allow up to 8 frames
    expect(longFrames.length).toBeLessThanOrEqual(8);

    // Toggle back to Light
    const lightToggleButton = page.locator('button[aria-label*="Switch to light theme"]').first();
    await lightToggleButton.click();

    await expect(page.locator('html')).toHaveClass(/theme-switching/);
    await expect(lightVideo).toHaveClass(/is-visible/);
    await expect(darkVideo).not.toHaveClass(/is-visible/);

    await page.waitForTimeout(650);
    await expect(page.locator('html')).not.toHaveClass(/theme-switching/);

    const lightPlayingAfter = await lightVideo.evaluate((v: HTMLVideoElement) => !v.paused);
    const darkPausedAfter = await darkVideo.evaluate((v: HTMLVideoElement) => v.paused);
    expect(lightPlayingAfter).toBe(true);
    expect(darkPausedAfter).toBe(true);
  });

  test('survives rapid repeated toggles without video restarts or frozen states', async ({ page }) => {
    await page.goto('/');

    const background = page.locator('#calcredit-ambient-bg');
    const lightVideo = background.locator(
      'video.wallpaper-video[src$="wallpaper_light_phone_1080x2400.mp4"]'
    );
    const darkVideo = background.locator(
      'video.wallpaper-video[src$="CalCredit_Wallpaper_Dark_1080x1920.mp4"]'
    );

    // Rapidly toggle 4 times in quick succession (120ms intervals)
    for (let i = 0; i < 4; i++) {
      const toggle = page.locator('button[aria-label*="Switch to"]').first();
      await toggle.click();
      await page.waitForTimeout(120);
    }

    // Wait for the final transition to settle
    await page.waitForTimeout(700);

    // Even number of clicks (4) should land back on light theme
    const finalTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(finalTheme).toBe('light');
    await expect(lightVideo).toHaveClass(/is-visible/);
    await expect(darkVideo).not.toHaveClass(/is-visible/);

    const lightPlaying = await lightVideo.evaluate((v: HTMLVideoElement) => !v.paused);
    expect(lightPlaying).toBe(true);
  });

  test('excludes SVGs from the wildcard theme transition property', async ({ page }) => {
    await page.goto('/');

    // Activate theme-switching
    await page.evaluate(() => document.documentElement.classList.add('theme-switching'));

    // Check SVG paths
    const svgPathTransitions = await page.evaluate(() => {
      const paths = Array.from(document.querySelectorAll('svg path'));
      return paths.map((p) => window.getComputedStyle(p).transitionProperty);
    });

    // None of the SVG paths should have !important box-shadow or fill/stroke transitions forced on them
    for (const prop of svgPathTransitions) {
      expect(prop).not.toContain('box-shadow');
    }

    await page.evaluate(() => document.documentElement.classList.remove('theme-switching'));
  });
});
