// Deep import, not the package barrel: `@expo-google-fonts/literata`
// re-exports all 16 weights via top-level require(), and Metro does not
// tree-shake, so the barrel ships ~3.9MB of unused TTFs.
import { Literata_700Bold } from '@expo-google-fonts/literata/700Bold';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

export const SPLASH_TIMEOUT_MS = 2500;

void SplashScreen.preventAutoHideAsync();

export function useStartupReady(): boolean {
  const [fontsLoaded, fontError] = useFonts({ Literata: Literata_700Bold });
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setTimedOut(true), SPLASH_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, []);

  const ready = fontsLoaded || Boolean(fontError) || timedOut;

  useEffect(() => {
    if (!ready) return;
    void SplashScreen.hideAsync();
  }, [ready]);

  return ready;
}
