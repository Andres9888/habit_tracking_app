/**
 * WOOPExplainerModal Component
 * Shows explanation of the WOOP method
 */

import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Target, X } from 'lucide-react-native';

interface WOOPExplainerModalProps {
  visible: boolean;
  onClose: () => void;
}

const WOOP_STEPS = [
  {
    bg: 'bg-amber-100',
    color: 'text-amber-600',
    desc: 'What do you want to achieve?',
    letter: 'W',
    title: 'Wish',
  },
  {
    bg: 'bg-amber-100',
    color: 'text-amber-600',
    desc: 'Best result of fulfilling your wish?',
    letter: 'O',
    title: 'Outcome',
  },
  {
    bg: 'bg-rose-100',
    color: 'text-rose-500',
    desc: 'Main inner obstacle preventing you?',
    letter: 'O',
    title: 'Obstacle',
  },
  {
    bg: 'bg-emerald-100',
    color: 'text-emerald-500',
    desc: 'If [obstacle], then I will [action]',
    letter: 'P',
    title: 'Plan',
  },
];

export function WOOPExplainerModal({
  visible,
  onClose,
}: WOOPExplainerModalProps) {
  return (
    <Modal
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
          className='w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl'
          onPress={(e) => e.stopPropagation()}
        >
          <View className='mb-4 flex-row items-start justify-between'>
            <View className='flex-row items-center gap-2'>
              <View className='h-10 w-10 items-center justify-center rounded-xl bg-amber-100'>
                <Target className='text-amber-600' size={20} />
              </View>
              <View>
                <Text className='text-lg font-bold text-stone-800'>
                  WOOP Method
                </Text>
                <Text className='text-xs text-stone-500'>
                  Dr. Gabriele Oettingen, NYU
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityLabel='Close'
              className='h-8 w-8 items-center justify-center rounded-full bg-stone-100'
              onPress={onClose}
            >
              <X className='text-stone-500' size={16} />
            </Pressable>
          </View>

          <Text className='mb-4 text-sm leading-relaxed text-stone-600'>
            WOOP is a science-backed mental strategy proven in 20+ studies to{' '}
            <Text className='font-semibold text-stone-800'>
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
                  <Text className='font-semibold text-stone-800'>
                    {step.title}
                  </Text>
                  <Text className='text-xs text-stone-500'>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <View className='rounded-xl bg-amber-50 p-3'>
            <Text className='text-xs leading-relaxed text-amber-800'>
              💡 The IF-THEN plan creates an{' '}
              <Text className='font-semibold'>implementation intention</Text> —
              a mental link that triggers automatic action when you face your
              obstacle.
            </Text>
          </View>

          <Text className='mt-3 text-center text-xs italic text-stone-400'>
            Source: "Rethinking Positive Thinking" (2014)
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
