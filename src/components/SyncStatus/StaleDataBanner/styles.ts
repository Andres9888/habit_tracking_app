/**
 * StaleDataBanner Styles
 */

import { StyleSheet } from 'react-native';
import { typography } from '@/theme/typography';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fafaf9', // stone-50
    borderColor: '#e7e5e4', // stone-200
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  containerDark: {
    alignItems: 'center',
    backgroundColor: '#1c1917', // stone-900
    borderColor: '#292524', // stone-800
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  content: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },

  refreshButton: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },

  text: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
});
