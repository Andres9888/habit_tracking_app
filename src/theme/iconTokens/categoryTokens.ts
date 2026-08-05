/**
 * Category → accent token map.
 *
 * Template rows carry a free-form `iconColor`, but it was never curated per
 * habit: `health_fitness` spans all ten tokens across its 66 templates, and
 * `breathing` manages nine tokens across ten templates. Keying the accent off
 * the category instead makes the preview hero agree with the shelf the habit
 * was tapped from, and collapses 47 hexes onto a governed set.
 *
 * Each token is picked to sit in the same hue neighbourhood as the category's
 * family in `CATEGORY_META` (green / gold / purple / blue), so the browse
 * screen keeps its four-family wayfinding while the preview can still tell
 * sibling categories apart.
 */

import type { IconTokenKey } from './types';

export const CATEGORY_ICON_TOKENS: Record<string, IconTokenKey> = {
  // green family — body, growth, compounding
  environmental_design: 'forest',
  financial: 'forest',
  health_fitness: 'forest',
  andrew_huberman: 'teal',

  // gold family — warmth, time, accumulation
  longevity: 'amber',
  morning_routine: 'sunrise',
  recovery: 'amber',
  social: 'ember',

  // purple family — mind, introspection, creativity
  creativity: 'magenta',
  learning: 'indigo',
  mental_health: 'violet',
  mindfulness: 'violet',

  // blue family — calm, focus, rest
  breathing: 'teal',
  productivity: 'sky',
  sleep: 'indigo',
  subtraction: 'slate',
};
