/**
 * Confetti Physics Engine
 *
 * Handles particle physics simulation with gravity, wind, and drag.
 */

import type { ConfettiPhysics, ParticleState } from './types';

/**
 * Initialize a particle state with random values within physics constraints
 */
export function initializeParticle(
  originX: number,
  originY: number,
  physics: ConfettiPhysics,
  seed: number = Math.random()
): ParticleState {
  // Use seed for deterministic randomness if provided
  const random = seed === undefined ? Math.random : () => {
    const x = Math.sin(seed++) * 10_000;
    return x - Math.floor(x);
  };

  const vx =
    physics.velocity.x[0] +
    random() * (physics.velocity.x[1] - physics.velocity.x[0]);
  const vy =
    physics.velocity.y[0] +
    random() * (physics.velocity.y[1] - physics.velocity.y[0]);
  const vRotation =
    physics.rotation.velocity[0] +
    random() * (physics.rotation.velocity[1] - physics.rotation.velocity[0]);

  return {
    x: originX,
    y: originY,
    rotation: 0,
    scale: 1,
    opacity: 1,
    vx,
    vy,
    vRotation,
  };
}

/**
 * Update particle physics for one frame
 * Uses Euler integration for simple physics simulation
 */
export function updateParticlePhysics(
  particle: ParticleState,
  physics: ConfettiPhysics,
  delta: number
): Partial<ParticleState> {
  const dt = delta / 1000; // Convert ms to seconds

  // Apply forces
  // Gravity accelerates particles downward
  particle.vy += physics.gravity * dt;

  // Wind applies horizontal acceleration
  particle.vx += physics.wind * dt * 50;

  // Air resistance (drag) reduces velocity
  particle.vx *= Math.pow(physics.drag, dt * 60);
  particle.vy *= Math.pow(physics.drag, dt * 60);

  // Update position
  particle.x += particle.vx * dt;
  particle.y += particle.vy * dt;

  // Update rotation
  particle.rotation += particle.vRotation * dt;

  // Apply angular drag
  particle.vRotation *= Math.pow(physics.drag, dt * 60);

  return particle;
}

/**
 * Calculate opacity based on particle lifetime
 * Particles fade out in the last 20% of their duration
 */
export function calculateOpacity(
  particle: ParticleState,
  currentTime: number,
  duration: number,
  creationTime: number
): number {
  const age = currentTime - creationTime;
  const fadeStart = duration * 0.8;

  if (age < fadeStart) {
    return particle.opacity;
  }

  // Fade out linearly over last 20%
  const fadeProgress = (age - fadeStart) / (duration - fadeStart);
  return Math.max(0, particle.opacity * (1 - fadeProgress));
}

/**
 * Check if particle is still visible
 */
export function isParticleAlive(
  currentTime: number,
  creationTime: number,
  duration: number
): boolean {
  return currentTime - creationTime < duration;
}

/**
 * Simple wind simulation that varies over time
 * Returns wind value that oscillates gently
 */
export function simulateWind(
  baseWind: number,
  time: number,
  intensity: number = 1
): number {
  const windVariation = Math.sin(time / 1000) * intensity * 10;
  return baseWind + windVariation;
}

/**
 * Turbulence function for more interesting particle motion
 * Adds random small forces to particles
 */
export function addTurbulence(
  particle: ParticleState,
  time: number,
  intensity: number = 20
): void {
  const turbulenceX = Math.sin(time / 200 + particle.x / 100) * intensity;
  const turbulenceY = Math.cos(time / 200 + particle.y / 100) * intensity;

  particle.vx += turbulenceX * 0.01;
  particle.vy += turbulenceY * 0.01;
}

/**
 * Physics simulation class for managing multiple particles
 */
export class PhysicsSimulation {
  private particles: Array<ParticleState & { creationTime: number }> = [];
  private duration: number;
  private physics: ConfettiPhysics;
  private lastTime: number = 0;

  constructor(duration: number, physics: ConfettiPhysics) {
    this.duration = duration;
    this.physics = physics;
  }

  /**
   * Add a new particle to the simulation
   */
  addParticle(originX: number, originY: number, seed?: number): void {
    const particle = initializeParticle(originX, originY, this.physics, seed);
    this.particles.push({
      ...particle,
      creationTime: Date.now(),
    });
  }

  /**
   * Update all particles for one frame
   */
  update(delta: number): Array<ParticleState & { opacity: number }> {
    const currentTime = Date.now();

    // Remove dead particles
    this.particles = this.particles.filter((p) =>
      isParticleAlive(currentTime, p.creationTime, this.duration)
    );

    // Update physics for all particles
    const currentWind = simulateWind(this.physics.wind, currentTime);

    for (const particle of this.particles) {
      // Apply physics with dynamic wind
      const physicsWithWind = {
        ...this.physics,
        wind: currentWind,
      };

      updateParticlePhysics(particle, physicsWithWind, delta);

      // Add turbulence for more interesting motion
      addTurbulence(particle, currentTime);

      // Calculate opacity
      particle.opacity = calculateOpacity(
        particle,
        currentTime,
        this.duration,
        particle.creationTime
      );
    }

    return this.particles;
  }

  /**
   * Get current particle states
   */
  getParticles(): Array<ParticleState & { opacity: number }> {
    return this.particles;
  }

  /**
   * Check if simulation has any active particles
   */
  isActive(): boolean {
    return this.particles.length > 0;
  }

  /**
   * Reset the simulation
   */
  reset(): void {
    this.particles = [];
  }
}
