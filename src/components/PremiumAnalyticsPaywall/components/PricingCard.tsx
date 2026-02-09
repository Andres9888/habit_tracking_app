/**
 * PricingCard Component
 * Dual pricing with monthly/annual toggle
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import type { PurchasesPackage } from 'react-native-purchases';
import { styles } from './PricingCard.styles';

interface PricingCardProps {
  monthlyPackage: PurchasesPackage | null;
  annualPackage: PurchasesPackage | null;
  onPackageChange?: (pkg: PurchasesPackage | null) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  monthlyPackage,
  annualPackage,
  onPackageChange,
}) => {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual');

  useEffect(() => {
    const pkg = plan === 'monthly' ? monthlyPackage : annualPackage;
    if (pkg) onPackageChange?.(pkg);
  }, [monthlyPackage, annualPackage, plan, onPackageChange]);

  const handleSelect = (newPlan: 'monthly' | 'annual') => {
    setPlan(newPlan);
    onPackageChange?.(
      newPlan === 'monthly' ? monthlyPackage : annualPackage
    );
  };

  const isLoading = !monthlyPackage && !annualPackage;

  const monthlyCost = monthlyPackage?.product.price ?? 6.99;
  const annualCost = annualPackage?.product.price ?? 44.99;
  const monthlyEq = annualCost / 12;
  const savings = Math.round(((monthlyCost - monthlyEq) / monthlyCost) * 100);

  const isMonthly = plan === 'monthly';

  if (isLoading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', minHeight: 180 }]}>
        <ActivityIndicator color="#6d28d9" size="large" />
        <Text style={[styles.planPeriod, { marginTop: 12 }]}>Loading pricing…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>LIMITED TIME OFFER</Text>
      </View>

      <View style={styles.plansContainer}>
        <AnimatedPressable
          style={[styles.planOption, isMonthly && styles.planOptionSelected]}
          onPress={() => handleSelect('monthly')}
        >
          <Text style={styles.planLabel}>Monthly</Text>
          <Text style={styles.planPrice}>
            {monthlyPackage?.product.priceString ?? '$6.99'}
          </Text>
          <Text style={styles.planPeriod}>/month</Text>
        </AnimatedPressable>

        <AnimatedPressable
          style={[styles.planOption, !isMonthly && styles.planOptionSelected]}
          onPress={() => handleSelect('annual')}
        >
          <View style={styles.savingsBadge}>
            <Text style={styles.savingsBadgeText}>Save {savings}%</Text>
          </View>
          <Text style={styles.planLabel}>Annual</Text>
          <Text style={styles.planPrice}>
            {annualPackage?.product.priceString ?? '$44.99'}
          </Text>
          <Text style={styles.planPeriod}>/year</Text>
          <Text style={styles.planMonthlyEquivalent}>
            ${monthlyEq.toFixed(2)}/mo
          </Text>
        </AnimatedPressable>
      </View>

      <Text style={styles.pricingLabel}>Start Your Free Trial</Text>
      <Text style={styles.pricingRow}>$0 for 7 days</Text>
      <Text style={styles.thenPricing}>
        Then{' '}
        {isMonthly
          ? monthlyPackage?.product.priceString ?? '$6.99'
          : annualPackage?.product.priceString ?? '$44.99'}
        {isMonthly ? '/month' : '/year'}
      </Text>
      <Text style={styles.pricingNote}>
        Cancel anytime • No commitments • Instant access
      </Text>
    </View>
  );
};

