/**
 * Placement for the library post-add toast. Everything inside the card is
 * owned by HabitAddedPanel — these styles only float it above the catalog.
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    left: 16,
    position: 'absolute',
    right: 16,
    zIndex: 9999,
  },
  gestureArea: {
    maxWidth: 420,
    width: '100%',
  },
  toast: {
    width: '100%',
  },
});
