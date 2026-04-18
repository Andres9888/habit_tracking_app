import { StyleSheet } from 'react-native';

import { borderRadius } from '@/theme/spacing';
import { colors } from '../../../theme/colors';

export const layoutStyles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  container: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.medium,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  expandedContent: {
    overflow: 'hidden',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.full,
    height: 36,
    justifyContent: 'center',
    marginRight: 12,
    width: 36,
  },
});
