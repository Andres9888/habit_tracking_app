import type { ConnectorStyle } from '../../../convex/settings/types';

type DarkModePreference = 'system' | 'light' | 'dark';

/** Shown when a settings write is rejected and the row has been rolled back. */
export const SETTINGS_SAVE_ERROR = "Couldn't save that — please try again.";

interface Setters {
  setDarkModeState: (v: DarkModePreference) => void;
  setReduceMotionState: (v: boolean) => void;
  setCompactViewState: (v: boolean) => void;
  setShowGradientFillState: (v: boolean) => void;
  setConnectorStyleState: (v: ConnectorStyle) => void;
}

/** Current local values, read at call time so rollback restores the real prior
 *  state rather than whatever was captured when the updaters were built. */
interface Current {
  compactView: boolean;
  connectorStyle: ConnectorStyle;
  darkModePreference: DarkModePreference;
  reduceMotion: boolean;
  showGradientFill: boolean;
}

/**
 * Every updater applies the new value LOCALLY FIRST, then persists.
 *
 * The switch is fully controlled by local state, so awaiting the mutation before
 * setting it meant the knob didn't move until the server answered — and never
 * moved at all offline. Optimistic + rollback keeps the control honest: it
 * responds instantly, and reverts with an explicit message if the write fails
 * rather than leaving the UI asserting something the backend never accepted.
 *
 * Patches are single-key: the previous implementation spread the whole settings
 * document into every write, so a late-landing write reverted unrelated fields.
 */
export function createSettingsUpdaters(
  update: (patch: Record<string, unknown>) => Promise<void>,
  setters: Setters,
  current: Current,
  onError: (message: string) => void
) {
  const optimistic = async <T>(
    value: T,
    previous: T,
    apply: (v: T) => void,
    patch: Record<string, unknown>
  ) => {
    apply(value);
    try {
      await update(patch);
    } catch {
      apply(previous);
      onError(SETTINGS_SAVE_ERROR);
    }
  };

  return {
    setCompactView: (value: boolean) =>
      optimistic(value, current.compactView, setters.setCompactViewState, {
        compactView: value,
      }),
    setConnectorStyle: (value: ConnectorStyle) =>
      optimistic(
        value,
        current.connectorStyle,
        setters.setConnectorStyleState,
        { connectorStyle: value }
      ),
    setDarkModePreference: (value: DarkModePreference) =>
      optimistic(
        value,
        current.darkModePreference,
        setters.setDarkModeState,
        { darkMode: value }
      ),
    setReduceMotion: (value: boolean) =>
      optimistic(value, current.reduceMotion, setters.setReduceMotionState, {
        reduceMotion: value,
      }),
    setShowGradientFill: (value: boolean) =>
      optimistic(
        value,
        current.showGradientFill,
        setters.setShowGradientFillState,
        { showGradientFill: value }
      ),
    // Sort mode has no local mirror — it reads straight from the settings
    // document — so there is nothing to roll back, only a failure to report.
    setHabitSortMode: async (value: string) => {
      try {
        await update({ habitSortMode: value });
      } catch {
        onError(SETTINGS_SAVE_ERROR);
      }
    },
  };
}

export type { DarkModePreference };

export const normalizeDarkModePreference = (
  value: unknown
): DarkModePreference => {
  if (value === 'dark' || value === 'light' || value === 'system') return value;
  if (value === true) return 'dark';
  if (value === false) return 'light';
  return 'system';
};
