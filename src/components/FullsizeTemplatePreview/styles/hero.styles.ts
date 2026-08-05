/**
 * Hero section styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../theme/typography';
import {
  HERO_DESCRIPTION,
  HERO_ICON_TEXT_SIZE,
  HERO_TITLE,
  PILL_TEXT_SIZE,
} from '../FullsizeTemplatePreview.constants';

export const heroStyles = StyleSheet.create({
  descriptionSection: {
    paddingBottom: spacing.lg,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  descriptionText: {
    color: colors.gray[500],
    fontFamily: fontFamilies.primary.text,
    ...HERO_DESCRIPTION,
    textAlign: 'center',
  },
  heroContent: { alignItems: 'center' },
  heroGradient: {
    overflow: 'hidden',
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 16,
    position: 'relative',
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 112,
    justifyContent: 'center',
    width: 112,
  },
  iconGlow: {
    borderRadius: borderRadius.full,
    height: 140,
    left: -14,
    position: 'absolute',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    top: -14,
    width: 140,
  },
  iconText: { fontSize: HERO_ICON_TEXT_SIZE },
  iconWrapper: { marginBottom: 20, position: 'relative' },
  metadataPill: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  metadataPillText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: PILL_TEXT_SIZE,
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
    fontWeight: fontWeights.bold,
    marginBottom: 16,
    textAlign: 'center',
    ...HERO_TITLE,
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
