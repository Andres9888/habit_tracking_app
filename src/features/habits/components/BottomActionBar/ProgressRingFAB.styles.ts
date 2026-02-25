import { StyleSheet } from 'react-native';
import { borderRadius, shadows } from '../../../../theme/spacing';
import { fontFamilies } from '../../../../theme/typography';

export const RING_SIZE = 60;
export const STROKE_WIDTH = 3;
export const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const fabRingStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: -20,
    overflow: 'visible',
  },
  fabButton: {
    alignItems: 'center',
    borderRadius: borderRadius.large,
    borderWidth: 3,
    height: 52,
    justifyContent: 'center',
    width: 52,
    ...shadows.floatingActionButton,
  },
  iconContainer: {
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  progressLabel: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center' as const,
  },
  ringOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringWrapper: {
    alignItems: 'center',
    height: RING_SIZE,
    justifyContent: 'center',
    width: RING_SIZE,
  },
});
