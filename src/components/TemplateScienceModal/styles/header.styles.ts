/**
 * Header styles for TemplateScienceModal
 */

import { StyleSheet } from 'react-native';

export const headerStyles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'rgba(250, 250, 249, 0.98)',
    borderBottomColor: 'transparent',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    zIndex: 10,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
    maxWidth: 200,
  },
  shareButton: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
