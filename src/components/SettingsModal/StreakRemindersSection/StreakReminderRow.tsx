/** StreakReminderRow — one toggle row inside the Habits card.
 *
 *  The nested "Remind me at" inset card is gone: the time now rides the row's
 *  own subtitle ("Every day at 8:00 PM") and tapping the row body opens a
 *  picker. That removes a permanently-expanded card, a disabled-state hint and
 *  a second tap target for a preference most people set once.
 *  Android keeps its native dialog; iOS gets a bottom sheet, because an inline
 *  spinner has nowhere to live now that the inset card is gone. */
import { Platform } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useState } from 'react';
import { iconSizes } from '@/theme/iconSizes';
import { SettingsRow } from '../SettingsRow';
import { useThemeColors } from '@/theme/ThemeContext';
import { AndroidTimePickerDialog } from './components/AndroidTimePickerDialog';
import { TimePickerSheet } from './components/TimePickerSheet';
import {
  handleTimeChange,
  useTimePickerState,
} from './StreakReminderRow.hooks';
import { formatStreakReminderSubtitle } from '../timeHelpers';
import type { StreakReminderRowProps } from './StreakReminderRow.types';

export function StreakReminderRow(props: StreakReminderRowProps) {
  const { setShowTimePicker, showTimePicker } = useTimePickerState();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { settings } = useThemeColors();
  const onTimeChange = handleTimeChange(props.onChangeTime, setShowTimePicker);
  const { strong, subtitle } = formatStreakReminderSubtitle(
    props.enabled,
    props.reminderTime
  );

  const openPicker = () =>
    Platform.OS === 'android' ? setShowTimePicker(true) : setSheetOpen(true);

  return (
    <>
      <SettingsRow
        accessibilityHint={props.enabled ? 'Change reminder time' : undefined}
        icon={<Bell color={settings.bell.icon} size={iconSizes.small} />}
        iconBackgroundColor={settings.bell.bg}
        label='Streak reminder'
        subtitle={subtitle}
        subtitleStrong={strong}
        type='toggle'
        value={props.enabled}
        onBodyPress={props.enabled ? openPicker : undefined}
        onToggle={(v) => void props.onToggle(v)}
      />
      <TimePickerSheet
        reminderTime={props.reminderTime}
        visible={sheetOpen}
        onChangeTime={props.onChangeTime}
        onClose={() => setSheetOpen(false)}
      />
      <AndroidTimePickerDialog
        reminderTime={props.reminderTime}
        visible={showTimePicker}
        onChange={onTimeChange}
      />
    </>
  );
}
