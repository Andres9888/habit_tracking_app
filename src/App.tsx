import '../global.css';

import { Text as RNText, TextInput as RNTextInput } from 'react-native';
import { AppProviders } from './app/AppProviders';
import { initializeAppMonitoring } from './app/initializeAppMonitoring';
import { useStartupReady } from './app/useStartupReady';
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
  // Mount the providers immediately and gate only the content: Clerk session
  // restore, the Convex client's auth + socket handshake, and query-cache
  // hydration all start during the font wait instead of after it.
  const ready = useStartupReady();

  return <AppProviders>{ready ? <AuthGate /> : null}</AppProviders>;
}
