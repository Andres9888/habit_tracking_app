/**
 * Utility functions for DualVizSetup component
 */

import type { VisualizationData } from './DualVizSetup.types';

/**
 * Checks if visualization data has at least one field filled
 */
export function hasVizData(viz: VisualizationData | undefined): boolean {
  if (!viz) return false;
  return !!(
    viz.successBody ||
    viz.successMind ||
    viz.successEmotion ||
    viz.failureBody ||
    viz.failureMind ||
    viz.failureEmotion
  );
}

/**
 * Checks if visualization data is complete (all 6 fields filled)
 */
export function isVizComplete(viz: VisualizationData | undefined): boolean {
  if (!viz) return false;
  return !!(
    viz.successBody &&
    viz.successMind &&
    viz.successEmotion &&
    viz.failureBody &&
    viz.failureMind &&
    viz.failureEmotion
  );
}

/**
 * Checks if success visualization has at least one field
 */
export function hasSuccessViz(viz: VisualizationData | undefined): boolean {
  if (!viz) return false;
  return !!(viz.successBody || viz.successMind || viz.successEmotion);
}

/**
 * Checks if failure visualization has at least one field
 */
export function hasFailureViz(viz: VisualizationData | undefined): boolean {
  if (!viz) return false;
  return !!(viz.failureBody || viz.failureMind || viz.failureEmotion);
}
