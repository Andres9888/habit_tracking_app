/**
 * ReadLetterModal Component
 * Modal for reading an unlocked letter from past self
 *
 * Features: Emotional "time capsule" reveal, unlock celebration animation,
 * quote-style content, automatic mark-as-read on open
 */

import React from 'react';
import { View, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../../../../../theme/ThemeContext';
import type { ReadLetterModalProps } from './ReadLetterModal.types';
import { useReadLetterModal } from './useReadLetterModal';
import { ReadLetterHeader } from './ReadLetterHeader';
import { ReadLetterFooter } from './ReadLetterFooter';
import { LetterContent } from './LetterContent';
import { LockedLetterView } from './LockedLetterView';

export function ReadLetterModal({
  visible,
  letter,
  onClose,
  onMarkAsRead,
  reduceMotion = false,
}: ReadLetterModalProps) {
  const hook = useReadLetterModal({
    letter,
    onMarkAsRead,
    reduceMotion,
    visible,
  });

  const { colors, isDark } = useThemeColors();

  if (!letter) return null;

  return (
    <Modal
      animationType='fade'
      presentationStyle='fullScreen'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1'>
        <LinearGradient
          className='absolute inset-0'
          colors={isDark ? [colors.background, colors.surface] : ['#f5f3ff', '#ffffff']}
        />
        <ReadLetterHeader
          envelopeAnimatedStyle={hook.envelopeAnimatedStyle}
          title={letter.title}
          onClose={onClose}
        />

        {hook.isLocked ? (
          <LockedLetterView unlockAt={letter.unlockAt} />
        ) : (
          <LetterContent
            animationComplete={hook.animationComplete}
            contentAnimatedStyle={hook.contentAnimatedStyle}
            daysSinceWritten={hook.daysSinceWritten}
            letter={letter}
            showContent={hook.showContent}
            sparkleAnimatedStyle={hook.sparkleAnimatedStyle}
            wasJustUnlocked={hook.wasJustUnlocked}
            writtenDateString={hook.writtenDateString}
          />
        )}

        <ReadLetterFooter isLocked={hook.isLocked} onClose={onClose} />
      </View>
    </Modal>
  );
}
