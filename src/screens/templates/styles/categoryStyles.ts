import { StyleSheet } from 'react-native';
import { borderRadius, shadows } from '@/theme/spacing';
import { fontWeights, typography } from '@/theme/typography';

export const categoryStyles = StyleSheet.create({
  categoriesContainer: {
    gap: 8,
    paddingHorizontal: 16,
    paddingRight: 50,
    paddingVertical: 12,
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoriesWrapper: {
    position: 'relative',
  },
  categoryChip: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginRight: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...shadows.subtle,
  },
  categoryColorDot: {
    borderRadius: borderRadius.full,
    height: 6,
    width: 6,
  },
  categoryCount: {
    borderRadius: borderRadius.full,
    marginLeft: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryCountText: {
    ...typography.caption,
    fontWeight: fontWeights.semibold,
  },
  categoryHeaderIcon: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  categoryHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  categoryIcon: {
    fontSize: typography.body.fontSize,
  },
  categoryScrollGradient: {
    height: '100%',
    width: 32,
  },
  categoryScrollHintChevrons: {
    alignItems: 'center',
    flexDirection: 'row',
    opacity: 0.7,
  },
  categoryScrollHintWrapper: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 8,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  categorySections: {
    paddingTop: 4,
  },
});
