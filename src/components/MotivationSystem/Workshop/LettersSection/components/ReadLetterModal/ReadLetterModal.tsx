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

import type { ReadLetterModalProps } from './ReadLetterModal.types';
import { LetterContent } from './LetterContent';
import { LockedLetterView } from './LockedLetterView';
import { ReadLetterFooter } from './ReadLetterFooter';
import { ReadLetterHeader } from './ReadLetterHeader';
import { useReadLetterModal } from './useReadLetterModal';
import { useThemeColors } from '../../../../../../theme/ThemeContext';

export function ReadLetterModal({
  visible,
  letter,
  onClose,
  onMarkAsRead,
  reduceMotion = false,
}: ReadLetterModalProps) {
  const { colors, isDark } = useThemeColors();
  const hook = useReadLetterModal({
    letter,
    onMarkAsRead,
    reduceMotion,
    visible,
  });


  if (!letter) return null;

  return (
    <Modal
      accessibilityViewIsModal
      animationType='fade'
      presentationStyle='fullScreen'
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
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
