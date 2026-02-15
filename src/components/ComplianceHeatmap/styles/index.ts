/**
 * Re-export all styles for ComplianceHeatmap
 */

import { auxiliaryStyles } from './auxiliary.styles';
import { gridStyles } from './grid.styles';
import { labelStyles } from './labels.styles';

export const styles = {
  ...gridStyles,
  ...labelStyles,
  ...auxiliaryStyles,
};
