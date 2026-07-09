/**
 * chainColors
 *
 * The completed-day tint and the ribbon "bridge" between consecutive completed
 * days must be the EXACT same solid color so a run merges seamlessly (no
 * double-alpha darkening where the bridge overlaps a cell, no corner notches).
 * So we pre-blend the habit color over the card color into one opaque hex
 * rather than relying on a translucent overlay.
 */

const TINT_ALPHA = 0.13;

function clampHex(v: number): string {
  return Math.max(0, Math.min(255, Math.round(v)))
    .toString(16)
    .padStart(2, '0');
}

function parseHex(hex: string): [number, number, number] | null {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  if (full.length !== 6) return null;
  const n = Number.parseInt(full, 16);
  if (Number.isNaN(n)) return null;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Blend `fg` over `bg` at TINT_ALPHA and return an opaque #rrggbb string.
 * Falls back to the foreground color if either input can't be parsed.
 */
export function completedTint(fg: string, bg: string): string {
  const f = parseHex(fg);
  const b = parseHex(bg);
  if (!f || !b) return fg;
  const mix = (i: number) => clampHex(f[i] * TINT_ALPHA + b[i] * (1 - TINT_ALPHA));
  return `#${mix(0)}${mix(1)}${mix(2)}`;
}
