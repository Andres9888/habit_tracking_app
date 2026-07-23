/**
 * Overlay Tokens
 *
 * Translucent material tokens for hero-card glass effects, modal scrims, and
 * secondary text on gradient backgrounds. Centralizing these prevents the slow
 * drift where every component invents its own `rgba(255,255,255,0.2-ish)`.
 */

export const overlays = {
  /** Hero-card overlay badges (icon containers, share buttons, pill chips). */
  glassLight: 'rgba(255, 255, 255, 0.20)',

  /** Pressed / hover state for glass badges. */
  glassMedium: 'rgba(255, 255, 255, 0.30)',

  /** Neutral metadata pills sitting directly on an accent-tinted hero wash. */
  glassStrong: 'rgba(255, 255, 255, 0.65)',

  /** Secondary text rendered over a gradient or hero surface. */
  subTextOnHero: 'rgba(255, 255, 255, 0.90)',

  /** Warm-toned modal scrim, sits behind sheets/modals over warm-stone bg. */
  scrim: 'rgba(45, 42, 38, 0.60)',
} as const;

export type OverlayKey = keyof typeof overlays;
