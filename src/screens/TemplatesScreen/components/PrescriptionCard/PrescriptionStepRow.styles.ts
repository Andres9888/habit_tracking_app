import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export const stepStyles = StyleSheet.create({
  body: { flex: 1, minWidth: 0 },
  chevron: {
    color: '#C9C2BA',
    flexShrink: 0,
    fontSize: 16,
    fontWeight: fontWeights.semibold,
  },
  icon: {
    alignItems: 'center',
    borderRadius: 11,
    flexShrink: 0,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  iconText: { fontSize: 20 },
  meta: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: 2,
  },
  name: { ...typography.bodySmall, fontWeight: fontWeights.semibold },
  reason: {
    ...typography.caption,
    color: '#6B6560',
    flexShrink: 1,
    fontSize: 11.5,
  },
  row: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 11,
    marginHorizontal: 12,
    marginTop: 10,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  rowImported: { backgroundColor: '#F0FDF6' },
  stepBadge: {
    borderRadius: borderRadius.full,
    flexShrink: 0,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  stepBadgeText: { fontSize: 10, fontWeight: fontWeights.bold },
});
