/**
 * CollapsibleCategorySection Styles
 */

import { StyleSheet } from 'react-native';

import { borderRadius } from '../../theme/spacing';
import { typography, fontFamilies } from '../../theme/typography';

import { useThemeColors } from '../../theme/ThemeContext';

/** Static styles that don't depend on theme */
const baseStyles = StyleSheet.create({
  chevronContainer: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  container: {
    marginBottom: 8,
    overflow: 'hidden',
  },
  content: {
    marginTop: 8,
  },
  countText: {
    fontFamily: fontFamilies.monospace,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  header: {
    alignItems: 'center',
    borderLeftWidth: 4,
    borderRadius: borderRadius.large,
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
    borderRadius: borderRadius.medium,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  label: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
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

/** @deprecated Use useThemedStyles() for dark mode support */
export const styles = {
  ...baseStyles,
  countTextHabits: { color: '#78716c' },
  countTextScience: { color: '#059669' },
};

export function useThemedStyles() {
  const { colors } = useThemeColors();
  return {
    ...baseStyles,
    countTextHabits: { color: colors.text.secondary },
    countTextScience: { color: colors.primary[600] },
  };
}
