/**
 * FrequencyPicker Styles
 */

import { StyleSheet } from 'react-native';
import { spacing, borderRadius } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...typography.heading3,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.md,
  },
  frequencyTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
    borderRadius: borderRadius.large,
    borderWidth: 2,
  },
  frequencyTypeIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  frequencyTypeTextContainer: {
    flex: 1,
  },
  frequencyTypeLabel: {
    ...typography.body,
    fontSize: 16,
    fontWeight: '600',
  },
  frequencyTypeDescription: {
    ...typography.caption,
    fontSize: 13,
    marginTop: 2,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  subsectionLabel: {
    ...typography.body,
    fontSize: 15,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  daySelectorContainer: {
    marginTop: spacing.sm,
  },
  daySelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  dayButtonText: {
    ...typography.body,
    fontSize: 13,
    fontWeight: '600',
  },
  timesPerWeekContainer: {
    marginTop: spacing.sm,
  },
  timesPerWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  timesPerWeekButton: {
    flex: 1,
    height: 48,
    borderRadius: borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  timesPerWeekButtonText: {
    ...typography.body,
    fontSize: 16,
    fontWeight: '600',
  },
  intervalContainer: {
    marginTop: spacing.sm,
  },
  intervalScrollContent: {
    gap: spacing.xs,
  },
  intervalButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.medium,
    borderWidth: 2,
  },
  intervalButtonText: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '600',
  },
  previewContainer: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.large,
    borderWidth: 1,
  },
  previewLabel: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  previewIcon: {
    fontSize: 20,
  },
  previewText: {
    ...typography.body,
    fontSize: 15,
    fontWeight: '600',
  },
});
