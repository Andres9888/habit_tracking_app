import React from 'react';
import { View, ScrollView } from 'react-native';
import { AnimatedContent } from './AnimatedContent';
import { HabitCard } from './HabitCard';
import { WhySection } from './WhySection';
import { WOOPReminder } from './WOOPReminder';
import { CueReminder } from './CueReminder';
import type { ActivationHabitData } from './types';

interface ActivationModalContentProps {
  habit: ActivationHabitData;
  visible: boolean;
  reduceMotion: boolean;
}

/**
 * ActivationModalContent - Scrollable content sections
 */
export function ActivationModalContent({
  habit,
  visible,
  reduceMotion,
}: ActivationModalContentProps) {
  const hasWhy = !!habit.why;
  const hasWOOP = !!habit.woopObstacle && !!habit.woopPlan;
  const hasCue =
    !!habit.cueTime || !!habit.cueLocation || !!habit.cueAfterBehavior;

  return (
    <ScrollView
      className='flex-1 px-4'
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Habit Card */}
      <AnimatedContent index={0} reduceMotion={reduceMotion} visible={visible}>
        <HabitCard habit={habit} reduceMotion={reduceMotion} />
      </AnimatedContent>

      {/* Your Why */}
      {hasWhy ? <AnimatedContent
          index={1}
          reduceMotion={reduceMotion}
          visible={visible}
        >
          <View className='mt-4'>
            <WhySection why={habit.why!} />
          </View>
        </AnimatedContent> : null}

      {/* WOOP IF-THEN Reminder */}
      {hasWOOP ? <AnimatedContent
          index={hasWhy ? 2 : 1}
          reduceMotion={reduceMotion}
          visible={visible}
        >
          <View className='mt-4'>
            <WOOPReminder
              obstacle={habit.woopObstacle!}
              plan={habit.woopPlan!}
            />
          </View>
        </AnimatedContent> : null}

      {/* Cue Reminder */}
      {hasCue ? <AnimatedContent
          index={(hasWhy ? 1 : 0) + (hasWOOP ? 1 : 0) + 1}
          reduceMotion={reduceMotion}
          visible={visible}
        >
          <View className='mt-4'>
            <CueReminder
              afterBehavior={habit.cueAfterBehavior}
              location={habit.cueLocation}
              time={habit.cueTime}
            />
          </View>
        </AnimatedContent> : null}
    </ScrollView>
  );
}
