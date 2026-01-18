/**
 * ReminderHeader - Header section with toggle for SimpleReminderSection
 */

import { Pressable, Switch, Text, View } from 'react-native';
import { Bell } from 'lucide-react-native';
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
        <View className='mr-3 h-10 w-10 items-center justify-center rounded-xl bg-blue-50'>
          <Bell color='#3b82f6' size={20} />
        </View>
        <View>
          <Text className='text-base font-semibold text-stone-800'>
            Remind me
          </Text>
          <Text className='text-xs text-stone-500'>
            {remindersEnabled ? formatReminderTime(reminderTime) : 'Off'}
          </Text>
        </View>
      </View>
      <Switch
        ios_backgroundColor='#e7e5e4'
        thumbColor='#ffffff'
        trackColor={{ false: '#e7e5e4', true: '#3b82f6' }}
        value={remindersEnabled}
        onValueChange={(val) => {
          triggerSelection();
          onToggle(val);
        }}
      />
    </Pressable>
  );
}
