/**
 * VisualizationExercise Component
 * Interactive exercise based on Andrew Huberman's visualization techniques
 *
 * Key principles:
 * - Visualize positive outcomes (pull motivation)
 * - Visualize negative outcomes/consequences (push motivation - "fear setting")
 * - Mental contrasting creates productive tension that drives action
 *
 * References:
 * - Huberman Lab Podcast: Goal Setting & Neural Mechanisms
 * - Tim Ferriss "Fear Setting" (influenced by Stoic premeditatio malorum)
 * - Gabriele Oettingen's WOOP method (mental contrasting)
 */

import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import {
  Sun,
  CloudRain,
  Sparkles,
  Save,
  ChevronRight,
  Brain,
  Target,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { clsx } from 'clsx';

type VisualizationStep = 'intro' | 'positive' | 'negative' | 'summary';

export interface VisualizationData {
  habitName: string;
  negativeVisualization: string;
  positiveVisualization: string;
  timestamp: number;
}

export interface VisualizationExerciseProps {
  habitName: string;
  onClose?: () => void;
  onSave?: (data: VisualizationData) => void;
}

/**
 * Step Indicator Component
 */
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          className={clsx(
            'h-2 rounded-full transition-all',
            index < currentStep ? 'w-8 bg-violet-500' : 'w-2 bg-stone-200'
          )}
        />
      ))}
    </View>
  );
}

/**
 * Intro Step Component
 */
function IntroStep({ habitName, onNext }: { habitName: string; onNext: () => void }) {
  return (
    <Animated.View className="flex-1 gap-6" entering={FadeInDown.springify()}>
      {/* Header */}
      <View className="items-center gap-4">
        <View className="h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600">
          <Brain className="text-white" size={40} />
        </View>
        <Text className="text-center text-2xl font-bold text-stone-900">
          Visualization Exercise
        </Text>
        <Text className="px-4 text-center text-base text-stone-500">
          Science-backed technique to boost your motivation for{' '}
          <Text className="font-semibold text-violet-600">{habitName}</Text>
        </Text>
      </View>

      {/* Explanation Cards */}
      <View className="gap-3">
        <View className="flex-row items-start gap-3 rounded-2xl bg-emerald-50 p-4">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <Sun className="text-emerald-600" size={20} />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-emerald-800">
              Positive Visualization
            </Text>
            <Text className="mt-1 text-xs leading-relaxed text-emerald-700">
              Imagine the best outcome. What does success look like? How will you feel?
            </Text>
          </View>
        </View>

        <View className="flex-row items-start gap-3 rounded-2xl bg-rose-50 p-4">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
            <CloudRain className="text-rose-600" size={20} />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-rose-800">
              Negative Visualization
            </Text>
            <Text className="mt-1 text-xs leading-relaxed text-rose-700">
              Imagine failing. What are the consequences? This creates "push" motivation.
            </Text>
          </View>
        </View>
      </View>

      {/* Huberman Quote */}
      <View className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <View className="flex-row items-start gap-2">
          <Sparkles className="mt-0.5 text-amber-500" size={16} />
          <Text className="flex-1 text-sm italic leading-relaxed text-amber-800">
            "Thinking about failure is actually a very effective way to reach your goals...
            it recruits the autonomic nervous system in ways that support action."
          </Text>
        </View>
        <Text className="mt-2 text-right text-xs font-medium text-amber-600">
          — Andrew Huberman
        </Text>
      </View>

      {/* Start Button */}
      <Pressable
        accessibilityLabel="Start visualization exercise"
        accessibilityRole="button"
        className="mt-auto flex-row items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 active:opacity-90"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onNext();
        }}
      >
        <Text className="text-[15px] font-semibold text-white">Begin Exercise</Text>
        <ChevronRight className="text-white" size={20} />
      </Pressable>
    </Animated.View>
  );
}

/**
 * Positive Visualization Step
 */
