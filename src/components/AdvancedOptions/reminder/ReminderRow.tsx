/**
 * "Daily reminder" — row one of the "More to customize" panel.
 *
 * The Switch is its own touch target inside the head: ON enables reminders and
 * opens the row, OFF disables and closes it (the chosen time is kept). While
 * the reminder is off the head is not pressable. No chevron on this row (per
 * the 2b mock): the Switch plus the time chip already fill the trailing slot.
 */
import { Switch, View } from 'react-native';
import { Bell } from 'lucide-react-native';
import { getNextReminderText } from '@/components/CreateHabitModal/components/NextReminderBadge';
import { TimePickerModal } from '@/components/CreateHabitModal/components/TimePickerModal/TimePickerModal';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { formatReminderTime } from '@/utils/notifications';
import { PanelRow } from '../panel/PanelRow';
import { usePanelTokens } from '../panel/panelTokens';
import { ReminderRowBody } from './ReminderRowBody';
import { useReminderRow } from './useReminderRow';
import type { ReminderRowLayoutProps } from './ReminderRow.types';

const DENIED_HINT = 'Notifications are off for this app';

export function ReminderRow(props: ReminderRowLayoutProps) {
  const { divided, open, onToggleOpen, reminder } = props;
  const { enabled, reminderTime } = reminder;
  const { colors } = useThemeColors();
  const t = usePanelTokens();
  const row = useReminderRow(props);

  const hint = !enabled
    ? 'Off'
    : row.permissionDenied
      ? DENIED_HINT
      : getNextReminderText(reminderTime);

  return (
    <View collapsable={false} ref={reminder.sectionRef}>
      <PanelRow
        accessibilityLabel='Daily reminder'
        divided={divided}
        hint={hint}
        hintColor={row.permissionDenied ? t.hues.why.ink : undefined}
        hue='reminder'
        icon={
          <Bell
            color={t.hues.reminder.ink}
            size={iconSizes.small}
            strokeWidth={2}
          />
        }
        open={open}
        showChevron={false}
        title='Daily reminder'
        trailing={
          <Switch
            accessibilityLabel={enabled ? 'Disable reminder' : 'Enable reminder'}
            accessibilityRole='switch'
            ios_backgroundColor={colors.border}
            testID='reminder-toggle'
            thumbColor={colors.text.inverse}
            trackColor={{ false: colors.border, true: colors.primary[600] }}
            value={enabled}
            onValueChange={row.handleSwitch}
          />
        }
        value={
          enabled && !open
            ? { label: formatReminderTime(reminderTime), set: true }
            : null
        }
        onToggle={enabled ? onToggleOpen : undefined}
      >
        {enabled ? (
          <ReminderRowBody reminderTime={reminderTime} row={row} />
        ) : null}
      </PanelRow>
      <TimePickerModal
        initialTime={reminderTime}
        visible={row.showTimePicker}
        onCancel={() => row.setShowTimePicker(false)}
        onConfirm={row.handleCustomTimeConfirm}
      />
    </View>
  );
}
