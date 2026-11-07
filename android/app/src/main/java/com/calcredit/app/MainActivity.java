package com.calcredit.app;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(lp);
        }

        View decorView = getWindow().getDecorView();
        ViewCompat.setOnApplyWindowInsetsListener(decorView, (v, windowInsets) -> {
            int top = windowInsets.getInsets(
                WindowInsetsCompat.Type.statusBars() | WindowInsetsCompat.Type.displayCutout()
            ).top;
            int bottom = windowInsets.getInsets(
                WindowInsetsCompat.Type.navigationBars()
            ).bottom;

            float density = getResources().getDisplayMetrics().density;
            int topDp = density > 0 ? Math.round(top / density) : 24;
            int bottomDp = density > 0 ? Math.round(bottom / density) : 0;

            if (getBridge() != null && getBridge().getWebView() != null) {
                String js = "document.documentElement.style.setProperty('--safe-area-inset-top', '" + topDp + "px');" +
                            "document.documentElement.style.setProperty('--safe-area-inset-bottom', '" + bottomDp + "px');";
                getBridge().getWebView().evaluateJavascript(js, null);
            }
            return ViewCompat.onApplyWindowInsets(v, windowInsets);
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        syncSafeArea();
    }

    private void syncSafeArea() {
        if (getBridge() == null || getBridge().getWebView() == null) {
            return;
        }

        int statusBarHeight = 0;
        int resourceId = getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            statusBarHeight = getResources().getDimensionPixelSize(resourceId);
        }

        int navBarHeight = 0;
        int navResourceId = getResources().getIdentifier("navigation_bar_height", "dimen", "android");
        if (navResourceId > 0) {
            navBarHeight = getResources().getDimensionPixelSize(navResourceId);
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
            int insetsBottom = rootInsets.getInsets(
                WindowInsetsCompat.Type.navigationBars() | WindowInsetsCompat.Type.displayCutout()
            ).bottom;
            if (insetsBottom > 0) {
                navBarHeight = insetsBottom;
            }
        }

        float density = getResources().getDisplayMetrics().density;
        int topDp = density > 0 && statusBarHeight > 0 ? Math.round(statusBarHeight / density) : 24;
        int bottomDp = density > 0 && navBarHeight > 0 ? Math.round(navBarHeight / density) : 48;

        String js = "document.documentElement.style.setProperty('--safe-area-inset-top', '" + topDp + "px');" +
                    "document.documentElement.style.setProperty('--safe-area-inset-bottom', '" + bottomDp + "px');";
        getBridge().getWebView().evaluateJavascript(js, null);
    }
}
