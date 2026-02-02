/**
 * Create Habit Screen - Screen 2 of onboarding
 * Habit suggestions (exercise, read, meditate, water) + custom option
 */

import { useState } from 'react';
import { View, Text, Pressable, TextInput, Modal } from 'react-native';
import Animated, {
  FadeIn,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { ONBOARDING_COLORS, HABIT_SUGGESTIONS } from '../constants';
import type { OnboardingScreenProps, HabitSuggestion } from '../types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CreateHabitScreen({ onNext, data, updateData }: OnboardingScreenProps) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customInput, setCustomInput] = useState(data.customHabitName);

  const handleSelectHabit = (habit: HabitSuggestion) => {
    updateData({ selectedHabit: habit, customHabitName: '' });
  };

  const handleCustomHabit = () => {
    if (customInput.trim()) {
      updateData({
        selectedHabit: null,
        customHabitName: customInput.trim(),
      });
      setShowCustomModal(false);
    }
  };

  const hasSelection = data.selectedHabit !== null || data.customHabitName.length > 0;

  return (
    <OnboardingLayout
      currentStep="createHabit"
      ctaTitle="Continue"
      onCtaPress={onNext}
      ctaDisabled={!hasSelection}
    >
      <View className="flex-1">
        {/* Header */}
        <Animated.View entering={FadeIn.delay(200).duration(500)}>
          <Text
            className="text-[24px] font-bold mb-2"
            style={{ color: ONBOARDING_COLORS.text.primary }}
          >
            Your First Habit
          </Text>
          <Text
            className="text-[15px] mb-6"
            style={{ color: ONBOARDING_COLORS.text.secondary }}
          >
            What do you want to build?
          </Text>
        </Animated.View>

        {/* Habit Suggestions Grid */}
        <View className="flex-row flex-wrap gap-3">
          {HABIT_SUGGESTIONS.map((habit, index) => (
            <HabitChip
              key={habit.id}
              habit={habit}
              isSelected={data.selectedHabit?.id === habit.id}
              onSelect={() => handleSelectHabit(habit)}
              delay={300 + index * 100}
            />
          ))}
        </View>

        {/* Custom Option */}
        <Animated.View entering={SlideInUp.delay(700).duration(500).springify()}>
          <Pressable
            onPress={() => setShowCustomModal(true)}
            className="mt-4 p-4 rounded-2xl items-center justify-center"
            style={{
              backgroundColor: data.customHabitName
                ? 'rgba(99, 102, 241, 0.2)'
                : ONBOARDING_COLORS.surface.default,
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: data.customHabitName
                ? ONBOARDING_COLORS.accent.primary
                : ONBOARDING_COLORS.surface.borderLight,
            }}
          >
            <Text
              className="text-[14px]"
              style={{
                color: data.customHabitName
                  ? ONBOARDING_COLORS.text.primary
                  : ONBOARDING_COLORS.text.secondary,
              }}
            >
              {data.customHabitName || '+ Create Custom Habit'}
            </Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Custom Habit Modal */}
      <Modal
        visible={showCustomModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCustomModal(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/60 px-6">
          <View
            className="w-full rounded-3xl p-6"
            style={{ backgroundColor: ONBOARDING_COLORS.background.end }}
          >
            <Text
              className="text-[20px] font-bold mb-4"
              style={{ color: ONBOARDING_COLORS.text.primary }}
            >
              Create Custom Habit
            </Text>
            <TextInput
              value={customInput}
              onChangeText={setCustomInput}
              placeholder="What habit do you want to build?"
              placeholderTextColor={ONBOARDING_COLORS.text.secondary}
              autoFocus
              className="rounded-xl px-4 py-4 text-[16px] mb-4"
              style={{
                backgroundColor: ONBOARDING_COLORS.surface.default,
                color: ONBOARDING_COLORS.text.primary,
              }}
            />
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setShowCustomModal(false)}
                className="flex-1 py-3 rounded-xl items-center"
                style={{ backgroundColor: ONBOARDING_COLORS.surface.default }}
              >
                <Text style={{ color: ONBOARDING_COLORS.text.secondary }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleCustomHabit}
                className="flex-1 py-3 rounded-xl items-center"
                style={{
                  backgroundColor: customInput.trim()
                    ? ONBOARDING_COLORS.accent.primary
                    : ONBOARDING_COLORS.surface.default,
                }}
              >
                <Text
                  style={{
                    color: customInput.trim()
                      ? ONBOARDING_COLORS.text.primary
                      : ONBOARDING_COLORS.text.secondary,
                  }}
                >
                  Save
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </OnboardingLayout>
  );
}

interface HabitChipProps {
  habit: HabitSuggestion;
  isSelected: boolean;
  onSelect: () => void;
  delay: number;
}

function HabitChip({ habit, isSelected, onSelect, delay }: HabitChipProps) {
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
    <Animated.View
      entering={SlideInUp.delay(delay).duration(500).springify()}
      style={{ width: '47%' }}
    >
      <AnimatedPressable
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="p-4 rounded-2xl items-center"
        style={[
          {
            backgroundColor: isSelected
              ? 'rgba(99, 102, 241, 0.2)'
              : ONBOARDING_COLORS.surface.default,
            borderWidth: 2,
            borderColor: isSelected
              ? ONBOARDING_COLORS.accent.primary
              : 'transparent',
          },
          animatedStyle,
        ]}
      >
        <Text className="text-[32px] mb-2">{habit.emoji}</Text>
        <Text
          className="text-[13px] font-medium"
          style={{ color: ONBOARDING_COLORS.text.primary }}
        >
          {habit.name}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
}
