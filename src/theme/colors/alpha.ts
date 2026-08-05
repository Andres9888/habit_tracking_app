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
  const rgb = parseHex(hex);
  if (rgb === null) return hex;
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;
}

/** #RGB / #RRGGBB → [r,g,b], or null when the input isn't hex. */
function parseHex(hex: string): [number, number, number] | null {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;

  let h = match[1];
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/**
 * mixHex — composite `hex` over `onto` at `amount` (0-1) and return OPAQUE hex.
 *
 * Same purpose as `withAlpha`, for the cases where a translucent value would be
 * wrong: a tint that several elements must read independently (a gradient stop
 * also used as a header background and a ScrollView overscroll colour) has to be
 * flattened, or it composites once per reader and shows a seam.
 *
 * Lets a tint stay *derived from tokens* rather than hand-picked, e.g.
 * `mixHex(colors.accent, colors.background, 0.07)`.
 *
 * Non-hex input is returned unchanged, matching `withAlpha`.
 */
export function mixHex(hex: string, onto: string, amount: number): string {
  const top = parseHex(hex);
  const base = parseHex(onto);
  if (top === null || base === null) return hex;

  const t = Math.max(0, Math.min(1, amount));
  const channel = (i: number) =>
    Math.round(top[i]! * t + base[i]! * (1 - t))
      .toString(16)
      .padStart(2, '0');
  return `#${channel(0)}${channel(1)}${channel(2)}`.toUpperCase();
}
