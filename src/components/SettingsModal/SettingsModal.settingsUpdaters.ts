type DarkModePreference = 'system' | 'light' | 'dark';

export function createSettingsUpdaters(
  update: (patch: Record<string, unknown>) => Promise<void>,
  setters: {
    setDarkModeState: (v: DarkModePreference) => void;
    setReduceMotionState: (v: boolean) => void;
    setUseDyslexicFontState: (v: boolean) => void;
    setCompactViewState: (v: boolean) => void;
    setShowGradientFillState: (v: boolean) => void;
    setShowStreakConnectionsState: (v: boolean) => void;
  }
) {
  return {
    setCompactView: async (value: boolean) => {
      setters.setCompactViewState(value);
      await update({ compactView: value });
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
    setShowStreakConnections: async (value: boolean) => {
      setters.setShowStreakConnectionsState(value);
      await update({ showStreakConnections: value });
    },
    setUseDyslexicFont: async (value: boolean) => {
      setters.setUseDyslexicFontState(value);
      await update({ useDyslexicFont: value });
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
