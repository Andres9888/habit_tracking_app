/**
 * MilestoneCelebration Component
 * Based on UX Specification Section 8.2: Milestone Celebration Animation
 *
 * Purpose: Celebrate when user reaches new habit strength level (20%, 40%, 60%, 80%)
 * Features: Full-screen modal, confetti animation, badge display with emoji, haptic feedback
 * Accessibility: Reduce Motion support, VoiceOver announcements
 * Performance: 60fps target on iPhone SE
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  AccessibilityInfo,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../theme';
import { Modal } from './Modal';
import { Button } from './Button/Button';
import {
  STRENGTH_LEVEL_CONFIG,
  type StrengthLevel,
} from './HabitStrengthIndicator/HabitStrengthIndicator';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Custom hook to detect Reduce Motion preference
 * Falls back to false if not available
 */
function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Check if reduce motion is enabled
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled ?? false);
    });

    // Listen for changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        setReduceMotion(enabled);
      }
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  return reduceMotion;
}

export interface MilestoneCelebrationProps {
  /** Modal visibility */
  visible: boolean;

  /** On close callback */
  onClose: () => void;

  /** Strength level achieved */
  level: StrengthLevel;

  /** Current strength percentage */
  strength: number;

  /** Habit name for context */
  habitName: string;

  /** On share callback */
  onShare?: () => void;
}

/**
 * Confetti colors from UX spec: Primary green variants + gold
 */
const CONFETTI_COLORS = [
  '#86EFAC', // Light green (starting)
  '#34D399', // Primary 400
  '#10B981', // Primary 500 (brand green)
  '#059669', // Primary 600
  '#047857', // Primary 700
  '#F59E0B', // Gold/amber
];

