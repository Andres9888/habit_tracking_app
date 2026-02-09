import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { getBannerStyles, getTrialMessage } from './styles';
import type { TrialCountdownBannerProps } from './types';

export function TrialCountdownBanner({
  daysRemaining,
  onUpgrade,
  onDismiss,
  dismissible = false,
}: TrialCountdownBannerProps) {
  const styles = getBannerStyles(daysRemaining);
  const message = getTrialMessage(daysRemaining);

  return (
    <View testID="trial-countdown-banner">
      <Text>{message}</Text>
      <Pressable onPress={onUpgrade}>
        <Text>Upgrade Now</Text>
      </Pressable>
      {dismissible && onDismiss && (
        <Pressable onPress={onDismiss}>
          <Text>✕</Text>
        </Pressable>
      )}
    </View>
  );
}
