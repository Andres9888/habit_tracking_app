/**
 * Hero section styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import {
  typography,
  fontFamilies,
  fontWeights,
} from '../../../theme/typography';

export const heroStyles = StyleSheet.create({
  descriptionSection: {
    paddingBottom: spacing.lg,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  descriptionText: {
    color: colors.gray[500],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    lineHeight: 26,
    textAlign: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroGradient: {
    overflow: 'hidden',
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 16,
    position: 'relative',
  },
  heroHairline: {
    bottom: 0,
    height: 1,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  metadataPill: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  metadataPillText: {
    fontFamily: fontFamilies.monospace,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.semibold,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  templateName: {
    alignSelf: 'stretch',
    color: colors.gray[900],
    fontFamily: fontFamilies.primary.display,
    fontSize: 30,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: 16,
    textAlign: 'center',
  },
  tagline: {
    color: colors.gray[600],
    fontFamily: fontFamilies.primary.text,
    fontSize: 15.5,
    lineHeight: 21,
    marginBottom: 16,
    marginTop: -6,
    maxWidth: 300,
    textAlign: 'center',
  },
});
