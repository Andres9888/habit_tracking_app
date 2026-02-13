/**
 * Monthly/Annual pricing toggle for blur overlay variants
 */

import React, { useState } from 'react';
import { View, Pressable, Text } from 'react-native';

interface PricingToggleProps {
  monthlyPackage: any;
  annualPackage: any;
  onPackageChange: (pkg: any) => void;
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
    <View className='flex-row items-center justify-center gap-3'>
      <Pressable
        className={`rounded-lg px-4 py-2 ${!isAnnual ? 'bg-white/20' : 'bg-white/5'}`}
        onPress={() => handleToggle(false)}
      >
        <Text className='text-sm text-white'>
          {monthlyPackage?.product?.priceString ?? '...'}/mo
        </Text>
      </Pressable>
      <Pressable
        className={`rounded-lg px-4 py-2 ${isAnnual ? 'bg-white/20' : 'bg-white/5'}`}
        onPress={() => handleToggle(true)}
      >
        <Text className='text-sm text-white'>
          {annualPackage?.product?.priceString ?? '...'}/yr
        </Text>
      </Pressable>
    </View>
  );
}
