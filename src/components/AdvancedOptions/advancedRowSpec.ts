/**
 * Shared geometry for Advanced Options row heads.
 *
 * The Strength Curve trigger (`StrengthCurveToggleRow`) and the canonical
 * `AdvancedOptionRow` both use a 36×36 / r11 icon tile with a 12px gap. The
 * inline section heads (Streak Goal, Growth Icons) used to hardcode 32/r9/gap10,
 * which pushed their text left-edge ~6px off the Growth-rate row. Centralizing
 * the values here keeps the icon column and text left-edge aligned across every
 * row, so they can't drift apart again.
 */
export const advancedRowSpec = {
  /** Icon tile edge length (matches AdvancedOptionRow + Strength Curve trigger). */
  iconSize: 36,
  /** Icon tile corner radius. */
  iconRadius: 11,
  /** Gap between the icon tile and the title. */
  gap: 12,
} as const;

/** Text left-edge inset = icon column width + gap, so descriptions line up with titles. */
export const advancedRowTextInset = advancedRowSpec.iconSize + advancedRowSpec.gap;
