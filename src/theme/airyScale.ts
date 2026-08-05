/**
 * Airy design scale — SHIP TARGET: "full airy, dense home".
 *
 * Full airy proportions everywhere (softer radii, roomier rows, bigger titles/
 * buttons) — it fits the calm-premium brand. The ONE exception is the home habit
 * list: it stays at canonical height because that's the surface scanned every day,
 * where seeing more habits at a glance beats extra padding. (Home cards still take
 * the airy 24px radius via cardRadius — only their height/padding stay tight.)
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
  // Settings rows.
  tileSize: AIRY_SCALE ? 42 : 40,
  tileRadius: AIRY_SCALE ? 13 : 12,
  rowPaddingV: AIRY_SCALE ? 20 : 16,
  // Home list stays DENSE (height/padding) — the daily glanceable surface.
  habitCardMinHeight: 88,
  habitCardPadding: 16,
  // Shared controls + screens go airy.
  controlHeight: AIRY_SCALE ? 48 : 44,
  titleSize: AIRY_SCALE ? 26 : 22,
  screenPadH: AIRY_SCALE ? 20 : 16,
  sectionGap: AIRY_SCALE ? 16 : 12,
} as const;
