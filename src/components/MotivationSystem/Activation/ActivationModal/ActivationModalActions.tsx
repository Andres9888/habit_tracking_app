import React from 'react';
import { View } from 'react-native';
import { Clock, Zap } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { AnimatedContent } from './AnimatedContent';
import { StartNowButton } from './StartNowButton';
import { QuickAction } from './QuickAction';
import type { ActivationHabitData } from './types';

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
  const { colors: themeColors } = useThemeColors();
  const hasWhy = !!habit.why;
  const hasWOOP = !!habit.woopObstacle && !!habit.woopPlan;
  const hasCue =
    !!habit.cueTime || !!habit.cueLocation || !!habit.cueAfterBehavior;

  const startButtonIndex =
    (hasWhy ? 1 : 0) + (hasWOOP ? 1 : 0) + (hasCue ? 1 : 0) + 1;
  const quickActionsIndex = startButtonIndex + 1;

  return (
    <View
      className='border-t px-4 pt-4'
      style={{ borderColor: themeColors.border, backgroundColor: themeColors.card, paddingBottom }}
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
            icon={<Clock color={themeColors.text.secondary} size={16} />}
            label='Snooze'
            onPress={onSnooze}
          />
          <QuickAction
            icon={<Zap color={themeColors.status.warning} size={16} />}
            label='Just 2 Min'
            onPress={onJustTwoMin}
          />
        </View>
      </AnimatedContent>
    </View>
  );
}
