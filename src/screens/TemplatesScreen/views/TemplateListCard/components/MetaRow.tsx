import { StyleSheet, Text, View } from 'react-native';
import { FlaskConical, Repeat } from 'lucide-react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../../../theme/spacing';
import { typography } from '../../../../../theme/typography';
import { getCategoryMeta } from '../../../data/categoryMeta';

interface MetaRowProps {
  categoryId: string;
  categoryLabel: string;
  frequency?: string;
  hasResearch: boolean;
}

export function MetaRow({
  categoryId,
  categoryLabel,
  frequency,
  hasResearch,
}: MetaRowProps) {
  const { colors } = useThemeColors();
  const categoryEmoji = getCategoryMeta(categoryId).icon;
  const neutralPill = {
    backgroundColor: colors.background,
    borderColor: colors.border,
  };

  return (
    <View style={styles.row}>
      {frequency ? (
        <View style={[styles.pill, neutralPill]}>
          <Repeat color={colors.text.secondary} size={11} strokeWidth={2.5} />
          <Text style={[styles.label, { color: colors.text.secondary }]}>
            {frequency}
          </Text>
        </View>
      ) : null}
      <View style={[styles.pill, neutralPill]}>
        <Text style={styles.emoji}>{categoryEmoji}</Text>
        <Text style={[styles.label, { color: colors.text.secondary }]}>
          {categoryLabel}
        </Text>
      </View>
      {hasResearch ? (
        <View
          style={[
            styles.pill,
            {
              backgroundColor: colors.primary[100],
              borderColor: colors.primary[300],
            },
          ]}
        >
          <FlaskConical
            color={colors.primary[700]}
            size={11}
            strokeWidth={2.5}
          />
          <Text style={[styles.label, { color: colors.primary[700] }]}>
            Science
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  emoji: {
    fontSize: 11,
    lineHeight: 13,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
  },
  pill: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
