/**
 * FeatureLimitBadge Component
 * Shows free tier usage indicator
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
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
  const { colors } = useThemeColors();
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
        className='flex-row items-center gap-1 rounded-full px-2 py-0.5'
        style={{ backgroundColor: isAtLimit ? colors.status.warningLight : colors.background }}
      >
        <Text
          className='text-xs font-medium'
          style={{ color: isAtLimit ? colors.status.warningText : colors.text.secondary }}
        >
          {current}/{limit} Free
        </Text>
        {isAtLimit ? <ChevronRight color={colors.status.warning} size={12} /> : null}
      </View>
    </Pressable>
  );
}
