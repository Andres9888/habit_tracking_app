/**
 * PaywallRestoreLink — restore purchases + legal text
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '../../theme/colors/core';
import { typography, fontWeights } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface PaywallRestoreLinkProps {
  onRestore: () => void;
  disabled?: boolean;
}

export function PaywallRestoreLink({ onRestore, disabled }: PaywallRestoreLinkProps) {
  return (
    <View style={{ alignItems: 'center', paddingBottom: spacing.xl, paddingTop: spacing.base }}>
      <Pressable disabled={disabled} hitSlop={8} onPress={onRestore}>
        <Text
          style={{
            ...typography.bodySmall,
            color: colors.premium[400],
            fontWeight: fontWeights.medium,
          }}
        >
          Restore Purchases
        </Text>
      </Pressable>
      <Text
        style={{
          ...typography.tabBar,
          color: colors.text.tertiary,
          lineHeight: 16,
          marginTop: spacing.sm,
          paddingHorizontal: spacing.xl,
          textAlign: 'center',
        }}
      >
        7-day free trial, then auto-renews. Cancel anytime.
      </Text>
    </View>
  );
}
