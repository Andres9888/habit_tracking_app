/**
 * V8 Unified Reminder Selector
 *
 * 4-option grid for selecting reminder time:
 * - None: No reminder
 * - Morning: 7:00 AM
 * - Midday: 12:00 PM
 * - Evening: 8:00 PM
 *
 * V11 Task 8: Reduced motion support
 */

import { AccessibilityInfo, Text, View } from 'react-native';
import { memo, useCallback } from 'react';

import type { ReminderOption, ReminderSelectorProps } from './types';
import STRINGS from '../../../../constants/strings';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { REMINDER_OPTIONS, REMINDER_OPTION_ORDER } from './constants';
import { ReminderOptionButton } from './ReminderOptionButton';
import { useReduceMotion } from '../../../../hooks/useReduceMotion';

function ReminderSelectorComponent({
  selectedOption,
  onSelectOption,
}: ReminderSelectorProps) {
  const { triggerSelection } = useHapticFeedback();
  const reduceMotion = useReduceMotion();

  const handleSelectOption = useCallback(
    (option: ReminderOption) => {
      triggerSelection();
      onSelectOption(option);

      // Announce selection for screen readers
      const optionInfo = REMINDER_OPTIONS[option];
      const announcement = optionInfo.time
        ? STRINGS.CREATE_HABIT.reminderAnnouncementWithTime(
            optionInfo.label,
            optionInfo.time
          )
        : STRINGS.CREATE_HABIT.reminderAnnouncementDisabled;
      AccessibilityInfo.announceForAccessibility(announcement);
    },
    [onSelectOption, triggerSelection]
  );

  return (
    <View className='mb-6 rounded-2xl bg-white p-4' testID='reminder-selector'>
      <Text
        accessibilityRole='text'
        className='mb-3 text-[13px] font-semibold uppercase text-stone-500'
        style={{ letterSpacing: 0.5 }}
      >
        {STRINGS.CREATE_HABIT.remindersLabel}
      </Text>
      <View className='flex-row gap-2'>
        {REMINDER_OPTION_ORDER.map((option) => (
          <ReminderOptionButton
            key={option}
            isSelected={selectedOption === option}
            option={option}
            reduceMotion={reduceMotion}
            onPress={() => handleSelectOption(option)}
          />
        ))}
      </View>
    </View>
  );
}

export const ReminderSelector = memo(ReminderSelectorComponent);

export default ReminderSelector;
