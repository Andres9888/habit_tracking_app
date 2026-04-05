/**
 * CustomTimeButton - Custom time selector button
 */

import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';
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
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityLabel='Choose custom reminder time'
      className='flex-row items-center justify-between rounded-xl px-4 py-3'
      style={{ backgroundColor: colors.background }}
      onPress={() => {
        triggerSelection();
        onPress();
      }}
    >
      <Text className='text-sm font-medium' style={{ color: colors.text.primary }}>Custom time</Text>
      <View className='flex-row items-center'>
        <Text className='mr-2 text-sm font-semibold' style={{ color: colors.status.info }}>
          {formatReminderTime(reminderTime)}
        </Text>
        <ChevronRight color='#a8a29e' size={iconSizes.small} />
      </View>
    </Pressable>
  );
}
