/**
 * SimpleReminderSection Component
 *
 * A simplified reminder configuration section with quick preset buttons
 * and a custom time selector.
 */

import { View } from 'react-native';

import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { QuickTimeButton } from './QuickTimeButton';
import { ReminderHeader } from './ReminderHeader';
import { CustomTimeButton } from './CustomTimeButton';
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
      <ReminderHeader
        remindersEnabled={remindersEnabled}
        reminderTime={reminderTime}
        triggerSelection={triggerSelection}
        onToggle={onToggle}
      />
      {remindersEnabled ? <View className='mt-4'>
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
          <CustomTimeButton
            reminderTime={reminderTime}
            triggerSelection={triggerSelection}
            onPress={onTimePress}
          />
        </View> : null}
    </View>
  );
};

export default SimpleReminderSection;
