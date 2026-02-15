/**
 * Header styles for TemplateScienceModal
 */

import { StyleSheet } from 'react-native';

import { colors } from '../../../theme/colors';

export const headerStyles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 24,
    height: 44,
    justifyContent: 'center',
    width: 44,
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
    width: 44,
  },
  headerTitle: {
    color: colors.gray[900],
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
    maxWidth: 200,
  },
  shareButton: {
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 24,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
});
