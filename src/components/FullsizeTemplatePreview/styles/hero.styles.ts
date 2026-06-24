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
  iconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    height: 96,
    justifyContent: 'center',
    width: 96,
  },
  iconGlow: {
    borderRadius: borderRadius.full,
    height: 96,
    opacity: 0.3,
    position: 'absolute',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    width: 96,
  },
  iconText: {
    fontSize: typography.displayLarge.fontSize,
  },
  iconWrapper: {
    marginBottom: 20,
    position: 'relative',
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
    ...typography.heading1,
    alignSelf: 'stretch',
    color: colors.gray[900],
    letterSpacing: -0.5,
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
