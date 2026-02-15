/**
 * EmptyState Styles
 */

import { StyleSheet } from 'react-native';

import { typography } from '../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
    width: '100%',
  },
  description: {
    marginBottom: 16,
    maxWidth: 320,
    textAlign: 'center',
  },
  headline: {
    marginBottom: 8,
    textAlign: 'center',
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  // Quick start templates
  quickStartSection: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
    width: '100%',
  },
  templateChip: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  templateChipPressed: {
    transform: [{ scale: 0.98 }],
  },
  templateEmoji: {
    fontSize: typography.body.fontSize,
  },
  templateName: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '500',
  },
  templateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
});
