/**
 * ReminderHeader - Header section with toggle for SimpleReminderSection
 */

import { Pressable, Switch, Text, View } from 'react-native';
import { Bell } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { useThemeColors } from '@/theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';
import { formatReminderTime } from '../../../../utils/notifications';

interface ReminderHeaderProps {
  remindersEnabled: boolean;
  reminderTime: Date;
  onToggle: (enabled: boolean) => void;
  triggerSelection: () => void;
}

export function ReminderHeader({
  remindersEnabled,
  reminderTime,
  onToggle,
  triggerSelection,
}: ReminderHeaderProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <Pressable
      accessibilityLabel={
        remindersEnabled ? 'Disable reminders' : 'Enable reminders'
      }
      accessibilityRole='switch'
      className='flex-row items-center justify-between'
      onPress={() => {
        triggerSelection();
        onToggle(!remindersEnabled);
      }}
    >
      <View className='flex-row items-center'>
        <View className='mr-3 h-10 w-10 items-center justify-center rounded-xl' style={{ backgroundColor: themeColors.status.infoLight }}>
          <Bell color={colors.secondary[500]} size={iconSizes.medium} />
        </View>
        <View>
          <Text className='text-base font-semibold' style={{ color: themeColors.text.primary }}>
            Remind me
          </Text>
          <Text className='text-xs' style={{ color: themeColors.text.secondary }}>
            {remindersEnabled ? formatReminderTime(reminderTime) : 'Off'}
          </Text>
        </View>
      </View>
      <Switch
        ios_backgroundColor={colors.border}
        thumbColor={themeColors.text.inverse}
        trackColor={{ false: colors.border, true: colors.secondary[500] }}
        value={remindersEnabled}
        onValueChange={(val) => {
          triggerSelection();
          onToggle(val);
        }}
      />
    </Pressable>
  );
}
