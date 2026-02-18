/**
 * Confetti Module Exports
 *
 * Public API for the confetti celebration system.
 */

export { ConfettiSystem } from './ConfettiSystem';
export { ConfettiParticle } from './ConfettiParticle';
export { PhysicsSimulation } from './physicsEngine';

// Types
export type {
  BurstType,
  BurstConfig,
  ConfettiPhysics,
  ParticleState,
  ParticleUpdate,
  HapticPatternName,
  CompletionSoundType,
  ConfettiSystemProps,
} from './types';

// Utilities
export {
  getBurstConfig,
  getBurstColors,
  CHAIN_COMPLETION_CONFIG,
  STREAK_MILESTONE_CONFIG,
  LEVEL_UP_CONFIG,
  PERFECT_WEEK_CONFIG,
  DEFAULT_CONFIG,
} from './burstConfigs';

// Physics engine
export {
  initializeParticle,
  updateParticlePhysics,
  calculateOpacity,
  isParticleAlive,
  simulateWind,
  addTurbulence,
} from './physicsEngine';
