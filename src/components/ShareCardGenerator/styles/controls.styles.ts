/**
 * Styles for customization controls (platform, gradient, message, toggle)
 */

import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { borderRadius } from '@/theme/spacing';
import { typography, fontWeights, fontFamilies} from '@/theme/typography';

export const controlsStyles = StyleSheet.create({
  characterCount: {
    fontFamily: fontFamilies.monospace,
    fontSize: typography.caption.fontSize,
    marginTop: 4,
    textAlign: 'right',
  },
  gradientButton: {
    borderColor: 'transparent',
    borderRadius: borderRadius.medium,
    borderWidth: 2,
    height: 56,
    overflow: 'hidden',
    width: 56,
  },
  gradientButtonInner: {
    flex: 1,
  },
  gradientButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  gradientButtonSelected: {
    borderColor: colors.primary[500],
  },
  messageInput: {
    borderRadius: borderRadius.small,
    borderWidth: 1,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    minHeight: 80,
    padding: 12,
    textAlignVertical: 'top',
  },
  optionGroup: {
    marginBottom: 24,
  },
  optionLabel: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    fontWeight: fontWeights.semibold,
    marginBottom: 12,
  },
  platformButton: {
    backgroundColor: colors.gray[100],
    borderColor: colors.border,
    borderRadius: borderRadius.small,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  platformButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformButtonText: {
    color: colors.gray[600],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.medium,
    textTransform: 'capitalize',
  },
  platformButtonTextActive: {
    color: colors.text.inverse,
  },
  shareButton: {
    marginTop: 8,
  },
  toggleLabelContainer: {
    flex: 1,
  },
  toggleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleSubtext: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    marginTop: 4,
  },
});
