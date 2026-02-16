/**
 * Free vs Premium comparison table for paywall
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Check, X } from 'lucide-react-native';

interface ComparisonRow {
  feature: string;
  free: string | boolean;
  premium: string | boolean;
}

const COMPARISON_DATA: ComparisonRow[] = [
  { feature: 'Daily habit tracking', free: true, premium: true },
  { feature: 'Habit streaks', free: true, premium: true },
  { feature: 'Basic stats', free: true, premium: true },
  { feature: 'Voice notes', free: '1 recording', premium: 'Unlimited' },
  { feature: 'Affirmations', free: '2 max', premium: 'Unlimited' },
  { feature: 'Letters to Self', free: false, premium: true },
  { feature: 'Vision Board', free: false, premium: true },
  { feature: 'Rescue Mode', free: false, premium: true },
  { feature: 'Advanced Analytics', free: false, premium: true },
  { feature: 'Advanced Visualization', free: false, premium: true },
];

function CellContent({ value }: { value: string | boolean }) {
  if (value === true) return <Check color='#059669' size={16} />;
  if (value === false) return <X color='#d1d5db' size={16} />;
  return <Text className='text-xs text-stone-600'>{value}</Text>;
}

interface FreePremiumComparisonProps {
  dark?: boolean;
}

export function FreePremiumComparison({ dark = false }: FreePremiumComparisonProps) {
  const textColor = dark ? 'text-white' : 'text-stone-800';
  const subtextColor = dark ? 'text-white/60' : 'text-stone-500';
  const borderColor = dark ? 'border-white/10' : 'border-stone-100';
  const headerBg = dark ? 'bg-white/5' : 'bg-stone-50';

  return (
    <View className='mb-4'>
      <Text className={`mb-3 text-center text-base font-bold ${textColor}`}>
        Free vs Premium
      </Text>
      <View className={`overflow-hidden rounded-xl border ${borderColor}`}>
        {/* Header row */}
        <View className={`flex-row ${headerBg} border-b ${borderColor} px-3 py-2`}>
          <View className='flex-1'>
            <Text className={`text-xs font-semibold ${subtextColor}`}>Feature</Text>
          </View>
          <View className='w-16 items-center'>
            <Text className={`text-xs font-semibold ${subtextColor}`}>Free</Text>
          </View>
          <View className='w-16 items-center'>
            <Text className='text-xs font-bold text-violet-500'>Pro</Text>
          </View>
        </View>
        {/* Data rows */}
        {COMPARISON_DATA.map((row, i) => (
          <View
            key={row.feature}
            className={`flex-row items-center px-3 py-2.5 ${i < COMPARISON_DATA.length - 1 ? `border-b ${borderColor}` : ''}`}
          >
            <View className='flex-1'>
              <Text className={`text-xs ${dark ? 'text-white/80' : 'text-stone-700'}`}>
                {row.feature}
              </Text>
            </View>
            <View className='w-16 items-center'>
              <CellContent value={row.free} />
            </View>
            <View className='w-16 items-center'>
              <CellContent value={row.premium} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
