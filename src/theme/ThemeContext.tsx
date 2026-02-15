/**
 * ThemeContext - Provides dark/light mode colors throughout the app.
 *
 * Reads the `darkMode` user setting from Convex and resolves system preference.
 * Components use `useThemeColors()` to get the active semantic color palette.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useQuery } from 'convex/react';

import type { SemanticColors } from './darkColors';
import { api } from '../../convex/_generated/api';
import { darkColors, lightColors } from './darkColors';

type DarkModePref = 'system' | 'light' | 'dark';

interface ThemeContextValue {
  colors: SemanticColors;
  isDark: boolean;
  mode: DarkModePref;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightColors,
  isDark: false,
  mode: 'system',
});

export function ThemeColorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = useQuery(api.settings.get);
  const systemScheme = useSystemColorScheme();

  const value = useMemo(() => {
    const raw = settings?.darkMode;
    const mode: DarkModePref =
      raw === 'dark' || raw === 'light' || raw === 'system' ? raw : 'system';

    let isDark = false;
    if (mode === 'dark') isDark = true;
    else if (mode === 'system') isDark = systemScheme === 'dark';

    return {
      colors: isDark ? darkColors : lightColors,
      isDark,
      mode,
    };
  }, [settings?.darkMode, systemScheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * Hook to access the current theme colors.
 *
 * Usage:
 *   const { colors, isDark } = useThemeColors();
 *   <View style={{ backgroundColor: colors.background }} />
 */
export function useThemeColors() {
  return useContext(ThemeContext);
}

/**
 * Lightweight hook to access only the isDark boolean.
 *
 * Prefer this over useThemeColors() when you only need isDark,
 * as it makes the component's theme dependency more explicit.
 *
 * Usage:
 *   const isDark = useIsDark();
 *   <Icon color={isDark ? '#fff' : '#000'} />
 */
export function useIsDark(): boolean {
  return useContext(ThemeContext).isDark;
}
