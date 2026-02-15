/**
 * CustomTimeButton - Button to pick a custom reminder time
 */

import { Pressable, Text } from 'react-native';
import { memo } from 'react';

import { Clock } from 'lucide-react-native';

interface CustomTimeButtonProps {
  isCustomTime: boolean;
  customTimeLabel: string;
  onPress: () => void;
}

function CustomTimeButtonComponent({
  isCustomTime,
  customTimeLabel,
  onPress,
}: CustomTimeButtonProps) {
  const accessibilityLabel = isCustomTime
    ? `Custom time set to ${customTimeLabel}. Double tap to change.`
    : 'Set a custom reminder time';

  return (
    <Pressable
      accessibilityHint='Opens time picker'
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      className='mb-4 flex-row items-center justify-center py-3'
      testID='custom-time-button'
      onPress={onPress}
    >
      {isCustomTime ? (
        <>
          <Clock color='#059669' size={16} />
          <Text className='ml-1.5 text-sm font-medium text-emerald-600'>
            {customTimeLabel}
          </Text>
          <Text className='ml-1 text-sm text-emerald-600'>(tap to change)</Text>
        </>
      ) : (
        <>
          <Text className='text-sm font-medium text-emerald-600'>
            Pick a different time
          </Text>
          <Text className='ml-1 text-emerald-600'>→</Text>
        </>
      )}
    </Pressable>
  );
}

export const CustomTimeButton = memo(CustomTimeButtonComponent);
