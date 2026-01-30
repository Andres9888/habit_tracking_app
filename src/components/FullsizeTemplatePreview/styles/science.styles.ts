/**
 * Science box styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

export const scienceStyles = StyleSheet.create({
  researchLinkButton: {
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  researchLinkText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  scienceBox: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderRadius: 16,
    borderWidth: 2,
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
  },
  scienceDivider: {
    backgroundColor: '#bbf7d0',
    height: 1,
    marginBottom: 12,
  },
  scienceHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  scienceIcon: {
    fontSize: 20,
  },
  scienceLabel: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  scienceQuote: {
    color: '#166534',
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 24,
  },
});
