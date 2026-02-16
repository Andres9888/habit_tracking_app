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

export function PricingToggle({
  monthlyPackage,
  annualPackage,
  onPackageChange,
}: PricingToggleProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  const handleToggle = (annual: boolean) => {
    setIsAnnual(annual);
    onPackageChange(annual ? annualPackage : monthlyPackage);
  };

  return (
    <View
      accessibilityRole='radiogroup'
      className='flex-row items-center justify-center gap-3'
    >
      <Pressable
        accessibilityLabel={`Monthly, ${monthlyPackage?.product?.priceString ?? 'loading'} per month`}
        accessibilityRole='radio'
        accessibilityState={{ selected: !isAnnual }}
        className={`min-h-[44px] items-center justify-center rounded-lg px-4 py-2 ${isAnnual ? 'bg-white/5' : 'bg-white/20'}`}
        onPress={() => handleToggle(false)}
      >
        <Text className='text-sm text-white'>
          {monthlyPackage?.product?.priceString ?? '...'}/mo
        </Text>
      </Pressable>
      <Pressable
        accessibilityLabel={`Annual, ${annualPackage?.product?.priceString ?? 'loading'} per year`}
        accessibilityRole='radio'
        accessibilityState={{ selected: isAnnual }}
        className={`min-h-[44px] items-center justify-center rounded-lg px-4 py-2 ${isAnnual ? 'bg-white/20' : 'bg-white/5'}`}
        onPress={() => handleToggle(true)}
      >
        <Text className='text-sm text-white'>
          {annualPackage?.product?.priceString ?? '...'}/yr
        </Text>
      </Pressable>
    </View>
  );
}
