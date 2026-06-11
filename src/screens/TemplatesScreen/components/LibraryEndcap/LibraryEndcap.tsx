/**
 * LibraryEndcap — the main page's single exit into the full catalog
 * ("Open the full library · 84 habits ›").
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

interface LibraryEndcapProps {
  onPress: () => void;
  totalHabitCount: number;
}

export function LibraryEndcap({
  onPress,
  totalHabitCount,
}: LibraryEndcapProps) {
  const { colors } = useThemeColors();
  const countSuffix = totalHabitCount > 0 ? ` · ${totalHabitCount} habits` : '';

  return (
    <View style={s.wrap}>
      <Pressable
        accessibilityLabel='Open the full habit library'
        accessibilityRole='button'
        style={[
          s.endcap,
          {
            backgroundColor: colors.primary[100],
            borderColor: colors.primary[300],
          },
        ]}
        onPress={onPress}
      >
        <Text style={[s.text, { color: colors.primary[700] }]}>
          Open the full library{countSuffix} ›
        </Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  endcap: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
  },
  text: { ...typography.bodySmall, fontWeight: fontWeights.bold },
  wrap: { alignItems: 'center', marginTop: spacing.lg },
});
