/**
 * Settings-facing aliases for the shared paper surface.
 *
 * The definitions live in `theme/surfaces` + `theme/spacing` so Settings,
 * Analytics and the Habit Browser can't drift apart; these re-exports keep the
 * settings call sites reading in their own vocabulary.
 */
import { shadows } from '@/theme/spacing';
import { getPaperSurface } from '@/theme/surfaces';

export const getRaisedSurface = getPaperSurface;

export const settingsCardShadow = shadows.cardLifted;
