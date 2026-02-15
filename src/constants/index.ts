/**
 * Constants Module
 *
 * Central export point for all app constants:
 * - Auth: Authentication configuration
 * - HubermanPhases: Daily energy optimization phases
 * - Motion: Animation timing and springs
 * - STRINGS: UI text strings
 */

export * from './auth';
export * from './errorMessages';
export * from './hubermanPhases';
export { default as Motion } from './motion';
export { default as STRINGS } from './strings';
