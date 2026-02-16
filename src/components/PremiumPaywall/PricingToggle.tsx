/**
 * Monthly/Annual pricing toggle for blur overlay variants
 */

import React, { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';

interface PricingToggleProps {
  monthlyPackage: PurchasesPackage | null;
  annualPackage: PurchasesPackage | null;
  onPackageChange: (pkg: PurchasesPackage | null) => void;
}

function getSavingsPercent(
  monthlyPackage: PurchasesPackage | null,
  annualPackage: PurchasesPackage | null
): number | null {
  if (!monthlyPackage || !annualPackage) return null;
  const monthlyAnnualized = monthlyPackage.product.price * 12;
  const annualPrice = annualPackage.product.price;
  if (monthlyAnnualized <= 0) return null;
  return Math.round(((monthlyAnnualized - annualPrice) / monthlyAnnualized) * 100);
}

export function PricingToggle({
  monthlyPackage,
  annualPackage,
  onPackageChange,
}: PricingToggleProps) {
  const [isAnnual, setIsAnnual] = useState(true);
  const savings = getSavingsPercent(monthlyPackage, annualPackage);

  const handleToggle = (annual: boolean) => {
    setIsAnnual(annual);
    onPackageChange(annual ? annualPackage : monthlyPackage);
  };

  return (
    <View
      accessibilityRole='radiogroup'
      className='flex-row items-stretch justify-center gap-3'
    >
      <Pressable
        accessibilityLabel={`Monthly, ${monthlyPackage?.product?.priceString ?? 'loading'} per month`}
        accessibilityRole='radio'
        accessibilityState={{ selected: !isAnnual }}
        className={`min-h-[56px] flex-1 items-center justify-center rounded-xl border-2 px-4 py-3 ${
          isAnnual ? 'border-white/10 bg-white/5' : 'border-white/40 bg-white/15'
        }`}
        onPress={() => handleToggle(false)}
      >
        <Text className='text-xs font-medium text-white/60'>Monthly</Text>
        <Text className='text-base font-bold text-white'>
          {monthlyPackage?.product?.priceString ?? '...'}/mo
        </Text>
      </Pressable>
      <View className='relative flex-1'>
        {savings !== null && savings > 0 && (
          <View className='absolute -top-3 left-0 right-0 z-10 items-center'>
            <View className='rounded-full bg-amber-400 px-3 py-0.5'>
              <Text className='text-xs font-bold text-amber-900'>
                Save {savings}%
              </Text>
            </View>
          </View>
        )}
        <Pressable
          accessibilityLabel={`Annual, ${annualPackage?.product?.priceString ?? 'loading'} per year, best value`}
          accessibilityRole='radio'
          accessibilityState={{ selected: isAnnual }}
          className={`min-h-[56px] flex-1 items-center justify-center rounded-xl border-2 px-4 py-3 ${
            isAnnual ? 'border-emerald-400/60 bg-white/15' : 'border-white/10 bg-white/5'
          }`}
          onPress={() => handleToggle(true)}
        >
          <Text className='text-xs font-medium text-white/60'>Annual</Text>
          <Text className='text-base font-bold text-white'>
            {annualPackage?.product?.priceString ?? '...'}/yr
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
