/**
 * OnboardingTooltip
 *
 * Subtle tutorial tooltip shown on first use to explain key UI elements.
 * Auto-dismisses on tap or after timeout. Stores seen state to never show again.
 *
 * Created by Opus.
 */

import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, useReducedMotion } from 'react-native-reanimated';

import { trackTooltipDismissed, trackTooltipShown } from '../../../lib/analytics/onboarding';

interface OnboardingTooltipProps {
  id: string;
  text: string;
  visible: boolean;
  onDismiss: () => void;
  /** Position relative to the target element */
  position?: 'above' | 'below';
  /** Auto-dismiss after ms (default 6000) */
  autoDismissMs?: number;
}

export function OnboardingTooltip({
  id,
  text,
  visible,
  onDismiss,
  position = 'below',
  autoDismissMs = 6000,
}: OnboardingTooltipProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (visible) {
      trackTooltipShown(id);
      const timer = setTimeout(() => {
        trackTooltipDismissed(id);
        onDismiss();
      }, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [visible, id, onDismiss, autoDismissMs]);

  if (!visible) return null;

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeIn.duration(200)}
      exiting={reduceMotion ? undefined : FadeOut.duration(150)}
      style={[styles.container, position === 'above' ? styles.above : styles.below]}
    >
      <Pressable
        accessibilityLabel={`Dismiss tooltip: ${text}`}
        accessibilityRole="button"
        style={styles.tooltip}
        onPress={() => {
          trackTooltipDismissed(id);
          onDismiss();
        }}
      >
        <View
          style={[
            styles.arrow,
            position === 'above' ? styles.arrowBelow : styles.arrowAbove,
          ]}
        />
        <Text style={styles.text}>{text}</Text>
        <Text style={styles.tapHint}>Tap to dismiss</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 100,
  },
  above: {
    bottom: '100%',
    marginBottom: 8,
  },
  below: {
    top: '100%',
    marginTop: 8,
  },
  tooltip: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: 260,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
    left: '50%',
    marginLeft: -8,
  },
  arrowAbove: {
    top: -6,
    borderBottomWidth: 6,
    borderBottomColor: '#1F2937',
  },
  arrowBelow: {
    bottom: -6,
    borderTopWidth: 6,
    borderTopColor: '#1F2937',
  },
  text: {
    color: '#F9FAFB',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center',
  },
  tapHint: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
});
