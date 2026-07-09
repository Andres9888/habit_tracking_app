import type { ConnectorStyle } from '../../../convex/settings/types';

type DarkModePreference = 'system' | 'light' | 'dark';

export function createSettingsUpdaters(
  update: (patch: Record<string, unknown>) => Promise<void>,
  setters: {
    setDarkModeState: (v: DarkModePreference) => void;
    setReduceMotionState: (v: boolean) => void;
    setCompactViewState: (v: boolean) => void;
    setShowGradientFillState: (v: boolean) => void;
    setConnectorStyleState: (v: ConnectorStyle) => void;
  }
) {
  return {
    setCompactView: async (value: boolean) => {
      setters.setCompactViewState(value);
      await update({ compactView: value });
    },
    setConnectorStyle: async (value: ConnectorStyle) => {
      setters.setConnectorStyleState(value);
      await update({ connectorStyle: value });
    },
    setDarkModePreference: async (value: DarkModePreference) => {
      setters.setDarkModeState(value);
      await update({ darkMode: value });
    },
    setHabitSortMode: async (value: string) => {
      await update({ habitSortMode: value });
    },
    setReduceMotion: async (value: boolean) => {
      setters.setReduceMotionState(value);
      await update({ reduceMotion: value });
    },
    setShowGradientFill: async (value: boolean) => {
      setters.setShowGradientFillState(value);
      await update({ showGradientFill: value });
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
