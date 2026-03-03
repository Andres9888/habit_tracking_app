import { StyleSheet } from 'react-native';

import { colors } from '../../../theme/colors';
import { borderRadius } from '../../../theme/spacing';

export const controlsStyles = StyleSheet.create({
  progressBar: {
    backgroundColor: colors.info,
    height: '100%',
  },
  progressContainer: {
    backgroundColor: colors.gray[200],
    bottom: 0,
    height: 3,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 13,
    marginTop: 2,
  },
  syncButton: {
    alignItems: 'center',
    backgroundColor: colors.info,
    borderRadius: borderRadius.large,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  syncButtonText: {
    color: colors.text.inverse,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  title: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});
