/**
 * PopularInlineRow — compact vertical trending habit row.
 * Used to surface top 3 popular habits without horizontal scroll.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';
import { AddButton } from '../TrendingCard/AddButton';
import { formatPopularity } from '../TrendingCard/formatPopularity';

interface PopularInlineRowProps {
  description?: string;
  frequency: string;
  hasResearch: boolean;
  icon: string;
  iconColor: string;
  isImported: boolean;
  isImporting: boolean;
  name: string;
  onImport: () => void;
  onPress: () => void;
  popularityPrefix?: string;
  popularityScore: number;
}

export function PopularInlineRow({
  frequency,
  hasResearch,
  icon,
  iconColor,
  isImported,
  isImporting,
  name,
  onImport,
  onPress,
  popularityPrefix,
  popularityScore,
}: PopularInlineRowProps) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityHint='Opens the habit preview'
      accessibilityLabel={`Preview ${name} habit`}
      accessibilityRole='button'
      style={[
        s.row,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: isImported ? 0.55 : 1,
        },
        shadows.subtle,
      ]}
      onPress={onPress}
    >
      <View style={[s.iconBox, { backgroundColor: `${iconColor}25` }]}>
        <Text style={s.iconEmoji}>{icon}</Text>
      </View>

      <View style={s.body}>
        <Text
          numberOfLines={1}
          style={[s.name, { color: colors.text.primary }]}
        >
          {name}
        </Text>
        <View style={s.metaRow}>
          <Text style={[s.popularity, { color: colors.primary[600] }]}>
            {popularityPrefix ? `${popularityPrefix} ` : ''}
            {formatPopularity(popularityScore)}
          </Text>
          <Text style={[s.dot, { color: colors.text.tertiary }]}>·</Text>
          <Text style={[s.meta, { color: colors.text.secondary }]} numberOfLines={1}>
            {frequency}
            {hasResearch ? ' · 🔬 Science-backed' : ''}
          </Text>
        </View>
      </View>

      <AddButton
        isImported={isImported}
        isImporting={isImporting}
        name={name}
        onImport={onImport}
      />
    </Pressable>
  );
}

const s = StyleSheet.create({
  body: { flex: 1, minWidth: 0 },
  dot: { fontSize: 12, marginHorizontal: 4 },
  iconBox: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  iconEmoji: { fontSize: 24 },
  meta: { ...typography.caption, flexShrink: 1 },
  metaRow: { alignItems: 'center', flexDirection: 'row', marginTop: 2 },
  name: { ...typography.bodySmall, fontWeight: fontWeights.bold },
  popularity: { ...typography.caption, fontWeight: fontWeights.semibold },
  row: {
    alignItems: 'center',
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
});
