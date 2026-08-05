/**
 * PositiveStep Component
 * Guides user through positive visualization (success outcomes)
 */

import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Sun, CheckCircle2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';
import { buildTextInputHintProps } from '@/utils/textInputHintProps';
import { PromptList } from './PromptList';
import { NavigationButtons } from './NavigationButtons';
import type { VisualizationInputStepProps } from '../types';
import { durations, enterEasing } from '@/theme/animations';

const PROMPTS = [
  'How do you feel after completing this habit?',
  'What positive changes do you notice?',
  'How does success impact other areas of life?',
];

export function PositiveStep({
  onBack,
  onNext,
  value,
  onValueChange,
}: VisualizationInputStepProps) {
  const { colors } = useThemeColors();

  return (
    <Animated.View className='flex-1 gap-5' entering={FadeInDown.duration(durations.enter).easing(enterEasing)}>
      <View className='items-center gap-3'>
        <View className='h-16 w-16 items-center justify-center rounded-2xl'>
          <LinearGradient
            className='absolute inset-0 rounded-2xl'
            colors={['#34d399', '#14b8a6']}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
          />
          <Sun className='text-white' size={iconSizes.xl} />
        </View>
        <Text className='text-xl font-bold' style={{ color: colors.text.primary }}>
          Visualize Success
        </Text>
        <Text className='px-4 text-center text-sm' style={{ color: colors.text.secondary }}>
          Close your eyes for a moment. Imagine you've achieved your goal. What
          does that look like?
        </Text>
      </View>

      <PromptList
        bgColorValue={colors.status.successLight}
        Icon={CheckCircle2}
        iconColorValue={colors.status.success}
        prompts={PROMPTS}
        textColorValue={colors.status.successText}
        title='Consider these questions:'
        titleColorValue={colors.status.successText}
      />

      <View className='flex-1'>
        <Text className='mb-2 text-sm font-medium' style={{ color: colors.text.primary }}>
          Describe your positive vision:
        </Text>
        <TextInput
          accessibilityLabel='Describe your positive vision'
          multiline
          className='flex-1 rounded-2xl border p-4 text-base'
          style={{ minHeight: 150, textAlignVertical: 'top', borderColor: colors.border, backgroundColor: colors.card, color: colors.text.primary }}
          value={value}
          {...buildTextInputHintProps(
            'When I successfully maintain this habit, I see myself...',
            '#a8a29e'
          )}
          onChangeText={onValueChange}
        />
      </View>

      <NavigationButtons
        activeColorValue={colors.status.success}
        canContinue={value.trim().length > 0}
        onBack={onBack}
        onNext={onNext}
      />
    </Animated.View>
  );
}
