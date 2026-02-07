/**
 * SpotlightBadge Component
 * The "SPOTLIGHT" badge displayed at the top of the hero
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { typography } from '@/theme/typography';

export const SpotlightBadge: React.FC = () => (
  <View style={styles.badge}>
    <Sparkles color='#ffffff' size={14} strokeWidth={2.5} />
    <Text style={styles.badgeText}>SPOTLIGHT</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 9999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: typography.tabBar.fontSize,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
