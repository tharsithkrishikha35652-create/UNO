import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.calcredit.app',
  appName: 'CalCredit',
  webDir: 'dist',
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com'],
      serverClientId: '1021203430303-8jvshisq9hq4h2br0q9621mb225b5hfl.apps.googleusercontent.com',
    },
    SplashScreen: {
      launchAutoHide: false,
      launchShowDuration: 0,
      backgroundColor: '#F7F1E1',
    },
  },
};

export default config;
