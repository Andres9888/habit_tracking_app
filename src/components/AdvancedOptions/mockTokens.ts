/**
 * Colors live in useAdvancedTokens (theme-aware); this file keeps copy only.
 *
 * Strength Curve display copy (Chain Day unified hybrid).
 * Strength Curve display copy (Chain Day unified hybrid).
 * Labels matching the OD mock (not product algo marketing names).
 */
export const CURVE_MOCK_COPY = {
  forgiving: {
    name: 'Gentle',
    desc: 'Slow build · soft miss cost',
    short: 'soft miss cost',
  },
  balanced: {
    name: 'Balanced',
    desc: 'Steady climb · fair miss cost',
    short: 'builds gradually',
  },
  strict: {
    name: 'Strict',
    desc: 'Fast gains · sharper miss cost',
    short: 'sharper miss cost',
  },
} as const;