export function MilestoneCelebration({
  visible,
  onClose,
  level,
  strength,
  habitName,
  onShare,
}: MilestoneCelebrationProps) {
  const theme = useAppTheme();
  const confettiRef = useRef<any>(null);
  const reduceMotion = useReduceMotion();

  const config = STRENGTH_LEVEL_CONFIG[level];

  // Animation values
  const badgeScale = useSharedValue(0);
  const glowOpacity = useSharedValue(0.3);
  const labelOpacity = useSharedValue(0);
  const percentageValue = useSharedValue(0);
  const shareButtonTranslateY = useSharedValue(50);
  const shareButtonOpacity = useSharedValue(0);
  const continueButtonOpacity = useSharedValue(0);

  // Trigger confetti when modal opens
  useEffect(() => {
    if (visible && confettiRef.current && !reduceMotion) {
      // Delay confetti to sync with modal animation
      setTimeout(() => {
        confettiRef.current?.start();
      }, 200);
    }
  }, [visible, reduceMotion]);

  // Animation sequence when modal opens
  useEffect(() => {
    if (visible) {
      // Haptic: Heavy impact on modal open
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      if (reduceMotion) {
        // Reduce Motion: Instant appearance, no animations
        badgeScale.value = 1;
        glowOpacity.value = 0.5;
        labelOpacity.value = 1;
        percentageValue.value = strength;
        shareButtonTranslateY.value = 0;
        shareButtonOpacity.value = 1;
        continueButtonOpacity.value = 1;
      } else {
        // Full animation sequence
        // 1. Badge animation (300-800ms) - bounce effect
        badgeScale.value = withSequence(
          withSpring(1.3, { damping: 10, stiffness: 100 }),
          withSpring(1, { damping: 15, stiffness: 150 }, () => {
            // Haptic: Heavy impact on badge full scale
            runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Heavy);
          })
        );

        // 2. Glow pulse effect
        glowOpacity.value = withSequence(
          withTiming(0.8, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.6, { duration: 400, easing: Easing.inOut(Easing.ease) })
        );

        // 3. Label fade in
        labelOpacity.value = withDelay(
          300,
          withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) })
        );

        // 4. Percentage counter animation
        percentageValue.value = withDelay(
          300,
          withTiming(strength, {
            duration: 500,
            easing: Easing.out(Easing.ease),
          })
        );

        // 5. Share button slide up (800-1200ms)
        shareButtonTranslateY.value = withDelay(
          800,
          withSpring(0, { damping: 15, stiffness: 150 })
        );
        shareButtonOpacity.value = withDelay(
          800,
          withTiming(1, { duration: 200 })
        );

        // 6. Continue button fade in
        continueButtonOpacity.value = withDelay(
          1000,
          withTiming(1, { duration: 300 })
        );
      }

      // VoiceOver announcement
      const message = `Milestone achieved! ${habitName} reached ${config.label} level at ${Math.round(strength)}% strength. ${config.description}`;
      AccessibilityInfo.announceForAccessibility(message);
    } else {
      // Reset animations when modal closes
      badgeScale.value = 0;
      glowOpacity.value = 0.3;
      labelOpacity.value = 0;
      percentageValue.value = 0;
      shareButtonTranslateY.value = 50;
      shareButtonOpacity.value = 0;
      continueButtonOpacity.value = 0;
    }
  }, [visible, level, strength, habitName, reduceMotion]);

  // Animated styles
  const badgeContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
  }));

  const percentageStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
  }));

  const shareButtonStyle = useAnimatedStyle(() => ({
    opacity: shareButtonOpacity.value,
    transform: [{ translateY: shareButtonTranslateY.value }],
  }));

  const continueButtonStyle = useAnimatedStyle(() => ({
    opacity: continueButtonOpacity.value,
  }));

  // Handle share action
  const handleShare = useCallback(() => {
    if (onShare) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onShare();
    }
  }, [onShare]);

  // Handle continue/dismiss
  const handleContinue = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  return (
    <>
      <Modal
        backdropOpacity={0.6}
        style={styles.modalContent}
        variant='fullScreen'
        visible={visible}
        onClose={handleContinue}
      >
        <View style={styles.container}>
          {/* Celebration Content */}
          <View style={styles.content}>
            {/* Badge with Glow Effect */}
            <View style={styles.badgeContainer}>
              {/* Glow effect behind emoji */}
              <Animated.View
                style={[
                  styles.glow,
                  glowStyle,
                  {
                    backgroundColor: theme.custom.colors.warning[500], // Gold glow
                  },
                ]}
              />

              {/* Milestone Emoji */}
              <Animated.View style={badgeContainerStyle}>
                <Text
                  accessible
                  accessibilityLabel={`${config.label} milestone emoji`}
                  style={styles.emoji}
                >
                  {config.emoji}
                </Text>
              </Animated.View>
            </View>

            {/* Level Name */}
            <Animated.Text
              accessible
              accessibilityRole='header'
              style={[
                theme.custom.typography.heading1,
                styles.levelName,
                { color: theme.custom.colors.gray[900] },
                labelStyle,
              ]}
            >
              {config.label}
            </Animated.Text>

            {/* Description */}
            <Animated.Text
              style={[
                theme.custom.typography.body,
                styles.description,
                { color: theme.custom.colors.gray[600] },
                labelStyle,
              ]}
            >
              {config.description}
            </Animated.Text>

            {/* Strength Percentage */}
            <Animated.View
              style={[styles.percentageContainer, percentageStyle]}
            >
              <Text
                accessible
                accessibilityLabel={`${Math.round(strength)} percent strength`}
                style={[
                  theme.custom.typography.heading1,
                  styles.percentage,
                  {
                    color: theme.custom.colors.primary[500],
                    fontFamily: theme.custom.fontFamilies.monospace,
                  },
                ]}
              >
                {Math.round(strength)}%
              </Text>
              <Text
                style={[
                  theme.custom.typography.caption,
                  { color: theme.custom.colors.gray[500] },
                ]}
              >
                Strength
              </Text>
            </Animated.View>

            {/* Habit Name Context */}
            <Animated.Text
              style={[
                theme.custom.typography.bodySmall,
                styles.habitName,
                { color: theme.custom.colors.gray[500] },
                labelStyle,
              ]}
            >
              {habitName}
            </Animated.Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            {/* Share Button */}
            {onShare && (
              <Animated.View style={[styles.shareButton, shareButtonStyle]}>
                <Button
                  accessible
                  accessibilityHint='Opens share card preview'
                  accessibilityLabel='Share your achievement'
                  size='large'
                  variant='primary'
                  onPress={handleShare}
                >
                  Share Your Achievement
                </Button>
              </Animated.View>
            )}

            {/* Continue Button */}
            <Animated.View style={continueButtonStyle}>
              <Button
                accessible
                accessibilityHint='Dismiss celebration and return to app'
                accessibilityLabel='Continue'
                size='large'
                variant='ghost'
                onPress={handleContinue}
              >
                Continue
              </Button>
            </Animated.View>
          </View>
        </View>
      </Modal>

      {/* Confetti Animation - Only if Reduce Motion is disabled */}
      {!reduceMotion && visible && (
        <ConfettiCannon
          ref={confettiRef}
          fadeOut
          autoStart={false}
          colors={CONFETTI_COLORS}
          count={100}
          explosionSpeed={350}
          fallSpeed={2500}
          origin={{ x: SCREEN_WIDTH / 2, y: 0 }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  actions: {
    gap: 12,
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingTop: 80,
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  description: {
    marginTop: 4,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 80,
    textAlign: 'center',
  },
  glow: {
    borderRadius: 80,
    height: 160,
    elevation: 20,
    position: 'absolute',
    shadowColor: '#F59E0B',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.8,
    width: 160,
    shadowRadius: 40,
  },
  habitName: {
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  levelName: {
    marginTop: 8,
    textAlign: 'center',
  },
  modalContent: {
    paddingHorizontal: 24,
  },
  percentage: {
    fontSize: 48,
    lineHeight: 56,
  },
  percentageContainer: {
    alignItems: 'center',
    gap: 4,
    marginTop: 24,
  },
  shareButton: {
    width: '100%',
  },
});

export default MilestoneCelebration;
