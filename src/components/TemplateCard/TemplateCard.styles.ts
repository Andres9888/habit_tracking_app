/**
 * TemplateCard Styles
 *
 * StyleSheet definitions for the main TemplateCard component
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
    elevation: 2,
    marginHorizontal: 20,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
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
