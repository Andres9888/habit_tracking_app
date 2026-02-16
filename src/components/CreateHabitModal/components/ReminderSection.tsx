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
  const { colors } = useThemeColors();
  const { triggerSelection } = useHapticFeedback();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        marginBottom: 24,
        padding: 16,
      }}
    >
      <View className='flex-row items-center'>
        {/* Bell icon in colored circle */}
        <View
          className='mr-3 h-10 w-10 items-center justify-center rounded-full'
          style={{ backgroundColor: remindersEnabled ? colors.success[50] : colors.gray[50] }}
        >
          <Text style={{ fontSize: 18 }}>🔔</Text>
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
          <Text style={{ color: colors.text.primary, fontSize: 16, fontWeight: '600' }}>Remind me</Text>
          <Text
            className='text-sm'
            style={{ color: remindersEnabled ? colors.primary[500] : colors.text.tertiary }}
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
          ios_backgroundColor={colors.toggle.iosBg}
          thumbColor={colors.toggle.thumb}
          trackColor={{ false: colors.toggle.trackOff, true: colors.toggle.trackOn }}
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
