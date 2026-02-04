/**
 * MonthlyCard - Secondary pricing card (subordinate)
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useMonthlyCardAnimation } from './usePaywallEntryAnimations';
import { useCardInteractionAnimation } from './usePaywallInteractionAnimations';
import { PAYWALL_COLORS, SPACING, PRICING } from './paywall.constants';
import type { PlanType } from './types';

interface MonthlyCardProps {
  onSelectPlan: (plan: PlanType) => void;
  reduceMotion: boolean;
  selectedPlan: PlanType;
  visible: boolean;
}

export function MonthlyCard({
  visible,
  reduceMotion,
  selectedPlan,
  onSelectPlan,
}: MonthlyCardProps) {
  const entryAnim = useMonthlyCardAnimation(visible, reduceMotion);
  const interaction = useCardInteractionAnimation(reduceMotion);
  const isSelected = selectedPlan === 'monthly';

  return (
    <Pressable
      accessibilityLabel={`Select monthly plan, ${PRICING.monthly.price} per month`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      onPress={() => onSelectPlan('monthly')}
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
        <View style={styles.content}>
          <Text style={styles.planName}>{PRICING.monthly.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{PRICING.monthly.price}</Text>
            <Text style={styles.period}>{PRICING.monthly.period}</Text>
          </View>
        </View>
        <View style={[styles.radio, isSelected && styles.radioSelected]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: PAYWALL_COLORS.surfaceRecessed,
    borderColor: PAYWALL_COLORS.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 20,
  },
  cardSelected: { borderColor: PAYWALL_COLORS.accent, borderWidth: 2 },
  content: { flex: 1 },
  period: { color: PAYWALL_COLORS.neutral, fontSize: 14, marginLeft: 2 },
  planName: {
    color: PAYWALL_COLORS.neutral,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  price: { color: PAYWALL_COLORS.neutral, fontSize: 22, fontWeight: '600' },
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
