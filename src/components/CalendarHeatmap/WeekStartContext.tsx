/**
 * WeekStartContext
 *
 * Provides the week start day preference throughout the CalendarHeatmap component tree.
 * This enables customization of which day the week starts on (Sunday, Monday, etc.).
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
  WeekStartDay,
  WeekStartDayName,
  WeekStartContextValue,
  WEEK_START_DAY_NAMES,
  DEFAULT_WEEK_START,
} from './types';
import {
  getWeekStartDay,
  saveWeekStartDay,
} from '../../utils/weekStartDayPreferences';

// Create context with undefined default (will be provided by Provider)
const WeekStartContext = createContext<WeekStartContextValue | undefined>(
  undefined
);

export interface WeekStartProviderProps {
  /** Initial week start day to use (defaults to Sunday = 0) */
  initialWeekStart?: WeekStartDay;

  /** Children components that will have access to the week start preference */
  children: ReactNode;

  /**
   * Whether to persist week start selection to AsyncStorage
   * When enabled, selected day is saved and restored on app restart
   * @default true
   */
  persistSelection?: boolean;
}

/**
 * WeekStartProvider component
 *
 * Wraps the CalendarHeatmap component tree and provides week start day preference.
 * Supports switching between different week start days and persisting the choice.
 *
 * @example
 * ```tsx
 * <WeekStartProvider initialWeekStart={1}>
 *   <CalendarHeatmap {...props} />
 * </WeekStartProvider>
 * ```
 *
 * @example Combining with GridThemeProvider
 * ```tsx
 * <GridThemeProvider initialTheme="github">
 *   <WeekStartProvider initialWeekStart={1}>
 *     <CalendarHeatmap {...props} />
 *   </WeekStartProvider>
 * </GridThemeProvider>
 * ```
 */
export function WeekStartProvider({
  initialWeekStart = DEFAULT_WEEK_START,
  children,
  persistSelection = true,
}: WeekStartProviderProps) {
  const [weekStartDay, setWeekStartDayState] =
    useState<WeekStartDay>(initialWeekStart);
  const [isInitialized, setIsInitialized] = useState(!persistSelection);

  // Load saved preference on mount (only if persistence is enabled)
  useEffect(() => {
    if (!persistSelection) {
      return;
    }

    let isMounted = true;

    async function loadSavedPreference() {
      const savedDay = await getWeekStartDay();
      if (isMounted && savedDay !== null) {
        setWeekStartDayState(savedDay);
      }
      if (isMounted) {
        setIsInitialized(true);
      }
    }

    void loadSavedPreference();

    return () => {
      isMounted = false;
    };
  }, [persistSelection]);

  // Handler to change the week start day
  const setWeekStartDay = useCallback(
    (day: WeekStartDay) => {
      setWeekStartDayState(day);

      // Persist selection to AsyncStorage (fire and forget - don't block UI)
      if (persistSelection) {
        void saveWeekStartDay(day);
      }
    },
    [persistSelection]
  );

  // Get human-readable name for current week start day
  const weekStartDayName: WeekStartDayName = WEEK_START_DAY_NAMES[weekStartDay];

  // All available week start options (0-6)
  const availableOptions = useMemo(
    (): WeekStartDay[] => [0, 1, 2, 3, 4, 5, 6],
    []
  );

  const contextValue = useMemo(
    (): WeekStartContextValue => ({
      weekStartDay,
      weekStartDayName,
      setWeekStartDay,
      availableOptions,
      isWeekStartReady: isInitialized,
    }),
    [
      weekStartDay,
      weekStartDayName,
      setWeekStartDay,
      availableOptions,
      isInitialized,
    ]
  );

  return (
    <WeekStartContext.Provider value={contextValue}>
      {children}
    </WeekStartContext.Provider>
  );
}

/**
 * useWeekStart hook
 *
 * Access the current week start day preference from context.
 * Must be used within a WeekStartProvider.
 *
 * @returns The week start context value including current day and setter
 * @throws Error if used outside of WeekStartProvider
 *
 * @example
 * ```tsx
 * function MonthGrid() {
 *   const { weekStartDay } = useWeekStart();
 *   const dayLabels = getRotatedDayLabels(weekStartDay);
 *
 *   return (
 *     <View>
 *       {dayLabels.map(label => <Text key={label}>{label}</Text>)}
 *     </View>
 *   );
 * }
 * ```
 */
export function useWeekStart(): WeekStartContextValue {
  const context = useContext(WeekStartContext);

  if (context === undefined) {
    throw new Error('useWeekStart must be used within a WeekStartProvider');
  }

  return context;
}

/**
 * useWeekStartOptional hook
 *
 * Access the current week start day preference from context, or undefined if
 * not within a provider. This is useful for components that should work
 * with or without week start customization.
 *
 * @returns The week start context value or undefined
 *
 * @example
 * ```tsx
 * function MonthGrid() {
 *   const weekStartContext = useWeekStartOptional();
 *   const weekStartDay = weekStartContext?.weekStartDay ?? DEFAULT_WEEK_START;
 *   const dayLabels = getRotatedDayLabels(weekStartDay);
 *
 *   // Use dayLabels...
 * }
 * ```
 */
export function useWeekStartOptional(): WeekStartContextValue | undefined {
  return useContext(WeekStartContext);
}

export default WeekStartContext;
