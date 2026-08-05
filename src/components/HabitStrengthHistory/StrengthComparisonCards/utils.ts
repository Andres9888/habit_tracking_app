/**
 * Utility functions for StrengthComparisonCards
 */

import type { StrengthLabel } from '../types';

/**
 * Convert strength label to display text
 */
export function getLabelText(label: StrengthLabel): string {
  switch (label) {
    case 'weak': {
      return 'Weak';
    }
    case 'developing': {
      return 'Developing';
    }
    case 'strong': {
      return 'Strong';
    }
  }
}
