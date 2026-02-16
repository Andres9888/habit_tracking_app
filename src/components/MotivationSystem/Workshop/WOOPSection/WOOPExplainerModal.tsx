/**
 * WOOPExplainerModal Component
 * Shows explanation of the WOOP method
 */

import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Target, X } from 'lucide-react-native';

import { useThemeColors } from '../../../../theme/ThemeContext';
import { WOOP_STEPS } from './WOOPExplainerModal.constants';

interface WOOPExplainerModalProps {
  visible: boolean;
  onClose: () => void;
}

export function WOOPExplainerModal({
  visible,
  onClose,
}: WOOPExplainerModalProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <Modal
      accessibilityViewIsModal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        className='flex-1 items-center justify-center bg-black/50 px-6'
        onPress={onClose}
      >
        <Pressable
          className='w-full max-w-sm rounded-2xl p-5 shadow-xl'
          style={{ backgroundColor: colors.surface }}
          onPress={(e) => e.stopPropagation()}
        >
          <View className='mb-4 flex-row items-start justify-between'>
            <View className='flex-row items-center gap-2'>
              <View className='h-10 w-10 items-center justify-center rounded-xl bg-amber-100'>
                <Target className='text-amber-600' size={20} />
              </View>
              <View>
                <Text className='text-lg font-bold' style={{ color: colors.text.primary }}>
                  WOOP Method
                </Text>
                <Text className='text-xs' style={{ color: colors.text.tertiary }}>
                  Dr. Gabriele Oettingen, NYU
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityLabel='Close'
              accessibilityRole='button'
              className='h-10 w-10 items-center justify-center rounded-full'
              style={{ backgroundColor: colors.gray[200] }}
              onPress={onClose}
            >
              <X color={colors.text.secondary} size={20} />
            </Pressable>
          </View>

          <Text className='mb-4 text-sm leading-relaxed' style={{ color: colors.text.secondary }}>
            WOOP is a science-backed mental strategy proven in 20+ studies to{' '}
            <Text className='font-semibold' style={{ color: colors.text.primary }}>
              double goal achievement
            </Text>
            . It combines positive thinking with realistic obstacle planning.
          </Text>

          <View className='mb-4 gap-3'>
            {WOOP_STEPS.map((step, i) => (
              <View key={i} className='flex-row gap-3'>
                <View
                  className={`h-8 w-8 items-center justify-center rounded-lg ${step.bg}`}
                >
                  <Text className={`font-bold ${step.color}`}>
                    {step.letter}
                  </Text>
                </View>
                <View className='flex-1'>
                  <Text className='font-semibold' style={{ color: colors.text.primary }}>
                    {step.title}
                  </Text>
                  <Text className='text-xs' style={{ color: colors.text.tertiary }}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <View className='rounded-xl p-3' style={{ backgroundColor: isDark ? colors.gray[100] : '#fffbeb' }}>
            <Text className='text-xs leading-relaxed' style={{ color: isDark ? colors.text.secondary : '#92400e' }}>
              💡 The IF-THEN plan creates an{' '}
              <Text className='font-semibold'>implementation intention</Text> —
              a mental link that triggers automatic action when you face your
              obstacle.
            </Text>
          </View>

          <Text className='mt-3 text-center text-xs italic' style={{ color: colors.text.tertiary }}>
            Source: "Rethinking Positive Thinking" (2014)
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
