/**
 * Icon-tile styles for the premium hero (glow, ring plate, white tile, glyph).
 */

import { StyleSheet } from 'react-native';
import { borderRadius } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export const heroIconStyles = StyleSheet.create({
  iconGlow: {
    borderRadius: borderRadius.full,
    height: 92,
    opacity: 0.28,
    position: 'absolute',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 22,
    width: 92,
  },
  iconRing: {
    alignItems: 'center',
    borderRadius: 26,
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
  iconText: {
    fontSize: typography.displayLarge.fontSize,
  },
  iconTile: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    elevation: 8,
    height: 74,
    justifyContent: 'center',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    width: 74,
  },
  iconWrapper: {
    alignItems: 'center',
    height: 88,
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
    width: 88,
  },
});
