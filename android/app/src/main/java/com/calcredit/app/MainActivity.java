package com.calcredit.app;

import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private volatile int lastTopDp = 24;
    private volatile int lastBottomDp = 0;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 1. Enforce true edge-to-edge window fitting across all OEM skins (ColorOS, OneUI, MIUI, etc.)
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        getWindow().setStatusBarColor(android.graphics.Color.TRANSPARENT);
        getWindow().setNavigationBarColor(android.graphics.Color.TRANSPARENT);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            getWindow().setStatusBarContrastEnforced(false);
            getWindow().setNavigationBarContrastEnforced(false);
        }

        // 2. Allow content to render into display cutout area (camera hole / notch)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(lp);
        }

        // 3. Set default light status bar (dark icons for white header)
        View decorView = getWindow().getDecorView();
        WindowInsetsControllerCompat insetsController = WindowCompat.getInsetsController(getWindow(), decorView);
        if (insetsController != null) {
            insetsController.setAppearanceLightStatusBars(true);
        }

        // 4. Expose synchronous JS interface and enable unrestricted HTML5 video autoplay
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().getSettings().setMediaPlaybackRequiresUserGesture(false);
            getBridge().getWebView().addJavascriptInterface(new Object() {
                @JavascriptInterface
                public int getTopInsetDp() {
                    return lastTopDp;
                }

                @JavascriptInterface
                public int getBottomInsetDp() {
                    return lastBottomDp;
                }

                @JavascriptInterface
                public void setDarkMode(boolean isDark) {
                    runOnUiThread(() -> {
                        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
                        if (controller != null) {
                            controller.setAppearanceLightStatusBars(!isDark);
                        }
                    });
                }
            }, "AndroidInsets");
        }

        // 5. Dynamic WindowInsets listener
        ViewCompat.setOnApplyWindowInsetsListener(decorView, (v, windowInsets) -> {
            int top = windowInsets.getInsets(
                WindowInsetsCompat.Type.statusBars() | WindowInsetsCompat.Type.displayCutout()
            ).top;

            float density = getResources().getDisplayMetrics().density;
            int topDp = density > 0 ? Math.round(top / density) : 24;
            int bottomDp = 0;

            if (isThreeButtonNavigation(windowInsets, density)) {
                int bottom = windowInsets.getInsets(
                    WindowInsetsCompat.Type.navigationBars()
                ).bottom;
                bottomDp = density > 0 && bottom > 0 ? Math.round(bottom / density) : 48;
            }

            lastTopDp = topDp;
            lastBottomDp = bottomDp;

            injectInsetsToWebView(topDp, bottomDp);

            return ViewCompat.onApplyWindowInsets(v, windowInsets);
        });

        // 6. Ensure insets are computed and posted when layout is ready
        decorView.post(this::syncSafeArea);
    }

    @Override
    public void onResume() {
        super.onResume();
        syncSafeArea();
    }

    private void injectInsetsToWebView(int topDp, int bottomDp) {
        if (getBridge() != null && getBridge().getWebView() != null) {
            String js = "document.documentElement.style.setProperty('--safe-area-inset-top', '" + topDp + "px');" +
                        "document.documentElement.style.setProperty('--safe-area-inset-bottom', '" + bottomDp + "px');";
            getBridge().getWebView().evaluateJavascript(js, null);
        }
    }

    private boolean isThreeButtonNavigation(WindowInsetsCompat insets, float density) {
        // 1. Check system navigation_mode setting if available (0 = 3-button, 1 = 2-button, 2 = gestural)
        try {
            int navMode = Settings.Secure.getInt(getContentResolver(), "navigation_mode");
            if (navMode == 2) {
                return false;
            } else if (navMode == 0 || navMode == 1) {
                return true;
            }
        } catch (Exception ignored) {
            // Setting unavailable or customized by OEM
        }

        if (insets != null) {
            // 2. Under 3-button navigation, buttons are tappable system elements.
            // Under gesture navigation, tappableElement().bottom is 0.
            int tappableBottom = insets.getInsets(WindowInsetsCompat.Type.tappableElement()).bottom;
            if (tappableBottom > 0 && density > 0 && (tappableBottom / density) >= 32.0f) {
                return true;
            }

            // 3. Check navigationBars height vs gesture bar height
            int navBarBottom = insets.getInsets(WindowInsetsCompat.Type.navigationBars()).bottom;
            if (density > 0) {
                float navBarDp = navBarBottom / density;
                if (navBarDp >= 36.0f) {
                    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
                        return true;
                    }
                    return tappableBottom > 0;
                }
            }
        }

        return false;
    }

    private void syncSafeArea() {
        float density = getResources().getDisplayMetrics().density;

        int statusBarHeight = 0;
        int resourceId = getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            statusBarHeight = getResources().getDimensionPixelSize(resourceId);
        }

        View decorView = getWindow().getDecorView();
        WindowInsetsCompat rootInsets = ViewCompat.getRootWindowInsets(decorView);
        if (rootInsets != null) {
            int insetsTop = rootInsets.getInsets(
                WindowInsetsCompat.Type.statusBars() | WindowInsetsCompat.Type.displayCutout()
            ).top;
            if (insetsTop > 0) {
                statusBarHeight = insetsTop;
            }
        }

        int topDp = density > 0 && statusBarHeight > 0 ? Math.round(statusBarHeight / density) : 24;
        int bottomDp = 0;

        if (isThreeButtonNavigation(rootInsets, density)) {
            int navBarHeight = 0;
            if (rootInsets != null) {
                navBarHeight = rootInsets.getInsets(WindowInsetsCompat.Type.navigationBars()).bottom;
            }
            if (navBarHeight <= 0) {
                int navResourceId = getResources().getIdentifier("navigation_bar_height", "dimen", "android");
                if (navResourceId > 0) {
                    navBarHeight = getResources().getDimensionPixelSize(navResourceId);
                }
            }
            bottomDp = density > 0 && navBarHeight > 0 ? Math.round(navBarHeight / density) : 48;
        }

        lastTopDp = topDp;
        lastBottomDp = bottomDp;

        injectInsetsToWebView(topDp, bottomDp);
    }
}
