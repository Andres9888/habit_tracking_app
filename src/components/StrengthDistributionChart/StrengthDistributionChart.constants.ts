import { Dimensions } from 'react-native';
import { spacing } from '../../theme/spacing';
import type { StrengthLevelKey } from './StrengthDistributionChart.types';

const { width: screenWidth } = Dimensions.get('window');
export const CHART_SIZE = Math.min(screenWidth - spacing.xl * 2, 280);

/**
 * Colorblind-friendly palette using distinct hues (not just green shades).
 * Distinguishable under deuteranopia, protanopia, and tritanopia.
 */
export const LEVEL_COLORS: Record<StrengthLevelKey, string> = {
  starting: '#F97316',   // Orange — early stage, warm tone
  building: '#FACC15',   // Yellow — gaining traction
  developing: '#38BDF8', // Sky blue — steady progress
  strong: '#818CF8',     // Indigo — well-established
  automatic: '#059669',  // Forest green — ingrained (matches primary)
};

export const LEVEL_LABELS: Record<StrengthLevelKey, string> = {
  automatic: 'Automatic',
  building: 'Building',
  developing: 'Developing',
  starting: 'Starting',
  strong: 'Strong',
};

export const STRENGTH_LEVELS: StrengthLevelKey[] = [
  'starting',
  'building',
  'developing',
  'strong',
  'automatic',
];
