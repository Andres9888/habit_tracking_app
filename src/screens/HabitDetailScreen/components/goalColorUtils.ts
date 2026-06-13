const MIN_TEXT_CONTRAST = 4.5;

function normalizeHexColor(color: string): string | null {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!match) return null;

  const hex =
    match[1].length === 3
      ? match[1]
          .split('')
          .map((channel) => channel + channel)
          .join('')
      : match[1];

  return `#${hex.toLowerCase()}`;
}

function toLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.03928
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4);
}

function luminance(hexColor: string): number | null {
  const hex = normalizeHexColor(hexColor);
  if (!hex) return null;

  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);

  return 0.2126 * toLinear(red) + 0.7152 * toLinear(green) + 0.0722 * toLinear(blue);
}

function contrastRatio(colorA: string, colorB: string): number | null {
  const lumA = luminance(colorA);
  const lumB = luminance(colorB);
  if (lumA === null || lumB === null) return null;

  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

export function readableHabitAccent(
  habitColor: string | undefined,
  againstColor: string,
  fallbackColor: string
): string {
  if (!habitColor) return fallbackColor;

  const ratio = contrastRatio(habitColor, againstColor);
  return ratio !== null && ratio >= MIN_TEXT_CONTRAST
    ? habitColor
    : fallbackColor;
}
