// Chain Day design tokens — extracted verbatim from habit_tracking_app/src/theme
// Use these EXACTLY; no hardcoded hex in components.

window.T = {
  // Color — warm minimal (from core.ts)
  bg: '#F5F1ED',          // canvas
  card: '#EDEAE5',         // surface L1
  cardWhite: '#FFFFFF',    // card rest (per HabitCard.styles spec)
  border: '#DDD8D2',
  borderMuted: '#E5E2DE',

  textPrimary: '#2D2A26',
  textSecondary: '#6B6560',
  textTertiary: '#6E6660',
  textInverse: '#FFFFFF',

  // Forest green primary
  primary600: '#059669',
  primary700: '#047857',
  primary500: '#10B981',
  primary100: '#D1FAE5',

  // Burnished gold streak (accent, ≤10% area)
  streak100: '#FEF3CD',
  streak300: '#E8B94D',
  streak500: '#8B6208',
  streak600: '#936A08',
  streak700: '#7D5907',

  // Strength levels
  strStartingLight: '#ecfccb', strStarting: '#4D7A0A',
  strDevelopingLight: '#ccfbf1', strDeveloping: '#0d9488',
  strBuildingLight: '#dcfce7', strBuilding: '#16a34a',
  strStrongLight: '#cffafe', strStrong: '#0891b2',
  strAutoLight: '#D4F0E2', strAuto: '#059669',

  success: '#15793C',
  error: '#B53030',
  warning: '#9A5504',

  // Gray scale
  g50:'#FAF8F5', g100:'#F5F1ED', g200:'#DDD8D2', g300:'#C4BFB7',
  g400:'#6E6660', g500:'#6B6560', g600:'#524D47', g700:'#3D3833',
  g800:'#2D2A26', g900:'#1A1816',

  // Spacing (8px grid)
  xs:4, sm:8, md:12, base:16, lg:24, xl:32, xxl:48, xxxl:64,

  // Radius
  rXs:4, rSm:8, rMd:12, rLg:16, rXl:24, rFull:9999,

  // Shadows (warm tint #2D2A26)
  shadowCard: '0 2px 8px rgba(45,42,38,0.06)',
  shadowFab: '0 4px 16px rgba(45,42,38,0.08)',
  shadowModal: '0 8px 24px rgba(45,42,38,0.10)',
  shadowSubtle: '0 1px 3px rgba(45,42,38,0.04)',
};

// Typography helpers — Literata (serif display/H1) + DM Sans (everything else)
window.Ty = {
  displayLarge: { fontFamily: 'Literata, Georgia, serif', fontSize: 34, fontWeight: 700, letterSpacing: -0.85, lineHeight: '41px' },
  heading1:     { fontFamily: 'Literata, Georgia, serif', fontSize: 22, fontWeight: 700, letterSpacing: -0.35, lineHeight: '28px' },
  heading2:     { fontFamily: '"DM Sans", system-ui, sans-serif', fontSize: 22, fontWeight: 600, letterSpacing: -0.35, lineHeight: '28px' },
  heading3:     { fontFamily: '"DM Sans", system-ui, sans-serif', fontSize: 20, fontWeight: 600, letterSpacing: -0.2,  lineHeight: '26px' },
  body:         { fontFamily: '"DM Sans", system-ui, sans-serif', fontSize: 17, fontWeight: 400, lineHeight: '24px' },
  bodySmall:    { fontFamily: '"DM Sans", system-ui, sans-serif', fontSize: 14, fontWeight: 400, lineHeight: '20px' },
  caption:      { fontFamily: '"DM Sans", system-ui, sans-serif', fontSize: 13, fontWeight: 500, lineHeight: '18px' },
  mono:         { fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 13, fontWeight: 500 },
};
