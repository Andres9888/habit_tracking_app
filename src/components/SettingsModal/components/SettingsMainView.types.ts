import type { EdgeInsets } from 'react-native-safe-area-context';
import type { useSettingsModalLogic } from '../SettingsModal.hooks';
import type { SettingsModalProps } from '../types';

type ModalLogic = ReturnType<typeof useSettingsModalLogic>;

export interface SettingsMainViewProps {
  view: ModalLogic['view'];
  viewDirection: ModalLogic['viewDirection'];
  setView: ModalLogic['setView'];
  handleClose: () => void;
  insets: EdgeInsets;
  isLoading: boolean;
  isPremium: boolean;
  archivedHabitsCount: number;
  compactView: boolean;
  setCompactView: ModalLogic['setCompactView'];
  darkModePreference: ModalLogic['darkModePreference'];
  setDarkModePreference: ModalLogic['setDarkModePreference'];
  habitSortMode: ModalLogic['habitSortMode'];
  setHabitSortMode: ModalLogic['setHabitSortMode'];
  showGradientFill: ModalLogic['showGradientFill'];
  setShowGradientFill: ModalLogic['setShowGradientFill'];
  connectorStyle: ModalLogic['connectorStyle'];
  setConnectorStyle: ModalLogic['setConnectorStyle'];
  completionSoundEnabled: SettingsModalProps['completionSoundEnabled'];
  completionSoundType: SettingsModalProps['completionSoundType'];
  dayShape: SettingsModalProps['dayShape'];
  habitCompletionIcon: SettingsModalProps['habitCompletionIcon'];
  streakRemindersEnabled: SettingsModalProps['streakRemindersEnabled'];
  streakReminderTime: SettingsModalProps['streakReminderTime'];
  stickyCalendarHeader: SettingsModalProps['stickyCalendarHeader'];
  onChangeCompletionSoundEnabled: SettingsModalProps['onChangeCompletionSoundEnabled'];
  onChangeCompletionSoundType: SettingsModalProps['onChangeCompletionSoundType'];
  onChangeDayShape: SettingsModalProps['onChangeDayShape'];
  onChangeHabitCompletionIcon: SettingsModalProps['onChangeHabitCompletionIcon'];
  onChangeStickyCalendarHeader: SettingsModalProps['onChangeStickyCalendarHeader'];
  onToggleStreakReminders: SettingsModalProps['onToggleStreakReminders'];
  onChangeStreakReminderTime: SettingsModalProps['onChangeStreakReminderTime'];
  onPremiumUpsell: SettingsModalProps['onPremiumUpsell'];
  onExportHabitsData: SettingsModalProps['onExportHabitsData'];
}
