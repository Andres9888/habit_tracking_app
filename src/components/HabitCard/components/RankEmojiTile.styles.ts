import { StyleSheet } from 'react-native';

export const DEFAULT_TILE_SIZE = 44;

export const baseStyles = StyleSheet.create({
  emoji: {
    textAlign: 'center',
  },
  gradientLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  highlight: {
    position: 'absolute',
    left: 3,
    right: 3,
  },
  shimmer: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

/** Size-dependent values derived from the tile edge length. */
export function getSizeVars(size: number) {
  const radius = Math.max(6, Math.round(size * 0.27));
  return {
    size,
    radius,
    emojiFontSize: Math.round(size * 0.55),
    emojiLineHeight: Math.round(size * 0.64),
    highlightHeight: Math.max(4, Math.round(size * 0.22)),
    highlightTop: Math.max(2, Math.round(size * 0.07)),
    shimmerWidth: Math.max(6, Math.round(size * 0.27)),
    glowScale: size / DEFAULT_TILE_SIZE,
  };
}
