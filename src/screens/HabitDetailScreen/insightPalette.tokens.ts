/**
 * Screen-local surface tints for the Habit Detail insight surfaces.
 *
 * The brand-carrying colors that used to live here — the green, and the whole
 * amber/recovery family — were promoted into the global theme (`colors.recovery`,
 * `status.recovery*`, `primary.700`) so recovery states read identically across
 * the app. What remains is deliberately local: data-visualization tints for the
 * heatmap, dial, and streak rails that have no meaning outside this screen and
 * would only add noise to the global palette.
 *
 * Rule of thumb: if a color communicates brand or state, it belongs in
 * `theme/colors`. If it is a chart surface, it belongs here.
 */

/** Deep forest green — band accents that need to out-weigh `DESIGN_GREEN`. */
export const BAND_GREEN = '#0B5D42';

/**
 * The design's single green, used for both the CTA and success roles.
 *
 * Deliberately NOT `primary.600`/`primary.700`. Deriving this from theme tokens
 * has been tried twice and rejected on look both times; see the file comment in
 * `__tests__/insightPalette.test.ts`, which guards it.
 */
export const DESIGN_GREEN = '#0C7C59';

/**
 * Recovery ink for small text (<18.66px).
 *
 * `LIGHT_INSIGHT_COLORS.amber` is the prototype's ink and stays the default, but
 * at 3.45:1 on `greenWash` and 3.95:1 on white it is below WCAG AA wherever it
 * renders as small text. This darker variant is used only in those spots, so the
 * approved look survives everywhere it was actually approved.
 */
export const RECOVERY_INK_SMALL = '#8A5526';

export const LIGHT_INSIGHT_COLORS = {
  /** Recovery ink on cream surfaces. Large text and non-text only — see `RECOVERY_INK_SMALL`. */
  amber: '#B0723A',
  /** Heatmap cell, no entry recorded. */
  cellEmpty: '#F0EDE4',
  /** Heatmap cell, date has not happened yet. */
  cellFuture: '#F7F5EF',
  /** Mid-weight green for sparkline/rail strokes. */
  greenSoft: '#8FC3AB',
  /** Tinted green for filled heatmap cells. */
  greenTint: '#CFE3D8',
  /** Palest green wash — completed-state card fills. */
  greenWash: '#E8F2EC',
  /** Ring around a missed day in the heatmap. */
  missedRing: '#D6CFC3',
  /** Muted cream for secondary text on green fills. */
  onGreenMuted: '#BFE3D2',
  /** Warm brown ink for recovery copy on cream surfaces. */
  recoveryInk: '#4C3D28',
  /** Stat tile background. */
  tileBg: '#EAF1EC',
} as const;
