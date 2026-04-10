/**
 * "Start Here" beginner card
 * Shown to users with 0-1 habits to guide them to easy, high-impact templates
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fontFamilies, fontWeights } from '@/theme/typography';

const STARTER_HABITS = [
  { emoji: '💧', name: 'Drink Water' },
  { emoji: '🧘', name: '2-Min Meditate' },
  { emoji: '📝', name: 'Gratitude' },
  { emoji: '🚶', name: '10-Min Walk' },
  { emoji: '📖', name: 'Read 1 Page' },
] as const;

interface StartHereCardProps {
  onPress: () => void;
}

export function StartHereCard({ onPress }: StartHereCardProps) {
  return (
    <Pressable style={startStyles.wrapper} onPress={onPress}>
      <LinearGradient
        colors={['#065f46', '#059669'] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={startStyles.gradient}
      >
        <Text style={startStyles.title}>New here? Start with these</Text>
        <Text style={startStyles.subtitle}>
          5 habits that take under 5 min and have the highest stick rate
        </Text>

        <View style={startStyles.chips}>
          {STARTER_HABITS.map((h) => (
            <View key={h.name} style={startStyles.chip}>
              <Text style={startStyles.chipEmoji}>{h.emoji}</Text>
              <Text style={startStyles.chipText}>{h.name}</Text>
            </View>
          ))}
        </View>

        <View style={startStyles.ctaRow}>
          <Text style={startStyles.ctaText}>Browse starter habits →</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const startStyles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chipEmoji: {
    fontSize: 16,
  },
  chipText: {
    color: '#fff',
    fontFamily: fontFamilies.primary.text,
    fontSize: 12,
    fontWeight: fontWeights.medium,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  ctaRow: {
    marginTop: 14,
  },
  ctaText: {
    color: '#fff',
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: fontWeights.bold,
  },
  gradient: {
    borderRadius: 18,
    padding: 20,
  },
  subtitle: {
    color: '#BBF7D0',
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  title: {
    color: '#fff',
    fontFamily: fontFamilies.primary.display,
    fontSize: 20,
    fontWeight: fontWeights.bold,
  },
  wrapper: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
});
