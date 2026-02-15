/**
 * TrialCountdownBanner - Shows remaining trial days with upgrade CTA
 *
 * Uses urgency-based dynamic styling from getBannerStyles() and
 * theme-aware colors for dark mode support.
 */

import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { Clock, X } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import type { TrialCountdownBannerProps } from './types';
import { getTrialMessage, getBannerStyles } from './styles';

export function TrialCountdownBanner({
  daysRemaining,
  onUpgrade,
  onDismiss,
  dismissible = false,
}: TrialCountdownBannerProps) {
  const { isDark } = useThemeColors();
  const urgency = getBannerStyles(daysRemaining);

  return (
    <View
      className={`flex-row items-center rounded-2xl border px-4 py-3 ${urgency.bg} ${urgency.border}`}
      style={isDark ? { backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)' } : undefined}
    >
      <View
        className={`mr-3 h-8 w-8 items-center justify-center rounded-full ${urgency.iconBg}`}
      >
        <Clock color={urgency.iconColor} size={16} strokeWidth={2.5} />
      </View>
      <Text
        className={`flex-1 text-[13px] font-semibold leading-[18px] ${urgency.text}`}
        style={isDark ? { color: '#F9FAFB' } : undefined}
      >
        {getTrialMessage(daysRemaining)}
      </Text>
      <Pressable
        accessibilityLabel={`Upgrade now, ${daysRemaining} days remaining in trial`}
        accessibilityRole="button"
        className={`min-h-[44px] items-center justify-center rounded-xl px-5 ${urgency.buttonBg}`}
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        onPress={onUpgrade}
      >
        <Text className="text-[13px] font-bold text-white">Upgrade</Text>
      </Pressable>
      {dismissible && onDismiss && (
        <Pressable
          accessibilityLabel="Dismiss trial banner"
          accessibilityRole="button"
          className="ml-2 min-h-[44px] min-w-[44px] items-center justify-center"
          onPress={onDismiss}
        >
          <X color={isDark ? '#9CA3AF' : '#6b7280'} size={16} strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );
}
