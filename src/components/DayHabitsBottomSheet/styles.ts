import { shadows } from '../../theme/spacing';
import { SCREEN_HEIGHT, MAX_SHEET_HEIGHT_RATIO } from './constants';

/**
 * Get the container style for the sheet
 */
export function getSheetContainerStyle(bottomInset: number) {
  return {
    elevation: 20,
    maxHeight: SCREEN_HEIGHT * MAX_SHEET_HEIGHT_RATIO,
    paddingBottom: bottomInset + 16,
    ...shadows.modal,
    shadowOffset: { height: -8, width: 0 },
  };
}
