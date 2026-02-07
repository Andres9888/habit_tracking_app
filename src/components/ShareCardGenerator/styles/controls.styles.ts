/**
 * Styles for customization controls (platform, gradient, message, toggle)
 */

import { StyleSheet } from 'react-native';
import { typography } from '@/theme/typography';

export const controlsStyles = StyleSheet.create({
  characterCount: {
    fontSize: typography.caption.fontSize,
    marginTop: 4,
    textAlign: 'right',
  },
  gradientButton: {
    borderColor: 'transparent',
    borderRadius: 12,
    borderWidth: 2,
    height: 56,
    overflow: 'hidden',
    width: 56,
  },
  gradientButtonInner: {
    flex: 1,
  },
  gradientButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  gradientButtonSelected: {
    borderColor: '#10B981',
  },
  messageInput: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 15,
    minHeight: 80,
    padding: 12,
    textAlignVertical: 'top',
  },
  optionGroup: {
    marginBottom: 24,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  platformButton: {
    backgroundColor: '#f5f5f4',
    borderColor: '#e7e5e4',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  platformButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformButtonText: {
    color: '#4B5563',
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  platformButtonTextActive: {
    color: '#FFFFFF',
  },
  shareButton: {
    marginTop: 8,
  },
  toggleLabelContainer: {
    flex: 1,
  },
  toggleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleSubtext: {
    fontSize: 13,
    marginTop: 4,
  },
});
