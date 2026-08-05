/**
 * PaywallPlanSelector — monthly/annual plan toggle
 */

import React from 'react';
import { View } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';
import { spacing } from '../../theme/spacing';
import { PaywallPlanCard } from './PaywallPlanCard';
import type { PlanType } from './paywall.types';

interface PaywallPlanSelectorProps {
  selectedPlan: PlanType;
  monthlyPackage: PurchasesPackage | null;
  annualPackage: PurchasesPackage | null;
  savingsPercent: number | null;
  onSelectPlan: (plan: PlanType) => void;
}

export function PaywallPlanSelector({
  selectedPlan,
  monthlyPackage,
  annualPackage,
  savingsPercent,
  onSelectPlan,
}: PaywallPlanSelectorProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.lg,
        paddingHorizontal: spacing.base,
      }}
    >
      <PaywallPlanCard
        isSelected={selectedPlan === 'annual'}
        pkg={annualPackage}
        savingsPercent={savingsPercent}
        type="annual"
        onSelect={() => onSelectPlan('annual')}
      />
      <PaywallPlanCard
        isSelected={selectedPlan === 'monthly'}
        pkg={monthlyPackage}
        savingsPercent={null}
        type="monthly"
        onSelect={() => onSelectPlan('monthly')}
      />
    </View>
  );
}
