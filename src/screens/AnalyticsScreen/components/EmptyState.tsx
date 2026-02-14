/**
 * EmptyState - OPTIMIZED: FadeInUp animation, better visuals, engaging illustration
 */
import React from 'react';
import { View, Text } from 'react-native';
import { BarChart3, Sparkles } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { shadows } from '../../../theme/spacing';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export const EmptyState: React.FC = () => {
  return (
    <View className='flex-1 items-center justify-center px-6 py-12'>
      {/* Illustration */}
      <Animated.View
        className='mb-6 h-24 w-24 items-center justify-center rounded-3xl bg-violet-50'
        entering={anim(0)}
        style={{
          shadowColor: '#8b5cf6',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        }}
      >
        <BarChart3 color='#8b5cf6' size={48} strokeWidth={1.5} />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        className='mb-2 text-center font-bold text-stone-900'
        entering={anim(50)}
        style={{ fontSize: 22, letterSpacing: -0.5 }}
      >
        No Analytics Yet
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        className='mb-8 text-center text-[17px] leading-[22px] text-stone-500'
        entering={anim(100)}
        style={{ maxWidth: 280 }}
      >
        Create habits and track them for a few days to unlock your insights
        dashboard.
      </Animated.Text>

      {/* Steps Card */}
      <Animated.View
        className='w-full rounded-2xl bg-white p-5'
        entering={anim(150)}
        style={{
          ...shadows.floatingActionButton,
        }}
      >
        <View className='mb-3 flex-row items-center gap-2'>
          <Sparkles color='#f59e0b' size={16} />
          <Text className='text-[13px] font-semibold text-amber-600'>
            GET STARTED
          </Text>
        </View>
        <View className='gap-3'>
          <StepItem number='1' text='Go to Home tab' />
          <StepItem number='2' text='Create your first habit' />
          <StepItem number='3' text='Track it daily' />
          <StepItem number='4' text='Come back to see insights!' />
        </View>
      </Animated.View>
    </View>
  );
};

function StepItem({ number, text }: { number: string; text: string }) {
  return (
    <View className='flex-row items-center gap-3'>
      <View className='h-7 w-7 items-center justify-center rounded-full bg-stone-100'>
        <Text className='text-[13px] font-semibold text-stone-600'>
          {number}
        </Text>
      </View>
      <Text className='text-[17px] text-stone-700'>{text}</Text>
    </View>
  );
}
