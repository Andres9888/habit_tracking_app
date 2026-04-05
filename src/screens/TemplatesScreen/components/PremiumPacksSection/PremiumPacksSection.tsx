/**
 * PremiumPacksSection - Vertically stacked curated pack cards
 */

import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';
import type { PremiumPack } from '../../data/premiumPacks';
import { PremiumPackCard } from './PremiumPackCard';

interface PremiumPacksSectionProps {
  onPackPress: (pack: PremiumPack) => void;
  packs: PremiumPack[];
}

export function PremiumPacksSection({
  onPackPress,
  packs,
}: PremiumPacksSectionProps) {
  return (
    <View testID='templates-premium-packs-section' style={s.container}>
      <View style={s.headerRow}>
        <Text style={s.title}>Starter Sets</Text>
        <Text style={s.badge}>Premium</Text>
      </View>
      {packs.map((pack) => (
        <PremiumPackCard
          key={pack.id}
          pack={pack}
          onPress={() => onPackPress(pack)}
        />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  badge: {
    ...typography.caption,
    color: colors.premium[700],
    fontWeight: '700',
  },
  container: { marginTop: spacing.lg },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.base,
  },
  title: { ...typography.heading3, color: colors.text.primary },
});
