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
import { View, Text, StyleSheet } from 'react-native';
import { Lock, Flame, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type PremiumBadgeVariant = 'pro' | 'popular' | 'new';

interface PremiumBadgeProps {
  variant?: PremiumBadgeVariant;
  style?: any;
}

export function PremiumBadge({ variant = 'pro', style }: PremiumBadgeProps) {
  if (variant === 'popular') {
    return (
      <View style={[styles.badge, styles.popularBadge, style]}>
        <Flame size={12} color="#ff4500" strokeWidth={2.5} />
        <Text style={[styles.badgeText, { color: '#ff4500' }]}>Popular</Text>
      </View>
    );
  }

  if (variant === 'new') {
    return (
      <View style={[styles.badge, styles.newBadge, style]}>
        <Sparkles size={12} color="#3b82f6" strokeWidth={2.5} />
        <Text style={[styles.badgeText, { color: '#3b82f6' }]}>New</Text>
      </View>
    );
  }

  // Pro badge with gradient
  return (
    <LinearGradient
      colors={['#FFD700', '#FFA500']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.badge, styles.proBadge, style]}
    >
      <Lock size={11} color="#6b4500" strokeWidth={2.75} />
      <Text style={[styles.badgeText, styles.proBadgeText]}>PRO</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  proBadge: {
    // Gradient applied via LinearGradient
  },
  popularBadge: {
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  newBadge: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  proBadgeText: {
    color: '#6b4500',
  },
});

export default PremiumBadge;
