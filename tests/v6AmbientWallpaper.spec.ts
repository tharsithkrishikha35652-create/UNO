import { test, expect } from '@playwright/test';

test.describe('video wallpaper', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('calcredit_theme', 'light');
      window.sessionStorage.setItem('calcredit_launch_played', 'true');
    });
  });

  test('keeps the inline video ready and removes the old SVG artwork', async ({ page }) => {
    await page.goto('/');

    const background = page.locator('#calcredit-ambient-bg');
    const videos = background.locator('video.wallpaper-video');
    const activeVideo = background.locator('video.wallpaper-video.is-visible');
    await expect(background).toBeAttached();
    await expect(videos).toHaveCount(2);
    await expect(activeVideo).toHaveCount(1, { timeout: 5000 });
    await expect(videos.first()).not.toHaveAttribute('controls');
    expect(await videos.evaluateAll((items) => items.every((item) => {
      const video = item as HTMLVideoElement;
      return !video.controls && video.muted && video.loop && video.playsInline;
    }))).toBe(true);
    await expect(background.locator('svg')).toHaveCount(0);
    await expect(background.locator('.spark, .breath-layer')).toHaveCount(0);

    await expect(videos.first()).toHaveAttribute(
      'data-light-src',
      '/wallpaperdark.mp4/wallpaper_light_phone_1080x2400.mp4'
    );
    await expect(videos.first()).toHaveAttribute(
      'data-dark-src',
      '/wallpaperdark.mp4/CalCredit_Wallpaper_Dark_1080x1920.mp4'
    );
    await expect(activeVideo).toHaveAttribute('poster', '/warm-scholar-bg.png');
    await expect(videos.locator('source')).toHaveCount(0);
    await expect(activeVideo).toHaveAttribute(
      'src',
      '/wallpaperdark.mp4/wallpaper_light_phone_1080x2400.mp4'
    );
  });

  test('loads the matching wallpaper when the theme changes', async ({ page }) => {
    await page.goto('/');

    const background = page.locator('#calcredit-ambient-bg');
    const videos = background.locator('video.wallpaper-video');
    const lightVideo = background.locator(
      'video.wallpaper-video[src$="wallpaper_light_phone_1080x2400.mp4"]'
    );
    const darkVideo = background.locator(
      'video.wallpaper-video[src$="CalCredit_Wallpaper_Dark_1080x1920.mp4"]'
    );
    await expect(videos.first()).toHaveAttribute(
      'data-light-src',
      '/wallpaperdark.mp4/wallpaper_light_phone_1080x2400.mp4'
    );
    await expect(lightVideo).toHaveClass(/is-visible/);
    await expect(lightVideo).toHaveAttribute('poster', '/warm-scholar-bg.png');

    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark';
      document.documentElement.classList.add('dark');
    });
    await expect(darkVideo).toHaveClass(/is-visible/);
    await expect(darkVideo).toHaveAttribute('poster', '/dark-scholar-bg.png');
    await expect(videos).toHaveCount(2);

    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });
    await expect(lightVideo).toHaveClass(/is-visible/);
    await expect(lightVideo).toHaveAttribute('poster', '/warm-scholar-bg.png');
  });

  test('covers portrait, landscape, and desktop viewport dimensions', async ({ page }) => {
    await page.goto('/');

    for (const viewport of [
      { width: 360, height: 800 },
      { width: 412, height: 915 },
      { width: 915, height: 412 },
      { width: 1920, height: 1080 },
    ]) {
      await page.setViewportSize(viewport);
      const video = page.locator('#calcredit-ambient-bg video').first();
      const geometry = await video.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          objectFit: getComputedStyle(element).objectFit,
        };
      });

      expect(geometry.width).toBeCloseTo(viewport.width, 0);
      expect(geometry.height).toBeCloseTo(viewport.height, 0);
      expect(geometry.objectFit).toBe('cover');
    }
  });

  test('pauses while the launch overlay hides the wallpaper', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.documentElement.classList.add('launch-pending'));

    const background = page.locator('#calcredit-ambient-bg');
    await expect(background).toHaveCSS('visibility', 'hidden');
    await expect(background.locator('video.wallpaper-video')).toHaveCount(2);
  });

  test('honors reduced-motion preference', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const allPaused = await page.locator('#calcredit-ambient-bg video').evaluateAll(
      (elements) => elements.every((element) => (element as HTMLVideoElement).paused)
    );
    expect(allPaused).toBe(true);
  });
});
