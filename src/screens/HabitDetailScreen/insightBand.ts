/**
 * insightBand — the hero wash tokens for the habit-detail screen.
 *
 * Split out of `insightPalette.ts` to keep both files inside the 100-line budget.
 *
 * These are the ORIGINAL Claude Design values from the "Habit Flow Prototype"
 * mock — a mint-green tint settling into the parchment canvas. They are literals
 * rather than token derivations on purpose: this is the signed-off look, and
 * pinning the exact hex is what keeps it stable. Two earlier revisions tried a
 * neutral parchment wash (per `docs/human-optimized-frontend-spec.md:48`) and
 * then a wash derived from `colors.accent`; both were rejected. Don't re-derive
 * these without asking.
 *
 * ONE INVARIANT STILL APPLIES, and it is not a style choice: every stop must be
 * OPAQUE hex, never `withAlpha`. The header tint, hero stop 0 and the ScrollView
 * overscroll tint all read stop 0, so a translucent value composites once per
 * reader and shows a seam at the hero boundary
 * (see `FullsizeTemplatePreview/components/PreviewContent.tsx:29-30`). That is why
 * the dark stops below are pre-blended rather than alpha-layered.
 */

import { mixHex, withAlpha } from '../../theme/colors';
import type { SemanticColors } from '../../theme/darkColors';

/** Three-stop gradient: tint, midpoint, then the page background. */
export type BandGradient = readonly [string, string, string];

/** Stop positions, exposed so the component never hardcodes them. */
export const BAND_LOCATIONS = [0, 0.7, 1] as const;

/** Design's mint wash while today is still open. */
const REST_TOP = '#E3EDE6';
const REST_MID = '#EDF0E9';
/** Design's greener wash once today is logged. */
const DONE_TOP = '#D9EBDF';
const DONE_MID = '#E9EFE7';
/** Design's amber wash while a miss is still unanswered. */
const RECOVERY_TOP = '#F3E7D8';
const RECOVERY_MID = '#F2EDE2';

/** Design's band ink and chrome. */
const BAND_INK = '#23211C';
const BAND_MUTED = '#5A6B5D';
const BAND_HAIRLINE = '#C9D6CB';
const DIAL_TRACK = '#D3DFD5';

export interface BandTokens {
  bandGradient: BandGradient;
  bandGradientDone: BandGradient;
  /** Amber wash for the recovery variant of the hero. */
  bandGradientRecovery: BandGradient;
  /** Primary copy on the band. Dark ink — the wash is pale. */
  bandFg: string;
  /** Muted copy: eyebrow, dial level word, why quote. */
  bandMuted: string;
  /** Translucent fill for the "your why" pill. */
  bandSoft: string;
  /** Hairline for the band's circular/pill controls. */
  bandHairline: string;
  /** Strength dial track. */
  dialTrack: string;
}

export function buildBandTokens(
  colors: SemanticColors,
  isDark: boolean,
  accent: string,
  warm: string
): BandTokens {
  if (isDark) {
    // The mock has no dark mode, so the dark wash is the same idea rebuilt
    // against the dark canvas: the accent mixed down to OPAQUE hex, per the
    // invariant in the file header.
    return {
      bandFg: colors.text.primary,
      bandGradient: [
        mixHex(accent, colors.background, 0.14),
        mixHex(accent, colors.background, 0.05),
        colors.background,
      ],
      bandGradientDone: [
        mixHex(accent, colors.background, 0.22),
        mixHex(accent, colors.background, 0.09),
        colors.background,
      ],
      bandGradientRecovery: [
        mixHex(warm, colors.background, 0.18),
        mixHex(warm, colors.background, 0.07),
        colors.background,
      ],
      bandHairline: mixHex(colors.text.primary, colors.background, 0.2),
      bandMuted: colors.text.secondary,
      bandSoft: withAlpha(accent, 0.14),
      dialTrack: withAlpha(colors.text.primary, 0.14),
    };
  }
  return {
    bandFg: BAND_INK,
    bandGradient: [REST_TOP, REST_MID, colors.background],
    bandGradientDone: [DONE_TOP, DONE_MID, colors.background],
    bandGradientRecovery: [RECOVERY_TOP, RECOVERY_MID, colors.background],
    bandHairline: BAND_HAIRLINE,
    bandMuted: BAND_MUTED,
    bandSoft: withAlpha(accent, 0.08),
    dialTrack: DIAL_TRACK,
  };
}
