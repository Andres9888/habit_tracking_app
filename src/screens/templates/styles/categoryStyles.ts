import { StyleSheet } from 'react-native';
import { shadows } from '@/theme/spacing';
import { fontFamilies } from '@/theme/typography';

export const categoryStyles = StyleSheet.create({
  categoriesContainer: {
    gap: 8,
    paddingHorizontal: 20,
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
    paddingVertical: 10,
    ...shadows.subtle,
  },
  categoryColorDot: {
    borderRadius: 999,
    height: 6,
    width: 6,
  },
  categoryCount: {
    borderRadius: 999,
    marginLeft: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryCountText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: '600',
  },
  categoryHeaderIcon: {
    alignItems: 'center',
    borderRadius: 12,
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
    fontSize: 17,
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
