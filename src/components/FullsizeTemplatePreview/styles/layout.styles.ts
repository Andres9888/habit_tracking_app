/**
 * Layout styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export const layoutStyles = StyleSheet.create({
  bottomSpacer: {
    height: 140,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  container: {
    backgroundColor: colors.gray[50],
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    alignItems: 'flex-end',
    paddingBottom: 8,
    paddingHorizontal: 16,
    zIndex: 10,
  },
});
