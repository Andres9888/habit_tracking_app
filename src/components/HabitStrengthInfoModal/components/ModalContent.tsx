/**
 * ModalContent Component for HabitStrengthInfoModal
 */

import React from 'react';
import { Text, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { InfoSection } from './InfoSection';
import { FormulaCard } from './FormulaCard';
import { TimelineExample } from './TimelineExample';

export function ModalContent() {
  return (
    <ScrollView
      className='flex-1'
      contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.Text
        className='text-sm leading-5 text-stone-600'
        entering={FadeInDown.delay(100).duration(400)}
      >
        Habit Strength shows how established your habit is—not just your streak,
        but the resilience you've built over time.
      </Animated.Text>
      <InfoSection
        color='#10B981'
        delay={200}
        description='Each completion adds 5% of your remaining potential.'
        icon='trending-up-outline'
        title='Gradual Growth'
      />
      <InfoSection
        color='#F59E0B'
        delay={300}
        description='Missing a day reduces strength by just 5%.'
        icon='refresh-outline'
        title='Gentle Decay'
      />
      <InfoSection
        color='#6366F1'
        delay={400}
        description='High strength survives occasional misses.'
        icon='shield-checkmark-outline'
        title='Built-in Resilience'
      />
      <FormulaCard delay={500} />
      <TimelineExample delay={600} />
      <Animated.View
        className='mt-2 flex-row items-start gap-2 rounded-xl bg-stone-100 p-3'
        entering={FadeInDown.delay(700).duration(400)}
      >
        <Ionicons color='#78716C' name='bulb-outline' size={16} />
        <Text className='flex-1 text-xs leading-4 text-stone-500'>
          Based on exponential smoothing from Loop Habit Tracker.
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

export default ModalContent;
