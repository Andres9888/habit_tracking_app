/**
 * Airy design scale — SHIP TARGET: "full airy, dense home".
 *
 * Full airy proportions everywhere (softer radii, bigger titles/buttons) — it
 * fits the calm-premium brand. Two surfaces stay dense: the home habit list,
 * because it's scanned every day and seeing more habits beats extra padding,
 * and settings rows, which went to option-1b density (36px tiles, 14px padding)
 * so a section reads as one compact block. (Both still take the airy 24px
 * radius via cardRadius — only their height/padding stay tight.)
 *
 * `AIRY_SCALE = false` (or git checkout + tailwind.config.js) restores canonical.
 * cardRadius is mirrored in tailwind.config.js (rounded-2xl/card) — that lever
 * needs a Metro restart with `--clear`.
 */
export const AIRY_SCALE = true;

export const airy = {
  // Radii (mirrored in tailwind.config.js).
  cardRadius: AIRY_SCALE ? 24 : 16,
  buttonRadius: AIRY_SCALE ? 14 : 12,
  modalRadius: AIRY_SCALE ? 28 : 24,
  chipRadius: AIRY_SCALE ? 10 : 8,
  // Settings rows — option 1b "tiles, lighter": smaller tiles and tighter rows
  // so a whole section fits on one screen. Airiness now comes from the gaps
  // BETWEEN cards, not from padding inside every row.
  tileSize: AIRY_SCALE ? 36 : 40,
  tileRadius: AIRY_SCALE ? 10 : 12,
  rowPaddingV: AIRY_SCALE ? 14 : 16,
  // Home list stays DENSE (height/padding) — the daily glanceable surface.
  habitCardMinHeight: 88,
  habitCardPadding: 16,
  // Shared controls + screens go airy.
  controlHeight: AIRY_SCALE ? 48 : 44,
  titleSize: AIRY_SCALE ? 26 : 22,
  screenPadH: AIRY_SCALE ? 20 : 16,
  sectionGap: AIRY_SCALE ? 16 : 12,
} as const;
