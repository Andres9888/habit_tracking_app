/**
 * FeatureLimitBadge Component
 * Shows free tier usage indicator
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';

interface FeatureLimitBadgeProps {
  current: number;
  limit: number;
  isPremium: boolean;
  onUpgrade: () => void;
  reduceMotion?: boolean;
  testID?: string;
}

export function FeatureLimitBadge({
  current,
  limit,
  isPremium,
  onUpgrade,
  testID,
}: FeatureLimitBadgeProps) {
  const { triggerLightImpact } = useHapticFeedback({});
  const isAtLimit = !isPremium && current >= limit;

  const handlePress = useCallback(() => {
    if (!isPremium) {
      triggerLightImpact();
      onUpgrade();
    }
  }, [isPremium, onUpgrade, triggerLightImpact]);

  if (isPremium) return null;

  return (
    <Pressable
      accessibilityHint={isAtLimit ? 'Tap to upgrade for unlimited' : undefined}
      accessibilityLabel={`${current} of ${limit} free used`}
      accessibilityRole={isAtLimit ? 'button' : 'text'}
      disabled={!isAtLimit}
      testID={testID}
      onPress={handlePress}
    >
      <View
        className={`flex-row items-center gap-1 rounded-full px-2 py-0.5 ${isAtLimit ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-stone-100 dark:bg-stone-800'}`}
      >
        <Text
          className={`text-xs font-medium ${isAtLimit ? 'text-amber-700 dark:text-amber-300' : 'text-stone-600 dark:text-stone-400'}`}
        >
          {current}/{limit} Free
        </Text>
        {isAtLimit && <ChevronRight className='text-amber-600 dark:text-amber-400' size={12} />}
      </View>
    </Pressable>
  );
}
