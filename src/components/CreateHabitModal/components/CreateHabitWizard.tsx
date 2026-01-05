import { memo, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { ArrowRight, ChevronLeft } from 'lucide-react-native';
import { TimeOfDaySelector, type TimeOfDay } from './TimeOfDaySelector';
import { EmojiPicker } from './EmojiPicker';
import { ColorPickerSection } from './ColorPickerSection';
import { HABIT_COLORS } from '../constants';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

/**
 * Streamlined 3-step wizard for habit creation
 *
 * UX Philosophy:
 * - Step 1: Only habit name (one decision, quick win)
 * - Step 2: When? (3 big buttons, auto-sets reminder)
 * - Step 3: Visual identity (optional, skippable)
 *
 * This reduces:
 * - Decision fatigue (one choice per screen)
 * - Creation abandonment (clear progress)
 * - Fear of "getting it wrong" (can skip customization)
 */

interface CreateHabitWizardProps {
  /** Current habit name value */
  habitName: string;
  /** Callback when habit name changes */
  onHabitNameChange: (name: string) => void;
  /** Current selected emoji */
  selectedEmoji: string | null;
  /** Callback when emoji is selected */
  onEmojiSelect: (emoji: string | null) => void;
  /** Current selected color */
  selectedColor: string;
  /** Callback when color is selected */
  onColorSelect: (color: string) => void;
  /** Current time of day selection */
  timeOfDay: TimeOfDay;
  /** Callback when time of day changes */
  onTimeOfDayChange: (time: TimeOfDay) => void;
  /** Callback when wizard is completed */
  onComplete: () => void;
  /** Whether to auto-focus the name input */
  autoFocus?: boolean;
  /** Callback to open custom color picker */
  onCustomColorPress: () => void;
}

type WizardStep = 'name' | 'when' | 'customize';

const CreateHabitWizardComponent = ({
  habitName,
  onHabitNameChange,
  selectedEmoji,
  onEmojiSelect,
  selectedColor,
  onColorSelect,
  timeOfDay,
  onTimeOfDayChange,
  onComplete,
  autoFocus = false,
  onCustomColorPress,
}: CreateHabitWizardProps) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('name');
  const { triggerSelection, triggerSuccess } = useHapticFeedback();

  const canProceedFromName = habitName.trim().length >= 2;

  const handleNext = useCallback(() => {
    triggerSelection();

    if (currentStep === 'name') {
      setCurrentStep('when');
    } else if (currentStep === 'when') {
      setCurrentStep('customize');
    }
  }, [currentStep, triggerSelection]);

  const handleBack = useCallback(() => {
    triggerSelection();

    if (currentStep === 'customize') {
      setCurrentStep('when');
    } else if (currentStep === 'when') {
      setCurrentStep('name');
    }
  }, [currentStep, triggerSelection]);

  const handleSkipCustomization = useCallback(() => {
    triggerSuccess();
    onComplete();
  }, [onComplete, triggerSuccess]);

  const handleFinish = useCallback(() => {
    triggerSuccess();
    onComplete();
  }, [onComplete, triggerSuccess]);

  // Progress indicator
  const stepNumber = currentStep === 'name' ? 1 : currentStep === 'when' ? 2 : 3;
  const progress = (stepNumber / 3) * 100;

  return (
    <View className="flex-1">
      {/* Progress Bar */}
      <View className="px-6 pt-4 pb-2">
        <View className="h-1 bg-stone-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-emerald-500"
            style={{ width: `${progress}%` }}
          />
        </View>
        <Text className="text-xs text-stone-400 mt-2">
          Step {stepNumber} of 3
        </Text>
      </View>

      {/* Back Button */}
      {currentStep !== 'name' && (
        <TouchableOpacity
          onPress={handleBack}
          className="flex-row items-center gap-1 px-6 py-2"
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ChevronLeft size={16} color="#78716C" />
          <Text className="text-sm text-stone-600">Back</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Name Only */}
        {currentStep === 'name' && (
          <Animated.View
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft.duration(300)}
            className="flex-1"
          >
            <View className="mt-6">
              <Text className="text-2xl font-bold text-stone-900 mb-2">
                What habit do you want to build?
              </Text>
              <Text className="text-base text-stone-500 mb-6">
                Keep it simple and specific
              </Text>

              <TextInput
                autoFocus={autoFocus}
                value={habitName}
                onChangeText={onHabitNameChange}
                placeholder="e.g., Read for 20 minutes"
                placeholderTextColor="#A8A29E"
                className="bg-white border-2 border-stone-200 rounded-2xl px-5 py-4 text-lg text-stone-900"
                maxLength={50}
                returnKeyType="next"
                onSubmitEditing={() => canProceedFromName && handleNext()}
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
          </Animated.View>
        )}

        {/* Step 2: When? */}
        {currentStep === 'when' && (
          <Animated.View
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft.duration(300)}
            className="flex-1"
          >
            <View className="mt-6">
              <Text className="text-2xl font-bold text-stone-900 mb-2">
                When will you do this?
              </Text>
              <Text className="text-base text-stone-500 mb-6">
                Choose the time that works best for you
              </Text>

              <TimeOfDaySelector
                value={timeOfDay}
                onChange={onTimeOfDayChange}
              />

              <View className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <Text className="text-sm text-emerald-700">
                  <Text className="font-semibold">✓ Reminder set </Text>
                  We'll send you a friendly nudge during your {timeOfDay} time
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Step 3: Customize (Optional) */}
        {currentStep === 'customize' && (
          <Animated.View
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft.duration(300)}
            className="flex-1"
          >
            <View className="mt-6">
              <Text className="text-2xl font-bold text-stone-900 mb-2">
                Pick your vibe
              </Text>
              <Text className="text-base text-stone-500 mb-6">
                Make it yours (or skip this step!)
              </Text>

              {/* Emoji Picker */}
              <EmojiPicker
                habitName={habitName}
                selectedEmoji={selectedEmoji}
                onSelect={onEmojiSelect}
              />

              {/* Color Picker */}
              <ColorPickerSection
                colors={HABIT_COLORS}
                selectedColor={selectedColor}
                onCustomPress={onCustomColorPress}
                onSelectColor={onColorSelect}
              />
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Action Footer */}
      <View className="px-6 pb-6 pt-4 border-t border-stone-200 bg-white">
        {currentStep === 'name' && (
          <TouchableOpacity
            onPress={handleNext}
            disabled={!canProceedFromName}
            className="h-14 flex-row items-center justify-center gap-2 rounded-2xl"
            style={{
              backgroundColor: canProceedFromName ? '#10B981' : '#D6D3D1',
              opacity: canProceedFromName ? 1 : 0.5,
            }}
            accessibilityRole="button"
            accessibilityLabel="Continue to next step"
            accessibilityState={{ disabled: !canProceedFromName }}
          >
            <Text className="text-[17px] font-semibold text-white">
              Continue
            </Text>
            <ArrowRight size={20} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        )}

        {currentStep === 'when' && (
          <TouchableOpacity
            onPress={handleNext}
            className="h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-emerald-500"
            accessibilityRole="button"
            accessibilityLabel="Continue to customization"
          >
            <Text className="text-[17px] font-semibold text-white">
              Continue
            </Text>
            <ArrowRight size={20} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        )}

        {currentStep === 'customize' && (
          <View className="gap-3">
            <TouchableOpacity
              onPress={handleFinish}
              className="h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-emerald-500"
              accessibilityRole="button"
              accessibilityLabel="Create habit"
            >
              <Text className="text-[17px] font-semibold text-white">
                Create Habit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSkipCustomization}
              className="py-3"
              accessibilityRole="button"
              accessibilityLabel="Skip customization and create habit"
            >
              <Text className="text-center text-sm font-medium text-stone-500">
                Skip and create
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

/**
 * Memoized wizard component for performance
 */
export const CreateHabitWizard = memo(CreateHabitWizardComponent);
