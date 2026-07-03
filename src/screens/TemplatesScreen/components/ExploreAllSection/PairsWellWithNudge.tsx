/**
 * Compact "Pairs well with X" nudge shown inline under a row right after
 * it's added — distinct from the full PairsWellWith section on
 * FullsizeTemplatePreview. Suggests the companion category's top template.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { colors as staticColors } from '../../../../theme/colors';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '../../../../theme/typography';
import { CATEGORY_PAIRINGS } from '../../data/habitPairings';
import { getCategoryMeta } from '../../data/categoryMeta';

interface PairsWellWithNudgeProps {
  category: string;
  templatesByCategory: Map<string, Doc<'templates'>>;
  importedTemplateIds: Set<string>;
  onAdd: (template: Doc<'templates'>) => void;
}

export function PairsWellWithNudge({
  category,
  templatesByCategory,
  importedTemplateIds,
  onAdd,
}: PairsWellWithNudgeProps) {
  const { colors } = useThemeColors();
  const pairing = CATEGORY_PAIRINGS[category]?.[0];
  if (!pairing) return null;

  const suggestion = templatesByCategory.get(pairing.targetCategory);
  if (!suggestion || importedTemplateIds.has(suggestion._id)) return null;

  const meta = getCategoryMeta(pairing.targetCategory);

  return (
    <View
      style={[
        s.container,
        {
          backgroundColor: staticColors.streak[100],
          borderColor: `${staticColors.streak[700]}26`,
        },
      ]}
    >
      <Text style={s.icon}>{suggestion.icon || meta.icon}</Text>
      <Text
        numberOfLines={1}
        style={[s.label, { color: staticColors.streak[700] }]}
      >
        Pairs well with <Text style={s.labelBold}>{suggestion.name}</Text>
      </Text>
      <Pressable
        accessibilityLabel={`Add ${suggestion.name}`}
        accessibilityRole='button'
        hitSlop={8}
        onPress={() => onAdd(suggestion)}
      >
        <Text style={[s.addLabel, { color: colors.primary[700] }]}>+ Add</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  addLabel: {
    flexShrink: 0,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.bold,
  },
  container: {
    alignItems: 'center',
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: spacing.base,
    marginTop: -spacing.xs,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  icon: { fontSize: 16 },
  label: {
    flex: 1,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.medium,
  },
  labelBold: { fontWeight: fontWeights.bold },
});
