import { ChevronRight, Clock } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { triggerHaptic } from '@/utils/haptics';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { AnimatedPressable } from '../../../ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';
import { useValueFlash } from '../../SettingsRow/SettingsRow.hooks';
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
  const displayTime = formatDisplayTime(reminderTime);
  const flashStyle = useValueFlash(displayTime);

  const handlePress = () => {
    void triggerHaptic('selection');
    onToggleTimePicker();
  };

  return (
    <AnimatedPressable
      accessibilityLabel='Reminder time'
      accessibilityRole='button'
      onPress={handlePress}
    >
      <View className='flex-row items-center px-3.5 py-3' style={{ gap: 12 }}>
        <View
          className='h-10 w-10 items-center justify-center rounded-xl'
          style={{ backgroundColor: settings.clock.bg }}
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
        <Animated.Text
          style={[
            {
              ...typography.body,
              fontWeight: fontWeights.medium,
              color: themeColors.text.secondary,
              borderRadius: 6,
              paddingHorizontal: 4,
            },
            flashStyle,
          ]}
        >
          {displayTime}
        </Animated.Text>
        <ChevronRight
          color={themeColors.text.secondary}
          size={iconSizes.small}
          strokeWidth={2}
        />
      </View>
    </AnimatedPressable>
  );
}
