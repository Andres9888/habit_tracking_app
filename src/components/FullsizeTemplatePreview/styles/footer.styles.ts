/**
 * Footer styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { borderRadius } from '../../../theme/spacing';
import {
  typography,
  fontFamilies,
  fontWeights,
} from '../../../theme/typography';

export const footerStyles = StyleSheet.create({
  customizeLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  customizeLinkText: {
    color: colors.gray[500],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.semibold,
  },
  footer: {
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  footerGradient: {
    paddingTop: 24,
  },
  footerGradientWrapper: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  // Duolingo press-depth: the deep-toned wrapper's bottom 4px reads as a hard
  // shadow; the button (bg = iconColor) translates down into it on press.
  ctaShadowWrap: {
    borderRadius: borderRadius.large,
    boxShadow: '0 6px 16px rgba(45,42,38,0.18)',
    paddingBottom: 4,
  },
  importButton: {
    alignItems: 'center',
    borderRadius: borderRadius.large,
    height: 56,
    justifyContent: 'center',
  },
  importButtonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  importButtonText: {
    color: colors.text.inverse,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    fontWeight: fontWeights.bold,
  },
  successButton: {
    alignItems: 'center',
    backgroundColor: colors.primary[400],
    borderRadius: borderRadius.large,
    flexDirection: 'row',
    gap: 10,
    height: 56,
    justifyContent: 'center',
  },
  successButtonText: {
    color: colors.text.inverse,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    fontWeight: fontWeights.bold,
  },
});
