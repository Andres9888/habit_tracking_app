/**
 * Constants Module
 *
 * Central export point for all app constants:
 * - App: Application-wide magic numbers and configuration
 * - Auth: Authentication configuration
 * - HubermanPhases: Daily energy optimization phases
 * - Motion: Animation timing and springs
 * - STRINGS: UI text strings
 */

export * from './app';
export * from './auth';
export * from './hubermanPhases';
export { default as Motion } from './motion';
export { default as STRINGS } from './strings';
