/**
 * TrialCountdownBanner - Shows remaining trial days with upgrade CTA
 */

import React from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import type { TrialCountdownBannerProps } from './types';
import { getTrialMessage } from './styles';
import { fontFamilies } from '@/theme/typography';

export function TrialCountdownBanner({
  daysRemaining,
  onUpgrade,
  onDismiss,
  dismissible = false,
}: TrialCountdownBannerProps) {
  return (
    <View style={localStyles.container}>
      <Text style={localStyles.text}>{getTrialMessage(daysRemaining)}</Text>
      <Pressable
        accessibilityLabel='Upgrade to premium'
        accessibilityRole='button'
        style={localStyles.upgradeButton}
        onPress={onUpgrade}
      >
        <Text style={localStyles.upgradeText}>Upgrade</Text>
      </Pressable>
      {dismissible && onDismiss && (
        <Pressable
          accessibilityLabel='Dismiss trial banner'
          accessibilityRole='button'
          hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          style={localStyles.dismissButton}
          onPress={onDismiss}
        >
          <Text style={localStyles.dismissText}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dismissButton: {
    alignItems: 'center' as const,
    height: 44,
    justifyContent: 'center' as const,
    marginLeft: 4,
    width: 44,
  },
  dismissText: { color: '#6b7280', fontFamily: fontFamilies.primary.text, fontSize: 17 },
  text: { color: '#1f2937', flex: 1, fontFamily: fontFamilies.primary.text, fontSize: 13, fontWeight: '500' },
  upgradeButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  upgradeText: { color: '#ffffff', fontFamily: fontFamilies.primary.text, fontSize: 13, fontWeight: '600' },
});
