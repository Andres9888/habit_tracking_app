/**
 * NegativeStep Component
 * Guides user through negative visualization (failure consequences)
 * Based on Tim Ferriss "Fear Setting" and Stoic premeditatio malorum
 */

import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CloudRain, AlertTriangle, Lightbulb } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';
import { buildTextInputHintProps } from '@/utils/textInputHintProps';
import { PromptList } from './PromptList';
import { NavigationButtons } from './NavigationButtons';
import type { VisualizationInputStepProps } from '../types';
import { durations, enterEasing } from '@/theme/animations';

const PROMPTS = [
  'What happens if you quit this habit?',
  'How will you feel 6 months from now?',
  'What opportunities will you miss?',
];

export function NegativeStep({
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
            colors={['#fb7185', '#ef4444']}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
          />
          <CloudRain className='text-white' size={iconSizes.xl} />
        </View>
        <Text className='text-xl font-bold' style={{ color: colors.text.primary }}>
          Visualize Failure
        </Text>
        <Text className='px-4 text-center text-sm' style={{ color: colors.text.secondary }}>
          Now imagine you've given up on this habit. What are the consequences?
          Be honest.
        </Text>
      </View>

      <PromptList
        bgColorValue={colors.status.errorLight}
        Icon={AlertTriangle}
        iconColorValue={colors.status.error}
        prompts={PROMPTS}
        textColorValue={colors.status.errorText}
        title='Consider these questions:'
        titleColorValue={colors.status.errorText}
      />

      <View className='flex-row items-start gap-2 rounded-xl p-3' style={{ backgroundColor: colors.status.warningLight }}>
        <Lightbulb className='mt-0.5' color={colors.status.warning} size={iconSizes.small} />
        <Text className='flex-1 text-xs leading-relaxed' style={{ color: colors.status.warningText }}>
          <Text className='font-semibold'>Why this works: </Text>
          Fear of loss is neurologically twice as powerful as desire for gain.
        </Text>
      </View>

      <View className='flex-1'>
        <Text className='mb-2 text-sm font-medium' style={{ color: colors.text.primary }}>
          Describe the consequences:
        </Text>
        <TextInput
          accessibilityLabel='Describe the consequences'
          multiline
          className='flex-1 rounded-2xl border p-4 text-base'
          style={{ minHeight: 150, textAlignVertical: 'top', borderColor: colors.border, backgroundColor: colors.card, color: colors.text.primary }}
          value={value}
          {...buildTextInputHintProps(
            'If I give up on this habit, I will experience...',
            '#a8a29e'
          )}
          onChangeText={onValueChange}
        />
      </View>

      <NavigationButtons
        activeColorValue={colors.status.error}
        canContinue={value.trim().length > 0}
        onBack={onBack}
        onNext={onNext}
      />
    </Animated.View>
  );
}
