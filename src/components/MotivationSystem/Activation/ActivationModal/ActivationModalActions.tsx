
import React from 'react';
import { View } from 'react-native';

import { Clock, Zap } from 'lucide-react-native';

import type { ActivationHabitData } from './types';
import { AnimatedContent } from './AnimatedContent';
import { QuickAction } from './QuickAction';
import { StartNowButton } from './StartNowButton';

interface ActivationModalActionsProps {
  habit: ActivationHabitData;
  visible: boolean;
  reduceMotion: boolean;
  paddingBottom: number;
  onStartNow: () => void;
  onSnooze: () => void;
  onJustTwoMin: () => void;
}

/**
 * ActivationModalActions - Bottom action buttons
 */
export function ActivationModalActions({
  habit,
  visible,
  reduceMotion,
  paddingBottom,
  onStartNow,
  onSnooze,
  onJustTwoMin,
}: ActivationModalActionsProps) {
  const hasWhy = !!habit.why;
  const hasWOOP = !!habit.woopObstacle && !!habit.woopPlan;
  const hasCue =
    !!habit.cueTime || !!habit.cueLocation || !!habit.cueAfterBehavior;

  const startButtonIndex =
    (hasWhy ? 1 : 0) + (hasWOOP ? 1 : 0) + (hasCue ? 1 : 0) + 1;
  const quickActionsIndex = startButtonIndex + 1;

  return (
    <View
      className='border-t border-stone-200 bg-white px-4 pt-4'
      style={{ paddingBottom }}
    >
      {/* Start Now - Primary CTA */}
      <AnimatedContent
        index={startButtonIndex}
        reduceMotion={reduceMotion}
        visible={visible}
      >
        <StartNowButton reduceMotion={reduceMotion} onPress={onStartNow} />
      </AnimatedContent>

      {/* Quick Actions */}
      <AnimatedContent
        index={quickActionsIndex}
        reduceMotion={reduceMotion}
        visible={visible}
      >
        <View className='mt-3 flex-row gap-3'>
          <QuickAction
            icon={<Clock className='text-stone-500' size={16} />}
            label='Snooze'
            onPress={onSnooze}
          />
          <QuickAction
            icon={<Zap className='text-amber-500' size={16} />}
            label='Just 2 Min'
            onPress={onJustTwoMin}
          />
        </View>
      </AnimatedContent>
    </View>
  );
}
