import { SCREEN_HEIGHT, MAX_SHEET_HEIGHT_RATIO } from './constants';

/**
 * Get the container style for the sheet
 */
export function getSheetContainerStyle(bottomInset: number) {
  return {
    elevation: 20,
    maxHeight: SCREEN_HEIGHT * MAX_SHEET_HEIGHT_RATIO,
    paddingBottom: bottomInset + 16,
    shadowColor: '#1c1917',
    shadowOffset: { height: -4, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  };
}
