/**
 * Reminder Screen - Screen 4 of onboarding
 * Time picker with morning/afternoon/evening presets
 */

import { View, Text, Pressable, Platform } from 'react-native';
import Animated, {
  FadeIn,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { ONBOARDING_COLORS, REMINDER_PRESETS } from '../constants';
import type { OnboardingScreenProps, ReminderPreset } from '../types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ReminderScreen({ onNext, onBack, onSkip, data, updateData }: OnboardingScreenProps) {
  const habitName = data.selectedHabit?.name || data.customHabitName || 'your habit';

  const handleSelectPreset = (preset: ReminderPreset) => {
    const presetData = REMINDER_PRESETS.find((p) => p.id === preset);
    if (presetData) {
      updateData({
        reminderPreset: preset,
        reminderTime: presetData.time,
      });
    }
  };

  const handleSkip = () => {
    updateData({ reminderPreset: null, reminderTime: null });
    onNext();
  };

  const selectedPreset = REMINDER_PRESETS.find((p) => p.id === data.reminderPreset);
  const displayTime = selectedPreset?.time || '08:00';
  const displayLabel = selectedPreset
    ? `Every ${selectedPreset.id}`
    : 'Select a time';

  return (
    <OnboardingLayout
      currentStep="reminder"
      ctaTitle="Enable Reminders"
      onCtaPress={onNext}
      onBack={onBack}
      onSkip={onSkip}
      ctaDisabled={!data.reminderPreset}
    >
      <View className="flex-1">
        {/* Header */}
        <Animated.View entering={FadeIn.delay(200).duration(500)}>
          <Text
            className="text-[24px] font-bold mb-2"
            style={{ color: ONBOARDING_COLORS.text.primary }}
          >
            Set a Reminder
          </Text>
          <Text
            className="text-[15px] mb-8"
            style={{ color: ONBOARDING_COLORS.text.secondary }}
          >
            When do you want to {habitName.toLowerCase()}?
          </Text>
        </Animated.View>

        {/* Time Display */}
        <Animated.View
          entering={SlideInUp.delay(400).duration(500).springify()}
          className="rounded-[20px] p-6 items-center mb-6"
          style={{ backgroundColor: ONBOARDING_COLORS.surface.default }}
        >
          <Text
            className="text-[48px] font-light"
            style={{
              color: ONBOARDING_COLORS.text.primary,
              fontVariant: ['tabular-nums'],
            }}
          >
            {displayTime}
          </Text>
          <Text
            className="text-[14px] mt-2"
            style={{ color: ONBOARDING_COLORS.text.secondary }}
          >
            {displayLabel}
          </Text>

          {/* Time Presets */}
          <View className="flex-row gap-2 mt-4">
            {REMINDER_PRESETS.map((preset, index) => (
              <TimeChip
                key={preset.id}
                label={preset.label}
                isActive={data.reminderPreset === preset.id}
                onPress={() => handleSelectPreset(preset.id)}
                delay={600 + index * 100}
              />
            ))}
          </View>
        </Animated.View>

        {/* Skip Link */}
        <Animated.View
          entering={FadeIn.delay(900).duration(400)}
          className="items-center"
        >
          <Pressable onPress={handleSkip}>
            <Text
              className="text-[14px]"
              style={{ color: ONBOARDING_COLORS.text.secondary }}
            >
              Skip for now
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </OnboardingLayout>
  );
}

interface TimeChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  delay: number;
}

function TimeChip({ label, isActive, onPress, delay }: TimeChipProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <Animated.View entering={FadeIn.delay(delay).duration(300)}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="px-4 py-2 rounded-[20px]"
        style={[
          {
            backgroundColor: isActive
              ? ONBOARDING_COLORS.accent.primary
              : 'rgba(99, 102, 241, 0.15)',
          },
          animatedStyle,
        ]}
      >
        <Text
          className="text-[13px]"
          style={{
            color: isActive
              ? ONBOARDING_COLORS.text.primary
              : ONBOARDING_COLORS.text.accent,
          }}
        >
          {label}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
}
