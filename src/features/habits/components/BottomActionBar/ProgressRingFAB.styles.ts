import { StyleSheet } from 'react-native';
import { absoluteFillObject } from '@/theme/absoluteFillObject';
import { colors } from '@/theme';
import { shadows } from '../../../../theme/spacing';

export const RING_SIZE = 64;
export const STROKE_WIDTH = 4;
export const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
export const FAB_SIZE = 48;

export const FAB_BORDER_LIGHT = 'rgba(245,241,237,0.9)';
export const FAB_BORDER_DARK = 'rgba(17,24,39,0.9)';

export const GLOW_SHADOW_BASE = {
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.5,
  shadowRadius: 8,
  elevation: 6,
};

export const DARK_FAB_SHADOW = {
  shadowColor: colors.primary[600],
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 20,
};

export const fabRingStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: -18,
  },
  fabButton: {
    alignItems: 'center',
    borderRadius: FAB_SIZE / 2,
    height: FAB_SIZE,
    justifyContent: 'center',
    width: FAB_SIZE,
  },
  iconAbsolute: {
    position: 'absolute' as const,
  },
  iconContainer: {
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  ringOverlay: {
    ...absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringWrapper: {
    alignItems: 'center',
    height: RING_SIZE,
    justifyContent: 'center',
    width: RING_SIZE,
    ...shadows.floatingActionButton,
  },
});
