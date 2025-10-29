import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { formatReminderTime } from '../../../utils/notifications';

interface ReminderSectionProps {
  remindersEnabled: boolean;
  onToggle: (value: boolean) => void;
  reminderTime: Date;
  onTimePress: () => void;
  reminderSound: string;
}

export const ReminderSection = ({
  remindersEnabled,
  onToggle,
  reminderTime,
  onTimePress,
  reminderSound,
}: ReminderSectionProps) => (
  <View className='mb-6 rounded-2xl bg-white p-4'>
    <View className='mb-4 flex-row items-center justify-between'>
      <Text className='text-base font-semibold text-[#1a1a1a]'>Reminders</Text>
      <Switch
        ios_backgroundColor='#E5E5E5'
        thumbColor='#FFFFFF'
        trackColor={{ false: '#E5E5E5', true: '#3B82F6' }}
        value={remindersEnabled}
        onValueChange={onToggle}
      />
    </View>
    {remindersEnabled && (
      <>
        <TouchableOpacity
          className='mb-3 flex-row items-center justify-between rounded-xl bg-[#F5F5F5] px-3 py-3'
          onPress={onTimePress}
        >
          <Text className='text-base font-medium text-[#1a1a1a]'>Reminder Time</Text>
          <Text className='text-base font-semibold text-[#3B82F6]'>
            {formatReminderTime(reminderTime)}
          </Text>
        </TouchableOpacity>
        <View className='flex-row items-center justify-between rounded-xl bg-[#F5F5F5] px-3 py-3'>
          <Text className='text-base font-medium text-[#1a1a1a]'>Sound</Text>
          <Text className='text-base font-semibold text-[#3B82F6]'>{reminderSound}</Text>
        </View>
      </>
    )}
  </View>
);
