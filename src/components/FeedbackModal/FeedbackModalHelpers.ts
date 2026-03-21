/**
 * Helper functions for FeedbackModal
 */

import type { FeedbackType } from './FeedbackModal.types';

/**
 * Get hint text for feedback description based on type
 * Extracts nested ternary logic for better maintainability
 */
export function getDescriptionPlaceholder(
  feedbackType: FeedbackType | null
): string {
  if (feedbackType === 'bug') {
    return 'What happened? What did you expect to happen? Steps to reproduce...';
  }
  if (feedbackType === 'feature') {
    return "Describe the feature you'd like to see and how it would help you...";
  }
  return 'Share your thoughts, suggestions, or any other feedback...';
}
