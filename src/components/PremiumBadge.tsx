/**
 * PremiumBadge Component
 * Displays subtle premium indicator on template cards
 *
 * Variants:
 * - 'pro' - Gold badge with lock icon
 * - 'popular' - Fire emoji badge
 * - 'new' - Blue "New" badge
 */

import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { Lock, Flame, Sparkles } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { LinearGradient } from 'expo-linear-gradient';
import { shadows, borderRadius } from '../theme/spacing'
import { typography, fontFamilies, fontWeights } from '../theme/typography';
import { colors } from '../theme/colors';

type PremiumBadgeVariant = 'pro' | 'popular' | 'new';

interface PremiumBadgeProps {
  variant?: PremiumBadgeVariant;
  style?: ViewStyle;
}

export function PremiumBadge({ variant = 'pro', style }: PremiumBadgeProps) {
  if (variant === 'popular') {
    return (
      <View style={[styles.badge, styles.popularBadge, style]}>
        <Flame color='#ff4500' size={iconSizes.micro} strokeWidth={2.5} />
        <Text style={[styles.badgeText, { color: '#ff4500' }]}>Popular</Text>
      </View>
    );
  }

  if (variant === 'new') {
    return (
      <View style={[styles.badge, styles.newBadge]}>
        <Sparkles color={colors.secondary[500]} size={iconSizes.micro} strokeWidth={2.5} />
        <Text style={[styles.badgeText, { color: colors.secondary[500] }]}>New</Text>
      </View>
    );
  }

  // Pro badge with violet gradient (premium color)
  return (
    <LinearGradient
      colors={['#8b5cf6', '#7c3aed']}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={[styles.badge, styles.proBadge, style]}
    >
      <Lock color={colors.text.inverse} size={iconSizes.micro} strokeWidth={2.5} />
      <Text style={[styles.badgeText, styles.proBadgeText]}>PRO</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    ...shadows.card,
    alignItems: 'center',
    borderRadius: borderRadius.small,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    right: 12,
    shadowOpacity: 0.15,
    top: 12,
    zIndex: 10,
  },
  badgeText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  newBadge: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
  },
  popularBadge: {
    backgroundColor: '#fff5f5',
    borderColor: '#fecaca',
    borderWidth: 1,
  },
  proBadge: {
    // Gradient applied via LinearGradient
  },
  proBadgeText: {
    color: colors.text.inverse,
  },
});

export default PremiumBadge;
