/** ReminderTimeRow — "Remind me at" with the time as a tappable tinted pill.
 *  The pill carries the affordance on its own, so this row drops the icon tile
 *  and chevron the main list rows use — it sits inside an inset card, not the
 *  settings list proper. */
import { typography, fontWeights } from '@/theme/typography';
import { triggerHaptic } from '@/utils/haptics';
import { Text, View } from 'react-native';
import { AnimatedPressable } from '../../../ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';
import { formatDisplayTime } from '../../timeHelpers';

interface ReminderTimeRowProps {
  reminderTime: string;
  onToggleTimePicker: () => void;
}

export function ReminderTimeRow({
  reminderTime,
  onToggleTimePicker,
}: ReminderTimeRowProps) {
  const { colors: themeColors, settings } = useThemeColors();

  const handlePress = () => {
    void triggerHaptic('selection');
    onToggleTimePicker();
  };

  return (
    <AnimatedPressable
      accessibilityLabel='Remind me at'
      accessibilityRole='button'
      accessibilityValue={{ text: formatDisplayTime(reminderTime) }}
      onPress={handlePress}
    >
      <View className='flex-row items-center px-3.5 py-3' style={{ gap: 12 }}>
        <Text
          className='flex-1'
          style={{
            ...typography.body,
            fontWeight: fontWeights.semibold,
            color: themeColors.text.primary,
          }}
        >
          Remind me at
        </Text>
        <View
          className='rounded-[9px] px-3 py-1.5'
          style={{ backgroundColor: settings.clock.bg }}
        >
          <Text
            style={{
              ...typography.body,
              fontWeight: fontWeights.bold,
              color: settings.clock.icon,
            }}
          >
            {formatDisplayTime(reminderTime)}
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}
