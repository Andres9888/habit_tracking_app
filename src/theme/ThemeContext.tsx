/**
 * ThemeContext - Dark/Light Mode Theme Management
 *
 * Provides semantic color palette and theme state throughout the app.
 * Reads user's dark mode preference from Convex settings and resolves
 * against system preference when set to 'system' mode.
 *
 * **Theme Resolution:**
 * - 'light' → Always use light colors
 * - 'dark' → Always use dark colors
 * - 'system' → Follow device system preference
 *
 * **Color Palette:**
 * See darkColors.ts for the full semantic color definitions.
 * Colors are designed for WCAG AA contrast compliance.
 *
 * @example
 * ```tsx
 * // In app root
 * <ThemeColorProvider>
 *   <App />
 * </ThemeColorProvider>
 *
 * // In any component
 * const { colors, isDark } = useThemeColors();
 * <View style={{ backgroundColor: colors.background }}>
 *   <Text style={{ color: colors.text }}>Hello</Text>
 * </View>
 * ```
 *
 * @see darkColors.ts for semantic color definitions
 * @see src/contexts/PerformanceContext for settings management
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { darkColors, lightColors } from './darkColors';
import type { SemanticColors } from './darkColors';

/**
 * User's dark mode preference setting
 */
type DarkModePref = 'system' | 'light' | 'dark';

/**
 * Theme context value interface
 */
interface ThemeContextValue {
  /** Active semantic color palette based on current theme */
  colors: SemanticColors;
  /** Whether dark mode is currently active */
  isDark: boolean;
  /** User's dark mode preference ('system', 'light', or 'dark') */
  mode: DarkModePref;
}

/**
 * Default context value (light mode)
 */
const ThemeContext = createContext<ThemeContextValue>({
  colors: lightColors,
  isDark: false,
  mode: 'system',
});

/**
 * ThemeColorProvider Component
 *
 * Provider component that reads user theme preference from Convex,
 * resolves it against system settings, and provides the active theme
 * to all child components.
 *
 * **Placement:**
 * Must be placed inside ConvexProvider to access user settings query.
 *
 * @param props - Component props
 * @param props.children - Child components to render
 *
 * @example
 * ```tsx
 * <ConvexProvider client={convex}>
 *   <ThemeColorProvider>
 *     <App />
 *   </ThemeColorProvider>
 * </ConvexProvider>
 * ```
 */
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
 * useThemeColors Hook
 *
 * Access the current theme colors and theme state.
 * Use this hook in components that need semantic colors.
 *
 * @returns Theme context value with colors, isDark, and mode
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { colors, isDark } = useThemeColors();
 *
 *   return (
 *     <View style={{ backgroundColor: colors.background }}>
 *       <Text style={{ color: colors.text }}>Hello</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useThemeColors() {
  return useContext(ThemeContext);
}

/**
 * useIsDark Hook
 *
 * Lightweight hook to access only the isDark boolean.
 * Prefer this over useThemeColors() when you only need the dark mode
 * state without the full color palette, as it makes the component's
 * theme dependency more explicit.
 *
 * @returns true if dark mode is active, false otherwise
 *
 * @example
 * ```tsx
 * function Icon() {
 *   const isDark = useIsDark();
 *
 *   return <Feather name="sun" color={isDark ? '#fff' : '#000'} />;
 * }
 * ```
 */
export function useIsDark(): boolean {
  return useContext(ThemeContext).isDark;
}
