/**
 * YearlyCard - Primary pricing card (emphasized)
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useYearlyCardAnimation } from './usePaywallEntryAnimations';
import { useCardInteractionAnimation } from './usePaywallInteractionAnimations';
import { PAYWALL_COLORS, SPACING, PRICING } from './paywall.constants';
import type { PlanType } from './types';

interface YearlyCardProps {
  onSelectPlan: (plan: PlanType) => void;
  reduceMotion: boolean;
  selectedPlan: PlanType;
  visible: boolean;
}

export function YearlyCard({
  visible,
  reduceMotion,
  selectedPlan,
  onSelectPlan,
}: YearlyCardProps) {
  const entryAnim = useYearlyCardAnimation(visible, reduceMotion);
  const interaction = useCardInteractionAnimation(reduceMotion);
  const isSelected = selectedPlan === 'yearly';

  return (
    <Pressable
      accessibilityLabel={`Select yearly plan, ${PRICING.yearly.price} per year`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      onPress={() => onSelectPlan('yearly')}
      onPressIn={interaction.handlePressIn}
      onPressOut={interaction.handlePressOut}
    >
      <Animated.View
        style={[
          styles.card,
          isSelected && styles.cardSelected,
          reduceMotion ? undefined : entryAnim.animatedStyle,
          reduceMotion ? undefined : interaction.animatedStyle,
        ]}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{PRICING.yearly.savingsBadge}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.planName}>{PRICING.yearly.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{PRICING.yearly.price}</Text>
            <Text style={styles.period}>{PRICING.yearly.period}</Text>
          </View>
          <Text style={styles.monthlyEquivalent}>
            {PRICING.yearly.monthlyEquivalent}
          </Text>
        </View>
        <View style={[styles.radio, isSelected && styles.radioSelected]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: PAYWALL_COLORS.accent,
    borderRadius: 8,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    position: 'absolute',
    right: 16,
    top: -10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  card: {
    alignItems: 'center',
    backgroundColor: PAYWALL_COLORS.surfaceElevated,
    borderRadius: 16,
    elevation: 4,
    flexDirection: 'row',
    padding: SPACING.lg,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  cardSelected: { borderColor: PAYWALL_COLORS.accent, borderWidth: 2 },
  content: { flex: 1 },
  monthlyEquivalent: {
    color: PAYWALL_COLORS.accent,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  period: { color: PAYWALL_COLORS.neutral, fontSize: 16, marginLeft: 2 },
  planName: {
    color: PAYWALL_COLORS.text,
    fontSize: 21,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    color: PAYWALL_COLORS.text,
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '700',
  },
  priceRow: { alignItems: 'baseline', flexDirection: 'row' },
  radio: {
    alignItems: 'center',
    borderColor: PAYWALL_COLORS.border,
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  radioInner: {
    backgroundColor: PAYWALL_COLORS.accent,
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  radioSelected: { borderColor: PAYWALL_COLORS.accent },
});
