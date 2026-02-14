/**
 * Monthly/Annual pricing toggle for blur overlay variants
 * Savings badge on annual option
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
  const [isAnnual, setIsAnnual] = useState(true);

  const savingsPercent = useMemo(() => {
    if (!monthlyPackage?.product?.price || !annualPackage?.product?.price) return null;
    const monthlyAnnualized = monthlyPackage.product.price * 12;
    const annual = annualPackage.product.price;
    if (monthlyAnnualized <= 0) return null;
    return Math.round(((monthlyAnnualized - annual) / monthlyAnnualized) * 100);
  }, [monthlyPackage, annualPackage]);

  const handleToggle = (annual: boolean) => {
    setIsAnnual(annual);
    onPackageChange(annual ? annualPackage : monthlyPackage);
  };

  return (
    <View className='flex-row items-stretch justify-center gap-3'>
      <Pressable
        className='flex-1 items-center rounded-xl px-4 py-3'
        style={{
          backgroundColor: isAnnual ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.2)',
          borderWidth: isAnnual ? 1 : 2,
          borderColor: isAnnual ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)',
        }}
        onPress={() => handleToggle(false)}
      >
        <Text className='text-xs text-white/60'>Monthly</Text>
        <Text className='mt-0.5 text-base font-bold text-white'>
          {monthlyPackage?.product?.priceString ?? '...'}/mo
        </Text>
      </Pressable>
      <Pressable
        className='relative flex-1 items-center rounded-xl px-4 py-3'
        style={{
          backgroundColor: isAnnual ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
          borderWidth: isAnnual ? 2 : 1,
          borderColor: isAnnual ? '#34D399' : 'rgba(255,255,255,0.1)',
        }}
        onPress={() => handleToggle(true)}
      >
        {savingsPercent && savingsPercent > 0 && (
          <View className='absolute -top-2.5 rounded-full bg-emerald-500 px-2 py-0.5'>
            <Text className='text-[10px] font-bold text-white'>
              SAVE {savingsPercent}%
            </Text>
          </View>
        )}
        <Text className='text-xs text-white/60'>Annual</Text>
        <Text className='mt-0.5 text-base font-bold text-white'>
          {annualPackage?.product?.priceString ?? '...'}/yr
        </Text>
      </Pressable>
    </View>
  );
}
