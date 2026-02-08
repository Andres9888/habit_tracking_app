/**
 * StreakMilestoneCelebration Component
 * Full-screen celebration modal for streak milestones (7, 30, 100 days)
 *
 * Orchestrates animated badge, content, and action buttons.
 * See BadgeSection, ContentSection, ActionButtons for sub-components.
 */

import React, { useEffect } from 'react';
import { View, AccessibilityInfo } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Modal } from '../Modal';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { ConfettiAnimation } from './ConfettiAnimation';
import { BadgeSection } from './BadgeSection';
import { ContentSection } from './ContentSection';
import { ActionButtons } from './ActionButtons';
import { ANIMATION_TIMING } from './constants';
import { styles } from './styles';
import type { StreakMilestoneCelebrationProps } from './types';

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 1 };

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

  const badgeScale = useSharedValue(0);
  const badgeRotate = useSharedValue(-15);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const contentOpacity = useSharedValue(0);
  const shareButtonOpacity = useSharedValue(0);
  const shareButtonTranslateY = useSharedValue(20);
  const continueButtonOpacity = useSharedValue(0);
  const continueButtonTranslateY = useSharedValue(20);

  useEffect(() => {
    if (visible) {
      if (reduceMotion) {
        badgeScale.value = 1;
        badgeRotate.value = 0;
        titleOpacity.value = 1;
        titleTranslateY.value = 0;
        contentOpacity.value = 1;
        shareButtonOpacity.value = 1;
        shareButtonTranslateY.value = 0;
        continueButtonOpacity.value = 1;
        continueButtonTranslateY.value = 0;
      } else {
        badgeScale.value = withSequence(
          withSpring(1.2, SPRING_CONFIG),
          withDelay(ANIMATION_TIMING.BADGE_SETTLE_DELAY, withSpring(1, SPRING_CONFIG))
        );
        badgeRotate.value = withSpring(0, SPRING_CONFIG);
        titleOpacity.value = withDelay(
          ANIMATION_TIMING.TITLE_DELAY,
          withTiming(1, { duration: ANIMATION_TIMING.CONTENT_FADE_DURATION, easing: Easing.out(Easing.cubic) })
        );
        titleTranslateY.value = withDelay(ANIMATION_TIMING.TITLE_DELAY, withSpring(0, SPRING_CONFIG));
        contentOpacity.value = withDelay(
          ANIMATION_TIMING.TITLE_DELAY + 100,
          withTiming(1, { duration: ANIMATION_TIMING.CONTENT_FADE_DURATION, easing: Easing.out(Easing.cubic) })
        );
        const buttonBaseDelay = ANIMATION_TIMING.TITLE_DELAY + 200;
        shareButtonOpacity.value = withDelay(buttonBaseDelay, withTiming(1, { duration: ANIMATION_TIMING.CONTENT_FADE_DURATION }));
        shareButtonTranslateY.value = withDelay(buttonBaseDelay, withSpring(0, SPRING_CONFIG));
        continueButtonOpacity.value = withDelay(buttonBaseDelay + ANIMATION_TIMING.BUTTON_STAGGER, withTiming(1, { duration: ANIMATION_TIMING.CONTENT_FADE_DURATION }));
        continueButtonTranslateY.value = withDelay(buttonBaseDelay + ANIMATION_TIMING.BUTTON_STAGGER, withSpring(0, SPRING_CONFIG));
      }
      AccessibilityInfo.announceForAccessibility(
        `Congratulations! ${milestone.title} You've maintained a ${streakDays} day streak for ${habitName}!`
      );
    }
  }, [visible, reduceMotion, milestone, streakDays, habitName]);

  useEffect(() => {
    if (!visible) {
      badgeScale.value = 0;
      badgeRotate.value = -15;
      titleOpacity.value = 0;
      titleTranslateY.value = 20;
      contentOpacity.value = 0;
      shareButtonOpacity.value = 0;
      shareButtonTranslateY.value = 20;
      continueButtonOpacity.value = 0;
      continueButtonTranslateY.value = 20;
    }
  }, [visible]);

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }, { rotate: `${badgeRotate.value}deg` }],
  }));
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));
  const contentAnimatedStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));
  const shareButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: shareButtonOpacity.value,
    transform: [{ translateY: shareButtonTranslateY.value }],
  }));
  const continueButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: continueButtonOpacity.value,
    transform: [{ translateY: continueButtonTranslateY.value }],
  }));

  return (
    <>
      <Modal backdropOpacity={0.7} style={styles.modalContent} variant="fullScreen" visible={visible} onClose={onClose}>
        <View style={styles.container}>
          <View style={styles.card}>
            <BadgeSection milestone={milestone} animatedStyle={badgeAnimatedStyle} />
            <ContentSection
              milestone={milestone}
              streakDays={streakDays}
              habitName={habitName}
              habitEmoji={habitEmoji}
              titleAnimatedStyle={titleAnimatedStyle}
              contentAnimatedStyle={contentAnimatedStyle}
            />
            <ActionButtons
              onShare={onShare}
              onClose={onClose}
              shareButtonAnimatedStyle={shareButtonAnimatedStyle}
              continueButtonAnimatedStyle={continueButtonAnimatedStyle}
            />
          </View>
        </View>
      </Modal>
      <ConfettiAnimation active={visible} />
    </>
  );
}

export default StreakMilestoneCelebration;
