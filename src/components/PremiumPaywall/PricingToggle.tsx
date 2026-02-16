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
  /** Use light theme styling (for non-blur backgrounds) */
  light?: boolean;
}

export function PricingToggle({
  monthlyPackage,
  annualPackage,
  onPackageChange,
  light = false,
}: PricingToggleProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  const handleToggle = (annual: boolean) => {
    setIsAnnual(annual);
    onPackageChange(annual ? annualPackage : monthlyPackage);
  };

  const monthlyPrice = monthlyPackage?.product?.priceString ?? '$4.99';
  const annualPrice = annualPackage?.product?.priceString ?? '$29.99';

  if (light) {
    return (
      <View accessibilityRole='radiogroup' className='gap-3'>
        {/* Annual option */}
        <Pressable
          accessibilityLabel={`Annual, ${annualPrice} per year, save 50%`}
          accessibilityRole='radio'
          accessibilityState={{ selected: isAnnual }}
          className={`relative min-h-[44px] flex-row items-center justify-between rounded-xl border-2 px-4 py-3 ${isAnnual ? 'border-violet-500 bg-violet-50' : 'border-stone-200 bg-white'}`}
          onPress={() => handleToggle(true)}
        >
          {/* Most Popular badge */}
          <View className='absolute -top-3 left-4 rounded-full bg-violet-600 px-3 py-0.5'>
            <Text className='text-[10px] font-bold text-white'>MOST POPULAR</Text>
          </View>
          <View className='flex-row items-center gap-3'>
            <View className={`h-5 w-5 items-center justify-center rounded-full border-2 ${isAnnual ? 'border-violet-500' : 'border-stone-300'}`}>
              {isAnnual && <View className='h-2.5 w-2.5 rounded-full bg-violet-500' />}
            </View>
            <View>
              <Text className='text-base font-semibold text-stone-800'>Annual</Text>
              <Text className='text-xs text-stone-500'>{annualPrice}/year</Text>
            </View>
          </View>
          <View className='items-end'>
            <View className='rounded-full bg-emerald-100 px-2 py-0.5'>
              <Text className='text-xs font-bold text-emerald-700'>Save 50%</Text>
            </View>
          </View>
        </Pressable>

        {/* Monthly option */}
        <Pressable
          accessibilityLabel={`Monthly, ${monthlyPrice} per month`}
          accessibilityRole='radio'
          accessibilityState={{ selected: !isAnnual }}
          className={`min-h-[44px] flex-row items-center justify-between rounded-xl border-2 px-4 py-3 ${!isAnnual ? 'border-violet-500 bg-violet-50' : 'border-stone-200 bg-white'}`}
          onPress={() => handleToggle(false)}
        >
          <View className='flex-row items-center gap-3'>
            <View className={`h-5 w-5 items-center justify-center rounded-full border-2 ${!isAnnual ? 'border-violet-500' : 'border-stone-300'}`}>
              {!isAnnual && <View className='h-2.5 w-2.5 rounded-full bg-violet-500' />}
            </View>
            <View>
              <Text className='text-base font-semibold text-stone-800'>Monthly</Text>
              <Text className='text-xs text-stone-500'>{monthlyPrice}/month</Text>
            </View>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      accessibilityRole='radiogroup'
      className='gap-3'
    >
      {/* Annual option */}
      <Pressable
        accessibilityLabel={`Annual, ${annualPrice} per year, save 50%, most popular`}
        accessibilityRole='radio'
        accessibilityState={{ selected: isAnnual }}
        className={`relative min-h-[44px] flex-row items-center justify-between rounded-xl border-2 px-4 py-3 ${isAnnual ? 'border-emerald-400 bg-white/15' : 'border-white/20 bg-white/5'}`}
        onPress={() => handleToggle(true)}
      >
        {/* Most Popular badge */}
        <View className='absolute -top-3 left-4 rounded-full bg-emerald-500 px-3 py-0.5'>
          <Text className='text-[10px] font-bold text-white'>MOST POPULAR</Text>
        </View>
        <View className='flex-row items-center gap-3'>
          <View className={`h-5 w-5 items-center justify-center rounded-full border-2 ${isAnnual ? 'border-emerald-400' : 'border-white/40'}`}>
            {isAnnual && <View className='h-2.5 w-2.5 rounded-full bg-emerald-400' />}
          </View>
          <View>
            <Text className='text-base font-semibold text-white'>Annual</Text>
            <Text className='text-xs text-white/60'>{annualPrice}/year</Text>
          </View>
        </View>
        <View className='items-end'>
          <View className='rounded-full bg-emerald-500/20 px-2 py-0.5'>
            <Text className='text-xs font-bold text-emerald-300'>Save 50%</Text>
          </View>
        </View>
      </Pressable>

      {/* Monthly option */}
      <Pressable
        accessibilityLabel={`Monthly, ${monthlyPrice} per month`}
        accessibilityRole='radio'
        accessibilityState={{ selected: !isAnnual }}
        className={`min-h-[44px] flex-row items-center justify-between rounded-xl border-2 px-4 py-3 ${!isAnnual ? 'border-emerald-400 bg-white/15' : 'border-white/20 bg-white/5'}`}
        onPress={() => handleToggle(false)}
      >
        <View className='flex-row items-center gap-3'>
          <View className={`h-5 w-5 items-center justify-center rounded-full border-2 ${!isAnnual ? 'border-emerald-400' : 'border-white/40'}`}>
            {!isAnnual && <View className='h-2.5 w-2.5 rounded-full bg-emerald-400' />}
          </View>
          <View>
            <Text className='text-base font-semibold text-white'>Monthly</Text>
            <Text className='text-xs text-white/60'>{monthlyPrice}/month</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
