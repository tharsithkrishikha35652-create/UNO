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

  test('profile drawer renders single-element horizontal logo with Anna University', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 922 });
    await page.addInitScript(() => {
      window.sessionStorage.setItem('calcredit_launch_played', 'true');
    });

    await page.goto('/?screen=profile');
    await page.waitForTimeout(600);

    const profileDrawer = page.locator('#academic-profile-title');
    await expect(profileDrawer).toBeVisible();

    // Ensure the logo image src contains calcredit_logo_horizontal
    const logoImg = profileDrawer.locator('img.brand-sheet-logo__image');
    await expect(logoImg.first()).toBeAttached();
    const srcs = await logoImg.evaluateAll((imgs) => imgs.map((i) => (i as HTMLImageElement).src));
    expect(srcs.some((s) => s.includes('horizontal'))).toBe(true);

    // Verify no separate disconnected span exists
    const separateSpan = profileDrawer.locator('span.text-slate-500');
    await expect(separateSpan).toHaveCount(0);

    // Take screenshot for visual verification
    await page.screenshot({ path: 'C:/Users/Raghu Nandan/.gemini/antigravity/brain/2d1062a9-c4b4-4ac2-8d36-9405fd983ee5/verify_profile_drawer_logo.png' });

    // Test in Dark Mode as well
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'C:/Users/Raghu Nandan/.gemini/antigravity/brain/2d1062a9-c4b4-4ac2-8d36-9405fd983ee5/verify_profile_drawer_logo_dark.png' });
  });

  test('courses sheet renders frosted glass blurred backdrop over underlying app', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 922 });
    await page.addInitScript(() => {
      window.sessionStorage.setItem('calcredit_launch_played', 'true');
    });

    await page.goto('/?screen=courses');
    await page.waitForTimeout(600);

    const coursesSheet = page.locator('#mobile-courses-sheet');
    await expect(coursesSheet).toBeVisible();

    // Verify backdrop button is transparent
    const backdropBtn = page.locator('button[aria-label="Close courses"]').first();
    await expect(backdropBtn).toBeVisible();
    const bg = await backdropBtn.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bg).toMatch(/rgba\(0,\s*0,\s*0,\s*0\)|transparent/);

    // Verify underlying content is mounted behind the backdrop
    const underlyingHeading = page.locator('h1:has-text("Matrices and Calculus")');
    await expect(underlyingHeading).toBeAttached();

    // Take screenshot to inspect the frosted blur
    await page.screenshot({ path: 'C:/Users/Raghu Nandan/.gemini/antigravity/brain/2d1062a9-c4b4-4ac2-8d36-9405fd983ee5/verify_courses_sheet_blur.png' });

    // Test in Dark Mode as well
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'C:/Users/Raghu Nandan/.gemini/antigravity/brain/2d1062a9-c4b4-4ac2-8d36-9405fd983ee5/verify_courses_sheet_blur_dark.png' });
  });

  test('GPA Hub displays Enter Grades of Choice button at the top of the page', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 922 });
    await page.addInitScript(() => {
      window.sessionStorage.setItem('calcredit_launch_played', 'true');
    });

    await page.goto('/?screen=gpa');
    await page.waitForTimeout(600);

    // Verify Enter Grades of Choice button is visible
    const gradesBtn = page.locator('#tour-grades-of-choice-button');
    await expect(gradesBtn).toBeVisible();
    await expect(gradesBtn).toContainText('Enter Grades of Choice');

    // Verify it is positioned near the top of the GPA Calculator (above the course table)
    const buttonBox = await gradesBtn.boundingBox();
    const headingBox = await page.locator('h2:has-text("GPA Calculator")').boundingBox();
    expect(buttonBox).not.toBeNull();
    expect(headingBox).not.toBeNull();
    if (buttonBox && headingBox) {
      // Button Y position is within the top banner area (within 120px of heading)
      expect(Math.abs(buttonBox.y - headingBox.y)).toBeLessThan(120);
    }

    // Capture screenshot in light theme
    await page.screenshot({ path: 'C:/Users/Raghu Nandan/.gemini/antigravity/brain/2d1062a9-c4b4-4ac2-8d36-9405fd983ee5/verify_gpa_hub_top_button.png' });

    // Capture screenshot in dark theme
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'C:/Users/Raghu Nandan/.gemini/antigravity/brain/2d1062a9-c4b4-4ac2-8d36-9405fd983ee5/verify_gpa_hub_top_button_dark.png' });

    // Capture desktop layout
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'C:/Users/Raghu Nandan/.gemini/antigravity/brain/2d1062a9-c4b4-4ac2-8d36-9405fd983ee5/verify_gpa_hub_top_button_desktop.png' });
  });

  test('CA section dropdowns eliminate blue color tab, start collapsed, and transition smoothly on uncheck', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 922 });
    await page.addInitScript(() => {
      window.sessionStorage.setItem('calcredit_launch_played', 'true');
    });

    await page.goto('/?screen=ca-dropdown');
    await page.waitForTimeout(600);

    // 1. Verify starts minimized (dropdown closed) with neutral background (not blue)
    const activitiesBtn = page.locator('button:has-text("Assignments / Activities")');
    await expect(activitiesBtn).toBeVisible();
    await expect(activitiesBtn).toContainText('80% estimate');

    // Verify it is NOT blue (not #3b4d66 or rgb(59, 77, 102))
    const btnBg = await activitiesBtn.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(btnBg).not.toContain('rgb(59, 77, 102)');

    // Capture collapsed screenshot
    await page.screenshot({ path: 'C:/Users/Raghu Nandan/.gemini/antigravity/brain/2d1062a9-c4b4-4ac2-8d36-9405fd983ee5/verify_ca_collapsed_start.png' });

    // 2. Click to expand dropdown
    await activitiesBtn.click();
    await page.waitForTimeout(400);

    // Verify notice message and uncheck button are visible
    const uncheckNotice = page.locator('text=Want to edit marks? Uncheck the "Include estimated lab & activity average" box above.');
    await expect(uncheckNotice).toBeVisible();
    const uncheckBtn = page.locator('button:has-text("Uncheck Box")').first();
    await expect(uncheckBtn).toBeVisible();

    // Verify button remains neutral and not blue even when expanded
    const expandedBtnBg = await activitiesBtn.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(expandedBtnBg).not.toContain('rgb(59, 77, 102)');

    // Capture expanded screenshot
    await page.screenshot({ path: 'C:/Users/Raghu Nandan/.gemini/antigravity/brain/2d1062a9-c4b4-4ac2-8d36-9405fd983ee5/verify_ca_expanded_notice.png' });

    // 3. Click Uncheck Box
    await uncheckBtn.click();
    await page.waitForTimeout(600);

    // Verify returns to standard layout (Image 1 style)
    // The dropdown button vanishes
    await expect(page.locator('button:has-text("80% estimate")')).toHaveCount(0);
    // Dynamic score boxes are open with standard headings
    await expect(page.locator('h4:has-text("Assignments / Activities")')).toBeVisible();
    await expect(page.locator('h4:has-text("Lab Practical Evaluation")')).toBeVisible();
    await expect(page.locator('span:has-text("Marks Contributed:")').first()).toBeVisible();

    // Capture uncheck end screenshot
    await page.screenshot({ path: 'C:/Users/Raghu Nandan/.gemini/antigravity/brain/2d1062a9-c4b4-4ac2-8d36-9405fd983ee5/verify_ca_uncheck_end.png' });
  });

  test('CGPA Hub displays regulation credits beside semester and has no editable credit inputs', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 922 });
    await page.addInitScript(() => {
      window.sessionStorage.setItem('calcredit_launch_played', 'true');
    });

    await page.goto('/?screen=cgpa');
    await page.waitForTimeout(600);

    // 1. Verify "Credits counted" input field does NOT exist
    const creditInputs = page.locator('input[aria-label*="credits counted in CGPA"]');
    await expect(creditInputs).toHaveCount(0);
    const creditsCountedLabels = page.locator('text=Credits counted');
    await expect(creditsCountedLabels).toHaveCount(0);

    // 2. Verify regulation credits badge beside semester heading
    const sem1Credits = page.locator('text=21 credits').first();
    await expect(sem1Credits).toBeVisible();

    // 3. Verify dropdown has All Semesters option
    const dropdownBtn = page.locator('button[aria-haspopup="listbox"]');
    await expect(dropdownBtn).toBeVisible();
    await dropdownBtn.click();
    await page.waitForTimeout(200);

    const allSemestersOption = page.locator('button:has-text("All Semesters (Semesters 1 – 8)")');
    await expect(allSemestersOption).toBeVisible();
    await allSemestersOption.click();
    await page.waitForTimeout(300);

    // 4. Fill in sample GPAs to verify calculation
    const gpaInputs = page.getByRole('spinbutton', { name: /Semester \d GPA/ });
    await expect(gpaInputs).toHaveCount(8);

    // Fill semesters 1 to 8
    for (let i = 0; i < 8; i++) {
      await gpaInputs.nth(i).fill('9.0');
    }
    // For Sem 3 UHV in CSE, fill UHV grade point
    const uhvInput = page.getByRole('spinbutton', { name: 'Universal Human Values grade point to exclude' });
    if (await uhvInput.count() > 0) {
      await uhvInput.fill('9.0');
    }
    await page.waitForTimeout(400);

    // Verify Cumulative GPA result
    const resultHeader = page.locator('text=Cumulative GPA for All Semesters');
    await expect(resultHeader).toBeVisible();
    const resultSection = page.locator('section[aria-label="CGPA result"]');
    await expect(resultSection).toContainText('9.00');
    await expect(resultSection).toContainText('169 total credits');

    // Click the UHV help button to test popover behavior
    const uhvHelpBtn = page.getByRole('button', { name: /How Semester 3 UHV credits and GPA work/ });
    if (await uhvHelpBtn.count() > 0) {
      await uhvHelpBtn.click();
      await page.waitForTimeout(300);

      // Check overflow metrics
      const overflowMetrics = await page.evaluate(() => {
        const docEl = document.documentElement;
        const body = document.body;
        const popover = document.getElementById('uhv-help-popover');
        const popoverRect = popover?.getBoundingClientRect();
        return {
          windowWidth: window.innerWidth,
          docScrollWidth: docEl.scrollWidth,
          docClientWidth: docEl.clientWidth,
          bodyScrollWidth: body.scrollWidth,
          bodyClientWidth: body.clientWidth,
          docScrollLeft: docEl.scrollLeft,
          bodyScrollLeft: body.scrollLeft,
          popoverRight: popoverRect?.right,
          popoverLeft: popoverRect?.left,
        };
      });
      console.log('OVERFLOW METRICS:', JSON.stringify(overflowMetrics, null, 2));
    }

    // Capture verification screenshots
    await page.screenshot({ path: 'C:/Users/Raghu Nandan/.gemini/antigravity/brain/2d1062a9-c4b4-4ac2-8d36-9405fd983ee5/verify_cgpa_fixed_credits.png' });

    // Dark mode screenshot
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'C:/Users/Raghu Nandan/.gemini/antigravity/brain/2d1062a9-c4b4-4ac2-8d36-9405fd983ee5/verify_cgpa_fixed_credits_dark.png' });
  });
});
