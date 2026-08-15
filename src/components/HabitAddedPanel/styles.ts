/**
 * Layout for the shared post-add confirmation panel.
 *
 * Colors come from the palette at the call site so the same geometry works on
 * the drill-down footer (opaque card on the page) and as a floating toast.
 */

import { StyleSheet } from 'react-native';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';

export const habitAddedPanelStyles = StyleSheet.create({
  check: {
    alignItems: 'center',
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  headline: {
    flex: 1,
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: fontWeights.bold,
  },
  message: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    lineHeight: 20,
  },
  panel: {
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 999,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.semibold,
  },
});
