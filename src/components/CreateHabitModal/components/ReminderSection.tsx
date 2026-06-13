import { Switch, Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { formatReminderTime } from '../../../utils/notifications';

interface ReminderSectionProps {
  remindersEnabled: boolean;
  onToggle: (value: boolean) => void;
  reminderTime: Date;
  onTimePress: () => void;
}

/**
 * Compact reminder section for V5 create habit redesign.
 * Single row layout with bell icon, label/time, and toggle.
 * Quick time buttons removed - time is now set by TimeOfDaySelector.
 */
export const ReminderSection = ({
  remindersEnabled,
  onToggle,
  reminderTime,
  onTimePress,
}: ReminderSectionProps) => {
  const { triggerSelection } = useHapticFeedback();
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='mb-6 rounded-2xl bg-white p-4'>
      <View className='flex-row items-center'>
        {/* Bell icon in colored circle */}
        <View
          className='mr-3 h-10 w-10 items-center justify-center rounded-full'
          style={{ backgroundColor: remindersEnabled ? '#DCFCE7' : '#F5F5F5' }}
        >
          <Text style={{ fontSize: 17 }}>🔔</Text>
        </View>

        {/* Label and time - tappable when enabled */}
        <AnimatedPressable
          accessibilityHint='Tap to change reminder time'
          accessibilityLabel={`Reminder time: ${formatReminderTime(reminderTime)}. Tap to change.`}
          accessibilityRole='button'
          accessibilityState={{ disabled: !remindersEnabled }}
          className='flex-1'
          disableAnimation={!remindersEnabled}
          disabled={!remindersEnabled}
          onPress={() => {
            if (remindersEnabled) {
              triggerSelection();
              onTimePress();
            }
          }}
        >
          <Text className='text-base font-semibold' style={{ color: themeColors.text.primary }}>Remind me</Text>
          <Text
            className='text-sm'
            style={{ color: remindersEnabled ? themeColors.status.success : '#a8a29e' }}
          >
            {formatReminderTime(reminderTime)}
          </Text>
        </AnimatedPressable>

        {/* Toggle switch on right */}
        <Switch
          accessibilityHint='Toggle habit reminder on or off'
          accessibilityLabel='Toggle reminder'
          accessibilityRole='switch'
          accessibilityState={{ checked: remindersEnabled }}
          ios_backgroundColor='#E5E5E5'
          thumbColor={themeColors.text.inverse}
          trackColor={{ false: '#E5E5E5', true: themeColors.status.success }}
          value={remindersEnabled}
          onValueChange={(val) => {
            triggerSelection();
            onToggle(val);
          }}
        />
      </View>
    </View>
  );
};
