/**
 * Tips box styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { borderRadius } from '../../../theme/spacing';
import { typography } from '@/theme/typography';

/** Yellow-800 dark text for tips label (domain-specific, no token match) */
const TIPS_LABEL_COLOR = '#854d0e';
/** Yellow-900 dark text for tip body (domain-specific, no token match) */
const TIPS_TEXT_COLOR = '#713f12';

export const tipsStyles = StyleSheet.create({
  tipIconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  tipItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  tipNumber: {
    fontSize: 13,
    fontWeight: '700',
  },
  tipsBox: {
    backgroundColor: colors.warning[100],
    borderColor: colors.warning[300],
    borderRadius: borderRadius.large,
    borderWidth: 2,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
  },
  tipsDivider: {
    backgroundColor: colors.warning[300],
    height: 1,
    marginBottom: 12,
  },
  tipsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tipsLabel: {
    color: TIPS_LABEL_COLOR,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  tipText: {
    color: TIPS_TEXT_COLOR,
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});
