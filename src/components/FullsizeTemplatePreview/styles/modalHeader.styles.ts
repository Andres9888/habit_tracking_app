/**
 * Modal header styles for FullsizeTemplatePreview — drag handle, the back/close
 * slots, and the centered "Habit science" kicker + template name.
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { borderRadius } from '@/theme/spacing';
import { fontFamilies, fontWeights } from '@/theme/typography';

export const modalHeaderStyles = StyleSheet.create({
  handle: {
    backgroundColor: colors.gray[300],
    borderRadius: borderRadius.xs,
    height: 4,
    width: 40,
  },
  handleRow: { alignItems: 'center', paddingTop: 8 },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'space-between',
  },
  slot: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  titleWrap: { alignItems: 'center', flex: 1, minWidth: 0 },
  kicker: {
    color: colors.primary[700],
    fontFamily: fontFamilies.primary.text,
    fontSize: 11,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.7,
    marginBottom: 1,
    textTransform: 'uppercase',
  },
  name: {
    color: colors.gray[800],
    fontFamily: fontFamilies.primary.display,
    fontSize: 15,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.2,
  },
});
