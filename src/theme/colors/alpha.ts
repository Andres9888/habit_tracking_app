/**
 * withAlpha — derive a translucent color from a solid hex token.
 *
 * Centralizes the `rgba(…)` math so components stop inventing one-off literals
 * (the drift the `overlays.ts` tokens were created to prevent). Pair it with
 * theme tokens, e.g. `withAlpha(colors.primary[600], 0.22)`.
 *
 * Accepts #RGB / #RRGGBB hex. Non-hex input is returned unchanged so callers can
 * safely pass values that are already rgba()/named colors.
 */
export function withAlpha(hex: string, alpha: number): string {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return hex;

  let h = match[1];
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }

  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
