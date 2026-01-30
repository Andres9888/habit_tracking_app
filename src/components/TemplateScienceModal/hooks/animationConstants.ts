/**
 * Animation configuration constants for TemplateScienceModal
 */

export const HERO_ANIMATION = {
  opacity: { duration: 400 },
  scale: { damping: 18, stiffness: 100 },
};

export const CARD_ANIMATION = {
  delays: { card1: 150, card2: 250, card3: 350, footer: 450 },
  spring: { damping: 20, stiffness: 90 },
};

export const GLOW_ANIMATION = {
  duration: 1500,
  opacity: { max: 0.35, min: 0.2 },
  scale: { max: 1.15, min: 1 },
};
