/**
 * Container and layout styles for ShareCardGenerator
 */

import { StyleSheet } from 'react-native';

export const containerStyles = StyleSheet.create({
  closeButton: {
    fontSize: 17,
    fontWeight: '600',
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  customizationSection: {
    borderTopColor: '#e7e5e4',
    borderTopWidth: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: '#e7e5e4',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  previewContainer: {
    backgroundColor: '#f5f5f4',
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
});
