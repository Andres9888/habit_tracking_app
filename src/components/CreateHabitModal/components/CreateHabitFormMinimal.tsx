import { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Check } from 'lucide-react-native';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

/**
 * Minimal habit creation form - Name only required
 *
 * UX Philosophy:
 * - ONLY habit name is required
 * - Everything else uses smart defaults:
 *   • Time: Afternoon (most common)
 *   • Reminder: Auto-enabled at 12:00 PM
 *   • Frequency: Daily
 *   • Emoji: Auto-assigned based on name keywords
 *   • Color: Random from palette
 * - Customization happens AFTER creation (edit screen)
 *
 * Expected Flow:
 * 1. Type name
 * 2. Tap "Create Habit" (or press Enter)
 * 3. Done!
 *
 * Total interactions: Type + 1 tap (or just Enter key)
 * Time to create: ~10 seconds
 */

interface CreateHabitFormMinimalProps {
  /** Current habit name value */
  habitName: string;
  /** Callback when habit name changes */
  onHabitNameChange: (name: string) => void;
  /** Callback when form is submitted */
  onSubmit: () => void;
  /** Whether to auto-focus the name input */
  autoFocus?: boolean;
}

const CreateHabitFormMinimalComponent = ({
  habitName,
  onHabitNameChange,
  onSubmit,
  autoFocus = false,
}: CreateHabitFormMinimalProps) => {
  const { triggerSuccess } = useHapticFeedback();

  const canSubmit = habitName.trim().length >= 2;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    triggerSuccess();
    onSubmit();
  }, [canSubmit, onSubmit, triggerSuccess]);

  return (
    <View className="flex-1 px-6 justify-center">
      {/* Centered Content */}
      <View style={{ marginBottom: 120 }}>
        {/* Title */}
        <Text className="text-3xl font-bold text-stone-900 mb-3 text-center">
          What habit do you{'\n'}want to build?
        </Text>
        <Text className="text-base text-stone-500 mb-10 text-center">
          We'll handle the rest with smart defaults
        </Text>

        {/* Habit Name Input */}
        <TextInput
          autoFocus={autoFocus}
          value={habitName}
          onChangeText={onHabitNameChange}
          placeholder="e.g., Read for 20 minutes"
          placeholderTextColor="#A8A29E"
          className="bg-white border-2 border-stone-200 rounded-2xl px-6 py-5 text-xl text-stone-900 text-center"
          maxLength={50}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          accessibilityLabel="Habit name"
          accessibilityHint="Enter the name of your new habit"
          style={{
            fontSize: 20,
            fontWeight: '500',
          }}
        />

        {/* Character Counter */}
        <View className="flex-row justify-between mt-3 px-2">
          <Text className="text-xs text-stone-400">
            {habitName.length}/50
          </Text>
          {habitName.trim().length > 0 && habitName.trim().length < 2 && (
            <Text className="text-xs text-amber-600 font-medium">
              2 chars minimum
            </Text>
          )}
        </View>

        {/* Smart Defaults Info */}
        {habitName.trim().length >= 2 && (
          <View className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <Text className="text-sm text-emerald-700 text-center leading-6">
              <Text className="font-semibold">✓ Ready to create</Text>
              {'\n'}
              Afternoon reminder • Daily • Auto-styled
              {'\n'}
              <Text className="text-xs text-emerald-600">
                (Customize anytime in settings)
              </Text>
            </Text>
          </View>
        )}
      </View>

      {/* Fixed Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-white">
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!canSubmit}
          className="h-14 flex-row items-center justify-center gap-2 rounded-2xl shadow-lg"
          style={{
            backgroundColor: canSubmit ? '#10B981' : '#D6D3D1',
            opacity: canSubmit ? 1 : 0.5,
            shadowColor: canSubmit ? '#10B981' : '#000',
            shadowOffset: { width: 0, height: canSubmit ? 4 : 2 },
            shadowOpacity: canSubmit ? 0.3 : 0.1,
            shadowRadius: canSubmit ? 8 : 4,
            elevation: canSubmit ? 4 : 2,
          }}
          accessibilityRole="button"
          accessibilityLabel="Create habit"
          accessibilityState={{ disabled: !canSubmit }}
        >
          <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
          <Text className="text-[17px] font-semibold text-white">
            Create Habit
          </Text>
        </TouchableOpacity>

        {/* Keyboard Shortcut Hint */}
        {canSubmit && (
          <Text className="text-xs text-stone-400 text-center mt-3">
            or press Enter ↵
          </Text>
        )}
      </View>
    </View>
  );
};

/**
 * Memoized minimal form component
 */
export const CreateHabitFormMinimal = memo(CreateHabitFormMinimalComponent);
