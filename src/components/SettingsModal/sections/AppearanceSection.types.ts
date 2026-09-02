/** AppearanceSection prop contract */
import type { DarkModePreference } from '../../../../convex/settings/types';

export interface AppearanceSectionProps {
  darkModePreference: DarkModePreference;
  onChangeDarkModePreference: (
    value: DarkModePreference
  ) => void | Promise<void>;
  compactView: boolean;
  onChangeCompactView: (value: boolean) => void | Promise<void>;
  onOpenCalendarLook: () => void;
}
