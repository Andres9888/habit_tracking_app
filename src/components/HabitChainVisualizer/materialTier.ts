/**
 * Material progression — the chain upgrades its material as habit strength grows.
 *
 * Aligned with STRENGTH_LEVELS (src/components/ProgressSectionConsolidated/types/strengthLevels.ts):
 *
 *   0 – 19    copper      Starting Out    thin copper wire, humble start
 *  20 – 39    chain       Building        habit accent color (prior default)
 *  40 – 59    iron        Growing         accent color with heavier bevel + thicker chain
 *  60 – 79    gold        Strong          universal gold overlay, shareable moment
 *  80 – 100   legendary   Unbreakable     platinum cell with gold border + shimmer
 */

export type MaterialTierName =
  | 'copper'
  | 'chain'
  | 'iron'
  | 'gold'
  | 'legendary';

export interface MaterialTier {
  name: MaterialTierName;
  /** If true, cell/connector colors come from the habit's accent. */
  useAccent: boolean;
  /** Fixed color when useAccent is false; unused when useAccent is true. */
  tierColor: string;
  /** Icon color rendered over a completed cell. */
  iconColor: string;
  /** Shadow color; empty string means "use accent color". */
  cellShadowColor: string;
  cellShadowOpacity: number;
  cellShadowRadius: number;
  connectorHeight: number;
  connectorOpacity: number;
  /** Shimmer cycle duration in ms; 0 disables. */
  shimmerSpeed: number;
  /** Extra glow shadow on the connector. */
  glow: boolean;
}

import { colors } from '@/theme/colors';

export const LEGENDARY_CELL_BACKGROUND = colors.material.legendary.cellBackground;

const COPPER: MaterialTier = {
  name: 'copper',
  useAccent: false,
  tierColor: colors.material.copper.tier,
  iconColor: colors.material.copper.icon,
  cellShadowColor: colors.material.copper.shadow,
  cellShadowOpacity: 0.25,
  cellShadowRadius: 3,
  connectorHeight: 2,
  connectorOpacity: 0.55,
  shimmerSpeed: 0,
  glow: false,
};

const CHAIN: MaterialTier = {
  name: 'chain',
  useAccent: true,
  tierColor: '',
  iconColor: colors.material.iconOnAccent,
  cellShadowColor: '',
  cellShadowOpacity: 0.3,
  cellShadowRadius: 5,
  connectorHeight: 3,
  connectorOpacity: 0.7,
  shimmerSpeed: 0,
  glow: false,
};

const IRON: MaterialTier = {
  name: 'iron',
  useAccent: true,
  tierColor: '',
  iconColor: colors.material.iconOnAccent,
  cellShadowColor: '',
  cellShadowOpacity: 0.5,
  cellShadowRadius: 8,
  connectorHeight: 4,
  connectorOpacity: 0.85,
  shimmerSpeed: 0,
  glow: true,
};

const GOLD: MaterialTier = {
  name: 'gold',
  useAccent: false,
  tierColor: colors.material.gold.tier,
  iconColor: colors.material.gold.icon,
  cellShadowColor: colors.material.gold.shadow,
  cellShadowOpacity: 0.55,
  cellShadowRadius: 10,
  connectorHeight: 4.5,
  connectorOpacity: 1,
  shimmerSpeed: 2000,
  glow: true,
};

const LEGENDARY: MaterialTier = {
  name: 'legendary',
  useAccent: false,
  tierColor: colors.material.legendary.tier,
  iconColor: colors.material.legendary.icon,
  cellShadowColor: colors.material.legendary.shadow,
  cellShadowOpacity: 0.65,
  cellShadowRadius: 14,
  connectorHeight: 5,
  connectorOpacity: 1,
  shimmerSpeed: 1000,
  glow: true,
};

/**
 * Pick the tier for a habit-strength score in the 0–100 range.
 * Thresholds mirror STRENGTH_LEVELS exactly so the chain material
 * and the strength label stay in lockstep.
 */
export function getMaterialTier(strengthPercent: number): MaterialTier {
  if (strengthPercent >= 80) return LEGENDARY;
  if (strengthPercent >= 60) return GOLD;
  if (strengthPercent >= 40) return IRON;
  if (strengthPercent >= 20) return CHAIN;
  return COPPER;
}
