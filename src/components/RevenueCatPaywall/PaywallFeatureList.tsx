/**
 * PaywallFeatureList — scrollable list of premium features
 */

import React from 'react';
import { View } from 'react-native';
import { spacing } from '../../theme/spacing';
import { colors } from '../../theme/colors/core';
import { borderRadius } from '../../theme/spacing';
import { PaywallFeatureItem } from './PaywallFeatureItem';
import { PAYWALL_FEATURES } from './paywall.constants';

export function PaywallFeatureList() {
  return (
    <View
      style={{
        backgroundColor: colors.light.surfaceMuted,
        borderColor: colors.border,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        marginHorizontal: spacing.base,
        marginTop: spacing.lg,
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.sm,
      }}
    >
      {PAYWALL_FEATURES.map((feature) => (
        <PaywallFeatureItem key={feature.id} feature={feature} />
      ))}
    </View>
  );
}
