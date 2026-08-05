/**
 * PaywallPlanCard — individual plan option (monthly or annual)
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '../../theme/colors/core';
import { typography, fontWeights } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import type { PaywallPlanCardProps } from './paywall.types';

export function PaywallPlanCard({ type, pkg, isSelected, savingsPercent, onSelect }: PaywallPlanCardProps) {
  const isAnnual = type === 'annual';
  const label = isAnnual ? 'Annual' : 'Monthly';
  const priceString = pkg?.product.priceString ?? '...';
  const period = isAnnual ? '/year' : '/month';

  return (
    <Pressable
      accessibilityLabel={`${label} plan ${priceString}`}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      style={{
        backgroundColor: isSelected ? `${colors.primary[600]}08` : colors.light.surfaceMuted,
        borderColor: isSelected ? colors.primary[600] : colors.border,
        borderRadius: borderRadius.large,
        borderWidth: isSelected ? 2 : 1,
        flex: 1,
        padding: spacing.md,
      }}
      onPress={onSelect}
    >
      {/* Savings badge for annual */}
      {isAnnual && savingsPercent !== null ? (
        <View
          style={{
            alignSelf: 'flex-start',
            backgroundColor: colors.primary[600],
            borderRadius: borderRadius.small,
            marginBottom: spacing.xs,
            paddingHorizontal: spacing.sm,
            paddingVertical: 2,
          }}
        >
          <Text
            style={{
              ...typography.tabBar,
              color: colors.text.inverse,
              fontWeight: fontWeights.bold,
            }}
          >
            Save {savingsPercent}%
          </Text>
        </View>
      ) : null}

      <Text
        style={{
          ...typography.caption,
          color: colors.text.secondary,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          ...typography.heading3,
          color: colors.text.primary,
          fontWeight: fontWeights.bold,
          marginTop: 2,
        }}
      >
        {priceString}
        <Text style={{ ...typography.bodySmall, color: colors.text.tertiary }}>
          {period}
        </Text>
      </Text>
    </Pressable>
  );
}
