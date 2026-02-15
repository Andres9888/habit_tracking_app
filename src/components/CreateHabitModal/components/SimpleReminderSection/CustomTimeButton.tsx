/**
 * CustomTimeButton - Custom time selector button
 */

import { Pressable, Text, View } from 'react-native';

import { ChevronRight } from 'lucide-react-native';

import { formatReminderTime } from '../../../../utils/notifications';

interface CustomTimeButtonProps {
  reminderTime: Date;
  onPress: () => void;
  triggerSelection: () => void;
}

export function CustomTimeButton({
  reminderTime,
  onPress,
  triggerSelection,
}: CustomTimeButtonProps) {
  return (
    <Pressable
      accessibilityLabel='Choose custom reminder time'
      className='flex-row items-center justify-between rounded-xl bg-stone-50 px-4 py-3'
      onPress={() => {
        triggerSelection();
        onPress();
      }}
    >
      <Text className='text-sm font-medium text-stone-700'>Custom time</Text>
      <View className='flex-row items-center'>
        <Text className='mr-2 text-sm font-semibold text-blue-500'>
          {formatReminderTime(reminderTime)}
        </Text>
        <ChevronRight color='#a8a29e' size={16} />
      </View>
    </Pressable>
  );
}
