/**
 * Confetti System Types
 *
 * Defines burst types, physics properties, and configuration for the enhanced celebration system.
 */

/**
 * Burst Type - Different celebration scenarios with unique visual/haptic/audio signatures
 */
export type BurstType =
  | 'chainCompletion' // Completing habits in sequence
  | 'streakMilestone' // Reaching streak milestones (7, 14, 30, 100 days)
  | 'levelUp' // Habit strength level increases
  | 'perfectWeek' // All habits completed for a full week
  | 'default' // Regular habit completion

/**
 * Physics properties for confetti particles
 */
export interface ConfettiPhysics {
  /** Gravity acceleration (pixels/s²) */
  gravity: number;

  /** Horizontal wind force (-1 to 1) */
  wind: number;

  /** Air resistance (drag coefficient) */
  drag: number;

  /** Initial velocity range */
  velocity: {
    x: [number, number];
    y: [number, number];
  };

  /** Rotation speed range */
  rotation: {
    velocity: [number, number];
  };
}

/**
 * Burst configuration for each celebration type
 */
export interface BurstConfig {
  /** Number of particles in the burst */
  particleCount: number;

  /** Duration in milliseconds */
  duration: number;

  /** Colors for this burst type (light mode) */
  colors: string[];

  /** Colors for dark mode */
  darkColors: string[];

  /** Physics properties */
  physics: ConfettiPhysics;

  /** Haptic feedback pattern */
  hapticPattern: HapticPatternName;

  /** Sound effect */
  soundType: CompletionSoundType;

  /** Emission delay between particles (ms) */
  emissionDelay?: number;
}

/**
 * Particle state for animation
 */
export interface ParticleState {
  /** Horizontal position */
  x: number;

  /** Vertical position */
  y: number;

  /** Rotation angle in degrees */
  rotation: number;

  /** Scale factor */
  scale: number;

  /** Opacity */
  opacity: number;

  /** Velocity X */
  vx: number;

  /** Velocity Y */
  vy: number;

  /** Angular velocity */
  vRotation: number;
}

/**
 * Animation frame update
 */
export interface ParticleUpdate {
  delta: number;
  time: number;
}

/**
 * Haptic pattern names (mirrored from utils/haptics)
 */
export type HapticPatternName =
  | 'tap'
  | 'toggle'
  | 'heavy'
  | 'success'
  | 'error'
  | 'warning'
  | 'selection'
  | 'streak'
  | 'celebration'
  | 'celebrationMajor';

/**
 * Completion sound types (mirrored from convex/settings)
 */
export type CompletionSoundType = 'chime' | 'pop' | 'success';

/**
 * Confetti system props
 */
export interface ConfettiSystemProps {
  /** Type of celebration burst */
  burstType: BurstType;

  /** Whether reduced motion is preferred */
  shouldReduceMotion: boolean;

  /** Whether dark mode is active */
  isDarkMode: boolean;

  /** Screen dimensions (for positioning) */
  dimensions?: {
    width: number;
    height: number;
  };

  /** Whether sound effects are enabled */
  soundEnabled?: boolean;

  /** Whether haptic feedback is enabled */
  hapticsEnabled?: boolean;

  /** Optional custom origin point for burst */
  origin?: {
    x: number;
    y: number;
  };
}
