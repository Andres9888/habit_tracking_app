/**
 * TemplateCard Styles
 *
 * StyleSheet definitions for the main TemplateCard component
 */

import { StyleSheet } from 'react-native';

import { shadows } from '../../theme/spacing';

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
    ...shadows.card,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    overflow: 'hidden',
    shadowOpacity: 0.05,
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
