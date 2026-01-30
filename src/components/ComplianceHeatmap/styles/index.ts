/**
 * Re-export all styles for ComplianceHeatmap
 */

import { gridStyles } from './grid.styles';
import { labelStyles } from './labels.styles';
import { auxiliaryStyles } from './auxiliary.styles';

export const styles = {
  ...gridStyles,
  ...labelStyles,
  ...auxiliaryStyles,
};
