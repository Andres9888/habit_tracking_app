import { Dimensions } from 'react-native';
import { spacing } from '../../theme/spacing';
import type { StrengthLevelKey } from './StrengthDistributionChart.types';

const { width: screenWidth } = Dimensions.get('window');
export const CHART_SIZE = Math.min(screenWidth - spacing.xl * 2, 280);

// Ascending tiers (starting → automatic): light red → orange → yellow → light green → green
export const LEVEL_COLORS: Record<StrengthLevelKey, string> = {
  automatic: '#10B981', // Emerald-500 (80-100%)
  building: '#FED7AA', // Orange-200 (20-40%)
  developing: '#FDE68A', // Amber-200 (40-60%)
  starting: '#FEE2E2', // Red-100 (0-20%)
  strong: '#BBF7D0', // Green-200 (60-80%)
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
