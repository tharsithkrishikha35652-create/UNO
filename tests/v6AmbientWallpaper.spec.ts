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

  test('theme-aware animation control: pauses inactive SVG and runs active SVG', async ({ page }) => {
    await page.goto('/');

    const ambientBg = page.locator('#calcredit-ambient-bg');
    const lightSvg = ambientBg.locator('svg.light-svg');
    const darkSvg = ambientBg.locator('svg.dark-svg');

    // 1. In Light Mode:
    // Active light SVG animations must be RUNNING
    const lightTasselState = await lightSvg.locator('.cap-tassel').evaluate((el) => {
      return window.getComputedStyle(el).animationPlayState;
    });
    expect(lightTasselState).toBe('running');

    // Inactive dark SVG animations must be PAUSED to eliminate GPU waste
    const darkTasselState = await darkSvg.locator('.cap-tassel').evaluate((el) => {
      return window.getComputedStyle(el).animationPlayState;
    });
    expect(darkTasselState).toBe('paused');

    // 2. Switch to Dark Mode:
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

    // In Dark Mode:
    // Active dark SVG animations must be RUNNING
    const darkTasselAfterSwitch = await darkSvg.locator('.cap-tassel').evaluate((el) => {
      return window.getComputedStyle(el).animationPlayState;
    });
    expect(darkTasselAfterSwitch).toBe('running');

    // Inactive light SVG animations must be PAUSED
    const lightTasselAfterSwitch = await lightSvg.locator('.cap-tassel').evaluate((el) => {
      return window.getComputedStyle(el).animationPlayState;
    });
    expect(lightTasselAfterSwitch).toBe('paused');

    // 3. Switch back to Light Mode:
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    await expect(async () => {
      const lightTasselBack = await lightSvg.locator('.cap-tassel').evaluate((el) => {
        return window.getComputedStyle(el).animationPlayState;
      });
      const darkTasselBack = await darkSvg.locator('.cap-tassel').evaluate((el) => {
        return window.getComputedStyle(el).animationPlayState;
      });
      expect(lightTasselBack).toBe('running');
      expect(darkTasselBack).toBe('paused');
    }).toPass({ timeout: 1000 });
  });

  test('mobile performance: pause state stops animations when backgrounded', async ({ page }) => {
    // Mobile viewport: Pixel 7 / iPhone style
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const ambientBg = page.locator('#calcredit-ambient-bg');

    // Emulate backgrounded app / hidden tab by adding paused class
    await page.evaluate(() => {
      document.getElementById('calcredit-ambient-bg')?.classList.add('paused');
    });

    const lightTasselState = await ambientBg.locator('svg.light-svg .cap-tassel').evaluate((el) => {
      return window.getComputedStyle(el).animationPlayState;
    });
    expect(lightTasselState).toBe('paused');

    const darkTasselState = await ambientBg.locator('svg.dark-svg .cap-tassel').evaluate((el) => {
      return window.getComputedStyle(el).animationPlayState;
    });
    expect(darkTasselState).toBe('paused');

    // Resume when returning to foreground
    await page.evaluate(() => {
      document.getElementById('calcredit-ambient-bg')?.classList.remove('paused');
    });

    const resumedLightState = await ambientBg.locator('svg.light-svg .cap-tassel').evaluate((el) => {
      return window.getComputedStyle(el).animationPlayState;
    });
    expect(resumedLightState).toBe('running');
  });

  test('reduced-motion preference strictly disables animations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const ambientBg = page.locator('#calcredit-ambient-bg');
    const playState = await ambientBg.locator('.cap-tassel').first().evaluate((el) => {
      return window.getComputedStyle(el).animationPlayState;
    });
    expect(playState).toBe('paused');
  });

  test('launch animation suppresses wallpaper rendering overhead', async ({ page }) => {
    await page.goto('/');

    // Simulate launch-pending state
    await page.evaluate(() => {
      document.documentElement.classList.add('launch-pending');
    });

    const ambientBg = page.locator('#calcredit-ambient-bg');
    const playState = await ambientBg.locator('.cap-tassel').first().evaluate((el) => {
      return window.getComputedStyle(el).animationPlayState;
    });
    expect(playState).toBe('paused');

    await expect(async () => {
      const bgVisibility = await ambientBg.evaluate((el) => window.getComputedStyle(el).visibility);
      const bgOpacity = await ambientBg.evaluate((el) => window.getComputedStyle(el).opacity);
      expect(bgVisibility).toBe('hidden');
      expect(parseFloat(bgOpacity)).toBe(0);
    }).toPass({ timeout: 1000 });
  });

  test('visual capture: light and dark V6 wallpaper screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Wait for initial render to settle
    await page.waitForTimeout(600);

    // Capture Light mode mobile screenshot
    await page.screenshot({
      path: 'C:/Users/Raghu Nandan/.gemini/antigravity/brain/2d1062a9-c4b4-4ac2-8d36-9405fd983ee5/v6_wallpaper_light.png',
      fullPage: false,
    });

    // Capture Light mode desktop full screen screenshot (1920x1080)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: 'C:/Users/Raghu Nandan/.gemini/antigravity/brain/2d1062a9-c4b4-4ac2-8d36-9405fd983ee5/v6_wallpaper_desktop_light.png',
      fullPage: false,
    });

    // Switch to Dark mode
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark';
      document.documentElement.classList.add('dark');
    });

    // Wait for theme crossfade
    await page.waitForTimeout(600);

    // Capture Dark mode desktop screenshot
    await page.screenshot({
      path: 'C:/Users/Raghu Nandan/.gemini/antigravity/brain/2d1062a9-c4b4-4ac2-8d36-9405fd983ee5/v6_wallpaper_desktop_dark.png',
      fullPage: false,
    });

    // Capture Dark mode mobile screenshot
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: 'C:/Users/Raghu Nandan/.gemini/antigravity/brain/2d1062a9-c4b4-4ac2-8d36-9405fd983ee5/v6_wallpaper_dark.png',
      fullPage: false,
    });
  });
});
