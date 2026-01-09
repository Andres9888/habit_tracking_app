/**
 * SimpleReminderSection Component
 *
 * A simplified reminder configuration section with quick preset buttons
 * and a custom time selector.
 */

import { Pressable, Switch, Text, View } from 'react-native';
import { Bell, ChevronRight } from 'lucide-react-native';

import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { formatReminderTime } from '../../../../utils/notifications';
import { QuickTimeButton } from './QuickTimeButton';
import type { SimpleReminderSectionProps } from './types';
import { buildQuickPresets, isTimeMatch } from './utils';

export const SimpleReminderSection = ({
  onQuickTimeSelect,
  onTimePress,
  onToggle,
  reminderTime,
  remindersEnabled,
  disabled = false,
}: SimpleReminderSectionProps) => {
  const { triggerSelection } = useHapticFeedback();
  const presets = buildQuickPresets();

  return (
    <View
      className='mb-6 rounded-2xl bg-white p-4'
      pointerEvents={disabled ? 'none' : 'auto'}
      style={{ opacity: disabled ? 0.4 : 1 }}
    >
      {/* Header with toggle */}
      <Pressable
        accessibilityLabel={
          remindersEnabled ? 'Disable reminders' : 'Enable reminders'
        }
        accessibilityRole='switch'
        className='flex-row items-center justify-between'
        onPress={() => {
          triggerSelection();
          onToggle(!remindersEnabled);
        }}
      >
        <View className='flex-row items-center'>
          <View className='mr-3 h-10 w-10 items-center justify-center rounded-xl bg-blue-50'>
            <Bell color='#3b82f6' size={20} />
          </View>
          <View>
            <Text className='text-base font-semibold text-stone-800'>
              Remind me
            </Text>
            <Text className='text-xs text-stone-500'>
              {remindersEnabled ? formatReminderTime(reminderTime) : 'Off'}
            </Text>
          </View>
        </View>
        <Switch
          ios_backgroundColor='#e7e5e4'
          thumbColor='#ffffff'
          trackColor={{ false: '#e7e5e4', true: '#3b82f6' }}
          value={remindersEnabled}
          onValueChange={(val) => {
            triggerSelection();
            onToggle(val);
          }}
        />
      </Pressable>

      {/* Quick time buttons */}
      {remindersEnabled && (
        <View className='mt-4'>
          <View className='mb-3 flex-row gap-2'>
            {presets.map((preset) => (
              <QuickTimeButton
                key={preset.label}
                isSelected={isTimeMatch(
                  reminderTime,
                  preset.date.getHours(),
                  preset.date.getMinutes()
                )}
                label={preset.label}
                time={preset.time}
                onPress={() => onQuickTimeSelect(preset.date)}
              />
            ))}
          </View>

          {/* Custom time button */}
          <Pressable
            accessibilityLabel='Choose custom reminder time'
            className='flex-row items-center justify-between rounded-xl bg-stone-50 px-4 py-3'
            onPress={() => {
              triggerSelection();
              onTimePress();
            }}
          >
            <Text className='text-sm font-medium text-stone-700'>
              Custom time
            </Text>
            <View className='flex-row items-center'>
              <Text className='mr-2 text-sm font-semibold text-blue-500'>
                {formatReminderTime(reminderTime)}
              </Text>
              <ChevronRight color='#a8a29e' size={16} />
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default SimpleReminderSection;
