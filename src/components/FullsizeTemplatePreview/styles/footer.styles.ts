/**
 * Footer styles for FullsizeTemplatePreview
 *
 * Layout only — CTA colors come from `useDetailPalette()` at the call site.
 */

import { StyleSheet } from 'react-native';

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
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.semibold,
  },
  footer: {
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
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
  importButton: {
    alignItems: 'center',
    borderRadius: 999,
    elevation: 6,
    height: 56,
    justifyContent: 'center',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
  },
  importButtonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  importButtonText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: fontWeights.bold,
  },
  successCheck: {
    alignItems: 'center',
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  successHeading: {
    flex: 1,
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: fontWeights.bold,
  },
  successMessage: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    lineHeight: 20,
  },
  successPanel: {
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  successPanelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  successPrimaryButton: {
    alignItems: 'center',
    borderRadius: 999,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  successPrimaryText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
  },
});
