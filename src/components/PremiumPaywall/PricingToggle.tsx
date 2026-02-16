/**
 * Monthly/Annual pricing toggle for blur overlay variants
 *
 * Defaults to annual (higher LTV). Shows savings percentage
 * to nudge users toward annual commitment.
 */

import React, { useState, useMemo } from 'react';
import { View, Pressable, Text } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';

interface PricingToggleProps {
  monthlyPackage: PurchasesPackage | null;
  annualPackage: PurchasesPackage | null;
  onPackageChange: (pkg: PurchasesPackage | null) => void;
}

export function PricingToggle({
  monthlyPackage,
  annualPackage,
  onPackageChange,
}: PricingToggleProps) {
  // Default to annual for higher LTV
  const [isAnnual, setIsAnnual] = useState(true);

  // Calculate savings percentage
  const savingsText = useMemo(() => {
    if (!monthlyPackage?.product?.price || !annualPackage?.product?.price)
      return null;
    const monthlyAnnualized = monthlyPackage.product.price * 12;
    const annualPrice = annualPackage.product.price;
    if (monthlyAnnualized <= 0) return null;
    const savings = Math.round(
      ((monthlyAnnualized - annualPrice) / monthlyAnnualized) * 100
    );
    return savings > 0 ? `Save ${savings}%` : null;
  }, [monthlyPackage, annualPackage]);

  const handleToggle = (annual: boolean) => {
    setIsAnnual(annual);
    onPackageChange(annual ? annualPackage : monthlyPackage);
  };

  return (
    <View
      accessibilityRole="radiogroup"
      className="flex-row items-center justify-center gap-3"
    >
      <Pressable
        accessibilityLabel={`Monthly, ${monthlyPackage?.product?.priceString ?? 'loading'} per month`}
        accessibilityRole="radio"
        accessibilityState={{ selected: !isAnnual }}
        className={`min-h-[44px] items-center justify-center rounded-lg px-4 py-2 ${isAnnual ? 'bg-white/5' : 'bg-white/20'}`}
        onPress={() => handleToggle(false)}
      >
        <Text className="text-sm text-white">
          {monthlyPackage?.product?.priceString ?? '...'}/mo
        </Text>
      </Pressable>

      <Pressable
        accessibilityLabel={`Annual, ${annualPackage?.product?.priceString ?? 'loading'} per year, best value`}
        accessibilityRole="radio"
        accessibilityState={{ selected: isAnnual }}
        className={`relative min-h-[44px] items-center justify-center rounded-lg px-4 py-2 ${isAnnual ? 'bg-white/20' : 'bg-white/5'}`}
        onPress={() => handleToggle(true)}
      >
        <Text className="text-sm text-white">
          {annualPackage?.product?.priceString ?? '...'}/yr
        </Text>
        {savingsText && (
          <View className="absolute -right-2 -top-2 rounded-full bg-amber-400 px-2 py-0.5">
            <Text className="text-[10px] font-bold text-amber-900">
              {savingsText}
            </Text>
          </View>
        )}
      </Pressable>

      {isAnnual && (
        <View className="absolute -bottom-5 right-0">
          <Text className="text-[11px] font-medium text-amber-300">
            ✨ Best value
          </Text>
        </View>
      )}
    </View>
  );
}
