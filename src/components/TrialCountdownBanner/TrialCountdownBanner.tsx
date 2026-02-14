/**
 * TrialCountdownBanner - Shows remaining trial days with upgrade CTA
 */

import React from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import type { TrialCountdownBannerProps } from './types';
import { getTrialMessage } from './styles';

export function TrialCountdownBanner({
  daysRemaining,
  onUpgrade,
  onDismiss,
  dismissible = false,
}: TrialCountdownBannerProps) {
  return (
    <View style={localStyles.container}>
      <Text style={localStyles.text}>{getTrialMessage(daysRemaining)}</Text>
      <Pressable style={localStyles.upgradeButton} onPress={onUpgrade}>
        <Text style={localStyles.upgradeText}>Upgrade</Text>
      </Pressable>
      {dismissible && onDismiss && (
        <Pressable onPress={onDismiss}>
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
  dismissText: { color: '#6b7280', fontSize: 16, marginLeft: 8 },
  text: { color: '#1f2937', flex: 1, fontSize: 14, fontWeight: '500' },
  upgradeButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  upgradeText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
});
