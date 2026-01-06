import { Switch, Text, TouchableOpacity, View } from 'react-native';
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

  return (
    <View className='mb-6 rounded-2xl bg-white p-4'>
      <View className='flex-row items-center'>
        {/* Bell icon in colored circle */}
        <View
          className='mr-3 h-10 w-10 items-center justify-center rounded-full'
          style={{ backgroundColor: remindersEnabled ? '#DCFCE7' : '#F5F5F5' }}
        >
          <Text style={{ fontSize: 18 }}>🔔</Text>
        </View>

        {/* Label and time - tappable when enabled */}
        <TouchableOpacity
          className='flex-1'
          disabled={!remindersEnabled}
          activeOpacity={remindersEnabled ? 0.7 : 1}
          accessibilityRole='button'
          accessibilityLabel={`Reminder time: ${formatReminderTime(reminderTime)}. Tap to change.`}
          accessibilityState={{ disabled: !remindersEnabled }}
          onPress={() => {
            if (remindersEnabled) {
              triggerSelection();
              onTimePress();
            }
          }}
        >
          <Text className='text-base font-semibold text-stone-800'>Remind me</Text>
          <Text
            className='text-sm'
            style={{ color: remindersEnabled ? '#22C55E' : '#a8a29e' }}
          >
            {formatReminderTime(reminderTime)}
          </Text>
        </TouchableOpacity>

        {/* Toggle switch on right */}
        <Switch
          ios_backgroundColor='#E5E5E5'
          thumbColor='#FFFFFF'
          trackColor={{ false: '#E5E5E5', true: '#22C55E' }}
          value={remindersEnabled}
          accessibilityRole='switch'
          accessibilityLabel='Toggle reminder'
          accessibilityState={{ checked: remindersEnabled }}
          onValueChange={(val) => {
            triggerSelection();
            onToggle(val);
          }}
        />
      </View>
    </View>
  );
};
