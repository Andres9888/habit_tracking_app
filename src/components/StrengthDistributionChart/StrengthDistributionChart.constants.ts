import { Dimensions } from 'react-native';
import { spacing } from '../../theme/spacing';
import type { StrengthLevelKey } from './StrengthDistributionChart.types';

const { width: screenWidth } = Dimensions.get('window');
export const CHART_SIZE = Math.min(screenWidth - spacing.xl * 2, 280);

export const LEVEL_COLORS: Record<StrengthLevelKey, string> = {
  automatic: '#10B981', // Green-200 (Strong)
  building: '#FED7AA', // Red-100 (Starting)
  developing: '#FDE68A', // Orange-200 (Building)
  starting: '#FEE2E2',
  strong: '#BBF7D0', // Yellow-200 (Developing)
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
