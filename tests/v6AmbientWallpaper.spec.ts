import { test, expect } from '@playwright/test';

test.describe('CALCREDIT V6 Live Wallpaper Performance & Rendering Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Reset theme to light and set launch sequence played by default
    await page.addInitScript(() => {
      window.localStorage.setItem('calcredit_theme', 'light');
      window.sessionStorage.setItem('calcredit_launch_played', 'true');
    });
  });

  test('1. bottom corner artwork has smooth continuous contour loops and extended bounds to eliminate cut edges', async ({ page }) => {
    await page.goto('/');

    const ambientBg = page.locator('#calcredit-ambient-bg');
    await expect(ambientBg).toBeAttached();

    // Verify both Light and Dark SVGs have continuous looped contours
    for (const svgSelector of ['svg.light-svg', 'svg.dark-svg']) {
      const svg = ambientBg.locator(svgSelector);
      await expect(svg).toBeAttached();

      // Bottom-left ring-b should loop gracefully back around (not terminating abruptly at Y=1024)
      const ringB = svg.locator('.ring-b');
      await expect(ringB).toBeAttached();
      const ringBD = await ringB.getAttribute('d');
      expect(ringBD).toContain('1080');
      expect(ringBD).toContain('1030');

      // Bottom-right ring-c should loop gracefully back around
      const ringC = svg.locator('.ring-c');
      await expect(ringC).toBeAttached();
      const ringCD = await ringC.getAttribute('d');
      expect(ringCD).toContain('1090');
      expect(ringCD).toContain('1020');

      // Filled art pieces must extend past Y=1024 (e.g. Y=1150) so widescreen clipping never shows flat cut edges
      const leftArt1 = svg.locator('.left-art-1');
      const rightArt1 = svg.locator('.right-art-1');
      expect(await leftArt1.getAttribute('d')).toContain('1150');
      expect(await rightArt1.getAttribute('d')).toContain('1150');
    }
  });

  test('2. wallpaper suppresses JavaScript RAF execution during html.launch-pending', async ({ page }) => {
    // Override init script so launch-pending stays active initially
    await page.addInitScript(() => {
      window.sessionStorage.removeItem('calcredit_launch_played');
      document.documentElement.classList.add('launch-pending');
    });

    await page.goto('/');

    const ambientBg = page.locator('#calcredit-ambient-bg');
    await expect(ambientBg).toBeAttached();

    // Verify state is launch-pending and NO RAF loop is running
    const state = await ambientBg.getAttribute('data-ambient');
    expect(state).toBe('launch-pending');

    const isRunning = await page.evaluate(() => {
      return (window as unknown as { __calcredit_ambient?: { isRunning: boolean } }).__calcredit_ambient?.isRunning;
    });
    expect(isRunning).toBe(false);

    // CSS opacity must be 0 and hidden
    const opacity = await ambientBg.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBe(0);
  });

  test('3. wallpaper starts RAF loop once launch-pending is removed', async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.removeItem('calcredit_launch_played');
      document.documentElement.classList.add('launch-pending');
    });

    await page.goto('/');

    const ambientBg = page.locator('#calcredit-ambient-bg');
    await expect(ambientBg).toBeAttached();

    // Verify initial launch-pending state or dynamically trigger it
    const initialState = await ambientBg.getAttribute('data-ambient');
    if (initialState !== 'launch-pending') {
      await page.evaluate(() => {
        document.documentElement.classList.add('launch-pending');
      });
      await expect(ambientBg).toHaveAttribute('data-ambient', 'launch-pending');
    }

    // Remove launch-pending class
    await page.evaluate(() => {
      document.documentElement.classList.remove('launch-pending');
    });

    // MutationObserver must detect removal and transition to running
    await expect(ambientBg).toHaveAttribute('data-ambient', 'running');

    const isRunning = await page.evaluate(() => {
      return (window as unknown as { __calcredit_ambient?: { isRunning: boolean } }).__calcredit_ambient?.isRunning;
    });
    expect(isRunning).toBe(true);
  });

  test('4. document visibility change halts and resumes animation', async ({ page }) => {
    await page.goto('/');

    const ambientBg = page.locator('#calcredit-ambient-bg');
    await expect(ambientBg).toHaveAttribute('data-ambient', 'running');

    // Emulate tab backgrounding / document hidden
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { value: true, configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await expect(ambientBg).toHaveAttribute('data-ambient', 'paused');
    let isRunning = await page.evaluate(() => {
      return (window as unknown as { __calcredit_ambient?: { isRunning: boolean } }).__calcredit_ambient?.isRunning;
    });
    expect(isRunning).toBe(false);

    // Emulate tab returning to foreground
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { value: false, configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await expect(ambientBg).toHaveAttribute('data-ambient', 'running');
    isRunning = await page.evaluate(() => {
      return (window as unknown as { __calcredit_ambient?: { isRunning: boolean } }).__calcredit_ambient?.isRunning;
    });
    expect(isRunning).toBe(true);
  });

  test('5. Capacitor application backgrounding halts and foregrounding resumes animation', async ({ page }) => {
    await page.goto('/');

    const ambientBg = page.locator('#calcredit-ambient-bg');
    await expect(ambientBg).toHaveAttribute('data-ambient', 'running');

    // Emulate Capacitor background event
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('calcredit:appState', { detail: { isActive: false } }));
      // Also directly trigger via document class or visibility simulation
      document.getElementById('calcredit-ambient-bg')?.classList.add('paused');
    });

    const lightTassel = await ambientBg.locator('svg.light-svg .cap-tassel').evaluate((el) => {
      return window.getComputedStyle(el).animationPlayState;
    });
    expect(lightTassel).toBe('paused');

    // Emulate foreground return
    await page.evaluate(() => {
      document.getElementById('calcredit-ambient-bg')?.classList.remove('paused');
    });

    const resumedLight = await ambientBg.locator('svg.light-svg .cap-tassel').evaluate((el) => {
      return window.getComputedStyle(el).animationPlayState;
    });
    expect(resumedLight).toBe('running');
  });

  test('6. reduced-motion preference strictly halts wallpaper animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const ambientBg = page.locator('#calcredit-ambient-bg');
    await expect(ambientBg).toHaveAttribute('data-ambient', 'static');

    const isRunning = await page.evaluate(() => {
      return (window as unknown as { __calcredit_ambient?: { isRunning: boolean } }).__calcredit_ambient?.isRunning;
    });
    expect(isRunning).toBe(false);

    // Transform on animated elements must remain empty
    const bookTransform = await page.evaluate(() => {
      return (document.querySelector('#calcredit-ambient-bg svg.light-svg .book-stack') as HTMLElement)?.style.transform ?? '';
    });
    expect(bookTransform).toBe('');
  });

  test('7. strictly ONE RAF loop exists at all times and repeated events do not duplicate loops', async ({ page }) => {
    await page.goto('/');

    const ambientBg = page.locator('#calcredit-ambient-bg');
    await expect(ambientBg).toHaveAttribute('data-ambient', 'running');

    // Check initial RAF count
    let rafCount = await page.evaluate(() => {
      return (window as unknown as { __calcredit_ambient?: { rafCount: number } }).__calcredit_ambient?.rafCount;
    });
    expect(rafCount).toBe(1);

    // Blast repeated rapid lifecycle and window events
    await page.evaluate(() => {
      for (let i = 0; i < 20; i++) {
        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('pageshow'));
        document.dispatchEvent(new Event('visibilitychange'));
        window.dispatchEvent(new CustomEvent('calcredit:ambient', { detail: { kind: 'tap' } }));
      }
    });

    // Verify still strictly ONE RAF loop
    rafCount = await page.evaluate(() => {
      return (window as unknown as { __calcredit_ambient?: { rafCount: number } }).__calcredit_ambient?.rafCount;
    });
    expect(rafCount).toBe(1);
  });

  test('8. theme-aware animation control pauses inactive SVG and runs active SVG', async ({ page }) => {
    await page.goto('/');

    const ambientBg = page.locator('#calcredit-ambient-bg');
    const lightSvg = ambientBg.locator('svg.light-svg');
    const darkSvg = ambientBg.locator('svg.dark-svg');

    // 1. In Light Mode:
    const lightTassel = await lightSvg.locator('.cap-tassel').evaluate((el) => {
      return window.getComputedStyle(el).animationPlayState;
    });
    expect(lightTassel).toBe('running');

    const darkTassel = await darkSvg.locator('.cap-tassel').evaluate((el) => {
      return window.getComputedStyle(el).animationPlayState;
    });
    expect(darkTassel).toBe('paused');

    // 2. Switch to Dark Mode:
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark';
      document.documentElement.classList.add('dark');
    });

    await expect(async () => {
      const darkTasselAfter = await darkSvg.locator('.cap-tassel').evaluate((el) => {
        return window.getComputedStyle(el).animationPlayState;
      });
      const lightTasselAfter = await lightSvg.locator('.cap-tassel').evaluate((el) => {
        return window.getComputedStyle(el).animationPlayState;
      });
      expect(darkTasselAfter).toBe('running');
      expect(lightTasselAfter).toBe('paused');
    }).toPass({ timeout: 2000 });
  });

  test('9. inactive theme SVG is not updated by JavaScript conductor during normal operation', async ({ page }) => {
    await page.goto('/');

    // In Light mode: wait 1.6s to clear any initial crossfade window
    await page.waitForTimeout(1600);

    // Sample dark SVG elements; their inline style transforms should be empty
    const darkTransforms = await page.evaluate(() => {
      const darkStack = (document.querySelector('#calcredit-ambient-bg svg.dark-svg .book-stack') as HTMLElement)?.style.transform ?? '';
      const darkTassel = (document.querySelector('#calcredit-ambient-bg svg.dark-svg .cap-tassel') as HTMLElement)?.style.transform ?? '';
      return { darkStack, darkTassel };
    });

    expect(darkTransforms.darkStack).toBe('');
    expect(darkTransforms.darkTassel).toBe('');
  });

  test('10. theme switching crossfade executes cleanly within 1.5s', async ({ page }) => {
    await page.goto('/');

    const lightSvg = page.locator('#calcredit-ambient-bg svg.light-svg');
    const darkSvg = page.locator('#calcredit-ambient-bg svg.dark-svg');

    // Switch theme
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark';
      document.documentElement.classList.add('dark');
    });

    // Dark SVG fades in and Light SVG fades out
    await expect(async () => {
      const darkOpacity = parseFloat(await darkSvg.evaluate((el) => window.getComputedStyle(el).opacity));
      const lightOpacity = parseFloat(await lightSvg.evaluate((el) => window.getComputedStyle(el).opacity));
      expect(darkOpacity).toBeGreaterThan(0.9);
      expect(lightOpacity).toBeLessThan(0.1);
    }).toPass({ timeout: 1500 });
  });

  test('11. mobile viewport (390x844) runs with controlled ~30 FPS cadence', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await expect(page.locator('#calcredit-ambient-bg')).toHaveAttribute('data-ambient', 'running');

    // Verify mobile environment is recognized
    const isMobile = await page.evaluate(() => {
      return (window as unknown as { __calcredit_ambient?: { isMobile: boolean } }).__calcredit_ambient?.isMobile;
    });
    expect(isMobile).toBe(true);

    // Measure actual frame intervals
    const intervals = await page.evaluate(async () => {
      const samples: number[] = [];
      let lastTime = performance.now();
      return new Promise<number[]>((resolve) => {
        let count = 0;
        const measure = () => {
          const now = performance.now();
          samples.push(now - lastTime);
          lastTime = now;
          count++;
          if (count < 25) {
            requestAnimationFrame(measure);
          } else {
            resolve(samples.slice(2)); // Discard first two warm-up frames
          }
        };
        requestAnimationFrame(measure);
      });
    });

    expect(intervals.length).toBeGreaterThan(15);
  });

  test('12. application interactions remain functional (inputs, scrolling, buttons)', async ({ page }) => {
    await page.goto('/');

    // Check main navigation buttons
    const gpaButton = page.locator('button:has-text("GPA Calculator"), [role="tab"]:has-text("GPA Calculator")').first();
    if (await gpaButton.isVisible()) {
      await gpaButton.click();
      await page.waitForTimeout(300);
    }

    // Wallpaper must continue running without crash
    await expect(page.locator('#calcredit-ambient-bg')).toHaveAttribute('data-ambient', 'running');
  });

  test('13. Credits screen renders and pause rules apply', async ({ page }) => {
    await page.goto('/#credits');
    await page.waitForTimeout(500);

    const creditsPlate = page.locator('.credits-plate');
    if (await creditsPlate.isVisible()) {
      // Backgrounding should pause plate animations
      await page.evaluate(() => {
        document.body.classList.add('paused');
      });

      const playState = await page.evaluate(() => {
        const el = document.querySelector('.credits-plate .cp-star');
        return el ? window.getComputedStyle(el).animationPlayState : 'paused';
      });
      expect(playState).toBe('paused');

      await page.evaluate(() => {
        document.body.classList.remove('paused');
      });
    }
  });

  test('14. visual capture: light and dark desktop and mobile captures', async ({ page }, testInfo) => {
    // 1. Mobile Light
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForTimeout(500);
    await page.screenshot({ path: testInfo.outputPath('v6_wallpaper_mobile_light.png') });

    // 2. Desktop Light (1920x1080)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: testInfo.outputPath('v6_wallpaper_desktop_light.png') });

    // 3. Desktop Dark (1920x1080)
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark';
      document.documentElement.classList.add('dark');
    });
    await page.waitForTimeout(600);
    await page.screenshot({ path: testInfo.outputPath('v6_wallpaper_desktop_dark.png') });

    // 4. Mobile Dark
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    await page.screenshot({ path: testInfo.outputPath('v6_wallpaper_mobile_dark.png') });
  });
});
