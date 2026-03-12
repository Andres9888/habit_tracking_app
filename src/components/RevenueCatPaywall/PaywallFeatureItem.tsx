/**
 * PaywallFeatureItem — single feature row with emoji + text
 */

import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../theme/colors/core';
import { fontFamilies, fontWeights } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
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
          borderRadius: 12,
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
            color: colors.text.primary,
            fontFamily: fontFamilies.primary.text,
            fontSize: 15,
            fontWeight: fontWeights.semibold,
            lineHeight: 20,
          }}
        >
          {feature.title}
        </Text>
        <Text
          style={{
            color: colors.text.tertiary,
            fontFamily: fontFamilies.primary.text,
            fontSize: 13,
            fontWeight: fontWeights.regular,
            lineHeight: 18,
          }}
        >
          {feature.description}
        </Text>
      </View>
    </View>
  );
}
