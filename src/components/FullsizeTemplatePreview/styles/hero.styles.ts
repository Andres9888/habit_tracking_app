/**
 * Hero section styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

import { borderRadius } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

export const heroStyles = StyleSheet.create({
  descriptionSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  descriptionText: {
    color: '#524D47',
    fontSize: typography.body.fontSize,
    lineHeight: 26,
    textAlign: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroGradient: {
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 16,
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
    fontSize: 48,
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
    fontSize: 13,
    fontWeight: '600',
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  templateName: {
    color: '#1c1917',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 16,
    textAlign: 'center',
  },
});
