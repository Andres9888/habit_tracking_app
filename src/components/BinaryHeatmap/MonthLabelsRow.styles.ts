/**
 * Styles for MonthLabelsRow Component
 *
 * Note: Colors that need theme awareness should be applied at runtime.
 * This file contains only layout-related styles.
 */

import { StyleSheet } from 'react-native';

import { MONTH_LABEL } from './constants';

export const styles = StyleSheet.create({
  container: {
    height: MONTH_LABEL.HEIGHT,
    marginBottom: 3,
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    top: 0,
    height: MONTH_LABEL.HEIGHT,
    alignItems: 'flex-start',
  },
  labelText: {
    fontSize: 10,
    fontWeight: '500',
  },
});
