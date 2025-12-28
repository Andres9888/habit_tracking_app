/**
 * GridThemeContext
 *
 * Provides the grid theme configuration throughout the CalendarHeatmap component tree.
 * This enables theming of cell shapes, colors, sizes, and visual effects.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import {
  GridTheme,
  GridThemeName,
  GridThemeOverrides,
  GridThemeContextValue,
  GRID_THEMES,
  DEFAULT_THEME,
  mergeThemeOverrides,
} from './types';
import {
  getSelectedGridTheme,
  saveSelectedGridTheme,
} from '../../utils/gridThemePreferences';

// Create context with undefined default (will be provided by Provider)
const GridThemeContext = createContext<GridThemeContextValue | undefined>(
  undefined
);

export interface GridThemeProviderProps {
  /** Initial theme name to use (defaults to 'github') */
  initialTheme?: GridThemeName;

  /** Optional custom overrides to apply to the active theme */
  overrides?: GridThemeOverrides;

  /** Children components that will have access to the theme */
  children: ReactNode;

  /**
   * Whether to persist theme selection to AsyncStorage
   * When enabled, selected theme is saved and restored on app restart
   * @default true
   */
  persistSelection?: boolean;
}

/**
 * GridThemeProvider component
 *
 * Wraps the CalendarHeatmap component tree and provides theme configuration.
 * Supports switching between preset themes and applying custom overrides.
 *
 * @example
 * ```tsx
 * <GridThemeProvider initialTheme="github">
 *   <CalendarHeatmap {...props} />
 * </GridThemeProvider>
 * ```
 *
 * @example With custom overrides
 * ```tsx
 * <GridThemeProvider
 *   initialTheme="github"
 *   overrides={{ cellGap: 4, showCheckmark: false }}
 * >
 *   <CalendarHeatmap {...props} />
 * </GridThemeProvider>
 * ```
 */
export function GridThemeProvider({
  initialTheme = DEFAULT_THEME,
  overrides: initialOverrides,
  children,
  persistSelection = true,
}: GridThemeProviderProps) {
  const [themeName, setThemeName] = useState<GridThemeName>(initialTheme);
  const [overrides, setOverrides] = useState<GridThemeOverrides>(
    initialOverrides ?? {}
  );
  const [isInitialized, setIsInitialized] = useState(!persistSelection);

  // Load saved theme preference on mount (only if persistence is enabled)
  useEffect(() => {
    if (!persistSelection) {
      return;
    }

    let isMounted = true;

    async function loadSavedTheme() {
      const savedTheme = await getSelectedGridTheme();
      if (isMounted && savedTheme !== null) {
        setThemeName(savedTheme);
      }
      if (isMounted) {
        setIsInitialized(true);
      }
    }

    void loadSavedTheme();

    return () => {
      isMounted = false;
    };
  }, [persistSelection]);

  // Compute the final theme by merging base theme with overrides
  const theme = useMemo((): GridTheme => {
    const baseTheme = GRID_THEMES[themeName];
    return mergeThemeOverrides(baseTheme, overrides);
  }, [themeName, overrides]);

  // Handler to change the active theme
  const setTheme = useCallback(
    (name: GridThemeName) => {
      setThemeName(name);
      // Clear custom overrides when switching themes
      setOverrides({});

      // Persist selection to AsyncStorage (fire and forget - don't block UI)
      if (persistSelection) {
        void saveSelectedGridTheme(name);
      }
    },
    [persistSelection]
  );

  // Handler to apply additional overrides to current theme
  const applyOverrides = useCallback((newOverrides: GridThemeOverrides) => {
    setOverrides((prev) => ({
      ...prev,
      ...newOverrides,
      // Deep merge nested objects
      cellSize: {
        ...prev.cellSize,
        ...newOverrides.cellSize,
      },
      streakColors: {
        ...prev.streakColors,
        ...newOverrides.streakColors,
      },
    }));
  }, []);

  // Available theme names for theme picker UI
  const availableThemes = useMemo(
    (): GridThemeName[] => Object.keys(GRID_THEMES) as GridThemeName[],
    []
  );

  const contextValue = useMemo(
    (): GridThemeContextValue => ({
      applyOverrides,
      availableThemes,
      isThemeReady: isInitialized,
      setTheme,
      theme,
      themeName,
    }),
    [theme, themeName, setTheme, applyOverrides, availableThemes, isInitialized]
  );

  return (
    <GridThemeContext.Provider value={contextValue}>
      {children}
    </GridThemeContext.Provider>
  );
}

/**
 * useGridTheme hook
 *
 * Access the current grid theme configuration from context.
 * Must be used within a GridThemeProvider.
 *
 * @returns The grid theme context value including theme config and setters
 * @throws Error if used outside of GridThemeProvider
 *
 * @example
 * ```tsx
 * function DayCell({ day }) {
 *   const { theme } = useGridTheme();
 *
 *   return (
 *     <View style={{
 *       backgroundColor: day.completed
 *         ? theme.streakColors.level1
 *         : theme.incompleteBackground
 *     }} />
 *   );
 * }
 * ```
 */
export function useGridTheme(): GridThemeContextValue {
  const context = useContext(GridThemeContext);

  if (context === undefined) {
    throw new Error('useGridTheme must be used within a GridThemeProvider');
  }

  return context;
}

/**
 * useGridThemeOptional hook
 *
 * Access the current grid theme configuration from context, or undefined if
 * not within a provider. This is useful for components that should work
 * with or without theme support.
 *
 * @returns The grid theme context value or undefined
 *
 * @example
 * ```tsx
 * function DayCell({ day }) {
 *   const themeContext = useGridThemeOptional();
 *   const theme = themeContext?.theme ?? GITHUB_THEME;
 *
 *   // Use theme...
 * }
 * ```
 */
export function useGridThemeOptional(): GridThemeContextValue | undefined {
  return useContext(GridThemeContext);
}

export default GridThemeContext;
