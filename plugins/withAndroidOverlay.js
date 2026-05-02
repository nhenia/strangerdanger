const { withAndroidManifest, createRunOncePlugin } = require('@expo/config-plugins');

const withAndroidOverlay = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;

    // Ensure we have the manifest
    if (!androidManifest.manifest) {
      return config;
    }

    // Request SYSTEM_ALERT_WINDOW permission
    const usesPermissions = androidManifest.manifest['uses-permission'] || [];

    const hasOverlayPermission = usesPermissions.find(
      (item) => item.$['android:name'] === 'android.permission.SYSTEM_ALERT_WINDOW'
    );

    if (!hasOverlayPermission) {
      usesPermissions.push({
        $: {
          'android:name': 'android.permission.SYSTEM_ALERT_WINDOW',
        },
      });
      androidManifest.manifest['uses-permission'] = usesPermissions;
    }

    // We inject a Foreground Service definition to host the WindowManager overlay
    // when the screen is off or app is closed.
    const application = androidManifest.manifest.application[0];
    const services = application.service || [];

    const hasOverlayService = services.find(
      (item) => item.$['android:name'] === '.OverlayService'
    );

    if (!hasOverlayService) {
      services.push({
        $: {
          'android:name': '.OverlayService',
          'android:enabled': 'true',
          'android:exported': 'false',
        },
      });
      application.service = services;
    }

    // Add FOREGROUND_SERVICE permission as well
    const hasForegroundPermission = usesPermissions.find(
      (item) => item.$['android:name'] === 'android.permission.FOREGROUND_SERVICE'
    );
    if (!hasForegroundPermission) {
      usesPermissions.push({
        $: {
          'android:name': 'android.permission.FOREGROUND_SERVICE',
        },
      });
    }

    return config;
  });
};

const withAndroidServiceSource = (config) => {
  return require('@expo/config-plugins').withDangerousMod(config, [
    'android',
    async (config) => {
      const fs = require('fs');
      const path = require('path');

      const androidSrcDir = path.join(config.modRequest.platformProjectRoot, 'app', 'src', 'main', 'java', 'com', 'temp_expo');
      fs.mkdirSync(androidSrcDir, { recursive: true });

      const serviceCode = `package com.temp_expo;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.IBinder;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.FrameLayout;

import androidx.core.app.NotificationCompat;

public class OverlayService extends Service {
    private WindowManager windowManager;
    private View overlayView;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String channelId = "overlay_service_channel";
            NotificationChannel channel = new NotificationChannel(
                    channelId,
                    "Overlay Service Channel",
                    NotificationManager.IMPORTANCE_LOW
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            if(manager != null) manager.createNotificationChannel(channel);

            Notification notification = new NotificationCompat.Builder(this, channelId)
                    .setContentTitle("Mood Ring")
                    .setContentText("Active")
                    .setSmallIcon(android.R.drawable.ic_menu_view)
                    .build();

            startForeground(1, notification);
        }

        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        overlayView = new FrameLayout(this);

        GradientDrawable border = new GradientDrawable();
        border.setColor(Color.TRANSPARENT);
        border.setStroke(4, Color.GREEN); // 2px high saturation green
        overlayView.setBackground(border);

        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.O ?
                        WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY :
                        WindowManager.LayoutParams.TYPE_PHONE,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL |
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN |
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS |
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED,
                PixelFormat.TRANSLUCENT
        );

        params.gravity = Gravity.CENTER;
        if(windowManager != null) windowManager.addView(overlayView, params);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (overlayView != null && windowManager != null) {
            windowManager.removeView(overlayView);
        }
    }
}
`;
      fs.writeFileSync(path.join(androidSrcDir, 'OverlayService.java'), serviceCode);
      return config;
    },
  ]);
};

const pkg = { name: 'withAndroidOverlay', version: '1.0.0' };

const withMyOverlay = (config) => {
  return withAndroidServiceSource(withAndroidOverlay(config));
};

module.exports = createRunOncePlugin(
  withMyOverlay,
  pkg.name,
  pkg.version
);
