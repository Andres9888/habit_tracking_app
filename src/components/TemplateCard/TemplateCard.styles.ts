/**
 * TemplateCard Styles
 *
 * StyleSheet definitions for the main TemplateCard component
 */

import { StyleSheet } from 'react-native';

import { borderRadius, shadows, spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  accentBar: {
    borderBottomLeftRadius: borderRadius.large,
    borderTopLeftRadius: borderRadius.large,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: spacing.xs,
  },
  card: {
    ...shadows.card,
    backgroundColor: '#fff',
    borderRadius: borderRadius.large,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    overflow: 'hidden',
    shadowOpacity: 0.05,
  },
  glowOverlay: {
    borderRadius: borderRadius.large,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
