import { ChevronRight, Clock } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { highContrastColors } from '@/theme/highContrastColors';
import { Text, View } from 'react-native';
import { AnimatedPressable } from '../../../ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';
import { formatDisplayTime } from '../../timeHelpers';

interface ReminderTimeRowProps {
  highContrastMode: boolean;
  reminderTime: string;
  onToggleTimePicker: () => void;
}

export function ReminderTimeRow({
  highContrastMode,
  reminderTime,
  onToggleTimePicker,
}: ReminderTimeRowProps) {
  const { colors: themeColors, settings } = useThemeColors();

  return (
    <AnimatedPressable
      accessibilityLabel='Reminder time'
      accessibilityRole='button'
      onPress={onToggleTimePicker}
    >
      <View className='flex-row items-center px-3.5 py-3' style={{ gap: 12 }}>
        <View
          className='h-10 w-10 items-center justify-center rounded-xl'
          style={{
            backgroundColor: settings.clock.bg,
            borderColor: highContrastMode
              ? highContrastColors.accent
              : 'transparent',
            borderWidth: highContrastMode ? 2 : 0,
          }}
        >
          <Clock color={settings.clock.icon} size={iconSizes.small} />
        </View>
        <Text
          className='flex-1'
          style={{
            ...typography.body,
            fontWeight: fontWeights.semibold,
            color: themeColors.text.primary,
          }}
        >
          Reminder time
        </Text>
        <Text
          style={{
            ...typography.body,
            fontWeight: fontWeights.medium,
            color: themeColors.text.secondary,
          }}
        >
          {formatDisplayTime(reminderTime)}
        </Text>
        <ChevronRight
          color={themeColors.text.secondary}
          size={iconSizes.small}
          strokeWidth={2}
        />
      </View>
    </AnimatedPressable>
  );
}
