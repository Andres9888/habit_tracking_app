/**
 * Picks a safe base color for a habit's icon tile tint.
 *
 * The tile tint used to be built by string concatenation — `${iconColor}30` —
 * which silently produces an invalid color the moment a template ships an
 * rgba() or named iconColor. `withAlpha` fixes the math, but on its own it
 * makes that case worse rather than better: it returns non-hex input
 * UNCHANGED, so a bad value would render as a fully opaque saturated tile
 * behind the emoji instead of a quiet wash.
 *
 * So validate first and fall back to a token we control. `fallback` must be a
 * 3- or 6-digit hex (browserPalette guarantees this for `textSecondary`).
 */

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function resolveIconColor(
  iconColor: string | undefined,
  fallback: string
): string {
  const candidate = iconColor?.trim();
  return candidate && HEX.test(candidate) ? candidate : fallback;
}
