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
  isHot?: boolean;
  label: string;
  onPress: () => void;
  previewEmojis: string[];
  textColor: string;
}

export function CategoryTile({
  bgColor,
  count,
  icon,
  index,
  isHot,
  label,
  onPress,
  previewEmojis,
  textColor,
}: CategoryTileProps) {
  return (
    <Pressable
      testID={`templates-category-tile-${index}`}
      accessibilityLabel={`${label} category, ${count} templates`}
      accessibilityRole='button'
      style={[s.tile, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      <View style={s.row}>
        <Text style={s.icon}>{icon}</Text>
        {isHot && <Text style={s.hotBadge}>🔥 Hot</Text>}
      </View>
      <Text style={[s.label, { color: textColor }]}>{label}</Text>
      <Text style={s.count}>{count} templates</Text>
      {previewEmojis.length > 0 && (
        <View style={s.previewRow}>
          {previewEmojis.map((emoji, i) => (
            <Text key={i} style={s.previewEmoji}>
              {emoji}
            </Text>
          ))}
        </View>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  count: { ...typography.caption, color: colors.text.tertiary, marginTop: 2 },
  hotBadge: {
    backgroundColor: '#fef3c7',
    borderRadius: 6,
    color: '#b45309',
    fontSize: 9,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  icon: { fontSize: 28 },
  label: { ...typography.bodySmall, fontWeight: '600', marginTop: spacing.sm },
  previewEmoji: { fontSize: 14, opacity: 0.6 },
  previewRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 'auto',
    paddingTop: 8,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tile: {
    borderRadius: borderRadius.medium,
    flex: 1,
    minHeight: 120,
    padding: spacing.md,
  },
});
