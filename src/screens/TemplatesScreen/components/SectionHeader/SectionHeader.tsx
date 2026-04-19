/**
 * SectionHeader — shared header for curated sections on the habit library.
 * One visual rhythm: title + optional subtitle on the left, optional slot
 * on the right. Used by PopularSection, PremiumPacksSection, ExploreAllSection.
 */

import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

interface SectionHeaderProps {
  rightSlot?: ReactNode;
  subtitle?: string;
  title: string;
}

export function SectionHeader({
  rightSlot,
  subtitle,
  title,
}: SectionHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View style={s.row}>
      <View style={s.textBlock}>
        <Text style={[s.title, { color: colors.text.primary }]}>{title}</Text>
        {subtitle ? (
          <Text style={[s.subtitle, { color: colors.text.secondary }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightSlot ? <View style={s.right}>{rightSlot}</View> : null}
    </View>
  );
}

const s = StyleSheet.create({
  right: { flexShrink: 0 },
  row: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  subtitle: { ...typography.caption, marginTop: 2 },
  textBlock: { flex: 1, minWidth: 0 },
  title: { ...typography.heading3 },
});
