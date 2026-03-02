/**
 * PremiumPackCard - Card for a curated premium habit pack
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock } from 'lucide-react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';
import type { PremiumPack } from '../../data/premiumPacks';

interface PremiumPackCardProps {
  index: number;
  onPress: () => void;
  pack: PremiumPack;
}

export function PremiumPackCard({ index, onPress, pack }: PremiumPackCardProps) {
  return (
    <Pressable testID={`templates-premium-pack-${index}`} accessibilityLabel={`${pack.name} premium pack`} accessibilityRole="button" onPress={onPress}>
      <LinearGradient colors={pack.backgroundGradient} style={s.card}>
        <View style={s.topRow}>
          <View style={s.emojiGroup}>
            {pack.emojiGroup.map((e, i) => (
              <Text key={i} style={s.emoji}>{e}</Text>
            ))}
          </View>
          <Lock color="rgba(255,255,255,0.7)" size={16} />
        </View>
        <Text style={s.name} numberOfLines={1}>{pack.name}</Text>
        <Text style={s.desc} numberOfLines={2}>{pack.description}</Text>
        <View style={s.cta}>
          <Text style={s.ctaText}>Unlock Pack</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: borderRadius.large, minHeight: 160, padding: spacing.base, width: 200 },
  cta: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: borderRadius.medium, marginTop: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  ctaText: { color: '#fff', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  desc: { ...typography.caption, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  emoji: { fontSize: 20 },
  emojiGroup: { flexDirection: 'row', gap: 4 },
  name: { ...typography.bodySmall, color: '#fff', fontWeight: '700', marginTop: spacing.md },
  topRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
});
