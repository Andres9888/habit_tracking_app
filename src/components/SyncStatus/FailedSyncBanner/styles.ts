/**
 * FailedSyncBanner Styles
 *
 * Error-themed banner styling to draw attention to un-synced changes.
 */

import { StyleSheet } from 'react-native';

import { colors } from '../../../theme/colors/core';
import { borderRadius } from '../../../theme/spacing';
import { typography, fontWeights, fontFamilies } from '@/theme/typography';

export const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.medium,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },

  container: {
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    borderColor: colors.error,
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  discardButton: {
    backgroundColor: 'transparent',
    borderColor: colors.error,
    borderWidth: 1,
  },

  discardText: {
    color: colors.error,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.medium,
  },

  message: {
    color: colors.error,
    flexShrink: 1,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.medium,
  },

  retryButton: {
    backgroundColor: colors.error,
  },

  retryText: {
    color: '#FFFFFF',
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.semibold,
  },
});
