/**
 * TechniqueApproach - Reusable component for effective/mistake technique sections
 */

import React from 'react';
import { View, Text } from 'react-native';

import { Lightbulb, AlertTriangle } from 'lucide-react-native';

interface TechniqueApproachProps {
  type: 'effective' | 'mistake';
  icon: React.ReactNode;
  description: string;
  example: string;
  why: string;
}

export function TechniqueApproach({
  type,
  icon,
  description,
  example,
  why,
}: TechniqueApproachProps) {
  const isEffective = type === 'effective';
  const bgColor = isEffective ? 'bg-emerald-50' : 'bg-rose-50';
  const textColor = isEffective ? 'text-emerald-700' : 'text-rose-700';
  const iconColor = isEffective ? 'text-amber-500' : 'text-rose-500';
  const label = isEffective ? '✓ Effective Approach' : '✗ Common Mistake';
  const whyLabel = isEffective ? 'Why it works: ' : 'Why to avoid: ';

  return (
    <View className='mt-4'>
      <View className='mb-2 flex-row items-center gap-2'>
        {icon}
        <Text className={`text-sm font-semibold ${textColor}`}>{label}</Text>
      </View>
      <View className={`rounded-xl ${bgColor} p-3`}>
        <Text className='text-sm leading-relaxed text-stone-700'>
          {description}
        </Text>
        <View className='mt-3 rounded-lg bg-white/80 p-2.5'>
          <Text className='text-xs italic text-stone-600'>{example}</Text>
        </View>
        <View className='mt-2 flex-row items-start gap-2'>
          {isEffective ? (
            <Lightbulb className={`mt-0.5 ${iconColor}`} size={14} />
          ) : (
            <AlertTriangle className={`mt-0.5 ${iconColor}`} size={14} />
          )}
          <Text className='flex-1 text-xs text-stone-600'>
            <Text className='font-medium'>{whyLabel}</Text>
            {why}
          </Text>
        </View>
      </View>
    </View>
  );
}
