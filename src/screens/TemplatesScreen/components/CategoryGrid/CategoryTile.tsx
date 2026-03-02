/**
 * CategoryTile - Single category tile in the grid
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

interface CategoryTileProps {
  bgColor: string;
  count: number;
  icon: string;
  index: number;
  isPremium: boolean;
  label: string;
  onPress: () => void;
  textColor: string;
}

export function CategoryTile({
  bgColor,
  count,
  icon,
  index,
  isPremium,
  label,
  onPress,
  textColor,
}: CategoryTileProps) {
  return (
    <Pressable
      testID={`templates-category-tile-${index}`}
      accessibilityLabel={`${label} category, ${count} templates`}
      accessibilityRole="button"
      style={[s.tile, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      <View style={s.row}>
        <Text style={s.icon}>{icon}</Text>
        {isPremium && (
          <View style={s.proBadge}>
            <Text style={s.proText}>PRO</Text>
          </View>
        )}
      </View>
      <Text style={[s.label, { color: textColor }]}>{label}</Text>
      <Text style={s.count}>{count} templates</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  count: { ...typography.caption, color: colors.text.tertiary, marginTop: 2 },
  icon: { fontSize: 28 },
  label: { ...typography.bodySmall, fontWeight: '600', marginTop: spacing.sm },
  proBadge: {
    backgroundColor: colors.premium[600],
    borderRadius: borderRadius.xs,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  proText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  row: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  tile: {
    borderRadius: borderRadius.medium,
    flex: 1,
    minHeight: 100,
    padding: spacing.md,
  },
});
