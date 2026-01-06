import { memo, useCallback, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Pressable,
  Text,
  View,
} from 'react-native';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
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
  reduceMotion: boolean;
}

/**
 * V11 Task 8: Respects reduced motion preference
 */
const ReminderOptionButtonComponent = ({
  option,
  isSelected,
  onPress,
  reduceMotion,
}: ReminderOptionButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const optionInfo = REMINDER_OPTIONS[option];

  const handlePressIn = useCallback(() => {
    if (reduceMotion) return;
    Animated.spring(scaleAnim, {
      friction: 10,
      tension: 300,
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, reduceMotion]);

  const handlePressOut = useCallback(() => {
    if (reduceMotion) {
      // No animation in reduced motion mode
      scaleAnim.setValue(1);
      slideAnim.setValue(0);
      return;
    }
    // V11 Spec: Slide up animation (translateY -2px) with spring
    // Sequence: quick slide up, then spring back to normal, then scale back
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: -2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Scale back to normal simultaneously
    Animated.spring(scaleAnim, {
      friction: 10,
      tension: 300,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, slideAnim, reduceMotion]);

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
            // V11: Combined transform for scale (press) and translateY (slide up)
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
            // V11: Subtle shadow increase on selection
            shadowColor: '#000',
            shadowOffset: { width: 0, height: isSelected ? 2 : 0 },
            shadowOpacity: isSelected ? 0.1 : 0,
            shadowRadius: isSelected ? 3 : 0,
            elevation: isSelected ? 2 : 0, // Android shadow
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

const ReminderOptionButton = memo(ReminderOptionButtonComponent);

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
 *
 * V11 Task 8: Reduced motion support
 */
const ReminderSelectorComponent = ({
  selectedOption,
  onSelectOption,
}: ReminderSelectorProps) => {
  const { triggerSelection } = useHapticFeedback();
  const reduceMotion = useReduceMotion(); // V11 Task 8: Reduced motion support

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
            onPress={() => handleSelectOption(option)}
            reduceMotion={reduceMotion}
          />
        ))}
      </View>
    </View>
  );
};

export const ReminderSelector = memo(ReminderSelectorComponent);

export default ReminderSelector;
