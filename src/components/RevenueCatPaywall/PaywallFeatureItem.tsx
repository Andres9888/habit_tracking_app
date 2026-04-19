/**
 * PaywallFeatureItem — single feature row with emoji + text
 */

import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../theme/colors/core';
import { typography, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import type { PaywallFeature } from './paywall.types';

interface PaywallFeatureItemProps {
  feature: PaywallFeature;
}

export function PaywallFeatureItem({ feature }: PaywallFeatureItemProps) {
  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.sm }}>
      {/* Emoji icon with purple tinted background */}
      <View
        style={{
          alignItems: 'center',
          backgroundColor: `${colors.premium[400]}12`,
          borderRadius: borderRadius.medium,
          height: 40,
          justifyContent: 'center',
          width: 40,
        }}
      >
        <Text style={{ fontSize: 20 }}>{feature.emoji}</Text>
      </View>

      {/* Text content */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            ...typography.bodySmall,
            color: colors.text.primary,
            fontWeight: fontWeights.semibold,
          }}
        >
          {feature.title}
        </Text>
        <Text
          style={{
            ...typography.caption,
            color: colors.text.tertiary,
            fontWeight: fontWeights.regular,
          }}
        >
          {feature.description}
        </Text>
      </View>
    </View>
  );
}
