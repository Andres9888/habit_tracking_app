/**
 * Constants for ComplianceHeatmap component
 */

import { Dimensions } from 'react-native';
import { spacing } from '../../theme/spacing';

const { width: screenWidth } = Dimensions.get('window');

export const CELL_SIZE = (screenWidth - spacing.lg * 2 - spacing.xs * 6) / 7;

export const LEVEL_COLORS = {
  high: '#10B981', // Green-300
  low: '#D1FAE5', // Gray-100
  medium: '#6EE7B7', // Green-100
  none: '#F3F4F6', // Primary green
} as const;

export const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
