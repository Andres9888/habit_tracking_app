import React from 'react';
import { View } from 'react-native';
import { Play, Clock } from 'lucide-react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../../../theme/ThemeContext';

import { AnimatedContent } from './AnimatedContent';
import { JustTwoMinButton } from './JustTwoMinButton';
import { SecondaryAction } from './SecondaryAction';

interface RescueModeActionsProps {
  visible: boolean;
  reduceMotion: boolean;
  hasStreak: boolean;
  hasWhy: boolean;
  hasVoiceNote: boolean;
  hasPreviousStreakNotes: boolean;
  insets: EdgeInsets;
  onJustTwoMin: () => void;
  onStartFull: () => void;
  onSkipToday: () => void;
}

/**
 * RescueModeActions - Bottom action buttons for Rescue Mode
 * Primary CTA is "Just 2 Min" to reduce activation energy
 */
export function RescueModeActions({
  visible,
  reduceMotion,
  hasStreak,
  hasWhy,
  hasVoiceNote,
  hasPreviousStreakNotes,
  insets,
  onJustTwoMin,
  onStartFull,
  onSkipToday,
}: RescueModeActionsProps) {
  const { colors } = useThemeColors();
  const baseIndex =
    (hasStreak ? 1 : 0) +
    (hasWhy ? 1 : 0) +
    (hasVoiceNote ? 1 : 0) +
    (hasPreviousStreakNotes ? 1 : 0) +
    2; // +2 for FailureViz and ScienceTip

  return (
    <View
      className='border-t px-4 pt-4'
      style={{
        backgroundColor: colors.card,
        borderTopColor: colors.status.errorLight,
        paddingBottom: Math.max(insets.bottom, 16),
      }}
    >
      {/* Just 2 Min - Primary CTA */}
      <AnimatedContent
        index={baseIndex}
        reduceMotion={reduceMotion}
        visible={visible}
      >
        <JustTwoMinButton reduceMotion={reduceMotion} onPress={onJustTwoMin} />
      </AnimatedContent>

      {/* Secondary Actions */}
      <AnimatedContent
        index={baseIndex + 1}
        reduceMotion={reduceMotion}
        visible={visible}
      >
        <View className='mt-3 flex-row gap-3'>
          <SecondaryAction
            icon={<Play color={colors.status.success} size={16} />}
            label='Full Habit'
            variant='default'
            onPress={onStartFull}
          />
          <SecondaryAction
            icon={<Clock color={colors.text.tertiary} size={16} />}
            label='Skip Today'
            variant='destructive'
            onPress={onSkipToday}
          />
        </View>
      </AnimatedContent>
    </View>
  );
}
