import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';

export const styles = StyleSheet.create({
  chip: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipLabel: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: fontWeights.semibold,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  // flexGrow: 0 overrides ScrollView's default flexGrow: 1, which otherwise
  // stretches the rail to absorb free vertical space in the catalog column.
  rail: { borderBottomWidth: 1, flexGrow: 0, flexShrink: 0 },
});
