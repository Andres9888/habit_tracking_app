/**
 * NotificationPrePermissionModal
 *
 * A value-first explanation screen shown BEFORE the OS notification
 * permission dialog. Displaying context about why notifications help
 * ("Want reminders to keep your streak going?") dramatically improves
 * the OS-prompt grant rate by priming user intent.
 *
 * Shown once, after the user completes their very first habit.
 */

import React, { useEffect } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { Modal } from '../Modal';
import { useThemeColors } from '../../theme/ThemeContext';

interface Benefit {
  emoji: string;
  text: string;
}

const BENEFITS: Benefit[] = [
  { emoji: '🔥', text: 'Daily reminders help protect your streak' },
  { emoji: '⏰', text: 'Custom times that fit your schedule' },
  { emoji: '🏆', text: 'Stay consistent and build lasting habits' },
];

const SPRING_CONFIG = { damping: 18, mass: 1, stiffness: 200 };

interface NotificationPrePermissionModalProps {
  visible: boolean;
  isRequestingPermission: boolean;
  onEnable: () => void;
  onSkip: () => void;
}

export function NotificationPrePermissionModal({
  visible,
  isRequestingPermission,
  onEnable,
  onSkip,
}: NotificationPrePermissionModalProps) {
  const { colors } = useThemeColors();
  const bellScale = useSharedValue(0);
  const bellRotate = useSharedValue(-20);

  // Announce to screen readers when visible
  useEffect(() => {
    if (visible) {
      AccessibilityInfo.announceForAccessibility(
        'Notification permission request. Want reminders to keep your streak going?'
      );
    }
  }, [visible]);

  // Bell icon entrance animation
  useEffect(() => {
    if (visible) {
      bellScale.value = withDelay(150, withSpring(1, SPRING_CONFIG));
      bellRotate.value = withDelay(200, withSpring(0, { ...SPRING_CONFIG, damping: 12 }));
    } else {
      bellScale.value = 0;
      bellRotate.value = -20;
    }
  }, [visible, bellScale, bellRotate]);

  const bellAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: bellScale.value },
      { rotate: `${bellRotate.value}deg` },
    ],
  }));

  const isDark = colors.background === '#111827';

  const styles = makeStyles(colors, isDark);

  return (
    <Modal
      visible={visible}
      onClose={onSkip}
      variant="centerAlert"
      disableBackdropClose={isRequestingPermission}
      disableGestureClose
    >
      <View style={styles.container}>
        {/* Bell icon */}
        <Animated.View style={[styles.iconContainer, bellAnimatedStyle]}>
          <Text style={styles.bellEmoji} accessibilityLabel="Bell">🔔</Text>
        </Animated.View>

        {/* Headline */}
        <Animated.View entering={FadeInUp.delay(250).duration(400)}>
          <Text style={styles.headline} accessibilityRole="header">
            Want reminders to keep your streak going?
          </Text>
          <Text style={styles.subheadline}>
            You just completed your first habit — great start! Notifications
            can help you stay consistent and never miss a day.
          </Text>
        </Animated.View>

        {/* Benefit list */}
        <Animated.View
          entering={FadeInDown.delay(350).duration(400)}
          style={styles.benefitsList}
        >
          {BENEFITS.map((benefit, index) => (
            <View
              key={benefit.emoji}
              style={[
                styles.benefitRow,
                index < BENEFITS.length - 1 && styles.benefitRowBorder,
              ]}
            >
              <Text style={styles.benefitEmoji}>{benefit.emoji}</Text>
              <Text style={styles.benefitText}>{benefit.text}</Text>
            </View>
          ))}
        </Animated.View>

        {/* CTA buttons */}
        <Animated.View
          entering={FadeInDown.delay(450).duration(400)}
          style={styles.buttonStack}
        >
          <TouchableOpacity
            style={[
              styles.enableButton,
              isRequestingPermission && styles.enableButtonDisabled,
            ]}
            onPress={onEnable}
            disabled={isRequestingPermission}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Enable Notifications"
            accessibilityState={{ disabled: isRequestingPermission }}
          >
            {isRequestingPermission ? (
              <ActivityIndicator
                color="#ffffff"
                size="small"
                style={styles.spinner}
              />
            ) : (
              <Text style={styles.enableButtonText}>Enable Notifications</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkip}
            disabled={isRequestingPermission}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Maybe Later"
          >
            <Text style={styles.skipButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        </Animated.View>

        {Platform.OS === 'ios' && (
          <Animated.View entering={FadeInDown.delay(500).duration(400)}>
            <Text style={styles.disclaimer}>
              You can change this anytime in Settings.
            </Text>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

function makeStyles(
  colors: ReturnType<typeof useThemeColors>['colors'],
  _isDark: boolean
) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      padding: 24,
      paddingBottom: 28,
    },
    iconContainer: {
      alignItems: 'center',
      backgroundColor: colors.primary[100],
      borderRadius: 40,
      height: 80,
      justifyContent: 'center',
      marginBottom: 20,
      width: 80,
    },
    bellEmoji: {
      fontSize: 40,
    },
    headline: {
      color: colors.text.primary,
      fontSize: 22,
      fontWeight: '700',
      letterSpacing: -0.3,
      marginBottom: 10,
      textAlign: 'center',
    },
    subheadline: {
      color: colors.text.secondary,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 20,
      textAlign: 'center',
    },
    benefitsList: {
      alignSelf: 'stretch',
      backgroundColor: colors.surface,
      borderRadius: 16,
      marginBottom: 24,
      overflow: 'hidden',
    },
    benefitRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    benefitRowBorder: {
      borderBottomColor: colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    benefitEmoji: {
      fontSize: 22,
      width: 30,
      textAlign: 'center',
    },
    benefitText: {
      color: colors.text.primary,
      flex: 1,
      fontSize: 15,
      lineHeight: 20,
    },
    buttonStack: {
      alignSelf: 'stretch',
      gap: 10,
    },
    enableButton: {
      alignItems: 'center',
      backgroundColor: colors.primary[300],
      borderRadius: 14,
      justifyContent: 'center',
      minHeight: 52,
      paddingVertical: 14,
    },
    enableButtonDisabled: {
      opacity: 0.6,
    },
    enableButtonText: {
      color: '#ffffff',
      fontSize: 17,
      fontWeight: '600',
    },
    spinner: {
      height: 20,
    },
    skipButton: {
      alignItems: 'center',
      borderRadius: 14,
      paddingVertical: 12,
    },
    skipButtonText: {
      color: colors.text.secondary,
      fontSize: 15,
      fontWeight: '500',
    },
    disclaimer: {
      color: colors.text.tertiary,
      fontSize: 12,
      marginTop: 10,
      textAlign: 'center',
    },
  });
}
