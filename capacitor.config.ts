import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.calibodi.two',
  appName: 'CaliBodi',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com'],
    } as any,
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0A0A0F',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0A0A0F',
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#FF6B35',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
