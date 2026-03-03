import { StyleSheet } from 'react-native';

import { borderRadius } from '../../../theme/spacing';
import { colors } from '../../../theme/colors';

export const layoutStyles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  container: {
    backgroundColor: colors.light.gradientMid,
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
    // TODO: needs theme-awareness — colors.light.card is light-mode only
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.full,
    height: 36,
    justifyContent: 'center',
    marginRight: 12,
    width: 36,
  },
});
