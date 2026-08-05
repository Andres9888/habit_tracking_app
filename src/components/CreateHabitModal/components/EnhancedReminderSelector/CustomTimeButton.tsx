/**
 * CustomTimeButton - Button to pick a custom reminder time
 */

import { memo } from 'react';
import { Pressable, Text } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';

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
  const { colors } = useThemeColors();
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
          <Clock color={colors.status.success} size={iconSizes.small} />
          <Text className='ml-1.5 text-sm font-medium' style={{ color: colors.status.success }}>
            {customTimeLabel}
          </Text>
          <Text className='ml-1 text-sm' style={{ color: colors.status.success }}>(tap to change)</Text>
        </>
      ) : (
        <>
          <Text className='text-sm font-medium' style={{ color: colors.status.success }}>
            or pick a custom time
          </Text>
          <Text className='ml-1' style={{ color: colors.status.success }}>→</Text>
        </>
      )}
    </Pressable>
  );
}

export const CustomTimeButton = memo(CustomTimeButtonComponent);
