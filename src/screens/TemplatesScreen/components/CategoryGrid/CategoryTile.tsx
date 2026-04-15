/**
 * CategoryTile - Single category tile in the grid
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { typography, fontWeights } from '../../../../theme/typography';

interface CategoryTileProps {
  bgColor: string;
  borderColor: string;
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
  borderColor,
  count,
  icon,
  index,
  label,
  onPress,
  previewEmojis,
  textColor,
}: CategoryTileProps) {
  const { colors } = useThemeColors();
  return (
    <Pressable
      testID={`templates-category-tile-${index}`}
      accessibilityLabel={`${label} category, ${count} ${count === 1 ? 'habit' : 'habits'}`}
      accessibilityRole='button'
      style={({ pressed }) => [
        s.tile,
        { backgroundColor: bgColor, borderColor },
        pressed && s.pressed,
      ]}
      onPress={onPress}
    >
      <View style={s.row}>
        <Text style={s.icon}>{icon}</Text>
        <ChevronRight size={16} color={textColor} strokeWidth={2} style={s.chevron} />
      </View>
      <Text style={[s.label, { color: textColor }]}>{label}</Text>
      <Text style={[s.count, { color: colors.text.tertiary }]}>{count} {count === 1 ? 'habit' : 'habits'}</Text>
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
  chevron: { opacity: 0.5 },
  count: { ...typography.caption, marginTop: spacing.xs },
  icon: { fontSize: 28 },
  label: { ...typography.bodySmall, fontWeight: fontWeights.semibold, marginTop: spacing.sm },
  pressed: { opacity: 0.75, transform: [{ scale: 0.97 }] },
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
    borderWidth: 1,
    flex: 1,
    minHeight: 120,
    padding: spacing.md,
  },
});
