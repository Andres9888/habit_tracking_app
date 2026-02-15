/**
 * NotificationPermissionSheet
 *
 * A pre-prompt bottom sheet that explains what notifications the app sends
 * and why, before triggering the system permission dialog.
 *
 * Best practice: iOS only shows the system dialog once. This pre-prompt
 * ensures users understand the value before they decide.
 *
 * Notification types explained:
 * - Habit reminders: Daily nudges at your chosen time
 * - Streak alerts: Warnings before a streak breaks
 * - Celebrations: Milestone achievements (7, 30, 100 days)
 * - Letters to Self: Unlock notifications for time-capsule letters
 */

import { useCallback, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ensureNotificationPermissions } from '../utils/notifications';
import { useThemeColors } from '../theme/ThemeContext';

interface NotificationPermissionSheetProps {
  visible: boolean;
  onComplete: (granted: boolean) => void;
  onDismiss: () => void;
}

const NOTIFICATION_BENEFITS = [
  {
    emoji: '⏰',
    title: 'Daily Reminders',
    description: 'A gentle nudge at the time you choose — never miss a habit.',
  },
  {
    emoji: '🔥',
    title: 'Streak Alerts',
    description: "We'll warn you before a streak is about to break.",
  },
  {
    emoji: '🎉',
    title: 'Milestone Celebrations',
    description: 'Get celebrated when you hit 7, 30, or 100-day streaks!',
  },
  {
    emoji: '💌',
    title: 'Letters to Self',
    description: "Know the moment your time-capsule letter is ready to read.",
  },
];

export function NotificationPermissionSheet({
  visible,
  onComplete,
  onDismiss,
}: NotificationPermissionSheetProps) {
  const { colors } = useThemeColors();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleEnable = useCallback(async () => {
    if (isRequesting) return;
    setIsRequesting(true);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const granted = await ensureNotificationPermissions();
      onComplete(granted);
    } catch {
      onComplete(false);
    } finally {
      setIsRequesting(false);
    }
  }, [isRequesting, onComplete]);

  const handleSkip = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDismiss();
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <Animated.View
          entering={FadeInDown.springify().damping(18)}
          style={[styles.sheet, { backgroundColor: colors.card }]}
        >
          {/* Bell icon */}
          <Animated.View
            entering={FadeIn.delay(100)}
            style={[styles.iconContainer, { backgroundColor: '#F0FDF4' }]}
          >
            <Text style={styles.bellEmoji}>🔔</Text>
          </Animated.View>

          <Text style={[styles.title, { color: colors.text.primary }]}>
            Stay on track with notifications
          </Text>

          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            We&apos;ll only send what helps you build habits — nothing spammy, ever.
          </Text>

          {/* Benefits list */}
          <View style={styles.benefitsList}>
            {NOTIFICATION_BENEFITS.map((benefit, index) => (
              <Animated.View
                key={benefit.title}
                entering={FadeInDown.delay(150 + index * 60).springify().damping(18)}
                style={styles.benefitRow}
              >
                <Text style={styles.benefitEmoji}>{benefit.emoji}</Text>
                <View style={styles.benefitText}>
                  <Text style={[styles.benefitTitle, { color: colors.text.primary }]}>
                    {benefit.title}
                  </Text>
                  <Text style={[styles.benefitDescription, { color: colors.text.secondary }]}>
                    {benefit.description}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>

          {/* CTA */}
          <Pressable
            accessibilityLabel="Enable notifications"
            accessibilityRole="button"
            disabled={isRequesting}
            style={[styles.enableButton, isRequesting && styles.buttonDisabled]}
            onPress={() => void handleEnable()}
          >
            <Text style={styles.enableButtonText}>
              {isRequesting ? 'Requesting…' : 'Enable Notifications'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityLabel="Skip enabling notifications"
            accessibilityRole="button"
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={[styles.skipButtonText, { color: colors.text.secondary }]}>
              Maybe later
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    alignItems: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 32,
    width: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 24,
    height: 64,
    justifyContent: 'center',
    marginBottom: 16,
    width: 64,
  },
  bellEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  benefitsList: {
    gap: 16,
    marginBottom: 28,
    width: '100%',
  },
  benefitRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  benefitEmoji: {
    fontSize: 24,
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  benefitDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  enableButton: {
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    elevation: 4,
    paddingHorizontal: 32,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  enableButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 16,
    minHeight: 44,
    justifyContent: 'center',
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default NotificationPermissionSheet;
