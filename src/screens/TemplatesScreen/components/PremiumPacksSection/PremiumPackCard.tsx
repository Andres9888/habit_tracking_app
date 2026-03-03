/**
 * PremiumPackCard - Full-width horizontal card for curated habit packs
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fontFamilies } from '../../../../theme/typography';
import type { PremiumPack } from '../../data/premiumPacks';

interface PremiumPackCardProps {
  onPress: () => void;
  pack: PremiumPack;
}

export function PremiumPackCard({ onPress, pack }: PremiumPackCardProps) {
  return (
    <Pressable
      testID={`templates-pack-${pack.id}`}
      accessibilityLabel={`${pack.name} pack`}
      accessibilityRole='button'
      onPress={onPress}
    >
      <LinearGradient
        colors={pack.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.gradient}
      >
        <View style={s.content}>
          <View style={s.emojiGroup}>
            {pack.emojiGroup.map((e, i) => (
              <Text key={i} style={s.emoji}>
                {e}
              </Text>
            ))}
          </View>
          <Text style={s.name} numberOfLines={1}>
            {pack.name}
          </Text>
          <Text style={s.desc} numberOfLines={2}>
            {pack.description}
          </Text>
          <Text style={s.habitCount}>{pack.habits.length} habits</Text>
        </View>
        <View style={s.cta}>
          <Text style={s.ctaText}>Import Pack</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const s = StyleSheet.create({
  content: { flex: 1 },
  cta: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  ctaText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  desc: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 3 },
  emoji: { fontSize: 22 },
  emojiGroup: { flexDirection: 'row', gap: 6 },
  gradient: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  habitCount: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: fontFamilies.monospace,
    fontSize: 11,
    marginTop: 4,
  },
  name: { color: '#fff', fontSize: 16, fontWeight: '700', marginTop: 8 },
});
