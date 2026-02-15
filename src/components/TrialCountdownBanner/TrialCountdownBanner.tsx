/**
 * TrialCountdownBanner - Shows remaining trial days with upgrade CTA
 * Enhanced with visual progress bar and urgency for low-day counts
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
  const isUrgent = daysRemaining <= 2;
  const progress = Math.max(0, Math.min(1, (7 - daysRemaining) / 7));

  return (
    <View style={[localStyles.container, isUrgent && localStyles.containerUrgent]}>
      <View style={localStyles.contentRow}>
        <View style={localStyles.textSection}>
          <Text style={[localStyles.text, isUrgent && localStyles.textUrgent]}>
            {isUrgent ? '⏰ ' : '✨ '}{getTrialMessage(daysRemaining)}
          </Text>
          {/* Progress bar */}
          <View style={localStyles.progressTrack}>
            <View style={[
              localStyles.progressFill,
              { width: `${progress * 100}%` },
              isUrgent && localStyles.progressFillUrgent,
            ]} />
          </View>
        </View>
        <Pressable
          accessibilityLabel='Upgrade to premium'
          accessibilityRole='button'
          style={[localStyles.upgradeButton, isUrgent && localStyles.upgradeButtonUrgent]}
          onPress={onUpgrade}
        >
          <Text style={localStyles.upgradeText}>
            {isUrgent ? 'Upgrade Now' : 'Upgrade'}
          </Text>
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
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: '#faf5ff',
    borderBottomColor: '#e9d5ff',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  containerUrgent: {
    backgroundColor: '#fef2f2',
    borderBottomColor: '#fecaca',
  },
  contentRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  textSection: {
    flex: 1,
    gap: 6,
  },
  progressTrack: {
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    height: 3,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#7c3aed',
    borderRadius: 2,
    height: '100%',
  },
  progressFillUrgent: {
    backgroundColor: '#ef4444',
  },
  dismissButton: { alignItems: 'center' as const, height: 44, justifyContent: 'center' as const, width: 44 },
  dismissText: { color: '#6b7280', fontSize: 17 },
  text: { color: '#1f2937', fontSize: 13, fontWeight: '500' },
  textUrgent: { color: '#991b1b', fontWeight: '600' },
  upgradeButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  upgradeButtonUrgent: {
    backgroundColor: '#ef4444',
  },
  upgradeText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
});
