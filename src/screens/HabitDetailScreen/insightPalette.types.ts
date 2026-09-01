import type { BandTokens } from './insightBand';

export interface InsightPalette extends BandTokens {
  bandLocations: readonly [number, number, number];
  card: string;
  cardBorder: string;
  divider: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  green: string;
  ctaGreen: string;
  greenSoft: string;
  greenTint: string;
  greenWash: string;
  recoveryInk: string;
  onGreen: string;
  onGreenMuted: string;
  dialArc: string;
  amber: string;
  amberBar: string;
  amberBg: string;
  amberBorder: string;
  tileBg: string;
  cellEmpty: string;
  cellFuture: string;
  missedRing: string;
}
