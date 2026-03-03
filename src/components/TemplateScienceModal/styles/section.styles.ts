/**
 * Section card styles for TemplateScienceModal
 */

import { StyleSheet } from 'react-native';

import { borderRadius, shadows } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

export const sectionStyles = StyleSheet.create({
  descriptionText: {
    color: '#4B5563',
    fontSize: typography.body.fontSize,
    lineHeight: 26,
  },
  sectionCard: {
    ...shadows.card,
    backgroundColor: '#FFFFFF',
    borderColor: '#e7e5e4',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: 16,
    marginHorizontal: 20,
    padding: 20,
    shadowOpacity: 0.04,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  sectionIconBadge: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  sectionIconEmoji: {
    fontSize: 18,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});
