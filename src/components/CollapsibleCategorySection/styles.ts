/**
 * CollapsibleCategorySection Styles
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  chevronContainer: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  container: {
    marginBottom: 8,
  },
  content: {
    marginTop: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  countTextHabits: {
    color: '#78716c',
  },
  countTextScience: {
    color: '#059669',
  },
  header: {
    alignItems: 'center',
    borderLeftWidth: 4,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  icon: {
    fontSize: 22,
  },
  iconBadge: {
    alignItems: 'center',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  labelContainer: {
    flex: 1,
  },
  templatesScroll: {
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 8,
  },
});
