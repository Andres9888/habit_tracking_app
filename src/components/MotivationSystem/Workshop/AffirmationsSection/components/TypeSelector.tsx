/**
 * TypeSelector Component
 * Allows user to select affirmation type (identity/motivational/instructional)
 */

import { triggerHaptic } from '@/utils/haptics';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { clsx } from 'clsx';
import type { AffirmationType } from '../AffirmationsSection.types';
import { TYPE_CONFIG } from '../AffirmationsSection.constants';

interface TypeSelectorProps {
  selectedType?: AffirmationType;
  onSelectType: (type?: AffirmationType) => void;
  isPremium: boolean;
}

export function TypeSelector({
  selectedType,
  onSelectType,
  isPremium,
}: TypeSelectorProps) {
  return (
    <View className='gap-2'>
      <Text className='mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400'>
        Type {!isPremium && '(Premium)'}
      </Text>
      <View className='flex-row gap-2'>
        {(Object.keys(TYPE_CONFIG) as AffirmationType[]).map((type) => {
          const config = TYPE_CONFIG[type];
          const isSelected = selectedType === type;
          const IconComponent = config.icon;

          return (
            <Pressable
              key={type}
              accessibilityLabel={`${config.label} affirmation type`}
              accessibilityRole='radio'
              accessibilityState={{ selected: isSelected }}
              className={clsx(
                'flex-1 flex-row items-center justify-center gap-1.5 rounded-lg border-2 px-2 py-2',
                isSelected
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-stone-200 bg-white',
                !isPremium && 'opacity-50'
              )}
              disabled={!isPremium}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              onPress={() => {
                triggerHaptic('tap');
                onSelectType(isSelected ? undefined : type);
              }}
            >
              <View
                className={clsx(
                  'h-6 w-6 items-center justify-center rounded-full',
                  isSelected ? config.selectedBg : config.bgColor
                )}
              >
                <IconComponent
                  className={isSelected ? 'text-white' : config.textColor}
                  size={12}
                />
              </View>
              <Text
                className={clsx(
                  'text-xs font-medium',
                  isSelected ? 'text-amber-700' : 'text-stone-600'
                )}
              >
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
