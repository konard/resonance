import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.resonance.app',
  appName: 'Resonance',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    url: undefined,
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#000000',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
  ios: {
    contentInset: 'automatic',
  },
}

export default config