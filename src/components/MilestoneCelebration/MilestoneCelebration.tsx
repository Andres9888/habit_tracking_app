/**
 * MilestoneCelebration Component
 * Based on UX Specification Section 8.2: Milestone Celebration Animation
 *
 * Purpose: Celebrate when user reaches new habit strength level (20%, 40%, 60%, 80%)
 * Features: Full-screen modal, confetti animation, badge display with emoji, haptic feedback
 * Accessibility: Reduce Motion support, VoiceOver announcements
 * Performance: 60fps target on iPhone SE
 */

import React from 'react';
import { View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Modal } from '../Modal';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import type { MilestoneCelebrationProps } from './types';
import { styles } from './styles';
import { CONFETTI_COLORS, SCREEN_WIDTH } from './constants';
import { useMilestoneAnimations } from './useMilestoneAnimations';
import { useMilestoneAnimatedStyles } from './useMilestoneAnimatedStyles';
import { useConfetti } from './useConfetti';
import { useAccessibilityAnnouncement } from './useAccessibilityAnnouncement';
import { MilestoneContent } from './MilestoneContent';
import { MilestoneActions } from './MilestoneActions';

export function MilestoneCelebration({
  visible,
  onClose,
  level,
  strength,
  habitName,
}: MilestoneCelebrationProps) {
  const reduceMotion = useReduceMotion();

  const animations = useMilestoneAnimations({
    reduceMotion,
    strength,
    visible,
  });

  const animatedStyles = useMilestoneAnimatedStyles(animations);
  const confettiRef = useConfetti({ reduceMotion, visible });

  useAccessibilityAnnouncement({
    habitName,
    level,
    strength,
    visible,
  });

  return (
    <>
      <Modal
        accessibilityViewIsModal
        backdropOpacity={0.6}
        style={styles.modalContent}
        variant='fullScreen'
        visible={visible}
        onClose={onClose}
      >
        <View style={styles.container}>
          <MilestoneContent
            badgeContainerStyle={animatedStyles.badgeContainerStyle}
            glowStyle={animatedStyles.glowStyle}
            habitName={habitName}
            labelStyle={animatedStyles.labelStyle}
            level={level}
            percentageStyle={animatedStyles.percentageStyle}
            strength={strength}
          />

          <MilestoneActions
            continueButtonStyle={animatedStyles.continueButtonStyle}
            onClose={onClose}
          />
        </View>
      </Modal>

      {/* Confetti Animation - Only if Reduce Motion is disabled */}
      {!reduceMotion && visible ? <ConfettiCannon
          ref={confettiRef}
          fadeOut
          autoStart={false}
          colors={CONFETTI_COLORS}
          count={100}
          explosionSpeed={350}
          fallSpeed={2500}
          origin={{ x: SCREEN_WIDTH / 2, y: 0 }}
        /> : null}
    </>
  );
}

export default MilestoneCelebration;
