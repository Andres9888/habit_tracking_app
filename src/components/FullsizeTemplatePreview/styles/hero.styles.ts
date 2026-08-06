/**
 * Hero section styles for FullsizeTemplatePreview
 *
 * Layout only — colors come from `useDetailPalette()` at the call site so the
 * hero adapts to dark mode.
 */

import { StyleSheet } from 'react-native';

import { spacing } from '../../../theme/spacing';
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
    fontFamily: fontFamilies.primary.text,
    ...HERO_DESCRIPTION,
    textAlign: 'center',
  },
  heroContent: { alignItems: 'center' },
  heroGradient: {
    overflow: 'hidden',
    paddingBottom: 26,
    paddingHorizontal: 24,
    paddingTop: 4,
    position: 'relative',
  },
  iconText: { fontSize: HERO_ICON_TEXT_SIZE },
  iconTile: {
    alignItems: 'center',
    borderRadius: 24,
    elevation: 3,
    height: 88,
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: 'rgba(122,86,50,0.4)',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    width: 88,
  },
  metadataPill: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  metadataPillText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: PILL_TEXT_SIZE,
    fontWeight: fontWeights.semibold,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  templateName: {
    alignSelf: 'stretch',
    fontFamily: fontFamilies.primary.display,
    fontWeight: fontWeights.bold,
    marginBottom: 16,
    textAlign: 'center',
    ...HERO_TITLE,
  },
  tagline: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 15.5,
    lineHeight: 21,
    marginBottom: 16,
    marginTop: -6,
    maxWidth: 300,
    textAlign: 'center',
  },
});
