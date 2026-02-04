/**
 * PricingCards - Container for yearly and monthly cards
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { YearlyCard } from './YearlyCard';
import { MonthlyCard } from './MonthlyCard';
import { SPACING } from './paywall.constants';
import type { PlanType } from './types';

interface PricingCardsProps {
  onSelectPlan: (plan: PlanType) => void;
  reduceMotion: boolean;
  selectedPlan: PlanType;
  visible: boolean;
}

export function PricingCards({
  visible,
  reduceMotion,
  selectedPlan,
  onSelectPlan,
}: PricingCardsProps) {
  return (
    <View style={styles.container}>
      <YearlyCard
        reduceMotion={reduceMotion}
        selectedPlan={selectedPlan}
        visible={visible}
        onSelectPlan={onSelectPlan}
      />
      <MonthlyCard
        reduceMotion={reduceMotion}
        selectedPlan={selectedPlan}
        visible={visible}
        onSelectPlan={onSelectPlan}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
});
