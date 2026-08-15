import '../global.css';

// Deep import, not the package barrel: `@expo-google-fonts/literata` re-exports
// all 16 weights via top-level `require()`, and Metro does not tree-shake, so
// the barrel ships ~3.9MB of unused TTFs. This subpath pulls only the one face.
import { Literata_700Bold } from '@expo-google-fonts/literata/700Bold';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Text as RNText, TextInput as RNTextInput } from 'react-native';
import { AppProviders } from './app/AppProviders';
import { initializeAppMonitoring } from './app/initializeAppMonitoring';
import { AuthGate } from './components/auth/AuthGate';
import { MAX_FONT_SIZE_MULTIPLIER_BODY } from './utils/accessibility/textScaling';

initializeAppMonitoring();

// App initially renders null while the display font loads. Keep the native
// splash visible during that gap, then dismiss it explicitly once React can
// render the startup UI instead of relying on the automatic first-frame hook.
void SplashScreen.preventAutoHideAsync().catch(() => undefined);

// Global Dynamic Type cap: without this, ~1,200 <Text> sites scale unbounded
// and break fixed-height layouts (cards, tab bar, day cells). RN honors
// Text/TextInput.defaultProps at runtime; AccessibleText overrides per-instance
// for chrome that needs a stricter cap.
type FontScaleDefaults = { defaultProps?: { maxFontSizeMultiplier?: number } };
const textDefaults = RNText as unknown as FontScaleDefaults;
textDefaults.defaultProps = {
  ...textDefaults.defaultProps,
  maxFontSizeMultiplier: MAX_FONT_SIZE_MULTIPLIER_BODY,
};
const inputDefaults = RNTextInput as unknown as FontScaleDefaults;
inputDefaults.defaultProps = {
  ...inputDefaults.defaultProps,
  maxFontSizeMultiplier: MAX_FONT_SIZE_MULTIPLIER_BODY,
};

export default function App() {
  // The theme's serif display face (typography.fontFamilies.primary.display).
  // All Literata text styles render bold, so one face covers them; without
  // this load the serif silently falls back to the system sans.
  const [fontsLoaded, fontError] = useFonts({ Literata: Literata_700Bold });
  const isFontReady = fontsLoaded || Boolean(fontError);

  useEffect(() => {
    if (isFontReady) {
      void SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [isFontReady]);

  if (!isFontReady) return null;

  return (
    <AppProviders>
      <AuthGate />
    </AppProviders>
  );
}
