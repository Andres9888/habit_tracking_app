/**
 * Shared spec for the three Advanced Options section-head icon tiles
 * (Strength Curve, Streak Goal, Growth Icons) so they read as one set:
 * identical size / radius / gap and a shared left edge for every title and
 * description. Colors come from useAdvancedTokens (accent green) at the call site.
 */
import type { ViewStyle } from 'react-native';

const SIZE = 32;
const GAP = 10;

export const sectionHeadTile = {
  size: SIZE,
  radius: 9,
  gap: GAP,
  /** Title/description left inset = tile + gap; shared by all three heads. */
  inset: SIZE + GAP,
} as const;

/** Square icon-tile style; pass the accent background from useAdvancedTokens. */
export function sectionHeadTileStyle(backgroundColor: string): ViewStyle {
  return {
    width: SIZE,
    height: SIZE,
    borderRadius: sectionHeadTile.radius,
    backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  };
}
