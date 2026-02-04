/**
 * PaywallHeader - Dismiss button zone (48px height)
 */

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { PAYWALL_COLORS, SPACING } from './paywall.constants';

interface PaywallHeaderProps {
  onClose: () => void;
}

export function PaywallHeader({ onClose }: PaywallHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityHint='Dismiss the premium subscription screen'
        accessibilityLabel='Close'
        accessibilityRole='button'
        hitSlop={12}
        style={({ pressed }) => [
          styles.closeButton,
          pressed && styles.closeButtonPressed,
        ]}
        onPress={onClose}
      >
        <X color={PAYWALL_COLORS.neutral} size={24} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  closeButtonPressed: { backgroundColor: `${PAYWALL_COLORS.neutral}20` },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 48,
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
  },
});
