/**
 * PricingCard - Dual pricing display
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';

interface PricingCardProps {
  monthlyPackage: PurchasesPackage | null;
  annualPackage: PurchasesPackage | null;
  onPackageChange?: (pkg: PurchasesPackage | null) => void;
}

export function PricingCard({
  monthlyPackage,
  annualPackage,
  onPackageChange,
}: PricingCardProps) {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual');

  useEffect(() => {
    const pkg = plan === 'monthly' ? monthlyPackage : annualPackage;
    if (pkg) onPackageChange?.(pkg);
  }, [monthlyPackage, annualPackage, plan, onPackageChange]);

  const handleSelect = (newPlan: 'monthly' | 'annual') => {
    setPlan(newPlan);
    const pkg = newPlan === 'monthly' ? monthlyPackage : annualPackage;
    onPackageChange?.(pkg);
  };

  const monthlyCost = monthlyPackage?.product.price ?? 6.99;
  const annualCost = annualPackage?.product.price ?? 44.99;
  const monthlyEq = annualCost / 12;
  const savings = Math.round(((monthlyCost - monthlyEq) / monthlyCost) * 100);

  const isMonthlySelected = plan === 'monthly';
  const isAnnualSelected = plan === 'annual';

  return (
    <View className='mb-4'>
      <View className='mb-3 flex-row gap-3'>
        <TouchableOpacity
          className={`flex-1 rounded-xl border-2 p-4 ${isMonthlySelected ? 'border-violet-400 bg-violet-400/20' : 'border-white/20 bg-white/5'}`}
          onPress={() => handleSelect('monthly')}
        >
          <Text className='mb-1 text-center text-xs font-semibold uppercase tracking-wide text-violet-300'>
            Monthly
          </Text>
          <Text className='text-center text-2xl font-bold text-white'>
            {monthlyPackage?.product.priceString ?? '$6.99'}
          </Text>
          <Text className='text-center text-xs text-white/60'>/month</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 rounded-xl border-2 p-4 ${isAnnualSelected ? 'border-violet-400 bg-violet-400/20' : 'border-white/20 bg-white/5'}`}
          onPress={() => handleSelect('annual')}
        >
          <View className='absolute -top-2 right-2 rounded-full bg-green-500 px-2 py-0.5'>
            <Text className='text-[10px] font-bold text-white'>
              Save {savings}%
            </Text>
          </View>
          <Text className='mb-1 text-center text-xs font-semibold uppercase tracking-wide text-violet-300'>
            Annual
          </Text>
          <Text className='text-center text-2xl font-bold text-white'>
            {annualPackage?.product.priceString ?? '$44.99'}
          </Text>
          <Text className='text-center text-xs text-white/60'>/year</Text>
          <Text className='mt-1 text-center text-[10px] text-green-400'>
            ${monthlyEq.toFixed(2)}/mo
          </Text>
        </TouchableOpacity>
      </View>

      <View className='rounded-xl bg-white/5 px-4 py-3'>
        <Text className='text-center text-sm text-white/80'>
          7-day free trial • Auto-renews at{' '}
          {isAnnualSelected
            ? `${annualPackage?.product.priceString ?? '$44.99'}/year`
            : `${monthlyPackage?.product.priceString ?? '$6.99'}/month`}{' '}
          • Cancel anytime
        </Text>
      </View>
    </View>
  );
}
