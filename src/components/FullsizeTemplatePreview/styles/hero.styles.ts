/**
 * Hero section styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

export const heroStyles = StyleSheet.create({
  heroContent: {
    alignItems: 'center',
  },
  descriptionSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heroGradient: {
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  descriptionText: {
    color: '#4B5563',
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 24,
    height: 96,
    justifyContent: 'center',
    width: 96,
  },
  iconGlow: {
    borderRadius: 48,
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
    borderRadius: 12,
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
