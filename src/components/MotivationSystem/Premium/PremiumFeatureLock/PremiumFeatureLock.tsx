/**
 * PremiumFeatureLock Component
 * Main orchestrator that renders appropriate lock variant
 */

import React, { useEffect } from 'react';
import { View } from 'react-native';

import type { PremiumFeatureLockProps } from './PremiumFeatureLock.types';
import { CardLock } from './CardLock';
import { InlineLock } from './InlineLock';
import { OverlayLock } from './OverlayLock';

export function PremiumFeatureLock({
  feature,
  onUpgrade,
  onLockViewed,
  variant = 'inline',
  showScience = false,
  reduceMotion = false,
  className,
  testID,
}: PremiumFeatureLockProps) {
  // Track when lock is viewed (for analytics)
  useEffect(() => {
    if (onLockViewed) {
      onLockViewed(feature);
    }
  }, [feature, onLockViewed]);

  if (variant === 'inline') {
    return (
      <View className={className}>
        <InlineLock
          reduceMotion={reduceMotion}
          testID={testID}
          onUpgrade={onUpgrade}
        />
      </View>
    );
  }

  if (variant === 'overlay') {
    return (
      <OverlayLock
        feature={feature}
        reduceMotion={reduceMotion}
        showScience={showScience}
        testID={testID}
        onUpgrade={onUpgrade}
      />
    );
  }

  return (
    <View className={className}>
      <CardLock
        feature={feature}
        reduceMotion={reduceMotion}
        showScience={showScience}
        testID={testID}
        onUpgrade={onUpgrade}
      />
    </View>
  );
}

export default PremiumFeatureLock;
