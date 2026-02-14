/**
 * Monthly/Annual pricing toggle with savings badge
 *
 * Defaults to annual selection (higher LTV).
 * Shows "Save 67%" badge on annual option.
 */

import React, { useState, useCallback } from 'react';
import { View, Pressable, Text } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';

interface PricingToggleProps {
  monthlyPackage: PurchasesPackage | null;
  annualPackage: PurchasesPackage | null;
  onPackageChange: (pkg: PurchasesPackage | null) => void;
  /** Use dark text (for light backgrounds like benefits variant) */
  darkMode?: boolean;
}

export function PricingToggle({
  monthlyPackage,
  annualPackage,
  onPackageChange,
  darkMode = false,
}: PricingToggleProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  const handleToggle = useCallback(
    (annual: boolean) => {
      setIsAnnual(annual);
      onPackageChange(annual ? annualPackage : monthlyPackage);
    },
    [annualPackage, monthlyPackage, onPackageChange],
  );

  const monthlyPrice = monthlyPackage?.product?.priceString ?? '...';
  const annualPrice = annualPackage?.product?.priceString ?? '...';

  // Calculate savings percentage if both prices available
  const savingsText = 'Save 67%';

  if (darkMode) {
    // Light-background variant (benefits / page-sheet)
    return (
      <View className='mx-4 mb-4 mt-2'>
        <View className='flex-row gap-3'>
          {/* Monthly option */}
          <Pressable
            accessibilityLabel='Monthly plan'
            accessibilityRole='button'
            className={`flex-1 rounded-2xl border-2 px-4 py-4 ${
              !isAnnual ? 'border-violet-500 bg-violet-50' : 'border-stone-200 bg-white'
            }`}
            onPress={() => handleToggle(false)}
          >
            <Text
              className={`text-sm font-medium ${!isAnnual ? 'text-violet-700' : 'text-stone-500'}`}
            >
              Monthly
            </Text>
            <Text
              className={`mt-1 text-xl font-bold ${!isAnnual ? 'text-stone-900' : 'text-stone-700'}`}
            >
              {monthlyPrice}
              <Text className='text-sm font-normal text-stone-500'>/mo</Text>
            </Text>
          </Pressable>

          {/* Annual option */}
          <Pressable
            accessibilityLabel='Annual plan, save 67 percent'
            accessibilityRole='button'
            className={`flex-1 rounded-2xl border-2 px-4 py-4 ${
              isAnnual ? 'border-violet-500 bg-violet-50' : 'border-stone-200 bg-white'
            }`}
            onPress={() => handleToggle(true)}
          >
            <View className='flex-row items-center gap-2'>
              <Text
                className={`text-sm font-medium ${isAnnual ? 'text-violet-700' : 'text-stone-500'}`}
              >
                Annual
              </Text>
              <View className='rounded-full bg-emerald-100 px-2 py-0.5'>
                <Text className='text-xs font-bold text-emerald-700'>{savingsText}</Text>
              </View>
            </View>
            <Text
              className={`mt-1 text-xl font-bold ${isAnnual ? 'text-stone-900' : 'text-stone-700'}`}
            >
              {annualPrice}
              <Text className='text-sm font-normal text-stone-500'>/yr</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Dark-background variant (blur overlay)
  return (
    <View className='mb-4'>
      <View className='flex-row gap-3'>
        {/* Monthly option */}
        <Pressable
          accessibilityLabel='Monthly plan'
          accessibilityRole='button'
          className={`flex-1 rounded-2xl border-2 px-4 py-4 ${
            !isAnnual ? 'border-white/60 bg-white/20' : 'border-white/10 bg-white/5'
          }`}
          onPress={() => handleToggle(false)}
        >
          <Text className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-white/60'}`}>
            Monthly
          </Text>
          <Text className={`mt-1 text-xl font-bold ${!isAnnual ? 'text-white' : 'text-white/80'}`}>
            {monthlyPrice}
            <Text className='text-sm font-normal text-white/50'>/mo</Text>
          </Text>
        </Pressable>

        {/* Annual option */}
        <Pressable
          accessibilityLabel='Annual plan, save 67 percent'
          accessibilityRole='button'
          className={`flex-1 rounded-2xl border-2 px-4 py-4 ${
            isAnnual ? 'border-white/60 bg-white/20' : 'border-white/10 bg-white/5'
          }`}
          onPress={() => handleToggle(true)}
        >
          <View className='flex-row items-center gap-2'>
            <Text className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-white/60'}`}>
              Annual
            </Text>
            <View className='rounded-full bg-emerald-500/30 px-2 py-0.5'>
              <Text className='text-xs font-bold text-emerald-300'>{savingsText}</Text>
            </View>
          </View>
          <Text
            className={`mt-1 text-xl font-bold ${isAnnual ? 'text-white' : 'text-white/80'}`}
          >
            {annualPrice}
            <Text className='text-sm font-normal text-white/50'>/yr</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
