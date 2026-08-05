/**
 * SectionOverline — quiet uppercase section label with optional right slot.
 * Minimal & Clean browse rhythm: low-emphasis headers between row sections.
 */

import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

interface SectionOverlineProps {
  /** Drop the top margin — for the first section under a hero/header. */
  flush?: boolean;
  rightSlot?: ReactNode;
  title: string;
}

export function SectionOverline({
  flush = false,
  rightSlot,
  title,
}: SectionOverlineProps) {
  const { colors } = useThemeColors();

  return (
    <View style={[s.row, flush && s.flush]}>
      <Text style={[s.label, { color: colors.text.tertiary }]}>{title}</Text>
      {rightSlot ? <View style={s.right}>{rightSlot}</View> : null}
    </View>
  );
}

const s = StyleSheet.create({
  flush: {
    marginTop: 0,
  },
  label: {
    ...typography.overline,
  },
  right: {
    flexShrink: 0,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.base,
  },
});
