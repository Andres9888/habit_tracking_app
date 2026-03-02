/**
 * StreakMilestoneCelebration Component
 * Full-screen celebration modal for streak milestones (7, 30, 100 days)
 *
 * Orchestrates animated badge, content, and action buttons.
 * See BadgeSection, ContentSection, ActionButtons for sub-components.
 */

import { useEffect } from 'react';
import { View, AccessibilityInfo } from 'react-native';
import { Modal } from '../Modal';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { ConfettiAnimation } from './ConfettiAnimation';
import { BadgeSection } from './BadgeSection';
import { ContentSection } from './ContentSection';
import { ActionButtons } from './ActionButtons';
import { useCelebrationAnimations } from './useCelebrationAnimations';
import { styles } from './styles';
import type { StreakMilestoneCelebrationProps } from './types';

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
  const animations = useCelebrationAnimations(visible, reduceMotion);

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
        accessibilityViewIsModal
        backdropOpacity={0.7}
        style={styles.modalContent}
        variant='fullScreen'
        visible={visible}
        onClose={onClose}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <BadgeSection
              animatedStyle={animations.badgeAnimatedStyle}
              milestone={milestone}
            />
            <ContentSection
              contentAnimatedStyle={animations.contentAnimatedStyle}
              habitEmoji={habitEmoji}
              habitName={habitName}
              milestone={milestone}
              streakDays={streakDays}
              titleAnimatedStyle={animations.titleAnimatedStyle}
            />
            <ActionButtons
              continueButtonAnimatedStyle={
                animations.continueButtonAnimatedStyle
              }
              shareButtonAnimatedStyle={animations.shareButtonAnimatedStyle}
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
