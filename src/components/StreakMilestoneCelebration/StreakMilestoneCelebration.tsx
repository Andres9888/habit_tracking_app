/**
 * StreakMilestoneCelebration Component
 * Full-screen celebration modal for streak milestones (7, 30, 100 days)
 */

import React, { useEffect } from 'react';
import { View, AccessibilityInfo } from 'react-native';
import { Modal } from '../Modal';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { ConfettiAnimation } from './ConfettiAnimation';
import { BadgeSection } from './BadgeSection';
import { ContentSection } from './ContentSection';
import { ActionButtons } from './ActionButtons';
import { styles } from './styles';
import type { StreakMilestoneCelebrationProps } from './types';
import { useCelebrationAnimations } from './useCelebrationAnimations';

export function StreakMilestoneCelebration({
  visible,
  onClose,
  milestone,
  habitName,
  streakDays,
  habitEmoji = '⭐',
  onShare,
}: StreakMilestoneCelebrationProps) {
  const reduceMotion = useReduceMotion();
  const anim = useCelebrationAnimations(visible, reduceMotion);

  useEffect(() => {
    if (visible) {
      AccessibilityInfo.announceForAccessibility(
        `Congratulations! ${milestone.title} You've maintained a ${streakDays} day streak for ${habitName}!`
      );
    }
  }, [visible, milestone, streakDays, habitName]);

  return (
    <>
      <Modal
        backdropOpacity={0.7}
        style={styles.modalContent}
        variant='fullScreen'
        visible={visible}
        onClose={onClose}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <BadgeSection
              animatedStyle={anim.badgeAnimatedStyle}
              milestone={milestone}
            />
            <ContentSection
              contentAnimatedStyle={anim.contentAnimatedStyle}
              habitEmoji={habitEmoji}
              habitName={habitName}
              milestone={milestone}
              streakDays={streakDays}
              titleAnimatedStyle={anim.titleAnimatedStyle}
            />
            <ActionButtons
              continueButtonAnimatedStyle={anim.continueButtonAnimatedStyle}
              shareButtonAnimatedStyle={anim.shareButtonAnimatedStyle}
              onClose={onClose}
              onShare={onShare}
            />
          </View>
        </View>
      </Modal>
      <ConfettiAnimation active={visible} />
    </>
  );
}

export default StreakMilestoneCelebration;
