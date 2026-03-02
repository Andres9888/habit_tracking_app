/**
 * PremiumPacksSection - Horizontal carousel of premium pack cards
 */

import { FlatList, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';
import type { PremiumPack } from '../../data/premiumPacks';
import { PremiumPackCard } from './PremiumPackCard';

interface PremiumPacksSectionProps {
  onPackPress: (pack: PremiumPack) => void;
  packs: PremiumPack[];
}

export function PremiumPacksSection({ onPackPress, packs }: PremiumPacksSectionProps) {
  return (
    <View testID="templates-premium-packs-section" style={s.container}>
      <View style={s.headerRow}>
        <Text style={s.title}>Premium Packs</Text>
        <View style={s.proBadge}>
          <Text style={s.proText}>PRO</Text>
        </View>
      </View>
      <FlatList
        horizontal
        data={packs}
        contentContainerStyle={{ gap: spacing.md, paddingHorizontal: spacing.base }}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <PremiumPackCard index={index} pack={item} onPress={() => onPackPress(item)} />
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginTop: spacing.lg },
  headerRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md, paddingHorizontal: spacing.base },
  proBadge: { backgroundColor: colors.premium[600], borderRadius: borderRadius.xs, paddingHorizontal: 6, paddingVertical: 2 },
  proText: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  title: { ...typography.heading3, color: colors.text.primary },
});
