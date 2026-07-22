/**
 * SectionHeader — category header for the grouped habit-library catalog.
 * Renders an optional inline emoji with title/subtitle and a right-side slot.
 */

import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

interface SectionHeaderProps {
  icon?: string;
  rightSlot?: ReactNode;
  subtitle?: string;
  title: string;
}

export function SectionHeader({
  icon,
  rightSlot,
  subtitle,
  title,
}: SectionHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View style={s.row}>
      <View style={s.titleRow}>
        {icon ? <Text style={s.icon}>{icon}</Text> : null}
        <View style={s.textBlock}>
          <Text style={[s.title, { color: colors.text.primary }]}>{title}</Text>
          {subtitle ? (
            <Text style={[s.subtitle, { color: colors.text.secondary }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {rightSlot ? <View style={s.right}>{rightSlot}</View> : null}
    </View>
  );
}

const s = StyleSheet.create({
  icon: { fontSize: 18 },
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
  titleRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minWidth: 0,
  },
});
