/**
 * PaywallHero — crown icon + title + subtitle
 */

import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../theme/colors/core';
import { fontFamilies, fontWeights } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { PAYWALL_HERO } from './paywall.constants';

export function PaywallHero() {
  return (
    <View style={{ alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
      {/* Premium badge */}
      <View
        style={{
          alignItems: 'center',
          backgroundColor: `${colors.premium[400]}15`,
          borderRadius: borderRadius.full,
          height: 64,
          justifyContent: 'center',
          marginBottom: spacing.base,
          width: 64,
        }}
      >
        <Text style={{ fontSize: 32 }}>{'\u2728'}</Text>
      </View>

      {/* Title — Literata serif */}
      <Text
        style={{
          color: colors.text.primary,
          fontFamily: fontFamilies.primary.display,
          fontSize: 26,
          fontWeight: fontWeights.bold,
          letterSpacing: -0.5,
          lineHeight: 32,
          marginBottom: spacing.sm,
          textAlign: 'center',
        }}
      >
        {PAYWALL_HERO.title}
      </Text>

      {/* Subtitle — DM Sans */}
      <Text
        style={{
          color: colors.text.secondary,
          fontFamily: fontFamilies.primary.text,
          fontSize: 16,
          fontWeight: fontWeights.regular,
          lineHeight: 22,
          textAlign: 'center',
        }}
      >
        {PAYWALL_HERO.subtitle}
      </Text>
    </View>
  );
}
