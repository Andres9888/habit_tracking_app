import { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Check } from 'lucide-react-native';
import { TimeOfDaySelector, type TimeOfDay } from './TimeOfDaySelector';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

/**
 * Single-page habit creation form (no wizard steps)
 *
 * UX Philosophy:
 * - All fields visible at once (no navigation between steps)
 * - Minimal required fields (name + time only)
 * - Customization (emoji/color) moved to edit screen
 * - Fast keyboard navigation via tab key
 * - One button click to create
 *
 * Expected Flow:
 * 1. Type name
 * 2. Select time (or use default)
 * 3. Tap "Create Habit" (done!)
 *
 * Total interactions: Type + 1-2 taps (vs wizard's 3-4 taps)
 */

interface CreateHabitFormSingleProps {
  /** Current habit name value */
  habitName: string;
  /** Callback when habit name changes */
  onHabitNameChange: (name: string) => void;
  /** Current time of day selection */
  timeOfDay: TimeOfDay;
  /** Callback when time of day changes */
  onTimeOfDayChange: (time: TimeOfDay) => void;
  /** Callback when form is submitted */
  onSubmit: () => void;
  /** Whether to auto-focus the name input */
  autoFocus?: boolean;
}

const CreateHabitFormSingleComponent = ({
  habitName,
  onHabitNameChange,
  timeOfDay,
  onTimeOfDayChange,
  onSubmit,
  autoFocus = false,
}: CreateHabitFormSingleProps) => {
  const { triggerSuccess } = useHapticFeedback();

  const canSubmit = habitName.trim().length >= 2;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    triggerSuccess();
    onSubmit();
  }, [canSubmit, onSubmit, triggerSuccess]);

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <Text className="text-2xl font-bold text-stone-900 mb-2">
          Create a new habit
        </Text>
        <Text className="text-base text-stone-500 mb-8">
          What do you want to build?
        </Text>

        {/* Habit Name */}
        <View className="mb-6">
          <Text className="text-xs font-medium text-stone-500 mb-2">
            HABIT NAME
          </Text>
          <TextInput
            autoFocus={autoFocus}
            value={habitName}
            onChangeText={onHabitNameChange}
            placeholder="e.g., Read for 20 minutes"
            placeholderTextColor="#A8A29E"
            className="bg-white border-2 border-stone-200 rounded-2xl px-5 py-4 text-lg text-stone-900"
            maxLength={50}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            accessibilityLabel="Habit name"
            accessibilityHint="Enter the name of your new habit"
          />
          <View className="flex-row justify-between mt-2">
            <Text className="text-xs text-stone-400">
              {habitName.length}/50 characters
            </Text>
            {habitName.trim().length > 0 && habitName.trim().length < 2 && (
              <Text className="text-xs text-amber-600">
                At least 2 characters
              </Text>
            )}
          </View>
        </View>

        {/* Time of Day */}
        <View className="mb-6">
          <Text className="text-xs font-medium text-stone-500 mb-2">
            BEST TIME
          </Text>
          <TimeOfDaySelector
            value={timeOfDay}
            onChange={onTimeOfDayChange}
          />
        </View>

        {/* Info Box */}
        <View className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <Text className="text-sm text-emerald-700">
            <Text className="font-semibold">✓ Default settings applied</Text>
            {'\n'}
            • Reminder: {timeOfDay === 'morning' ? '7:00 AM' : timeOfDay === 'afternoon' ? '12:00 PM' : '8:00 PM'}
            {'\n'}
            • Frequency: Daily
            {'\n'}
            • You can customize these in settings later
          </Text>
        </View>

      </ScrollView>

      {/* Footer */}
      <View className="px-6 pb-6 pt-4 border-t border-stone-200 bg-white">
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!canSubmit}
          className="h-14 flex-row items-center justify-center gap-2 rounded-2xl"
          style={{
            backgroundColor: canSubmit ? '#10B981' : '#D6D3D1',
            opacity: canSubmit ? 1 : 0.5,
          }}
          accessibilityRole="button"
          accessibilityLabel="Create habit"
          accessibilityState={{ disabled: !canSubmit }}
        >
          <Check size={20} color="#FFFFFF" strokeWidth={2} />
          <Text className="text-[17px] font-semibold text-white">
            Create Habit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Memoized single-page form component
 */
export const CreateHabitFormSingle = memo(CreateHabitFormSingleComponent);
