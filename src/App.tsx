import '../global.css';

import { Literata_700Bold } from '@expo-google-fonts/literata';
import { useFonts } from 'expo-font';
import { Text as RNText, TextInput as RNTextInput } from 'react-native';
import { AppProviders } from './app/AppProviders';
import { initializeAppMonitoring } from './app/initializeAppMonitoring';
import { AuthGate } from './components/auth/AuthGate';
import { MAX_FONT_SIZE_MULTIPLIER_BODY } from './utils/accessibility/textScaling';

initializeAppMonitoring();

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
  if (!fontsLoaded && !fontError) return null;

  return (
    <AppProviders>
      <AuthGate />
    </AppProviders>
  );
}
