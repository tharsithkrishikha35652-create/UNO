import { test, expect } from '@playwright/test';

test.describe('CALCREDIT V6 Live Wallpaper Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Reset theme to light and set launch sequence played
    await page.addInitScript(() => {
      window.localStorage.setItem('calcredit_theme', 'light');
      window.sessionStorage.setItem('calcredit_launch_played', 'true');
    });
  });

  test('SVG artwork genuinely replaces PNG backgrounds with responsive cover scaling', async ({ page }) => {
    await page.goto('/');

    const ambientBg = page.locator('#calcredit-ambient-bg');
    await expect(ambientBg).toBeAttached();

    // Confirm no PNG background-image is applied to #calcredit-ambient-bg
    const bgImage = await ambientBg.evaluate((el) => {
      return window.getComputedStyle(el).backgroundImage;
    });
    expect(bgImage === 'none' || bgImage === '' || !bgImage.includes('.png')).toBe(true);

    // Verify both Light and Dark SVG elements exist
    const lightSvg = ambientBg.locator('svg.light-svg');
    const darkSvg = ambientBg.locator('svg.dark-svg');
    await expect(lightSvg).toBeAttached();
    await expect(darkSvg).toBeAttached();

    // Verify responsive slice scaling attribute
    await expect(lightSvg).toHaveAttribute('preserveAspectRatio', 'xMidYMid slice');
    await expect(darkSvg).toHaveAttribute('preserveAspectRatio', 'xMidYMid slice');

    // In default light theme: light SVG has opacity 1, dark SVG has opacity 0
    await expect(async () => {
      const lightOpacity = await lightSvg.evaluate((el) => window.getComputedStyle(el).opacity);
      const darkOpacity = await darkSvg.evaluate((el) => window.getComputedStyle(el).opacity);
      expect(parseFloat(lightOpacity)).toBeGreaterThan(0.9);
      expect(parseFloat(darkOpacity)).toBeLessThan(0.1);
    }).toPass({ timeout: 2000 });
  });

  test('V6 key animated SVG elements exist with correct origins and styles', async ({ page }) => {
    await page.goto('/');

    const ambientBg = page.locator('#calcredit-ambient-bg');

    // Graduation cap stationary body vs swinging tassel
    const capTassel = ambientBg.locator('.cap-tassel').first();
    await expect(capTassel).toBeAttached();

    const tasselOrigin = await capTassel.evaluate((el) => {
      return window.getComputedStyle(el).transformOrigin;
    });
    // Pivot at top attachment point (488, 155)
    expect(tasselOrigin).toContain('488px 155px');

    // Floating books stack
    const bookStack = ambientBg.locator('.book-stack').first();
    await expect(bookStack).toBeAttached();

    // Bottom decorative organic shapes
    const leftArtPieces = ambientBg.locator('.left-art-piece');
    const rightArtPieces = ambientBg.locator('.right-art-piece');
    expect(await leftArtPieces.count()).toBeGreaterThan(0);
    expect(await rightArtPieces.count()).toBeGreaterThan(0);

    // Stars
    const svgStars = ambientBg.locator('.svg-star');
    expect(await svgStars.count()).toBeGreaterThan(0);

    // Atmospheric layer and sparks
    await expect(ambientBg.locator('.breath-layer')).toBeAttached();
    expect(await ambientBg.locator('.spark').count()).toBe(4);
  });

  test('theme crossfade switches light and dark SVG visibility smoothly', async ({ page }) => {
    await page.goto('/');

    const ambientBg = page.locator('#calcredit-ambient-bg');
    const lightSvg = ambientBg.locator('svg.light-svg');
    const darkSvg = ambientBg.locator('svg.dark-svg');

    // Switch to dark theme
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark';
      document.documentElement.classList.add('dark');
    });

    // Dark SVG should now be visible and light SVG hidden
    await expect(async () => {
      const darkOpacity = await darkSvg.evaluate((el) => window.getComputedStyle(el).opacity);
      const lightOpacity = await lightSvg.evaluate((el) => window.getComputedStyle(el).opacity);
      expect(parseFloat(darkOpacity)).toBeGreaterThan(0.9);
      expect(parseFloat(lightOpacity)).toBeLessThan(0.1);
    }).toPass({ timeout: 2000 });
  });

  test('mobile performance: pause state stops animations when backgrounded', async ({ page }) => {
    // Mobile viewport: Pixel 7 / iPhone style
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const ambientBg = page.locator('#calcredit-ambient-bg');

    // Emulate backgrounded tab by adding paused class
    await page.evaluate(() => {
      document.getElementById('calcredit-ambient-bg')?.classList.add('paused');
    });

    const playState = await ambientBg.locator('.cap-tassel').first().evaluate((el) => {
      return window.getComputedStyle(el).animationPlayState;
    });
    expect(playState).toBe('paused');
  });

  test('visual capture: light and dark V6 wallpaper screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Wait for initial render to settle
    await page.waitForTimeout(600);

    // Capture Light mode screenshot
    await page.screenshot({
      path: 'C:/Users/Raghu Nandan/.gemini/antigravity/brain/2d1062a9-c4b4-4ac2-8d36-9405fd983ee5/v6_wallpaper_light.png',
      fullPage: false,
    });

    // Switch to Dark mode
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark';
      document.documentElement.classList.add('dark');
    });

    // Wait for theme crossfade
    await page.waitForTimeout(1400);

    // Capture Dark mode screenshot
    await page.screenshot({
      path: 'C:/Users/Raghu Nandan/.gemini/antigravity/brain/2d1062a9-c4b4-4ac2-8d36-9405fd983ee5/v6_wallpaper_dark.png',
      fullPage: false,
    });
  });
});
