/**
 * Type definitions for timing constants
 */

import type {
  ANIMATION_DURATIONS,
  CONFETTI_DURATIONS,
  DELAYS,
  RANDOM_DELAYS,
  SPRING_CONFIGS,
  STAGGER_DELAYS,
  TIMEOUTS,
  VOICE_NOTE_DURATIONS,
} from './config';

export type AnimationDurationsType = typeof ANIMATION_DURATIONS;
export type StaggerDelaysType = typeof STAGGER_DELAYS;
export type DelaysType = typeof DELAYS;
export type TimeoutsType = typeof TIMEOUTS;
export type SpringConfigType = typeof SPRING_CONFIGS;
export type VoiceNoteDurationsType = typeof VOICE_NOTE_DURATIONS;
export type ConfettiDurationsType = typeof CONFETTI_DURATIONS;
export type RandomDelaysType = typeof RANDOM_DELAYS;
