import { useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Pressable,
  Text,
  View,
} from 'react-native';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import STRINGS from '../../../constants/strings';

/**
 * Reminder options for the V8 unified reminder selector
 */
export type ReminderOption = 'none' | 'morning' | 'midday' | 'evening';

export interface ReminderOptionInfo {
  id: ReminderOption;
  emoji: string;
  label: string;
  time: string | null;
  hour: number | null;
  minute: number | null;
}

/**
 * V8 Reminder Options - 4 unified options
 * - None: No reminder (default)
 * - Morning: 7:00 AM
 * - Midday: 12:00 PM
 * - Evening: 8:00 PM
 */
export const REMINDER_OPTIONS: Record<ReminderOption, ReminderOptionInfo> = {
  evening: {
    emoji: '🌙',
    hour: 20,
    id: 'evening',
    label: 'Evening',
    minute: 0,
    time: '8:00 PM',
  },
  midday: {
    emoji: '☀️',
    hour: 12,
    id: 'midday',
    label: 'Midday',
    minute: 0,
    time: '12:00 PM',
  },
  morning: {
    emoji: '🌅',
    hour: 7,
    id: 'morning',
    label: 'Morning',
    minute: 0,
    time: '7:00 AM',
  },
  none: {
    emoji: '🔕',
    hour: null,
    id: 'none',
    label: 'None',
    minute: null,
    time: null,
  },
} as const;

export const REMINDER_OPTION_ORDER: ReminderOption[] = [
  'none',
  'morning',
  'midday',
  'evening',
];

/**
 * Creates a Date object for the reminder time based on the selected option
 * Returns null for 'none'
 */
export const getReminderTimeForOption = (
  option: ReminderOption
): Date | null => {
  const info = REMINDER_OPTIONS[option];
  if (info.hour === null || info.minute === null) {
    return null;
  }
  const date = new Date();
  date.setHours(info.hour, info.minute, 0, 0);
  return date;
};

interface ReminderOptionButtonProps {
  option: ReminderOption;
  isSelected: boolean;
  onPress: () => void;
}

const ReminderOptionButton = ({
  option,
  isSelected,
  onPress,
}: ReminderOptionButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const optionInfo = REMINDER_OPTIONS[option];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      friction: 10,
      tension: 300,
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      friction: 10,
      tension: 300,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const accessibilityLabel = optionInfo.time
    ? `${optionInfo.label} at ${optionInfo.time}`
    : `${optionInfo.label}, no reminder`;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      className='flex-1'
      testID={`reminder-option-${option}`}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className='items-center justify-center rounded-xl px-2 py-3'
        style={[
          {
            backgroundColor: isSelected ? '#ECFDF5' : '#fafaf9',
            borderColor: isSelected ? '#10B981' : '#e7e5e4', // #e7e5e4 = stone-200
            borderWidth: isSelected ? 2 : 1,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text className='mb-0.5 text-lg'>{optionInfo.emoji}</Text>
        <Text
          className='text-xs font-medium'
          style={{ color: isSelected ? '#047857' : '#78716c' }}
        >
          {optionInfo.label}
        </Text>
        {optionInfo.time && (
          <Text
            className='text-[10px]'
            style={{ color: isSelected ? '#047857' : '#a8a29e' }}
          >
            {optionInfo.time}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
};

interface ReminderSelectorProps {
  selectedOption: ReminderOption;
  onSelectOption: (option: ReminderOption) => void;
}

/**
 * V8 Unified Reminder Selector
 *
 * 4-option grid for selecting reminder time:
 * - None (🔕): No reminder
 * - Morning (🌅): 7:00 AM
 * - Midday (☀️): 12:00 PM
 * - Evening (🌙): 8:00 PM
 *
 * Replaces the separate TimeOfDaySelector and ReminderSection components
 * from the V5 design for a simpler, unified UX.
 */
export const ReminderSelector = ({
  selectedOption,
  onSelectOption,
}: ReminderSelectorProps) => {
  const { triggerSelection } = useHapticFeedback();

  const handleSelectOption = (option: ReminderOption) => {
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
  };

  return (
    <View className='mb-6 rounded-2xl bg-white p-4' testID='reminder-selector'>
      <Text
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
            onPress={() => handleSelectOption(option)}
          />
        ))}
      </View>
    </View>
  );
};

export default ReminderSelector;