function PositiveStep({
  onBack,
  onNext,
  value,
  onValueChange,
}: {
  onBack: () => void;
  onNext: () => void;
  value: string;
  onValueChange: (text: string) => void;
}) {
  return (
    <Animated.View className="flex-1 gap-5" entering={FadeInDown.springify()}>
      {/* Header */}
      <View className="items-center gap-3">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500">
          <Sun className="text-white" size={32} />
        </View>
        <Text className="text-xl font-bold text-stone-900">
          Visualize Success
        </Text>
        <Text className="px-4 text-center text-sm text-stone-500">
          Close your eyes for a moment. Imagine you've achieved your goal. What does that look like?
        </Text>
      </View>

      {/* Prompts */}
      <View className="rounded-xl bg-emerald-50 p-4">
        <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
          Consider these questions:
        </Text>
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={14} />
            <Text className="text-sm text-emerald-800">How do you feel after completing this habit?</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={14} />
            <Text className="text-sm text-emerald-800">What positive changes do you notice?</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={14} />
            <Text className="text-sm text-emerald-800">How does success impact other areas of life?</Text>
          </View>
        </View>
      </View>

      {/* Text Input */}
      <View className="flex-1">
        <Text className="mb-2 text-sm font-medium text-stone-700">
          Describe your positive vision:
        </Text>
        <TextInput
          className="flex-1 rounded-2xl border border-stone-200 bg-white p-4 text-base text-stone-800"
          multiline
          onChangeText={onValueChange}
          placeholder="When I successfully maintain this habit, I see myself..."
          placeholderTextColor="#a8a29e"
          style={{ textAlignVertical: 'top', minHeight: 150 }}
          value={value}
        />
      </View>

      {/* Navigation */}
      <View className="flex-row gap-3">
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          className="flex-1 items-center rounded-xl border border-stone-200 bg-white py-3.5 active:bg-stone-50"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onBack();
          }}
        >
          <Text className="text-sm font-medium text-stone-600">Back</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Continue to negative visualization"
          accessibilityRole="button"
          className={clsx(
            'flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3.5',
            value.trim().length > 0
              ? 'bg-emerald-500 active:bg-emerald-600'
              : 'bg-stone-200'
          )}
          disabled={value.trim().length === 0}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onNext();
          }}
        >
          <Text className={clsx(
            'text-sm font-semibold',
            value.trim().length > 0 ? 'text-white' : 'text-stone-400'
          )}>
            Continue
          </Text>
          <ChevronRight
            className={value.trim().length > 0 ? 'text-white' : 'text-stone-400'}
            size={18}
          />
        </Pressable>
      </View>
    </Animated.View>
  );
}

/**
 * Negative Visualization Step
 */
function NegativeStep({
  onBack,
  onNext,
  value,
  onValueChange,
}: {
  onBack: () => void;
  onNext: () => void;
  value: string;
  onValueChange: (text: string) => void;
}) {
  return (
    <Animated.View className="flex-1 gap-5" entering={FadeInDown.springify()}>
      {/* Header */}
      <View className="items-center gap-3">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-red-500">
          <CloudRain className="text-white" size={32} />
        </View>
        <Text className="text-xl font-bold text-stone-900">
          Visualize Failure
        </Text>
        <Text className="px-4 text-center text-sm text-stone-500">
          Now imagine you've given up on this habit. What are the consequences? Be honest.
        </Text>
      </View>

      {/* Prompts */}
      <View className="rounded-xl bg-rose-50 p-4">
        <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-rose-700">
          Consider these questions:
        </Text>
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <AlertTriangle className="text-rose-500" size={14} />
            <Text className="text-sm text-rose-800">What happens if you quit this habit?</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <AlertTriangle className="text-rose-500" size={14} />
            <Text className="text-sm text-rose-800">How will you feel 6 months from now?</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <AlertTriangle className="text-rose-500" size={14} />
            <Text className="text-sm text-rose-800">What opportunities will you miss?</Text>
          </View>
        </View>
      </View>

      {/* Scientific Context */}
      <View className="flex-row items-start gap-2 rounded-xl bg-amber-50 p-3">
        <Lightbulb className="mt-0.5 text-amber-500" size={16} />
        <Text className="flex-1 text-xs leading-relaxed text-amber-800">
          <Text className="font-semibold">Why this works: </Text>
          Fear of loss is neurologically twice as powerful as desire for gain.
          This "loss aversion" can be channeled productively.
        </Text>
      </View>

      {/* Text Input */}
      <View className="flex-1">
        <Text className="mb-2 text-sm font-medium text-stone-700">
          Describe the consequences of failure:
        </Text>
        <TextInput
          className="flex-1 rounded-2xl border border-stone-200 bg-white p-4 text-base text-stone-800"
          multiline
          onChangeText={onValueChange}
          placeholder="If I give up on this habit, I will experience..."
          placeholderTextColor="#a8a29e"
          style={{ textAlignVertical: 'top', minHeight: 150 }}
          value={value}
        />
      </View>

      {/* Navigation */}
      <View className="flex-row gap-3">
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          className="flex-1 items-center rounded-xl border border-stone-200 bg-white py-3.5 active:bg-stone-50"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onBack();
          }}
        >
          <Text className="text-sm font-medium text-stone-600">Back</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Continue to summary"
          accessibilityRole="button"
          className={clsx(
            'flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3.5',
            value.trim().length > 0
              ? 'bg-rose-500 active:bg-rose-600'
              : 'bg-stone-200'
          )}
          disabled={value.trim().length === 0}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onNext();
          }}
        >
          <Text className={clsx(
            'text-sm font-semibold',
            value.trim().length > 0 ? 'text-white' : 'text-stone-400'
          )}>
            Continue
          </Text>
          <ChevronRight
            className={value.trim().length > 0 ? 'text-white' : 'text-stone-400'}
            size={18}
          />
        </Pressable>
      </View>
    </Animated.View>
  );
}

