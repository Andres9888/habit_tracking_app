/**
 * EmptyState Styles
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
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
    marginTop: 8,
    marginBottom: 24,
    alignItems: 'center',
    width: '100%',
  },
  templateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  templateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    gap: 6,
  },
  templateChipPressed: {
    backgroundColor: '#e5e7eb',
    transform: [{ scale: 0.98 }],
  },
  templateEmoji: {
    fontSize: 16,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});
