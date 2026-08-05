/**
 * Premium banner palette — the one INK card on the settings page.
 *
 * Previously a dark-green gradient, which read as "another green thing" on a
 * page already full of green tiles and toggles. Ink + gold is the editorial
 * counterweight: it's the only surface that inverts, so it carries weight
 * without introducing a colour the brand doesn't already use.
 */
export const premiumHero = {
  border: 'rgba(180, 136, 74, 0.28)',
  crown: '#E8C88A',
  gradient: ['#211F1D', '#2A2724', '#1C1A18'] as const,
  iconBox: 'rgba(180, 136, 74, 0.22)',
  /** Gold pill, ink label — the page's single highest-contrast CTA. */
  pill: '#B4884A',
  pillText: '#1A1816',
  subtitle: 'rgba(249, 245, 240, 0.66)',
  title: '#FBF7F2',
  overline: 'rgba(232, 200, 138, 0.78)',
} as const;