/**
 * Summary Step Component
 */
function SummaryStep({
  habitName,
  negativeVisualization,
  onBack,
  onSave,
  positiveVisualization,
}: {
  habitName: string;
  negativeVisualization: string;
  onBack: () => void;
  onSave: () => void;
  positiveVisualization: string;
}) {
  return (
    <Animated.View className="flex-1 gap-5" entering={FadeInDown.springify()}>
      {/* Header */}
      <View className="items-center gap-3">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600">
          <Target className="text-white" size={32} />
        </View>
        <Text className="text-xl font-bold text-stone-900">
          Your Visualization
        </Text>
        <Text className="px-4 text-center text-sm text-stone-500">
          Review your mental contrasting exercise for{' '}
          <Text className="font-semibold text-violet-600">{habitName}</Text>
        </Text>
      </View>

      {/* Visualizations */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-4 pb-4">
          {/* Positive */}
          <View className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <View className="mb-3 flex-row items-center gap-2">
              <Sun className="text-emerald-600" size={18} />
              <Text className="text-sm font-semibold text-emerald-800">
                Success Vision
              </Text>
            </View>
            <Text className="text-sm leading-relaxed text-emerald-900">
              "{positiveVisualization}"
            </Text>
          </View>

          {/* Negative */}
          <View className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <View className="mb-3 flex-row items-center gap-2">
              <CloudRain className="text-rose-600" size={18} />
              <Text className="text-sm font-semibold text-rose-800">
                Failure Consequences
              </Text>
            </View>
            <Text className="text-sm leading-relaxed text-rose-900">
              "{negativeVisualization}"
            </Text>
          </View>

          {/* Insight */}
          <View className="rounded-2xl bg-violet-50 p-4">
            <View className="flex-row items-start gap-2">
              <Brain className="mt-0.5 text-violet-500" size={16} />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-violet-800">
                  Mental Contrasting Complete
                </Text>
                <Text className="mt-1 text-xs leading-relaxed text-violet-700">
                  By holding both visions in mind, you've created a productive tension
                  that drives action. Review these visualizations when motivation dips.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Actions */}
      <View className="flex-row gap-3">
        <Pressable
          accessibilityLabel="Go back to edit"
          accessibilityRole="button"
          className="flex-1 items-center rounded-xl border border-stone-200 bg-white py-3.5 active:bg-stone-50"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onBack();
          }}
        >
          <Text className="text-sm font-medium text-stone-600">Edit</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Save visualization"
          accessibilityRole="button"
          className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 active:opacity-90"
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onSave();
          }}
        >
          <Save className="text-white" size={18} />
          <Text className="text-sm font-semibold text-white">Save</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

/**
 * Main VisualizationExercise Component
 */
export function VisualizationExercise({
  habitName,
  onClose,
  onSave,
}: VisualizationExerciseProps) {
  const [step, setStep] = useState<VisualizationStep>('intro');
  const [positiveVisualization, setPositiveVisualization] = useState('');
  const [negativeVisualization, setNegativeVisualization] = useState('');

  const stepNumber = {
    intro: 1,
    positive: 2,
    negative: 3,
    summary: 4,
  }[step];

  const handleSave = () => {
    const data: VisualizationData = {
      habitName,
      negativeVisualization,
      positiveVisualization,
      timestamp: Date.now(),
    };
    onSave?.(data);
    onClose?.();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <View className="flex-1 gap-6">
        {/* Step Indicator */}
        <StepIndicator currentStep={stepNumber} totalSteps={4} />

        {/* Step Content */}
        {step === 'intro' && (
          <IntroStep
            habitName={habitName}
            onNext={() => setStep('positive')}
          />
        )}

        {step === 'positive' && (
          <PositiveStep
            onBack={() => setStep('intro')}
            onNext={() => setStep('negative')}
            onValueChange={setPositiveVisualization}
            value={positiveVisualization}
          />
        )}

        {step === 'negative' && (
          <NegativeStep
            onBack={() => setStep('positive')}
            onNext={() => setStep('summary')}
            onValueChange={setNegativeVisualization}
            value={negativeVisualization}
          />
        )}

        {step === 'summary' && (
          <SummaryStep
            habitName={habitName}
            negativeVisualization={negativeVisualization}
            onBack={() => setStep('negative')}
            onSave={handleSave}
            positiveVisualization={positiveVisualization}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

export default VisualizationExercise;
