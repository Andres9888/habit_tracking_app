import '../global.css';

import { Literata_700Bold } from '@expo-google-fonts/literata';
import { useFonts } from 'expo-font';
import { AppProviders } from './app/AppProviders';
import { initializeAppMonitoring } from './app/initializeAppMonitoring';
import { AuthGate } from './components/auth/AuthGate';

initializeAppMonitoring();

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
