import { StyleSheet } from 'react-native';
import { borderRadius } from '@/theme/spacing';
import { fontWeights, typography } from '@/theme/typography';

export const formStyles = StyleSheet.create({
  charCount: {
    ...typography.caption,
    marginTop: 4,
    textAlign: 'right',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  colorSwatch: {
    borderRadius: borderRadius.full,
    height: 44,
    width: 44,
  },
  colorSwatchActive: {
    borderWidth: 3,
  },
  inputLabel: {
    ...typography.caption,
    fontWeight: fontWeights.semibold,
    marginTop: 16,
  },
  inputWrapper: {
    marginTop: 8,
    position: 'relative',
  },
  nameInput: {
    ...typography.body,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reminderChip: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  reminderChipActive: {},
  reminderChipText: {
    ...typography.caption,
    fontWeight: fontWeights.semibold,
  },
  reminderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
});
