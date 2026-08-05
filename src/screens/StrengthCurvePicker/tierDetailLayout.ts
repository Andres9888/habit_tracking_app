/** Min-heights for tier explainer — prevents layout shift when switching tabs. */

export const TIER_DETAIL_DESCRIPTION_LINE_HEIGHT = 16;
export const TIER_DETAIL_DESCRIPTION_MIN_LINES = 3;
export const TIER_DETAIL_CHIP_ROW_MIN_HEIGHT = 44;

export function tierDetailDescriptionMinHeight(scale = 1): number {
  return TIER_DETAIL_DESCRIPTION_MIN_LINES * TIER_DETAIL_DESCRIPTION_LINE_HEIGHT * scale;
}

export function tierDetailChipRowMinHeight(scale = 1): number {
  return TIER_DETAIL_CHIP_ROW_MIN_HEIGHT * scale;
}
