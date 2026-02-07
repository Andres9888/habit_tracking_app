/**
 * TemplateCard Styles - OPTIMIZED: Deeper shadows, better elevation
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  accentBar: {
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 4,
    marginHorizontal: 20,
    marginVertical: 8,
    overflow: 'hidden',
    // OPTIMIZED: Deeper shadow for better depth perception
    shadowColor: '#1c1917',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  glowOverlay: {
    borderRadius: 16,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
