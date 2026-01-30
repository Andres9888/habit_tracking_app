/**
 * Section card styles for TemplateScienceModal
 */

import { StyleSheet } from 'react-native';

export const sectionStyles = StyleSheet.create({
  descriptionText: {
    color: '#4B5563',
    fontSize: 16,
    lineHeight: 26,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#e7e5e4',
    borderRadius: 20,
    borderWidth: 1,
    elevation: 2,
    marginBottom: 16,
    marginHorizontal: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  sectionIconBadge: {
    alignItems: 'center',
    borderRadius: 12,
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
