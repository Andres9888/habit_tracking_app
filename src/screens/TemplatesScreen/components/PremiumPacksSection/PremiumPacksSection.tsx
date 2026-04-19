/**
 * PremiumPacksSection - Vertically stacked curated pack cards
 */

import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';
import type { PremiumPack } from '../../data/premiumPacks';
import { SectionHeader } from '../SectionHeader';
import { PremiumPackCard } from './PremiumPackCard';

interface PremiumPacksSectionProps {
  onPackPress: (pack: PremiumPack) => void;
  packs: PremiumPack[];
}

export function PremiumPacksSection({
  onPackPress,
  packs,
}: PremiumPacksSectionProps) {
  const { colors } = useThemeColors();

  return (
    <View testID='templates-premium-packs-section' style={s.container}>
      <SectionHeader
        rightSlot={
          <Text style={[s.badge, { color: colors.status.premiumText }]}>Premium</Text>
        }
        title='Curated bundles'
      />
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
    fontWeight: fontWeights.bold,
  },
  container: { marginTop: spacing.lg },
});
