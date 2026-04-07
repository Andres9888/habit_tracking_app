/**
 * CategoryTile - Single category tile in the grid
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { typography, fontWeights } from '../../../../theme/typography';

interface CategoryTileProps {
  bgColor: string;
  count: number;
  icon: string;
  index: number;
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
  label,
  onPress,
  previewEmojis,
  textColor,
}: CategoryTileProps) {
  return (
    <Pressable
      testID={`templates-category-tile-${index}`}
      accessibilityLabel={`${label} category, ${count} ${count === 1 ? 'habit' : 'habits'}`}
      accessibilityRole='button'
      style={[s.tile, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      <View style={s.row}>
        <Text style={s.icon}>{icon}</Text>
      </View>
      <Text style={[s.label, { color: textColor }]}>{label}</Text>
      <Text style={s.count}>{count} {count === 1 ? 'habit' : 'habits'}</Text>
      {previewEmojis.length > 0 ? <View style={s.previewRow}>
          {previewEmojis.map((emoji, i) => (
            <Text key={i} style={s.previewEmoji}>
              {emoji}
            </Text>
          ))}
        </View> : null}
    </Pressable>
  );
}

const s = StyleSheet.create({
  count: { ...typography.caption, color: colors.text.tertiary, marginTop: spacing.xs },
  icon: { fontSize: 28 },
  label: { ...typography.bodySmall, fontWeight: fontWeights.semibold, marginTop: spacing.sm },
  previewEmoji: { fontSize: 14, opacity: 0.6 },
  previewRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: 'auto',
    paddingTop: spacing.sm,
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
