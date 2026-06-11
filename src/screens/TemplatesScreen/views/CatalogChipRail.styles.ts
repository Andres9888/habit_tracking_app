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
  chipLabelSelected: { color: '#FFFFFF' },
  chipSelected: {
    backgroundColor: '#2D2A26',
    borderColor: '#2D2A26',
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  rail: { borderBottomWidth: 1, flexShrink: 0 },
});
