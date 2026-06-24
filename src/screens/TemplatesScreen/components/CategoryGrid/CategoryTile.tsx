/**
 * CategoryTile - Single category tile in the grid
 */

import { StyleSheet, Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
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
  const { colors } = useThemeColors();
  return (
    <AnimatedPressable
      testID={`templates-category-tile-${index}`}
      accessibilityLabel={`${label} category, ${count} ${count === 1 ? 'habit' : 'habits'}`}
      accessibilityRole='button'
      hitSlop={0}
      style={[s.tile, { backgroundColor: bgColor }]}
      onPress={() => {
        void triggerHaptic('tap');
        onPress();
      }}
    >
      <View style={s.row}>
        <Text style={s.icon}>{icon}</Text>
      </View>
      <Text style={[s.label, { color: textColor }]}>{label}</Text>
      <Text style={[s.count, { color: colors.text.tertiary }]}>
        {count} {count === 1 ? 'habit' : 'habits'}
      </Text>
      {previewEmojis.length > 0 ? (
        <View style={s.previewRow}>
          {previewEmojis.map((emoji, i) => (
            <Text key={i} style={s.previewEmoji}>
              {emoji}
            </Text>
          ))}
        </View>
      ) : null}
    </AnimatedPressable>
  );
}

const s = StyleSheet.create({
  count: { ...typography.caption, marginTop: spacing.xs },
  icon: { fontSize: 28 },
  label: {
    ...typography.bodySmall,
    fontWeight: fontWeights.semibold,
    marginTop: spacing.sm,
  },
  previewEmoji: { fontSize: typography.bodySmall.fontSize, opacity: 0.6 },
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
    ...shadows.subtle,
    borderRadius: borderRadius.medium,
    flex: 1,
    minHeight: 120,
    padding: spacing.md,
  },
});
